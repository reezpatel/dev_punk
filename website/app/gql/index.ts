import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import { Website, Feeds, User } from '@devpunk/types';

const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
});

const getAllWebsites = async () => {
  const query = gql`
    query {
      websites {
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

  try {
    const result = await client.query<{ websites: Website[] }>({
      query,
      fetchPolicy: 'no-cache',
    });

    return result.data.websites;
  } catch (e) {
    console.error(e);
    throw new Error('Failed to add website');
  }
};

interface WebsiteMutationResponse extends Website {
  addWebsite: {
    error: string;
  };
}

const addNewWebsite = async (website: Website) => {
  const mutation = gql`
    mutation($website: IWebsite!) {
      addWebsite(website: $website) {
        name
        _id
        error
      }
    }
  `;

  let result;
  try {
    result = await client.mutate<WebsiteMutationResponse>({
      mutation,
      variables: {
        website,
      },
    });
  } catch (e) {
    console.error(e);
    throw new Error('Failed to add website');
  }

  if (result.errors?.length) {
    throw new Error(result.errors[0].name);
  }

  if (result.data.addWebsite.error) {
    throw new Error(result.data.addWebsite.error);
  }

  return result.data;
};

const editWebsite = async (website: Website) => {
  const mutation = gql`
    mutation($website: IWebsite!) {
      editWebsite(website: $website) {
        name
        _id
        error
      }
    }
  `;

  let result;
  try {
    result = await client.mutate<WebsiteMutationResponse>({
      mutation,
      variables: {
        website,
      },
    });
  } catch (e) {
    console.error(e);
    throw new Error('Failed to edit website');
  }

  if (result.errors?.length) {
    throw new Error(result.errors[0].name);
  }

  if (result.data.editWebsite.error) {
    throw new Error(result.data.editWebsite.error);
  }

  return result.data;
};

const deleteWebsite = async (id: String) => {
  const mutation = gql`
    mutation($id: String!) {
      deleteWebsite(id: $id) {
        success
        error
      }
    }
  `;

  let result;
  try {
    result = await client.mutate<WebsiteMutationResponse>({
      mutation,
      variables: {
        id,
      },
    });
  } catch (e) {
    console.error(e);
    throw new Error('Failed to delete website');
  }

  if (result.errors?.length) {
    throw new Error(result.errors[0].name);
  }

  if (result.data.deleteWebsite.error) {
    throw new Error(result.data.deleteWebsite.error);
  }

  return result.data;
};

const deleteFeed = async (id: String) => {
  const mutation = gql`
    mutation($id: String!) {
      deleteFeed(id: $id) {
        success
        error
      }
    }
  `;

  let result;
  try {
    result = await client.mutate<WebsiteMutationResponse>({
      mutation,
      variables: {
        id,
      },
    });
  } catch (e) {
    console.error(e);
    throw new Error('Failed to delete website');
  }

  if (result.errors?.length) {
    throw new Error(result.errors[0].name);
  }

  if (result.data.deleteFeed.error) {
    throw new Error(result.data.deleteFeed.error);
  }

  return result.data;
};

const getFeeds = async (page: number, website: string) => {
  const query = gql`
    query($page: Int!, $website: String) {
      feeds(page: $page, website: $website) {
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

  try {
    const result = await client.query<{ feeds: Feeds[] }>({
      query,
      fetchPolicy: 'no-cache',
      variables: {
        page,
        website,
      },
    });

    return result.data.feeds as Feeds[];
  } catch (e) {
    console.error(e);
    throw new Error('Failed to add website');
  }
};

const getUser = async (token: string) => {
  const query = gql`
    query {
      user {
        name
        favorites {
          title
        }
        pins {
          name
        }
        error
      }
    }
  `;

  let result;
  try {
    result = await client.query({
      query,
      fetchPolicy: 'no-cache',
      context: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
    console.log('result', result);
  } catch (e) {
    console.error(e);
    throw new Error('Failed to get user');
  }

  if (result.errors?.length) {
    throw new Error(result.errors[0].name);
  }

  if (result.data.user.error) {
    throw new Error(result.data.user.error);
  }

  return result.data.user;
};

export {
  getAllWebsites,
  editWebsite,
  addNewWebsite,
  deleteFeed,
  deleteWebsite,
  getFeeds,
  getUser,
};
