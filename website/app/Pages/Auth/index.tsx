import React, { useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';

const AuthPage = () => {
  const location = useLocation();
  const history = useHistory();
  const user = useUserContext();

  const handleLogin = async () => {
    const params = new URLSearchParams(location.search);

    const response = await fetch(
      `http://localhost:3000/auth/${params.get('code')}`
    );

    const { token } = await response.json();

    console.log(token);

    user.login(token);

    history.replace('/');
  };

  useEffect(() => {
    handleLogin();
  }, []);

  return <div>"Working on it...</div>;
};

export default AuthPage;
