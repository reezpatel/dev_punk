import os from 'os';
import kubemq from 'kubemq-nodejs';
import fp from 'fastify-plugin';
import { FastifyLoggerInstance } from 'fastify';
import { IFeeds, IWebsite } from 'src/types/database';
import { StorageService } from '../storage';
import { RSSService } from '../rss';

interface PubSubService {
  addFeed: (feed: IFeeds) => Promise<void>;
}

const MESSAGE_CHECK_DELAY = 300;
const ONE = 1;
const FIRST_MESSAGE = 0;

const addFeed = (imageQueue, logger: FastifyLoggerInstance) => async (
  feed: IFeeds
) => {
  try {
    const message = new kubemq.Message(
      feed.title,
      kubemq.stringToByte(JSON.stringify(feed)),
      []
    );

    await imageQueue.sendQueueMessage(message);
  } catch (e) {
    logger.error({
      message: e.message,
      module: 'PubSub:: Add Feed',
      stack: e.stack
    });
  }
};

const addWebsite = (feedsQueue, logger: FastifyLoggerInstance) => async (
  website: IWebsite
) => {
  try {
    const message = new kubemq.Message(
      website.name,
      kubemq.stringToByte(JSON.stringify(website)),
      []
    );

    await feedsQueue.sendQueueMessage(message);
  } catch (e) {
    logger.error({
      message: e.message,
      module: 'PubSub:: Add Website',
      stack: e.stack
    });
  }
};

const feedListener = async (
  feedsQueue,
  imageQueue,
  logger: FastifyLoggerInstance,
  rss: RSSService
) => {
  const feeds = await feedsQueue.receiveQueueMessages(ONE, ONE);

  if (feeds.Messages.length) {
    const start = new Date();
    const website: IWebsite = JSON.parse(
      feeds.Messages[FIRST_MESSAGE].Body.toString()
    );

    logger.info({
      message: `Started Processing Website: ${website.name}`,
      module: 'PubSub:: Message Listener'
    });

    const insertedFeeds = await rss.getFeeds(website._id, website.feed);

    const end = new Date();

    logger.info({
      message: `Finished Processing Website: ${website.name}`,
      meta: {
        count: insertedFeeds.length,
        ids: insertedFeeds.map((feed) => {
          addFeed(imageQueue, logger)(feed);

          return feed._id;
        }),
        time: end.getTime() - start.getTime()
      },
      module: 'PubSub:: Message Listener'
    });
  }
};

const imageListener = async (
  imageQueue,
  logger: FastifyLoggerInstance,
  storage: StorageService
) => {
  const entries = await imageQueue.receiveQueueMessages(ONE, ONE);

  if (entries.Messages.length) {
    const start = new Date();
    const feed: IFeeds = JSON.parse(
      entries.Messages[FIRST_MESSAGE].Body.toString()
    );

    logger.info({
      message: `Started Processing Feeds: ${feed.title}`,
      module: 'PubSub:: Message Listener'
    });

    const success = await storage.saveFeedImage(feed._id, feed.url);

    const end = new Date();

    logger.info({
      message: `Finished Processing Feeds: ${feed.title}`,
      meta: {
        success,
        time: end.getTime() - start.getTime()
      },
      module: 'PubSub:: Message Listener'
    });
  }
};

const attachMessageListener = (
  feedsQueue,
  imageQueue,
  logger: FastifyLoggerInstance,
  storage: StorageService,
  rss: RSSService
) => {
  const messageListener = async () => {
    try {
      await feedListener(feedsQueue, imageQueue, logger, rss);
      await imageListener(imageQueue, logger, storage);
    } catch (e) {
      logger.error({
        message: e.message,
        module: 'PubSub:: Message Listener',
        stack: e.stack
      });
    }

    setTimeout(messageListener, MESSAGE_CHECK_DELAY);
  };

  messageListener();
};

const pubsub = fp((fastify, _, next) => {
  const HOSTNAME = os.hostname();
  const KUBEMQ_URI = fastify.config.KUBEMQ_HOST;
  const FEED_Q = 'devpunk_feeds';
  const IMAGE_Q = 'devpunk_image';

  const feedsQueue = new kubemq.MessageQueue(KUBEMQ_URI, FEED_Q, HOSTNAME);
  const imageQueue = new kubemq.MessageQueue(KUBEMQ_URI, IMAGE_Q, HOSTNAME);

  fastify.decorate('pubsub', {
    addFeed: addFeed(imageQueue, fastify.log),
    addWebsite: addWebsite(feedsQueue, fastify.log)
  });

  attachMessageListener(
    feedsQueue,
    imageQueue,
    fastify.log,
    fastify.storage,
    fastify.rss
  );

  next();
});

export default pubsub;
export { PubSubService };
