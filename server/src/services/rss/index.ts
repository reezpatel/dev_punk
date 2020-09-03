import fp from 'fastify-plugin';
import RSSParser from 'rss-parser';
import mongoose from 'mongoose';
import { IFeeds } from 'src/types/database';
import DBController from '../database/controller';

interface RSSService {
  getFeeds: (id: string, url: string) => Promise<IFeeds[]>;
}

const parser = new RSSParser();

const getFeeds = (db: DBController) => async (id, url) => {
  const now = new Date().toISOString();
  const response = await parser.parseURL(url);

  const feeds = response.items.map((item) => ({
    _id: new mongoose.Types.ObjectId(),
    author: item?.creator ?? '',
    createdAt: now,
    publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : now,
    tags: item?.categories ?? [],
    title: item?.title ?? '',
    url: item?.link ?? '',
    website: id
  }));

  return db.addFeeds(feeds);
};

const rss = fp((fastify, _, next) => {
  fastify.decorate('rss', {
    getFeeds: getFeeds(fastify.db)
  });

  next();
});

export default rss;
export { RSSService };
