import jwtDecode from 'jwt-decode';
import { User } from './reducers/authReducers';

export const saveToken = (token: string) => {
  localStorage.setItem('accessToken', token);
};

export const loadToken = () => {
  return localStorage.getItem('accessToken');
};

export const removeToken = () => {
  localStorage.removeItem('accessToken');
};

export const decodeToken = (token: string) => {
  return jwtDecode<JwtPayload>(token);
};

export const getUserFromToken = (token: string): User | null => {
  try {
    const payload = decodeToken(token);
    return {
      id: payload.user_id,
      username: payload.username,
    };
  } catch (error) {
    return null;
  }
};

interface JwtPayload {
  user_id: number;
  username: string;
  exp: number;
  iat: number;
}
