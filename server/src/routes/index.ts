import fp from 'fastify-plugin';
import { createReadStream } from 'fs';
import { join } from 'path';

const routes = fp((fastify, opts, next) => {
  fastify.get('/live', (req, res) => {
    res.send({ status: 200, message: 'Working!!' });
  });

  fastify.put('/api/images', (req, res) => {
    const { id, image } = JSON.parse(req.body as string) as {
      id: string;
      image: string;
    };
    fastify.image.saveWebsiteImage(id, image);
    res.send('done');
  });

  fastify.get('/api/images/website/:id', (req, res) => {
    const { id } = req.params as any;
    res.send(createReadStream(fastify.image.getWebsiteImage(id)));
  });

  fastify.get('/api/images/feeds/:id', (req, res) => {
    const { id } = req.params as any;
    res.send(
      createReadStream(
        fastify.image.getFeedImage(id) ||
          join(__dirname, './../../assets/banner.png')
      )
    );
  });

  fastify.get('/ingest', async (req, res) => {
    await fastify.ingest();
    res.send('Sync has started');
  });

  fastify.get('/r/:id', async (req, res) => {
    const url =
      (await fastify.db.getFeedUrl((req.params as any).id)) ||
      'http://localhost:1234/';

    res.redirect(307, url);
  });

  next();
});

export default routes;
