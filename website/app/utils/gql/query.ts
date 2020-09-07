/* eslint-disable @typescript-eslint/no-unused-vars */
import gql from 'graphql-tag';

const GET_ALL_WEBSITE_QUERY = gql`
  query {
    items: websites {
      name
      _id
      website
      feed
      order
      active
      type
    }
  }
`;

const GET_PAGINATED_FEEDS_QUERY = gql`
  query($page: Int!, $website: String) {
    items: feeds(page: $page, website: $website) {
      _id
      title
      author
      tags
      createdAt
      publishedAt
      author
      website {
        name
        _id
        website
        order
      }
    }
  }
`;

const ADD_WEBSITE_MUTATION = gql`
  mutation($website: IWebsite!) {
    item: addWebsite(website: $website) {
      name
      _id
      error
    }
  }
`;

const EDIT_WEBSITE_MUTATION = gql`
  mutation($website: IWebsite!) {
    item: editWebsite(website: $website) {
      name
      _id
      error
    }
  }
`;

const DELETE_WEBSITE_MUTATION = gql`
  mutation($id: String!) {
    item: deleteWebsite(id: $id) {
      success
      error
    }
  }
`;

const DELETE_FEED_MUTATION = gql`
  mutation($id: String!) {
    item: deleteFeed(id: $id) {
      success
      error
    }
  }
`;

const GET_USER_QUERY = gql`
  query {
    items: user {
      name
      favorites {
        _id
        title
      }
      pins {
        _id
        name
      }
      error
    }
  }
`;

const UPDATE_PIN_MUTATION = gql`
  mutation($ids: [String]!) {
    item: updatePins(ids: $ids) {
      name
      favorites {
        _id
        title
      }
      pins {
        _id
        name
        website
      }
      error
    }
  }
`;

const UPDATE_FAVORITES_MUTATION = gql`
  mutation($ids: [String!]!) {
    item: updateFavorites(ids: $ids) {
      name
      favorites {
        _id
        title
        website {
          _id
          name
        }
      }
      pins {
        _id
        name
        website
      }
      error
    }
  }
`;

export {
  GET_ALL_WEBSITE_QUERY,
  GET_PAGINATED_FEEDS_QUERY,
  ADD_WEBSITE_MUTATION,
  EDIT_WEBSITE_MUTATION,
  DELETE_WEBSITE_MUTATION,
  DELETE_FEED_MUTATION,
  GET_USER_QUERY,
  UPDATE_FAVORITES_MUTATION,
  UPDATE_PIN_MUTATION
};
