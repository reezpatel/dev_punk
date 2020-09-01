import React, { useEffect, useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import AdminPage from './Pages/Admin';
import GuestPage from './Pages/Guest';
import AuthPage from './Pages/Auth';
import { useUserContext } from './context/UserContext';
import { getUser } from './gql';

const App = () => {
  const [loading, setLoading] = useState(true);
  const user = useUserContext();

  const validateLogin = async () => {
    const token = window.localStorage.getItem('AUTH_TOKEN');

    if (!token) {
      user.logout();
    }

    const response = await fetch('http://localhost:3000/auth/validate', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    if (data && data.success) {
      user.login(token);
      const userData = await getUser(token);
      console.log(userData);
    } else {
      user.logout();
    }

    setLoading(false);
  };

  useEffect(() => {
    validateLogin();
  }, []);

  return loading ? (
    <div>loading</div>
  ) : (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact>
          <GuestPage></GuestPage>
        </Route>
        <Route path="/admin">
          <AdminPage></AdminPage>
        </Route>
        <Route path="/authcallback">
          <AuthPage></AuthPage>
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default App;
