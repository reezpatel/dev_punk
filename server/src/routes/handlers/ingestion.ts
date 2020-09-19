import { FastifyPluginCallback } from 'fastify';
import DBController from 'src/services/database/controller';
import { PubSubService } from 'src/services/pubsub';
import { IFeeds, ErrorResponse } from 'src/types/database';

const NEXT_PAGE = 1;

const processImages = (
  feeds: IFeeds[] | ErrorResponse,
  pubsub: PubSubService
): boolean => {
  if (Array.isArray(feeds)) {
    if (feeds.length) {
      feeds.forEach((feed) => {
        pubsub.addFeed(feed);
      });

      return true;
    }

    return false;
  }

  throw new Error(feeds.error);
};

const imageSyncHandler = async (db: DBController, pubsub: PubSubService) => {
  let page = 1;
  let hasNext = true;

  try {
    while (hasNext) {
      // eslint-disable-next-line no-await-in-loop
      const feeds = await db.getFeeds(page, '', '');

      hasNext = processImages(feeds, pubsub);
      page += NEXT_PAGE;
    }
  } catch (e) {
    return {
      message: e.message,
      success: false
    };
  }

  return {
    message: 'Sync has started',
    success: true
  };
};

const ingestionHandler: FastifyPluginCallback<Record<string, unknown>> = (
  fastify,
  _,
  next
) => {
  fastify.get('/ingest', async (__, res) => {
    const websites = await fastify.db.getAllWebsites();

    if (!Array.isArray(websites)) {
      fastify.log.error(websites.error);

      res.send({
        error: websites,
        success: false
      });

      return;
    }

    const promises = websites.map((website) =>
      fastify.pubsub.addWebsite(website)
    );

    await Promise.all(promises);

    res.send({
      message: 'Ingestion has started',
      success: true
    });
  });

  fastify.get('/sync', async (__, res) => {
    const msg = await imageSyncHandler(fastify.db, fastify.pubsub);

    res.send(msg);
  });

  next();
};

export default ingestionHandler;
