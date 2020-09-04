/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useCallback } from 'react';
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
    name: ''
  });

  const login = useCallback(
    (token: string) => {
      window.localStorage.setItem('AUTH_TOKEN', token);
      setUser({ ...user, isLoggedIn: true });
    },
    [user]
  );

  const logout = useCallback(() => {
    // TODO Call Logout API
    window.localStorage.removeItem('AUTH_TOKEN');
    setUser({ ...user, isLoggedIn: false });
  }, [user]);

  const setFavorites = (favorites: Feeds[]) => {
    // TODO: Update Favs in Server
    setUser({
      ...user,
      favorites
    });
  };

  const setPins = (pins: Website[]) => {
    // TODO: Update Pins in Server
    setUser({
      ...user,
      pins
    });
  };

  return { user, login, logout, setFavorites, setPins };
};

const [UserProvider, useUserContext] = constate<UserState, UserHook, []>(
  useUser
);

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const withUser = (Children: () => JSX.Element) => (props): JSX.Element => {
  const userProps = useUserContext();
  return (
    <>
      <Children {...props} {...userProps} />
    </>
  );
};

export { withUser, useUserContext, UserProvider };
