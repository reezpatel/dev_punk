import fp from 'fastify-plugin';
import gql from 'fastify-gql';
import { IFeeds, IUser } from 'src/types/database';
import DBController from '../database/controller';
import { RedisService } from '../redis';
import { schema } from './schema';

const ZERO_INDEX = 0;
const FIRST_INDEX = 1;

const queries = (db: DBController) => ({
  feeds(_, { page, website }) {
    return db.getFeeds(page, website);
  },
  user(_, __, ctx) {
    if (!ctx.isAuthenticated) {
      return {
        error: 'Unauthenticated Request'
      };
    }

    return db.getUserById(ctx.id);
  },
  websites() {
    return db.getAllWebsites();
  }
});

const mutations = (db: DBController) => ({
  addWebsite(_, { website }) {
    return db.addNewWebsite(website);
  },
  deleteFeed(_, { id }) {
    return db.deleteFeed(id);
  },
  deleteWebsite(_, { id }) {
    return db.deleteWebsite(id);
  },
  editWebsite(_, { website }) {
    return db.editWebsite(website);
  },
  updateFavorites(_, { ids }, ctx) {
    if (!ctx.isAuthenticated) {
      return {
        error: 'Unauthenticated Request'
      };
    }

    return db.updateFavorites(ctx.id, ids);
  },
  updatePins(_, { ids }, ctx) {
    if (!ctx.isAuthenticated) {
      return {
        error: 'Unauthenticated Request'
      };
    }

    return db.updatePins(ctx.id, ids);
  }
});

const loaders = (db: DBController) => ({
  Feed: {
    website(requests: { obj: IFeeds }[]) {
      return db.resolveFeedsToWebsite(requests.map(({ obj }) => obj));
    }
  },
  User: {
    favorites(requests: { obj: IUser }[]) {
      return db.resolveFavorites(requests[ZERO_INDEX].obj.favorites);
    },
    pins(requests: { obj: IUser }[]) {
      return db.resolvePins(requests[ZERO_INDEX].obj.pins);
    }
  }
});

const getContext = (redis: RedisService) => async (req) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer ')
  ) {
    return {
      isAuthenticated: false,
      roles: []
    };
  }

  const token = Buffer.from(
    req.headers.authorization.split(' ')[FIRST_INDEX],
    'base64'
  ).toString('utf-8');

  const [id, secret] = token.split(':');
  const isAuthenticated = await redis.validateUserToken(id, secret);

  return {
    id,
    isAuthenticated,
    roles: ['USER', 'ADMIN']
  };
};

const graphql = fp((fastify, _, next) => {
  const resolvers = {
    Mutation: mutations(fastify.db),
    Query: queries(fastify.db)
  };

  fastify.register(gql, {
    context: getContext(fastify.redis),
    graphiql: 'playground',
    loaders: loaders(fastify.db),
    resolvers,
    schema
  });

  next();
});

export default graphql;
