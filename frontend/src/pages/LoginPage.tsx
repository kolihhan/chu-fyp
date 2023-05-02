import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../reducers/authReducers';
import { AnyAction} from '@reduxjs/toolkit';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../app/store';


const Login: React.FC = () => {
  useEffect(() => {
    document.title = "Home"; // 設置新的網頁標題
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // 定义 dispatch 类型
  type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

  const dispatch: AppDispatch = useDispatch();

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(login(username, password));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login Page</h1>
      <div>
        <label>Email</label>
        <input type="text" value={username} onChange={handleUsernameChange} />
      </div>
      <div>
        <label>Password</label>
        <input type="password" value={password} onChange={handlePasswordChange} />
      </div>
      <button type="submit">Login</button>
      <Link to="/register">Register</Link>
    </form>
  );
};

export default Login;
