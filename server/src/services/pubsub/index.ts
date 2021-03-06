import RedisSMQ from 'rsmq';
import fp from 'fastify-plugin';
import { FastifyLoggerInstance } from 'fastify';
import { IFeeds, IWebsite } from 'src/types/database';
import StorageService from '../storage/interface';
import { RSSService } from '../rss';
import DBController from '../database/controller';

interface PubSubService {
  addFeed: (feed: IFeeds) => Promise<void>;
  addWebsite: (website: IWebsite) => Promise<void>;
}

const FEED_Q = 'devpunk_feeds';
const IMAGE_Q = 'devpunk_image';

const EMPTY_OBJECT_LENGTH = 0;
const MESSAGE_CHECK_DELAY = 700;

const ensureQueue = async (rsmq: RedisSMQ, qname: string) => {
  try {
    await rsmq.createQueueAsync({ qname });

    return true;
  } catch (e) {
    return Promise.resolve(false);
  }
};

const addFeed = (rsmq: RedisSMQ, logger: FastifyLoggerInstance) => async (
  feed: IFeeds
) => {
  try {
    await rsmq.sendMessageAsync({
      message: JSON.stringify(feed),
      qname: IMAGE_Q
    });
  } catch (e) {
    logger.error({
      message: e.message,
      module: 'PubSub:: Add Feed',
      stack: e.stack
    });
  }
};

const addWebsite = (rsmq: RedisSMQ, logger: FastifyLoggerInstance) => async (
  website: IWebsite
) => {
  try {
    await rsmq.sendMessageAsync({
      message: JSON.stringify(website),
      qname: FEED_Q
    });
  } catch (e) {
    logger.error({
      message: e.message,
      module: 'PubSub:: Add Website',
      stack: e.stack
    });
  }
};

const feedListener = async (
  rsmq: RedisSMQ,
  logger: FastifyLoggerInstance,
  rss: RSSService
) => {
  const start = new Date();
  const msg = await rsmq.popMessageAsync({ qname: FEED_Q });

  if (Object.keys(msg).length === EMPTY_OBJECT_LENGTH) {
    return;
  }

  const { message, ...meta } = msg as RedisSMQ.QueueMessage;

  const website: IWebsite = JSON.parse(message);

  logger.info({
    message: `Started Processing Website: ${website.name}`,
    meta,
    module: 'PubSub:: Message Listener'
  });

  const insertedFeeds = await rss.getFeeds(website._id, website.feed);
  const end = new Date();

  logger.info({
    message: `Finished Processing Website: ${website.name}`,
    meta: {
      count: insertedFeeds.length,
      ids: insertedFeeds.map((feed) => {
        addFeed(rsmq, logger)(feed);

        return feed._id;
      }),
      time: end.getTime() - start.getTime()
    },
    module: 'PubSub:: Message Listener'
  });
};

const imageListener = async (
  db: DBController,
  rsmq: RedisSMQ,
  logger: FastifyLoggerInstance,
  storage: StorageService
) => {
  const start = new Date();
  const msg = await rsmq.popMessageAsync({ qname: IMAGE_Q });

  if (Object.keys(msg).length === EMPTY_OBJECT_LENGTH) {
    return;
  }

  const { message, ...meta } = msg as RedisSMQ.QueueMessage;
  const feed: IFeeds = JSON.parse(message);

  logger.info({
    message: `Started Processing Feeds: ${feed.title}`,
    meta,
    module: 'PubSub:: Message Listener'
  });

  const image = await storage.saveFeedImage(feed._id, feed.url);
  const end = new Date();

  await db.addImageToFeed(feed._id, image);

  logger.info({
    message: `Finished Processing Feeds: ${feed.title}`,
    meta: {
      image,
      time: end.getTime() - start.getTime()
    },
    module: 'PubSub:: Message Listener'
  });
};

const attachMessageListener = (
  db: DBController,
  rsmq: RedisSMQ,
  logger: FastifyLoggerInstance,
  storage: StorageService,
  rss: RSSService
) => {
  const messageListener = async () => {
    try {
      await feedListener(rsmq, logger, rss);
      await imageListener(db, rsmq, logger, storage);
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

const pubsub = fp(async (fastify, _, next) => {
  const rsmq = new RedisSMQ({
    host: fastify.config.REDIS_HOST,
    ns: 'devpunk',
    port: 6379
  });

  try {
    await ensureQueue(rsmq, FEED_Q);
    await ensureQueue(rsmq, IMAGE_Q);
  } catch (e) {
    fastify.log.error({
      error: 'Failed to ensure queue',
      message: e.message,
      stack: e.stack
    });
  }

  fastify.decorate('pubsub', {
    addFeed: addFeed(rsmq, fastify.log),
    addWebsite: addWebsite(rsmq, fastify.log)
  });

  attachMessageListener(
    fastify.db,
    rsmq,
    fastify.log,
    fastify.storage,
    fastify.rss
  );

  next();
});

export default pubsub;
export { PubSubService };
