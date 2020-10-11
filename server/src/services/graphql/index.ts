import fp from 'fastify-plugin';
import gql from 'fastify-gql';
import { IFeeds, IUser } from 'src/types/database';
import DBController from '../database/controller';
import { RedisService } from '../redis';
import { schema } from './schema';

const ZERO_INDEX = 0;
const FIRST_INDEX = 1;

const queries = (db: DBController) => ({
  feeds(_, { page, website, query }) {
    return db.getFeeds(page, website, query);
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

const withAuth = (roles, cb) => (_, fields, ctx) => {
  if (!ctx.isAuthenticated) {
    return {
      error: 'Unauthenticated Request'
    };
  }

  if (roles.find((role) => ctx.roles[role])) {
    return {
      error: 'Unauthorized Request'
    };
  }

  return cb(_, fields, ctx);
};

const mutations = (db: DBController) => ({
  addWebsite: withAuth(['ADMIN'], (_, { website }) =>
    db.addNewWebsite(website)
  ),
  deleteFeed: withAuth(['ADMIN'], (_, { id }) => db.deleteFeed(id)),
  deleteWebsite: withAuth(['ADMIN'], (_, { id }) => db.deleteWebsite(id)),
  editWebsite: withAuth(['ADMIN'], (_, { website }) => db.editWebsite(website)),
  updateFavorites: withAuth(['USER'], (_, { ids }, ctx) =>
    db.updateFavorites(ctx.id, ids)
  ),
  updatePins: withAuth(['USER'], (_, { ids }, ctx) =>
    db.updatePins(ctx.id, ids)
  )
});

const loaders = (db: DBController) => ({
  Feed: {
    website(requests: { obj: IFeeds }[]) {
      return db.resolveFeedsToWebsite(requests.map(({ obj }) => obj));
    }
  },
  User: {
    async favorites(requests: { obj: IUser }[]) {
      return [await db.resolveFavorites(requests[ZERO_INDEX].obj.favorites)];
    },
    async pins(requests: { obj: IUser }[]) {
      return [await db.resolvePins(requests[ZERO_INDEX].obj.pins)];
    }
  }
});

const getContext = (adminEmail: string, redis: RedisService) => async (req) => {
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

  const [id, secret, email] = token.split(':');
  const isAuthenticated = await redis.validateUserToken(id, secret);

  return {
    id,
    isAuthenticated,
    roles: {
      ADMIN: adminEmail === email,
      USER: true
    }
  };
};

const graphql = fp((fastify, _, next) => {
  const resolvers = {
    Mutation: mutations(fastify.db),
    Query: queries(fastify.db)
  };

  fastify.register(gql, {
    context: getContext(fastify.config.ADMIN_USER, fastify.redis),
    graphiql: 'playground',
    loaders: loaders(fastify.db),
    resolvers,
    schema
  });

  next();
});

export default graphql;
