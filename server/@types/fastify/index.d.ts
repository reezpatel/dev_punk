import fastify from 'fastify';
import { Model } from 'mongoose';
import { IWebsite, IFeeds, IUser } from 'src/database/schema';
import DBController from 'src/database/controller';

declare module 'fastify' {
  export interface FastifyInstance<
    HttpServer = Server,
    HttpRequest = IncomingMessage,
    HttpResponse = ServerResponse
  > {
    config: {
      MONGODB_PASSWORD: string;
      MONGODB_USERNAME: string;
      MONGODB_DB_NAME: string;
      MONGODB_AUTH_DB: string;
      MONGODB_HOST: string;
      MONGODB_PORT: number;
      DATA_DIR: string;
    };
    db: DBController;
    image: {
      saveWebsiteImage: (string, string) => void;
      getWebsiteImage: (string) => string;
      saveFeedImage: (string, string) => Promise<boolean>;
      getFeedImage: (string) => string;
    };
    ingest: () => void;
    pubsub: {
      addWebsite: (IWebsite) => Promise<void>;
      addFeed: (IFeeds) => Promise<void>;
    };
    rss: {
      getFeeds: (string, string) => Promise<IFeeds[]>;
    };
    redis: {
      generateUserToken: (id: string) => Promise<string>;
      validateUserToken: (id: string, token: string) => Promise<boolean>;
      destroyUserToken: (token: string) => Promise<number>;
    };
  }
}
