import jwtDecode , {JwtPayload} from "jwt-decode";
import dayjs from 'dayjs';

export const authHeaders = () =>{
  const token = getCookie('accessToken');
  if(token) {
    return{
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }else{
    return{
      'Content-Type': 'application/json',
    }
  }


};

export const saveToken = (token: string) => {
  sessionStorage.setItem('accessToken', token);
  setCookie('accessToken', token);
};


export const removeToken = () => {
  sessionStorage.removeItem('accessToken');
  removeCookie('accessToken');
};


export const getUserFromToken = (payload: any) => {
  try {
    return {
      type : payload.type,
      id: payload.id,
      username: payload.name,
      email: payload.email,
      gender: payload.gender,
      birthday: payload.birthday ? dayjs(payload.birthday).format("YYYY-MM-DD") : null,
      address: payload.address,
      phone: payload.phone,
      avatarUrl: payload.avatarUrl
    };


  } catch (error) {
    return null;
  }
};

export const getUserId = () =>{
  const token: any = getCookie('accessToken');
  if(token) {
    return token
  }else{
    return 0
  }


};

export const setCookie = (name: string, value: string, days?: number) => {
  const expirationDate = new Date();
  if(days==null) days=7
  expirationDate.setDate(expirationDate.getDate() + days);
  const cookieValue = `${name}=${encodeURIComponent(value)};expires=${expirationDate.toUTCString()};path=/`;
  document.cookie = cookieValue;
};

export const getCookie = (name: string): string | null => {
  const cookieString = document.cookie;
  const cookies = cookieString.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(`${name}=`)) {
      return decodeURIComponent(cookie.substring(name.length + 1));
    }
  }
  return null; // Cookie with the given name not found
};

export const removeCookie = (name: string) => {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() - 1);
  const cookieValue = `${name}=;expires=${expirationDate.toUTCString()};path=/`;
  document.cookie = cookieValue;
};

export const removeAllCookies = () => {
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  }
};