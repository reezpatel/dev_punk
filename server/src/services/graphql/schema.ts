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
  website: Website
}

type User {
  _id: String
  name: String
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
  feeds(page: Int!, website: String, query: String): [Feed!]!
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

export { schema };
