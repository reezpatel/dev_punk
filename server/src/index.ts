import { IncomingMessage, Server, ServerResponse } from 'http';
import cors from 'fastify-cors';
import fastifyEnv from 'fastify-env';
import fastify, { FastifyInstance } from 'fastify';
import metrics from 'fastify-metrics';
import { database, graphql, storage, rss, redis, pubsub } from './services';
import config from './plugins/config';
import routes from './routes';

const server: FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse
> = fastify({
  logger: true,
  pluginTimeout: 1000000
});

server.register(metrics, { endpoint: '/metrics' });
server.register(fastifyEnv, config);
server.register(storage);
server.register(database);
server.register(routes, { prefix: 'api/v1' });
server.register(rss);
server.register(redis);
server.register(pubsub);
server.register(graphql);

server.register(cors, {
  origin: ['http://localhost:1234']
});

const start = async () => {
  try {
    await server.ready();
    await server.listen(server.config.SERVER_PORT, '0.0.0.0');
    server.log.info(`Server is listening at ${server.config.SERVER_PORT}`);
  } catch (err) {
    server.log.error({
      message: err.message,
      module: 'Main:: Failed to start server',
      stack: err.stack
    });
  }
};

process.on('uncaughtException', (error) => {
  server.log.error({
    message: error.message,
    module: 'Main:: uncaughtException',
    stack: error.stack
  });
});

process.on('unhandledRejection', (error) => {
  server.log.error({
    message: error,
    module: 'Main:: unhandledRejection'
  });
});

start();
