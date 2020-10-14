import fp from 'fastify-plugin';
import authHandlers from './handlers/auth';
import imageHandlers from './handlers/images';
import ingestionHandler from './handlers/ingestion';
import livenessHandler from './handlers/liveness';
import redirectHandler from './handlers/redirect';
import publicHandler from './handlers/public';

const routes = fp((fastify, options: { prefix: string }, next) => {
  const { prefix } = options;

  fastify.register(authHandlers, { prefix: `${prefix}/auth` });
  fastify.register(imageHandlers, { prefix: `${prefix}/images` });
  fastify.register(ingestionHandler, { prefix: `${prefix}/ingestion` });
  fastify.register(redirectHandler, { prefix: `${prefix}/r` });
  fastify.register(livenessHandler);
  fastify.register(publicHandler);

  next();
});

export default routes;
