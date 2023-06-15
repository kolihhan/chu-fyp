import { AnyAction, createSlice, PayloadAction,createAction } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../app/store';
import { loginApi, registerApi, getProfileApi, refreshApi } from '../api';
import { removeToken, saveToken, getUserFromToken } from '../utils';
import { message } from 'antd';
import dayjs from 'dayjs';  // 引入 dayjs 库

export interface User {
  id: number;
  username: string;
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
    saveToken(token);
    const user = getUserFromToken(token);
    dispatch(setAccessToken(token));
    dispatch(setUser(user));
    message.success('登入成功');
  } catch (error) {
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
    const token = response.data.access;
    saveToken(token);
    const user = getUserFromToken(token);
    dispatch(setAccessToken(token));
    dispatch(setUser(user));
    message.success('注冊成功');
  } catch (error) {
    dispatch(setAccessToken(null));
    dispatch(setUser(null));
    message.error("注冊失敗，請確認格式是否正確");
  }
};

export const logout = (): ThunkAction<void, RootState, unknown, AnyAction> => async dispatch => {
  removeToken();
  dispatch(setAccessToken(null));
  dispatch(setUser(null));
  message.success('登出成功');
};

export const refreshToken = (
  accessToken: string
): ThunkAction<void, RootState, unknown, AnyAction> => async dispatch => {
  try {
    const response = await refreshApi(accessToken);
    const token = response.data.access;
    saveToken(token);
    const user = getUserFromToken(token);
    dispatch(setAccessToken(token));
    dispatch(setUser(user));
  } catch (error) {
    console.log(error);
    dispatch(setAccessToken(null));
    dispatch(setUser(null));
  }
};

export const selectAccessToken = (state: RootState) => state.auth.accessToken;

export const selectUser = (state: RootState) => state.auth.user;

export default authReducer.reducer;
