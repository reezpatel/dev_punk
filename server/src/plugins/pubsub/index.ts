import kubemq from 'kubemq-nodejs';
import fp from 'fastify-plugin';
import { IWebsite, IFeeds } from 'src/database/schema';
import os from 'os';

let feedsQueue = new kubemq.MessageQueue(
  'localhost:50000',
  'devpunk_feeds',
  os.hostname()
);
let imageQueue = new kubemq.MessageQueue(
  'localhost:50000',
  'devpunk_image',
  os.hostname()
);

const pubsub = fp((fastify, _, next) => {
  const feedListener = async () => {
    const feeds = await feedsQueue.receiveQueueMessages(1, 1);
    if (feeds.Messages.length) {
      const start = new Date();
      const website: IWebsite = JSON.parse(feeds.Messages[0].Body.toString());

      fastify.log.info({
        module: 'PubSub:: Message Listener',
        message: `Started Processing Website: ${website.name}`,
      });

      const insertedFeeds = await fastify.rss.getFeeds(
        website._id,
        website.feed
      );

      const end = new Date();

      fastify.log.info({
        module: 'PubSub:: Message Listener',
        message: `Finished Processing Website: ${website.name}`,
        meta: {
          time: end.getTime() - start.getTime(),
          count: insertedFeeds.length,
          ids: insertedFeeds.map((f) => {
            fastify.pubsub.addFeed(f);
            return f._id;
          }),
        },
      });
    }
  };

  const imageListener = async () => {
    const entries = await imageQueue.receiveQueueMessages(1, 1);
    if (entries.Messages.length) {
      const start = new Date();
      const feed: IFeeds = JSON.parse(entries.Messages[0].Body.toString());

      fastify.log.info({
        module: 'PubSub:: Message Listener',
        message: `Started Processing Feeds: ${feed.title}`,
      });

      const success = await fastify.image.saveFeedImage(feed._id, feed.url);

      const end = new Date();

      fastify.log.info({
        module: 'PubSub:: Message Listener',
        message: `Finished Processing Feeds: ${feed.title}`,
        meta: {
          time: end.getTime() - start.getTime(),
          success,
        },
      });
    }
  };

  const messageListener = async () => {
    while (true) {
      try {
        await feedListener();
        await imageListener();
      } catch (e) {
        fastify.log.error({
          module: 'PubSub:: Message Listener',
          message: e.message,
          stack: e.stack,
        });
      }
    }
  };

  const addWebsite = async (website: IWebsite) => {
    try {
      const message = new kubemq.Message(
        website.name,
        kubemq.stringToByte(JSON.stringify(website)),
        []
      );
      await feedsQueue.sendQueueMessage(message);
    } catch (e) {
      fastify.log.error({
        module: 'PubSub:: Add Website',
        message: e.message,
        stack: e.stack,
      });
    }
  };

  const addFeed = async (feed: IFeeds) => {
    try {
      const message = new kubemq.Message(
        feed.title,
        kubemq.stringToByte(JSON.stringify(feed)),
        []
      );
      await imageQueue.sendQueueMessage(message);
    } catch (e) {
      fastify.log.error({
        module: 'PubSub:: Add Feed',
        message: e.message,
        stack: e.stack,
      });
    }
  };

  fastify.decorate('pubsub', {
    addWebsite,
    addFeed,
  });

  messageListener();

  next();
});

export default pubsub;
