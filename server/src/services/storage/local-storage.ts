import {
  statSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  createWriteStream
} from 'fs';
import { join } from 'path';
import axios from 'axios';
import { FastifyInstance, FastifyLoggerInstance } from 'fastify';
import { getFeedImageUrl } from '../../utils';
import StorageService from './interface';

const EXIT_CODE = 0;
const SUCCESS_RESPONSE_CODE = 200;

const ensureDir = (path) => {
  if (!existsSync(path)) {
    mkdirSync(path);
  }
};

const saveWebsiteImage = (baseDir: string) => (id: string, data: string) => {
  const index = data.indexOf(',');
  const buffer = Buffer.from(data.substring(index), 'base64');

  writeFileSync(join(baseDir, id), buffer);

  return Promise.resolve(id);
};

const getFeedImage = (baseDir: string) => (id: string) => {
  const filePath = join(baseDir, id);

  if (existsSync(filePath) && statSync(filePath).isFile) {
    return filePath;
  }

  return '';
};

const getWebsiteImage = (baseDir: string) => (id: string) => {
  const filePath = join(baseDir, id);

  if (existsSync(filePath) && statSync(filePath).isFile) {
    return filePath;
  }

  return '';
};

const saveFeedImage = (
  logger: FastifyLoggerInstance,
  baseDir: string
) => async (id: string, url: string) => {
  try {
    const imageUrl = await getFeedImageUrl(logger, url);

    if (imageUrl) {
      const res = await axios.get(imageUrl, {
        responseType: 'stream'
      });

      if (res.status === SUCCESS_RESPONSE_CODE) {
        res.data.pipe(createWriteStream(join(baseDir, id)));

        return id;
      }
    }
  } catch (e) {
    logger.error({
      message: e.message,
      module: 'Image:: Add Feed Image',
      stack: e.stack
    });
  }

  return '';
};

const getLocalStoragePlugin = (fastify: FastifyInstance): StorageService => {
  const { DATA_DIR } = fastify.config;

  const WEBSITE_DIR = join(DATA_DIR, 'website');
  const FEED_DIR = join(DATA_DIR, 'feeds');

  if (!statSync(DATA_DIR).isDirectory) {
    fastify.log.error(`${DATA_DIR} is not a folder, Exiting...`);
    // eslint-disable-next-line no-process-exit
    process.exit(EXIT_CODE);
  }

  ensureDir(WEBSITE_DIR);
  ensureDir(FEED_DIR);

  return {
    getFeedImage: getFeedImage(FEED_DIR),
    getWebsiteImage: getWebsiteImage(WEBSITE_DIR),
    saveFeedImage: saveFeedImage(fastify.log, FEED_DIR),
    saveWebsiteImage: saveWebsiteImage(WEBSITE_DIR)
  };
};

export default getLocalStoragePlugin;
