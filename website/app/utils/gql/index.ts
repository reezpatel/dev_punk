import ApolloClient, { DocumentNode, OperationVariables } from 'apollo-boost';
import { Website, Feeds, User } from '@devpunk/types';
import {
  GET_ALL_WEBSITE_QUERY,
  GET_PAGINATED_FEEDS_QUERY,
  ADD_WEBSITE_MUTATION,
  EDIT_WEBSITE_MUTATION,
  DELETE_WEBSITE_MUTATION,
  DELETE_FEED_MUTATION,
  GET_USER_QUERY,
  UPDATE_PIN_MUTATION,
  UPDATE_FAVORITES_MUTATION
} from './query';
import ENDPOINTS from '../endpoints';

const GQL_SERVER = ENDPOINTS.gqlServer;

const client = new ApolloClient({
  uri: GQL_SERVER
});

async function executeQuery<Type>(
  query: DocumentNode,
  variables?: OperationVariables,
  context?: Record<string, unknown>
): Promise<Type> {
  try {
    const result = await client.query<{ items: Type }>({
      query,
      variables,
      fetchPolicy: 'no-cache',
      context
    });

    if (result.errors?.length) {
      throw new Error(result.errors[0].name);
    }

    return result.data.items;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    throw new Error('Something went wrong!! Try again Later...');
  }
}

async function executeMutation<Type>(
  mutation: DocumentNode,
  variables?: OperationVariables,
  context?: Record<string, unknown>
): Promise<Type> {
  let result;
  try {
    result = await client.mutate<Type>({
      mutation,
      variables,
      fetchPolicy: 'no-cache',
      context
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    throw new Error('Something went wrong!! Try again Later...');
  }

  if (result.errors?.length) {
    throw new Error(result.errors[0].name);
  }

  if (result.data.item.error) {
    throw new Error(result.data.item.error);
  }

  return result.data.item;
}

const getAllWebsites = async (): Promise<Website[]> => {
  return executeQuery<Website[]>(GET_ALL_WEBSITE_QUERY);
};

const getFeeds = async (
  page: number,
  website?: string,
  query?: string
): Promise<Feeds[]> => {
  return executeQuery<Feeds[]>(GET_PAGINATED_FEEDS_QUERY, {
    page,
    website,
    query
  });
};

const addNewWebsite = async (
  token: string,
  website: Website
): Promise<Website> => {
  return executeMutation<Website>(
    ADD_WEBSITE_MUTATION,
    {
      website
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};

const editWebsite = async (
  token: string,
  website: Website
): Promise<Website> => {
  return executeMutation<Website>(
    EDIT_WEBSITE_MUTATION,
    {
      website
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};

const deleteWebsite = async (token: string, id: string): Promise<Website> => {
  return executeMutation<Website>(
    DELETE_WEBSITE_MUTATION,
    {
      id
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};

const deleteFeed = async (token: string, id: string): Promise<Feeds> => {
  return executeMutation<Feeds>(
    DELETE_FEED_MUTATION,
    {
      id
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};

const getUser = async (token: string): Promise<User> => {
  return executeQuery<User>(GET_USER_QUERY, undefined, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

const updatePins = async (token: string, ids: string[]): Promise<User> => {
  return executeMutation<User>(
    UPDATE_PIN_MUTATION,
    {
      ids
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};

const updateFavorites = async (token: string, ids: string[]): Promise<User> => {
  return executeMutation<User>(
    UPDATE_FAVORITES_MUTATION,
    {
      ids
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};

export {
  getAllWebsites,
  editWebsite,
  addNewWebsite,
  deleteFeed,
  deleteWebsite,
  getFeeds,
  getUser,
  updatePins,
  updateFavorites
};
