import { createReadStream } from 'fs';
import { join } from 'path';
import { FastifyPluginCallback } from 'fastify';

const DEFAULT_WEBSITE_LOGO_PATH = join(__dirname, './../../../assets/logo.png');
const DEFAULT_FEED_BANNER_PATH = join(
  __dirname,
  './../../../assets/banner.png'
);

interface WebsitePutBody {
  id: string;
  image: string;
}

const imageHandlers: FastifyPluginCallback<Record<string, unknown>> = (
  fastify,
  _,
  next
) => {
  fastify.put<{ Body: WebsitePutBody }>('/website', (req, res) => {
    const { id, image } = req.body;

    fastify.storage.saveWebsiteImage(id, image);
    res.send({
      success: true
    });
  });

  fastify.get<{ Params: { id: string } }>('/website/:id', (req, res) => {
    const { id } = req.params;
    const path = fastify.storage.getWebsiteImage(id);

    res.send(createReadStream(path || DEFAULT_WEBSITE_LOGO_PATH));
  });

  fastify.get<{ Params: { id: string } }>('/feeds/:id', (req, res) => {
    const { id } = req.params;
    const path = fastify.storage.getFeedImage(id);

    res.send(createReadStream(path || DEFAULT_FEED_BANNER_PATH));
  });

  next();
};

export default imageHandlers;
