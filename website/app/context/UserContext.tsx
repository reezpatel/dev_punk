import React, { useState, useCallback, Fragment } from 'react';
import constate from 'constate';

interface User {
  isLoggedIn: boolean;
}

interface UserHook {
  user: User;
  setLoginStatus: (status: boolean) => void;
}

const useUser = () => {
  const [user, setUser] = useState<User>({ isLoggedIn: false });

  const setLoginStatus = useCallback(
    (status: boolean) => setUser({ ...user, isLoggedIn: status }),
    []
  );

  return { user, setLoginStatus };
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
