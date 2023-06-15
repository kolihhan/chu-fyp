import { configureStore, combineReducers, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from '../reducers/authReducers';
import userReducers from '../reducers/userReducers';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducers,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
