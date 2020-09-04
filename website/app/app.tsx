import React, { useEffect, useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { useUserContext } from './context';
import { request, gql } from './utils';
import { FullScreenLoader } from './components';
import { FeedsPage, AuthPage, AdminPage } from './Pages';

const VIEW_LOADING = 0;
const VIEW_CONTENT = 1;

const App = (): JSX.Element => {
  const [view, setView] = useState(VIEW_LOADING);
  const user = useUserContext();

  const validateLogin = async () => {
    try {
      const token = window.localStorage.getItem('AUTH_TOKEN');

      if (await request.validateAuthToken(token)) {
        user.login(token);

        // TODO Add user data to state
        // const userData = await gql.getUser(token);
        // console.log(userData);
      } else {
        user.logout();
      }
    } catch {
      user.logout();
    }
    setView(VIEW_CONTENT);
  };

  useEffect(() => {
    validateLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {view === VIEW_CONTENT && (
        <BrowserRouter>
          <Switch>
            <Route path="/" exact>
              <FeedsPage />
            </Route>
            <Route path="/admin">
              <AdminPage />
            </Route>
            <Route path="/auth">
              <AuthPage />
            </Route>
          </Switch>
        </BrowserRouter>
      )}
      {view === VIEW_LOADING && <FullScreenLoader />}
    </>
  );
};

export default App;
