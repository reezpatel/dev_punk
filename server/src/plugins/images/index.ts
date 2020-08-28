import fp from 'fastify-plugin';
import {
  statSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  createWriteStream,
} from 'fs';
import { join } from 'path';
import axios from 'axios';
import cheerio from 'cheerio';
import { URL } from 'url';

const ensureDir = (path) => {
  if (!existsSync(path)) {
    mkdirSync(path);
  }
};

const images = fp((fastify, _, next) => {
  const { DATA_DIR } = fastify.config;

  const WEBSITE_DIR = join(DATA_DIR, 'website');
  const FEED_DIR = join(DATA_DIR, 'feeds');

  if (!statSync(DATA_DIR).isDirectory) {
    fastify.log.error(`${DATA_DIR} is not a folder, Exiting...`);
    process.exit(0);
  }
  ensureDir(WEBSITE_DIR);
  ensureDir(FEED_DIR);

  const getImageUrl = async (url: string) => {
    try {
      const uri = new URL(url);
      const response = (await axios.get(url, { timeout: 1000 * 60 * 2 })).data;

      const paths = [
        'head meta[property="og:image"]',
        'head meta[property="twitter:image"]',
      ];

      const $ = cheerio.load(response);

      for (const path of paths) {
        const e = $(path);
        const imageUrl: string = e.prop('content');

        console.log(path, e.prop('content'));

        if (imageUrl) {
          return imageUrl.startsWith('/')
            ? `${uri.origin}${imageUrl}`
            : imageUrl;
        }
      }

      return '';
    } catch (e) {
      fastify.log.error({
        module: 'Image:: Get Image URL',
        message: e.message,
        stack: e.stack,
      });
      return '';
    }
  };

  const saveWebsiteImage = (id: string, data: string) => {
    const index = data.indexOf(',');
    const buffer = new Buffer(data.substring(index), 'base64');
    writeFileSync(join(WEBSITE_DIR, id), buffer);
  };

  const getFeedImage = (id: string) => {
    const filePath = join(FEED_DIR, id);
    if (existsSync(filePath) && statSync(filePath).isFile) {
      return filePath;
    } else {
      return '';
    }
  };

  const getWebsiteImage = (id: string) => {
    const filePath = join(WEBSITE_DIR, id);
    if (existsSync(filePath) && statSync(filePath).isFile) {
      return filePath;
    } else {
      return '';
    }
  };

  const saveFeedImage = async (id: string, url: string) => {
    try {
      const imageUrl = await getImageUrl(url);

      console.log('imageUrl', imageUrl);

      if (imageUrl) {
        const res = await axios.get(imageUrl, {
          responseType: 'stream',
        });
        if (res.status === 200) {
          res.data.pipe(createWriteStream(join(FEED_DIR, id)));
          return true;
        }
      }
      return false;
    } catch (e) {
      fastify.log.error({
        module: 'Image:: Add Feed Image',
        message: e.message,
        stack: e.stack,
      });
    }
  };

  fastify.decorate('image', {
    saveWebsiteImage,
    getWebsiteImage,
    saveFeedImage,
    getFeedImage,
  });
  next();
});

export default images;
