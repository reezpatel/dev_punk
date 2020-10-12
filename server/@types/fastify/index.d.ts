import DBController from 'src/services/database/controller';
import { Config } from 'src/plugins/config';
import { RSSService } from 'src/services/rss';
import { RedisService } from 'src/services/redis';
import { PubSubService } from 'src/services/pubsub';
import StorageService from 'src/services/storage/interface';

declare module 'fastify' {
  export interface FastifyInstance {
    config: Config;
    db: DBController;
    storage: StorageService;
    pubsub: PubSubService;
    rss: RSSService;
    redis: RedisService;
  }
}
