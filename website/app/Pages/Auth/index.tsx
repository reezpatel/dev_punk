import React, { useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useUserContext } from '../../context';
import { CONFIG } from '../../utils';
import { FullScreenLoader } from '../../components';

const AuthPage = (): JSX.Element => {
  const location = useLocation();
  const history = useHistory();
  const user = useUserContext();

  const handleLogin = async () => {
    const params = new URLSearchParams(location.search);
    const response = await fetch(CONFIG.ENDPOINTS.authCode(params.get('code')));
    const { token } = await response.json();

    user.login(token);

    history.replace('/');
  };

  useEffect(() => {
    handleLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <FullScreenLoader />;
};

export default AuthPage;
