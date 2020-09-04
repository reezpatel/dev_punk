import { FastifyPluginCallback } from 'fastify';

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
      message: 'Sync has started',
      success: true
    });
  });

  next();
};

export default ingestionHandler;
