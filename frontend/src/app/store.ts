import { configureStore, combineReducers, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from '../reducers/authReducers';
import userReducers from '../reducers/userReducers';
import employeeReducers from '../reducers/employeeReducers';
import companiesReducers from '../reducers/companiesReducers';

import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'user', 'employee'], // 要持久化的 reducer 名称
};

const authPersistConfig = {
  key: 'auth',
  storage,
};

const userPersistConfig = {
  key: 'user',
  storage,
};

const employeePersistConfig = {
  key: 'employee',
  storage,
};

const companiesPersistConfig = {
  key: 'companies',
  storage,
}

const authPersistedReducer = persistReducer(authPersistConfig, authReducer);
const userPersistedReducer = persistReducer(userPersistConfig, userReducers);
const employeePersistedReducer = persistReducer(employeePersistConfig, employeeReducers);
const companiesPersistedReducer = persistReducer(companiesPersistConfig, companiesReducers);

export const rootReducer = combineReducers({
  auth: authPersistedReducer,
  user: userPersistedReducer,
  employee: employeePersistedReducer,
  companies: companiesPersistedReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);


export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
