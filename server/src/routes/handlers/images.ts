import { createReadStream } from 'fs';
import { join } from 'path';
import { FastifyPluginCallback } from 'fastify';

const DEFAULT_WEBSITE_LOGO_PATH = join(__dirname, './../../../assets/logo.png');
const DEFAULT_FEED_BANNER_PATH = join(
  __dirname,
  './../../../assets/banner.png'
);

const TEMP_REDIRECT_CODE = 307;

interface WebsitePutBody {
  id: string;
  image: string;
}

const imageHandlers: FastifyPluginCallback<Record<string, unknown>> = (
  fastify,
  _,
  next
) => {
  fastify.put<{ Body: string }>('/website', (req, res) => {
    const { id, image } = JSON.parse(req.body) as WebsitePutBody;

    fastify.storage.saveWebsiteImage(id, image);
    res.send({
      success: true
    });
  });

  fastify.get<{ Params: { id: string } }>('/website/:id', (req, res) => {
    const { id } = req.params;

    if (id === 'pins' || id === 'all') {
      res.send(createReadStream(DEFAULT_WEBSITE_LOGO_PATH));
    } else if (fastify.config.S3_BUCKET_NAME) {
      res.redirect(
        TEMP_REDIRECT_CODE,
        `https://${fastify.config.S3_BUCKET_NAME}.${fastify.config.S3_BUCKET_REGION}/${id}`
      );
    } else {
      const path = fastify.storage.getWebsiteImage(id);

      res.send(createReadStream(path || DEFAULT_WEBSITE_LOGO_PATH));
    }
  });

  fastify.get<{ Params: { id: string; type: string } }>(
    '/feeds/:type/:id',
    (req, res) => {
      const { type, id } = req.params;

      if (fastify.config.S3_BUCKET_NAME) {
        res.redirect(
          TEMP_REDIRECT_CODE,
          `https://${fastify.config.S3_BUCKET_NAME}.${fastify.config.S3_BUCKET_REGION}/feed/${type}/${id}`
        );
      } else {
        const path = fastify.storage.getFeedImage(id);

        res.send(createReadStream(path || DEFAULT_FEED_BANNER_PATH));
      }
    }
  );

  next();
};

export default imageHandlers;
