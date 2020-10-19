import { createReadStream, createWriteStream, unlinkSync } from 'fs';
import { join } from 'path';
import { Readable } from 'stream';
import AWS from 'aws-sdk';
import { FastifyInstance, FastifyLoggerInstance } from 'fastify';
import axios from 'axios';
import sharp from 'sharp';
import mime from 'mime';
import { getFeedImageUrl } from '../../utils';
import StorageService from './interface';

const DEFAULT_WEBSITE_LOGO_PATH = join(__dirname, './../../../assets/logo.png');

const SUCCESS_RESPONSE_CODE = 200;
const RESIZED_IMAGE = 120;

const storeFileToBucket = (
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

const uploadFile = (
  logger: FastifyLoggerInstance,
  s3: AWS.S3,
  bucket: string,
  file: string,
  stream: Readable
) =>
  new Promise((resolve, reject) => {
    const tmpFile = join('/tmp', file);
    const writer = createWriteStream(tmpFile);

    stream.pipe(writer);

    writer.on('close', async () => {
      try {
        await storeFileToBucket(
          s3,
          bucket,
          createReadStream(tmpFile),
          `feed/full/${file}`
        );
        const smallImage = await sharp(tmpFile)
          .resize(RESIZED_IMAGE)
          .toBuffer();

        await storeFileToBucket(s3, bucket, smallImage, `feed/small/${file}`);

        unlinkSync(tmpFile);

        resolve(file);
      } catch (e) {
        logger.error({
          message: e.message,
          module: 'Image:: Add Feed Icon',
          stack: e.stack
        });

        reject(e);
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
      const extension = mime.getExtension(res.headers['content-type']);

      if (res.status === SUCCESS_RESPONSE_CODE) {
        await uploadFile(logger, s3, bucket, `${id}.${extension}`, res.data);
      } else {
        throw new Error(`Image Not Found => ${res.status}`);
      }

      return `${id}.${extension}`;
    }

    return '';
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

    await storeFileToBucket(s3, bucket, Readable.from(buffer), id);
  } else {
    await storeFileToBucket(
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
