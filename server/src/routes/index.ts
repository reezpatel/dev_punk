import fp from 'fastify-plugin';
import { createReadStream } from 'fs';
import { join } from 'path';
import axios from 'axios';
import { URLSearchParams } from 'url';

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
    res.send(
      createReadStream(
        fastify.image.getWebsiteImage(id) ||
          join(__dirname, './../../assets/logo.png')
      )
    );
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

  fastify.get('/auth/validate', async (req, res) => {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith('Bearer ')
    ) {
      res.send({
        success: false,
      });
    }

    const token = Buffer.from(
      req.headers.authorization.split(' ')[1],
      'base64'
    ).toString('utf-8');

    const [userId, secret] = token.split(':');

    res.send({
      success: await fastify.redis.validateUserToken(userId, secret),
    });
  });

  fastify.get('/auth/:code', async (req, res) => {
    const { code } = req.params as any;

    const { data } = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: '95469d58ffff15bc6684',
        client_secret: '979c15a3787adaa9e6ac48d3a8e552aad84b944a',
        code,
      }
    );

    console.log(data);

    const params = new URLSearchParams(data);

    const accessToken = params.get('access_token');
    const type = params.get('token_type');

    const { data: user } = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `${type} ${accessToken}`,
      },
    });

    const authUser = await fastify.db.getUser(user.email, user.name);
    const token = await fastify.redis.generateUserToken(authUser._id);

    res.send({
      token: Buffer.from(authUser._id + ':' + token).toString('base64'),
    });
  });

  next();
});

export default routes;
