interface Config {
  ADMIN_USER: string;
  INGESTION_KEY: string;
  MONGODB_PASSWORD: string;
  MONGODB_USERNAME: string;
  MONGODB_DB_NAME: string;
  MONGODB_AUTH_DB: string;
  MONGODB_HOST: string;
  MONGODB_PORT: number;
  DATA_DIR: string;
  SERVER_PORT: number;
  GITHUB_LOGIN_CLIENT_ID: string;
  GITHUB_LOGIN_CLIENT_SECRET: string;
  APPLICATION_URL: string;
  REDIS_HOST: string;
}

const schema = {
  properties: {
    ADMIN_USER: {
      type: 'string'
    },
    APPLICATION_URL: {
      default: 'https://example.com/',
      type: 'string'
    },
    DATA_DIR: {
      default: '/tmp',
      type: 'string'
    },
    GITHUB_LOGIN_CLIENT_ID: {
      type: 'string'
    },
    GITHUB_LOGIN_CLIENT_SECRET: {
      type: 'string'
    },
    INGESTION_KEY: {
      type: 'string'
    },
    MONGODB_AUTH_DB: {
      default: 'admin',
      type: 'string'
    },
    MONGODB_DB_NAME: {
      type: 'string'
    },
    MONGODB_HOST: {
      default: 'localhost',
      type: 'string'
    },
    MONGODB_PASSWORD: {
      type: 'string'
    },
    MONGODB_PORT: {
      default: 27017,
      type: 'number'
    },
    MONGODB_USERNAME: {
      type: 'string'
    },
    REDIS_HOST: {
      default: 'localhost',
      type: 'string'
    },
    SERVER_PORT: {
      default: 3000,
      type: 'number'
    }
  },
  required: [
    'ADMIN_USER',
    'GITHUB_LOGIN_CLIENT_ID',
    'GITHUB_LOGIN_CLIENT_SECRET',
    'MONGODB_DB_NAME',
    'MONGODB_PASSWORD',
    'MONGODB_USERNAME',
    'INGESTION_KEY'
  ],
  type: 'object'
};

const option = {
  dotenv: {
    debug: true,
    path: `${__dirname}/../../../.env`
  },
  schema
};

export default option;
export { Config };
