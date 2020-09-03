import {
  statSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  createWriteStream
} from 'fs';
import { join } from 'path';
import { URL } from 'url';
import fp from 'fastify-plugin';
import axios from 'axios';
import cheerio from 'cheerio';
import { FastifyLoggerInstance } from 'fastify';

interface StorageService {
  getFeedImage: (id: string) => string;
  getWebsiteImage: (id: string) => string;
  saveFeedImage: (id: string, url: string) => boolean;
  saveWebsiteImage: (id: string, data: string) => void;
}

const EXIT_CODE = 0;
const SUCCESS_RESPONSE_CODE = 200;
const IMAGE_PATHS = [
  'head meta[property="og:image"]',
  'head meta[property="twitter:image"]'
];
const API_TIMEOUT = 120000; // 1000 * 60 * 2

const ensureDir = (path) => {
  if (!existsSync(path)) {
    mkdirSync(path);
  }
};

const getImageUrl = async (logger: FastifyLoggerInstance, url: string) => {
  try {
    const uri = new URL(url);
    const response = (await axios.get(url, { timeout: API_TIMEOUT })).data;
    const $ = cheerio.load(response);

    for (const path of IMAGE_PATHS) {
      const imageUrl: string = $(path).prop('content');

      if (imageUrl) {
        return imageUrl.startsWith('/') ? `${uri.origin}${imageUrl}` : imageUrl;
      }
    }
  } catch (e) {
    logger.error({
      message: e.message,
      module: 'Image:: Get Image URL',
      stack: e.stack
    });
  }

  return '';
};

const saveWebsiteImage = (baseDir: string) => (id: string, data: string) => {
  const index = data.indexOf(',');
  const buffer = Buffer.from(data.substring(index), 'base64');

  writeFileSync(join(baseDir, id), buffer);
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
    const imageUrl = await getImageUrl(logger, url);

    if (imageUrl) {
      const res = await axios.get(imageUrl, {
        responseType: 'stream'
      });

      if (res.status === SUCCESS_RESPONSE_CODE) {
        res.data.pipe(createWriteStream(join(baseDir, id)));

        return true;
      }
    }
  } catch (e) {
    logger.error({
      message: e.message,
      module: 'Image:: Add Feed Image',
      stack: e.stack
    });
  }

  return false;
};

const storage = fp((fastify, _, next) => {
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

  fastify.decorate('storage', {
    getFeedImage: getFeedImage(FEED_DIR),
    getWebsiteImage: getWebsiteImage(WEBSITE_DIR),
    saveFeedImage: saveFeedImage(fastify.log, FEED_DIR),
    saveWebsiteImage: saveWebsiteImage(WEBSITE_DIR)
  });

  next();
});

export default storage;
export { StorageService };
