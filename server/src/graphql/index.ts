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
  }

  type Query {
    website: Website
    websites: [Website!]!
    feeds(page: Int!, website: String): [Feed!]!
    user(id: String!): User
  }

  type Mutation {
    addWebsite(website: IWebsite!): Website
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
    },
    Mutation: {
      addWebsite(_, { website }) {
        return fastify.db.addNewWebsite(website);
      },
    },
  };

  const loaders = {
    Feed: {
      website(queries) {
        return fastify.db.resolveFeedsToWebsite(queries.map(({ obj }) => obj));
      },
    },
  };

  fastify.register(gql, {
    schema: schema,
    resolvers: resolvers,
    graphiql: 'playground',
    loaders: loaders,
  });

  next();
});

export default graphql;
