import fp from 'fastify-plugin';
import gql from 'fastify-gql';

const schema = `
  type Website {
    _id: String
    name: String
    type: String
    website: String
    order: Int
    feed: String
    active: Boolean
    error: String
  }

  input IWebsite {
    _id: String
    name: String!
    type: String!
    website: String!
    order: Int!
    feed: String!
    active: Boolean!
  }

  type Feed {
    _id: String
    title: String!
    createdAt: String!
    publishedAt: String
    author: String
    tags: [String!]
    website: Website!
  }

  type User {
    _id: String
    name: String!
    favorites: [Feed]
    pins: [Website]
    error: String
  }

  type Action {
    success: Boolean
    error: String
  }

  type Query {
    website: Website
    websites: [Website!]!
    feeds(page: Int!, website: String): [Feed!]!
    user: User
  }

  type Mutation {
    addWebsite(website: IWebsite!): Website
    editWebsite(website: IWebsite!): Website
    deleteWebsite(id: String!): Action
    deleteFeed(id: String!): Action
    updateFavorites(ids: [String!]!): User
    updatePins(ids: [String]!): User
  }
`;

const graphql = fp((fastify, _, next) => {
  const resolvers = {
    Query: {
      websites() {
        return fastify.db.getAllWebsites();
      },
      feeds(_, { page, website }) {
        return fastify.db.getFeeds(page, website);
      },
      async user(_, __, ctx) {
        if (!ctx.isAuthenticated) {
          return {
            error: 'Unauthenticated Request',
          };
        }
        return fastify.db.getUserById(ctx.id);
      },
    },
    Mutation: {
      addWebsite(_, { website }) {
        return fastify.db.addNewWebsite(website);
      },
      editWebsite(_, { website }) {
        return fastify.db.editWebsite(website);
      },
      deleteWebsite(_, { id }) {
        return fastify.db.deleteWebsite(id);
      },
      deleteFeed(_, { id }) {
        return fastify.db.deleteFeed(id);
      },
      updateFavorites(_, { ids }, ctx) {
        if (!ctx.isAuthenticated) {
          return {
            error: 'Unauthenticated Request',
          };
        }
        return fastify.db.updateFavorites(ctx.id, ids);
      },
      updatePins(_, { ids }, ctx) {
        if (!ctx.isAuthenticated) {
          return {
            error: 'Unauthenticated Request',
          };
        }
        return fastify.db.updatePins(ctx.id, ids);
      },
    },
  };

  const loaders = {
    Feed: {
      website(queries) {
        return fastify.db.resolveFeedsToWebsite(queries.map(({ obj }) => obj));
      },
    },
    User: {
      favorites(queries) {
        return fastify.db.resolveFavorites(queries[0].obj.favorites);
      },
      pins(queries) {
        return fastify.db.resolvePins(queries[0].obj.pins);
      },
    },
  };

  fastify.register(gql, {
    schema: schema,
    resolvers: resolvers,
    graphiql: 'playground',
    loaders: loaders,
    context: async (req) => {
      if (
        !req.headers.authorization ||
        !req.headers.authorization.startsWith('Bearer ')
      ) {
        return {
          isAuthenticated: false,
          roles: [],
        };
      }

      const token = Buffer.from(
        req.headers.authorization.split(' ')[1],
        'base64'
      ).toString('utf-8');

      const [userId, secret] = token.split(':');

      const isAuthenticated = await fastify.redis.validateUserToken(
        userId,
        secret
      );

      return {
        isAuthenticated,
        roles: ['USER', 'ADMIN'],
        id: userId,
      };
    },
  });

  next();
});

export default graphql;
