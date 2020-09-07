/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useCallback } from 'react';
import constate from 'constate';
import { User, Feeds, Website } from '@devpunk/types';
import { gql } from '../utils';

interface UserState extends User {
  isLoggedIn: boolean;
}

interface UserHook {
  user: UserState;
  login: (token: string, pins?: Website[], favorites?: Feeds[]) => void;
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
    (token: string, pins?: Website[], favorites?: Feeds[]) => {
      window.localStorage.setItem('AUTH_TOKEN', token);
      setUser({
        ...user,
        isLoggedIn: true,
        pins: pins || user.pins,
        favorites: favorites || user.favorites
      });
    },
    [user]
  );

  const logout = useCallback(() => {
    // TODO Call Logout API
    window.localStorage.removeItem('AUTH_TOKEN');
    setUser({ ...user, isLoggedIn: false });
  }, [user]);

  const setFavorites = async (favorites: Feeds[]) => {
    const ids = favorites.map((p) => p._id);

    const data = await gql.updateFavorites(
      window.localStorage.getItem('AUTH_TOKEN'),
      ids
    );

    setUser({
      ...user,
      favorites: data.favorites
    });
  };

  const setPins = async (pins: Website[]) => {
    const ids = pins.map((p) => p._id);

    const data = await gql.updatePins(
      window.localStorage.getItem('AUTH_TOKEN'),
      ids
    );

    setUser({
      ...user,
      pins: data.pins
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
