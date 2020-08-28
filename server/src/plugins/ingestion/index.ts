import fp from 'fastify-plugin';

const ingestion = fp((fastify, _, next) => {
  fastify.decorate('ingest', async () => {
    const websites = await fastify.db.getAllWebsites();

    if (!Array.isArray(websites)) {
      fastify.log.error(websites.error);
      return;
    }

    for (const website of websites) {
      await fastify.pubsub.addWebsite(website);
    }
  });

  next();
});

export default ingestion;
