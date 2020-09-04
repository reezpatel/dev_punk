import { FastifyPluginCallback } from 'fastify';
import authHandlers from './handlers/auth';
import imageHandlers from './handlers/images';
import ingestionHandler from './handlers/ingestion';
import metricsHandler from './handlers/metrics';
import redirectHandler from './handlers/redirect';

const routes: FastifyPluginCallback<Record<string, unknown>> = (
  fastify,
  _,
  next
) => {
  fastify.register(authHandlers, { prefix: '/auth' });
  fastify.register(imageHandlers, { prefix: '/images' });
  fastify.register(ingestionHandler, { prefix: '/ingest' });
  fastify.register(redirectHandler, { prefix: '/r' });
  fastify.register(metricsHandler);

  next();
};

export default routes;
