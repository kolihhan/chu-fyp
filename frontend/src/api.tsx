import axios from 'axios';
import { loadToken } from './utils';

const API_URL = 'http://localhost:8000/api';

const headers = {
  'Content-Type': 'application/json',
};

export const loginApi = (username: string, password: string) =>
  axios.post(`${API_URL}/login`, { email: username, password: password }, { headers });

export const registerApi = (username: string, password: string, confirmPassword: string) =>
  axios.post(
    `${API_URL}/register`,
    { username, password1: password, password2: confirmPassword },
    { headers }
  );

export const refreshApi = (accessToken : string) =>
  axios.post(
    `${API_URL}/register`,
    { accessToken },
    { headers }
  );

export const getProfileApi = () => {
  const token = loadToken ();
  const headers = { Authorization: `Bearer ${token}` };
  return axios.get(`${API_URL}auth/user/`, { headers });
};