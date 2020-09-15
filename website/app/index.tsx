import React from 'react';
import ReactDOM from 'react-dom';
import { UserProvider, DeviceProvider } from './context';
import App from './app';
import './styles.scss';

ReactDOM.render(
  <UserProvider name="" favorites={[]} pins={[]} isLoggedIn={false}>
    <DeviceProvider type="DESKTOP">
      <App />
    </DeviceProvider>
  </UserProvider>,
  document.getElementById('root')
);
