import { URLSearchParams } from 'url';
import axios from 'axios';
import { FastifyPluginCallback } from 'fastify';

const FIRST_INDEX = 1;

const reply = (success: boolean, message?: string, error?: string) => {
  if (success) {
    return {
      message,
      success
    };
  }

  return {
    error,
    success
  };
};

const decodeToken = (token: string) => {
  const value = Buffer.from(token.split(' ')[FIRST_INDEX], 'base64').toString(
    'utf-8'
  );

  return value.split(':');
};

const getAccessTokenFromGithub = async (clientId, clientSecret, code) => {
  const { data } = await axios.post(
    'https://github.com/login/oauth/access_token',
    {
      // eslint-disable-next-line camelcase
      client_id: clientId,
      // eslint-disable-next-line camelcase
      client_secret: clientSecret,
      code
    }
  );
  const params = new URLSearchParams(data);
  const accessToken = params.get('access_token');
  const type = params.get('token_type');

  return [accessToken, type];
};

const authHandlers: FastifyPluginCallback<Record<string, unknown>> = (
  fastify,
  _,
  next
) => {
  fastify.get('/validate', async (req, res) => {
    if (!req.headers.authorization?.startsWith('Bearer ')) {
      res.send(reply(false, '', 'Invalid Auth Header'));
    }

    const [id, secret] = decodeToken(req.headers.authorization);
    const isValid = await fastify.redis.validateUserToken(id, secret);

    res.send(reply(isValid, 'Authenticated', 'Authentication Error'));
  });

  fastify.get<{ Params: { code: string } }>('/:code', async (req, res) => {
    try {
      const [accessToken, type] = await getAccessTokenFromGithub(
        fastify.config.GITHUB_LOGIN_CLIENT_ID,
        fastify.config.GITHUB_LOGIN_CLIENT_SECRET,
        req.params.code
      );

      if (!accessToken || !type) {
        res.send(reply(false, '', 'Invalid Credentials'));
      }

      const { data: user } = await axios.get('https://api.github.com/user', {
        headers: {
          Authorization: `${type} ${accessToken}`
        }
      });

      const authUser = await fastify.db.getUser(user.email, user.name);
      const token = await fastify.redis.generateUserToken(authUser._id);

      res.send({
        token: Buffer.from(`${authUser._id}:${token}`).toString('base64')
      });
    } catch (e) {
      res.send(reply(false, '', `Invalid Credentials :: ${e.message}`));
    }
  });

  next();
};

export default authHandlers;
