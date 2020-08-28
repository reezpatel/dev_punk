import fastify, { FastifyInstance } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';
import fastifyEnv from 'fastify-env';
import config from './plugins/config';
import routes from './routes';
import graphql from './graphql';
import database from './database';
import rss from './rss';
import cors from 'fastify-cors';
import images from './plugins/images';
import ingestion from './plugins/ingestion';
import pubsub from './plugins/pubsub';

const server: FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse
> = fastify({
  logger: true,
  pluginTimeout: 1000000,
});

server.register(fastifyEnv, config);
server.register(database);
server.register(routes);
server.register(graphql);
server.register(rss);
server.register(ingestion);
server.register(pubsub);

server.register(cors, {
  origin: ['http://localhost:1234'],
});
server.register(images);

const start = async () => {
  try {
    await server.listen(3000, '0.0.0.0');
    server.log.info(`Server is listening at ${3000}`);
  } catch (err) {
    console.log(err);
    server.log.error(err);
    process.exit(1);
  }
};

process.on('uncaughtException', (error) => {
  console.error(error);
});

process.on('unhandledRejection', (error) => {
  console.error(error);
});

start();
