import React, { useState, useCallback, Fragment } from 'react';
import constate from 'constate';
import { User, Feeds, Website } from '@devpunk/types';

interface UserState extends User {
  isLoggedIn: boolean;
}

interface UserHook {
  user: UserState;
  login: (token: string) => void;
  logout: () => void;
  setFavorites: (favorites: Feeds[]) => void;
  setPins: (pins: Website[]) => void;
}

const useUser = () => {
  const [user, setUser] = useState<UserState>({
    isLoggedIn: false,
    favorites: [],
    pins: [],
    name: '',
  });

  const login = useCallback((token: string) => {
    window.localStorage.setItem('AUTH_TOKEN', token);
    setUser({ ...user, isLoggedIn: true });
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem('AUTH_TOKEN');
    setUser({ ...user, isLoggedIn: false });
  }, []);

  const setFavorites = (favorites: Feeds[]) => {
    setUser({
      ...user,
      favorites,
    });
  };

  const setPins = (pins: Website[]) => {
    setUser({
      ...user,
      pins,
    });
  };

  return { user, login, logout, setFavorites, setPins };
};

const [UserProvider, useUserContext] = constate<User, UserHook, []>(useUser);

const withUser = (Children: () => JSX.Element) => (props) => {
  const userProps = useUserContext();
  return (
    <Fragment>
      <Children {...props} {...userProps} />
    </Fragment>
  );
};

export { withUser, useUserContext, UserProvider };
