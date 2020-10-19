import { Schema } from 'mongoose';
import { URL_REGEX } from '../../utils';
const { ObjectId } = Schema.Types;

const MAX_ORDER_COUNT = 10000;
const MIN_ORDER_COUNT = 0;

const WebsiteSchema = new Schema({
  active: Boolean,
  feed: {
    type: String,
    unique: [true, 'Website with provided feed already exist'],
    validate: [URL_REGEX, 'Feed URL is invalid']
  },
  name: {
    index: true,
    type: String,
    unique: [true, 'Website already exist'],
    validate: [/\S+/u, 'Website Name is Required']
  },
  order: {
    max: [MAX_ORDER_COUNT, 'Website order should be below 10000'],
    min: [MIN_ORDER_COUNT, 'Website order should be above 0'],
    type: Number
  },
  type: {
    enum: ['RSS'],
    type: String
  },
  website: {
    type: String,
    unique: [true, 'Website with provided url already exist'],
    validate: [URL_REGEX, 'Website URL is invalid']
  }
});

const FeedsSchema = new Schema({
  _id: {
    type: ObjectId
  },
  author: String,
  createdAt: String,
  image: String,
  publishedAt: String,
  tags: [String],
  title: { index: true, type: String },
  url: { index: true, type: String, unique: true },
  website: String
});

const UserSchema = new Schema({
  _id: {
    type: ObjectId
  },
  email: {
    index: true,
    type: String,
    unique: true
  },
  favorites: [String],
  name: String,
  pins: [String]
});

export { WebsiteSchema, FeedsSchema, UserSchema };
