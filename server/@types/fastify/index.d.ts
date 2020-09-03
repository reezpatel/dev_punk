import DBController from 'src/services/database/controller';
import { Config } from 'src/plugins/config';
import { RSSService } from 'src/services/rss';
import { RedisService } from 'src/services/redis';
import { StorageService } from 'src/services/storage';

declare module 'fastify' {
  export interface FastifyInstance<
    HttpServer = Server,
    HttpRequest = IncomingMessage,
    HttpResponse = ServerResponse
  > {
    config: Config;
    db: DBController;
    storage: StorageService;
    pubsub: {
      addWebsite: (IWebsite) => Promise<void>;
      addFeed: (IFeeds) => Promise<void>;
    };
    rss: RSSService;
    redis: RedisService;
  }
}
