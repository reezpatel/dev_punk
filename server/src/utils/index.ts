import { URL } from 'url';
import { FastifyLoggerInstance } from 'fastify';
import cheerio from 'cheerio';
import axios from 'axios';

const IMAGE_PATHS = [
  'head meta[property="og:image"]',
  'head meta[property="twitter:image"]'
];
const API_TIMEOUT = 120000; // 1000 * 60 * 2

const URL_REGEX = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/u;

const getFeedImageUrl = async (
  logger: FastifyLoggerInstance,
  url: string
): Promise<string> => {
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

export { URL_REGEX, getFeedImageUrl };
