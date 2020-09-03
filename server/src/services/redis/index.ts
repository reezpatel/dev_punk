import fp from 'fastify-plugin';
import Redis from 'ioredis';
import { nanoid } from 'nanoid';

type destroyUserToken = (token: string) => Promise<number>;
type generateUserToken = (id: string) => Promise<string>;
type validateUserToken = (id: string, token: string) => Promise<boolean>;

interface RedisService {
  destroyUserToken: destroyUserToken;
  generateUserToken: generateUserToken;
  validateUserToken: validateUserToken;
}

const instance = new Redis({
  keyPrefix: 'devpunk_'
});

const generateUserToken: generateUserToken = async (id) => {
  const token = nanoid();

  await instance.set(`token_${token}`, id);

  return token;
};

const validateUserToken: validateUserToken = async (id, token) => {
  const user = await instance.get(`token_${token}`);

  return user === id;
};

const destroyUserToken: destroyUserToken = (token) =>
  instance.del(`token_${token}`);

const redis = fp((fastify, _, next) => {
  fastify.decorate('redis', {
    destroyUserToken,
    generateUserToken,
    validateUserToken
  });

  next();
});

export default redis;
export { RedisService };
