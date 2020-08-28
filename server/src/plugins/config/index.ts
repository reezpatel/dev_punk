const schema = {
  type: 'object',
  required: ['MONGODB_PASSWORD', 'MONGODB_USERNAME', 'MONGODB_DB_NAME'],
  properties: {
    MONGODB_PASSWORD: {
      type: 'string',
    },
    MONGODB_USERNAME: {
      type: 'string',
    },
    MONGODB_DB_NAME: {
      type: 'string',
    },
    MONGODB_AUTH_DB: {
      type: 'string',
      default: 'admin',
    },
    MONGODB_HOST: {
      type: 'string',
      default: 'localhost',
    },
    MONGODB_PORT: {
      type: 'number',
      default: 27017,
    },
    DATA_DIR: {
      type: 'string',
    },
  },
};

const option = {
  schema: schema,
  dotenv: {
    path: `${__dirname}/../../../.env`,
    debug: true,
  },
};

export default option;
