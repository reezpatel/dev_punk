import ENDPOINTS from './endpoints';

const AUTH_VALIDATE_URL = ENDPOINTS.authUrl;
const validateAuthToken = async (token: string): Promise<boolean> => {
  if (!token) {
    return false;
  }

  const response = await fetch(AUTH_VALIDATE_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await response.json();

  if (data && data.success) {
    return true;
  }

  return false;
};

// eslint-disable-next-line import/prefer-default-export
export { validateAuthToken };
