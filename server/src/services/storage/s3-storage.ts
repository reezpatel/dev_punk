import { createReadStream } from 'fs';
import { join } from 'path';
import { Readable } from 'stream';
import AWS from 'aws-sdk';
import { FastifyInstance, FastifyLoggerInstance } from 'fastify';
import axios from 'axios';
import { getFeedImageUrl } from '../../utils';
import StorageService from './interface';

const DEFAULT_WEBSITE_LOGO_PATH = join(__dirname, './../../../assets/logo.png');
const DEFAULT_FEED_BANNER_PATH = join(
  __dirname,
  './../../../assets/banner.png'
);

const SUCCESS_RESPONSE_CODE = 200;

const uploadFile = (
  s3: AWS.S3,
  bucket: string,
  stream: Readable,
  name: string
) =>
  new Promise((resolve, reject) => {
    s3.upload({ Body: stream, Bucket: bucket, Key: name }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

const saveFeedImage = (
  logger: FastifyLoggerInstance,
  s3: AWS.S3,
  bucket: string
) => async (id: string, url: string) => {
  try {
    const imageUrl = await getFeedImageUrl(logger, url);

    if (imageUrl) {
      const res = await axios.get(imageUrl, {
        responseType: 'stream'
      });

      if (res.status === SUCCESS_RESPONSE_CODE) {
        await uploadFile(s3, bucket, res.data, id);
      }
    } else {
      await uploadFile(
        s3,
        bucket,
        createReadStream(DEFAULT_FEED_BANNER_PATH),
        id
      );
    }

    return id;
  } catch (e) {
    logger.error({
      message: e.message,
      module: 'Image:: Add Feed Image',
      stack: e.stack
    });
  }

  return '';
};

const saveWebsiteImage = (s3: AWS.S3, bucket: string) => async (
  id: string,
  data: string
) => {
  if (data) {
    const index = data.indexOf(',');
    const buffer = Buffer.from(data.substring(index), 'base64');

    await uploadFile(s3, bucket, Readable.from(buffer), id);
  } else {
    await uploadFile(
      s3,
      bucket,
      createReadStream(DEFAULT_WEBSITE_LOGO_PATH),
      id
    );
  }

  return id;
};

const getS3StoragePlugin = (fastify: FastifyInstance): StorageService => {
  const s3 = new AWS.S3({ endpoint: fastify.config.S3_BUCKET_REGION });

  return {
    getFeedImage: () => '',
    getWebsiteImage: () => '',
    saveFeedImage: saveFeedImage(
      fastify.log,
      s3,
      fastify.config.S3_BUCKET_NAME
    ),
    saveWebsiteImage: saveWebsiteImage(s3, fastify.config.S3_BUCKET_NAME)
  };
};

export default getS3StoragePlugin;
