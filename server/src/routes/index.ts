import fp from 'fastify-plugin';
import authHandlers from './handlers/auth';
import imageHandlers from './handlers/images';
import ingestionHandler from './handlers/ingestion';
import metricsHandler from './handlers/metrics';
import redirectHandler from './handlers/redirect';
import publicHandler from './handlers/public';

const routes = fp((fastify, options: { prefix: string }, next) => {
  const { prefix } = options;

  fastify.register(authHandlers, { prefix: `${prefix}/auth` });
  fastify.register(imageHandlers, { prefix: `${prefix}/images` });
  fastify.register(ingestionHandler, { prefix: `${prefix}/ingest` });
  fastify.register(redirectHandler, { prefix: `${prefix}/r` });
  fastify.register(metricsHandler);
  fastify.register(publicHandler);

  next();
});

export default routes;
