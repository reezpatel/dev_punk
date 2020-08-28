import fp from 'fastify-plugin';
import RSSParser from 'rss-parser';
import mongoose from 'mongoose';

const parser = new RSSParser();

const rss = fp((fastify, _, next) => {
  const getFeeds = async (id, url) => {
    const now = new Date().toISOString();
    const response = await parser.parseURL(url);
    const feeds = response.items.map((item) => {
      return {
        _id: mongoose.Types.ObjectId(),
        title: item?.title ?? '',
        createdAt: now,
        publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : now,
        author: item?.creator ?? '',
        website: id,
        tags: item?.categories ?? [],
        url: item?.link ?? '',
      };
    });

    return fastify.db.addFeeds(feeds);
  };

  fastify.decorate('rss', {
    getFeeds,
  });

  next();
});

export default rss;
