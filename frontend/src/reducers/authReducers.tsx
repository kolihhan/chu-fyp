import { AnyAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../app/store';
import { loginApi, registerApi, refreshApi } from '../api';
import { removeToken, saveToken, getUserFromToken } from '../utils';
import { message } from 'antd';
import dayjs from 'dayjs';  // 引入 dayjs 库

import { fetchResumes } from '../reducers/userReducers';

export interface User {
  id: number,
  username: string,
  email: string,
  gender: string,
  birthday: dayjs.Dayjs | null,
  address: string,
  phone: string,
  avatarUrl: string
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
    
    await dispatch(fetchUsersInfo(token));

    message.success('登入成功');
    setTimeout(() => {
      window.location.href = '/';
    }, 500); 

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
  avatarUrl: string
): ThunkAction<void, RootState, unknown, AnyAction> => async dispatch => {
  try {
    const response = await registerApi(username,email,password,checkPassword,gender,birthday,address,phone,avatarUrl);

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
      const user = getUserFromToken(token);
      dispatch(setUser(user));
      dispatch(fetchResumes());
    }

  } catch (error) {
    console.log(error);
    removeToken();
    dispatch(setAccessToken(null));
    dispatch(setUser(null));
  }
};

export const selectAccessToken = (state: RootState) => state.auth.accessToken;

export const selectUser = (state: RootState) => state.auth.user;

export default authReducer.reducer;
