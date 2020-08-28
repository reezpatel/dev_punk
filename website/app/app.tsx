import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import AdminPage from './Pages/Admin';
import GuestPage from './Pages/Guest';

const App = () => {
  return (
    <BrowserRouter>
      <UserProvider isLoggedIn={false}>
        <Switch>
          <Route path="/" exact>
            <GuestPage></GuestPage>
          </Route>
          <Route path="/admin">
            <AdminPage></AdminPage>
          </Route>
        </Switch>
      </UserProvider>
    </BrowserRouter>
  );
};

export default App;
