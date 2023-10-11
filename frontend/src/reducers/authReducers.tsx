import { AnyAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../app/store';
import { loginApi, registerApi, refreshApi, getUserEmployee } from '../api';
import { removeToken, saveToken, getUserFromToken, setCookie, removeCookie, removeAllCookies } from '../utils';
import { message } from 'antd';
import dayjs from 'dayjs';  // 引入 dayjs 库

import { fetchResumes } from '../reducers/userReducers';
import { setEmployees, setSelectCompany } from './employeeReducers';

export interface User {
  id: number,
  username: string,
  email: string,
  gender: string,
  birthday: string | null,
  address: string,
  phone: string,
  avatarUrl: string
  type : string
}

export interface AuthState {
  accessToken: string | null;
  user: User | null;
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
};

export const authReducer = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken(state, action: PayloadAction<string | null | undefined>) {
      state.accessToken = action.payload ?? null;
    },
    setUser(state, action: PayloadAction<User | null | undefined>) {
      state.user = action.payload ?? null;
    },
  },
});

export const { setAccessToken, setUser } = authReducer.actions;


export const login = (
  username: string,
  password: string
): ThunkAction<void, RootState, unknown, AnyAction> => async dispatch => {
  try {
    const response = await loginApi(username, password);
    const token = response.data.access;
    
    dispatch(fetchUsersInfo(token));

  } catch (error) {
    console.log(error);
    message.error("登入失敗，請確認密碼或賬戶是否正確");
    dispatch(setAccessToken(null));
    dispatch(setUser(null));
  }
};



export const register = (
  username: string,
  email: string,
  password: string,
  checkPassword: string,
  gender: string,
  birthday: dayjs.Dayjs | null,
  address: string,
  phone: string,
  avatarUrl: string, 
  type: string,
): ThunkAction<void, RootState, unknown, AnyAction> => async dispatch => {
  try {
    const response = await registerApi(username,email,password,checkPassword,gender,birthday,address,phone,avatarUrl, type);

    if (response.status === 201) {
      message.success('注冊成功');
    }

  } catch (error) {
    message.error("注冊失敗，請確認格式是否正確");
  }
};

export const logout = (): ThunkAction<void, RootState, unknown, AnyAction> => async dispatch => {
  removeToken();
  dispatch(setAccessToken(null));
  dispatch(setUser(null));
  message.success('登出成功');
  removeAllCookies()
  setTimeout(() => {
    window.location.href = '/login'
  }, 100)
};

export const fetchUsersInfo = (
  accessToken: string
): ThunkAction<void, RootState, unknown, AnyAction> => async dispatch => {
  try {
    saveToken(accessToken);
    dispatch(setAccessToken(accessToken));

    const response = await refreshApi(accessToken);

    if (response) {
      const token = response.data;
      const user = getUserFromToken(token.user);
      dispatch(setUser(user));
      if(token.company_employee){
        dispatch(setEmployees(token.company_employee));
        dispatch(setSelectCompany(0));
      }
      
      message.success('登入成功');
      setTimeout(async () => {
        if (user?.type == "Boss"){
          setCookie("role", "Boss");
          setCookie("userId", user?.id);
          window.location.href = 'company/list';
        }else if (user?.type == "Employee"){
          setCookie("role", "Employee");
          setCookie("userId", user?.id);
          const response = await getUserEmployee(user?.id)
          console.log(response.data)
          if(response.data!=null && response.data.length > 0){
            setCookie("employeeId", response.data[0].id);
            setCookie("companyId", response.data[0].company_id)
            window.location.href = '/company/home'
          }else{
            window.location.href = '/'
          }
        }else{
          window.location.href = '/'
        }
      }, 500); 
      dispatch(fetchResumes());
    }

    
    
  } catch (error) {
    console.log(error);
    message.error("驗證有誤，請聯係客服解決");
    removeToken();
    dispatch(setAccessToken(null));
    dispatch(setUser(null));
  }
};
export const validateUserToken = (
  accessToken: string
): ThunkAction<void, RootState, unknown, AnyAction> => async dispatch => {
  try {
    
    const response = await refreshApi(accessToken);


  } catch (error) {
    message.error("驗證已過期，請重新登入");
    removeToken();
    dispatch(setAccessToken(null));
    dispatch(setUser(null));
  }
};

export const selectAccessToken = (state: RootState) => state.auth.accessToken;

export const selectUser = (state: RootState) => state.auth.user;

export default authReducer.reducer;
