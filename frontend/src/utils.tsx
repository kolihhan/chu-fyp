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
      id: payload.id,
      username: payload.username,
      email: payload.email,
      gender: payload.gender,
      birthday: payload.birthday ?? null,
      address: payload.address,
      phone: payload.phone,
      avatarUrl: payload.avatarUrl
    };


  } catch (error) {
    return null;
  }
};

