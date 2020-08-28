import { Schema, Document } from 'mongoose';
const ObjectId = Schema.Types.ObjectId;

interface IWebsite extends Document {
  _id: string;
  name: string;
  type: string;
  website: string;
  order: string;
  feed: string;
  active: boolean;
}

const urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

const WebsiteSchema = new Schema({
  name: {
    type: String,
    validate: [/\S+/, 'Website Name is Required'],
    unique: [true, 'Website already exist'],
    index: true,
  },
  type: {
    type: String,
    enum: ['RSS'],
  },
  website: {
    type: String,
    validate: [urlRegex, 'Website URL is invalid'],
    unique: [true, 'Website with provided url already exist'],
  },
  order: {
    type: Number,
    min: [0, 'Website order should be above 0'],
    max: [10000, 'Website order should be below 10000'],
  },
  feed: {
    type: String,
    validate: [urlRegex, 'Feed URL is invalid'],
    unique: [true, 'Website with provided feed already exist'],
  },
  active: Boolean,
});

interface IFeeds extends Document {
  _id: string;
  title: string;
  url: string;
  createdAt: string;
  publishedAt: string;
  author: string;
  tags: string[];
  website: string;
}

const FeedsSchema = new Schema({
  _id: {
    type: ObjectId,
  },
  url: { type: String, index: true, unique: true },
  title: { type: String, index: true },
  createdAt: String,
  publishedAt: String,
  author: String,
  tags: [String],
  website: String,
});

interface IUser extends Document {
  name: string;
  favorites: string[];
  pins: [];
}

const UserSchema = new Schema({
  _id: {
    type: ObjectId,
  },
  name: String,
  favorites: [String],
  pins: [String],
});

export { WebsiteSchema, FeedsSchema, UserSchema, IWebsite, IFeeds, IUser };
