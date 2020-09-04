const API_BASE_URL = 'http://localhost:3000/api/v1';

const AUTH_VALIDATE_URL = `${API_BASE_URL}/auth/validate`;

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

export { validateAuthToken };
