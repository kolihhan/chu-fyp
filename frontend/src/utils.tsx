import jwtDecode , {JwtPayload} from "jwt-decode";
import dayjs from 'dayjs';

export const authHeaders = () =>{
  const token = sessionStorage.getItem('accessToken');
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
};


export const removeToken = () => {
  sessionStorage.removeItem('accessToken');
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
  const token: any = sessionStorage.getItem('accessToken');
  if(token) {
    return token
  }else{
    return 0
  }


};