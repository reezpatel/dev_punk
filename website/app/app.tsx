import React, { useEffect, useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { useDeviceContext, useUserContext } from './context';
import { request, gql, CONFIG } from './utils';
import { FullScreenLoader } from './components';
import { FeedsPage, AuthPage, AdminPage } from './Pages';

const VIEW_LOADING = 0;
const VIEW_CONTENT = 1;

const matchWidth = (width) => {
  return window.matchMedia(`(max-width: ${width}px)`).matches;
};

const App = (): JSX.Element => {
  const [view, setView] = useState(VIEW_LOADING);
  const user = useUserContext();
  const device = useDeviceContext();

  const resizeListener = () => {
    if (matchWidth(CONFIG.BREAKPOINTS.mobile)) {
      device.setDeviceType('MOBILE');
    } else if (matchWidth(CONFIG.BREAKPOINTS.tablet)) {
      device.setDeviceType('TABLET');
    } else {
      device.setDeviceType('DESKTOP');
    }
  };

  const validateLogin = async () => {
    try {
      const token = window.localStorage.getItem('AUTH_TOKEN');

      if (await request.validateAuthToken(token)) {
        const userData = await gql.getUser(token);

        user.login(token, userData.pins, userData.favorites);
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

    resizeListener();
    window.addEventListener('resize', resizeListener);
    return () => {
      window.removeEventListener('resize', resizeListener);
    };

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
