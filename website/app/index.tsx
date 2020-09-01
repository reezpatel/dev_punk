import React from 'react';
import ReactDOM from 'react-dom';
import { UserProvider } from './context/UserContext';
import App from './app';

import './styles.scss';

ReactDOM.render(
  <UserProvider isLoggedIn={false}>
    <App />
  </UserProvider>,
  document.getElementById('root')
);
