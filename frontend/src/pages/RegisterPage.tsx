import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../reducers/authReducers';
import { AnyAction} from '@reduxjs/toolkit';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../app/store';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // 定义 dispatch 类型
  type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

  const dispatch: AppDispatch = useDispatch();

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    };
    
    const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value);
    };
    
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(register(username, password, confirmPassword));
    };
    
    return (
    <form onSubmit={handleSubmit}>
      <h1>Register Page</h1>
      <div>
        <label>Username</label>
        <input type="text" value={username} onChange={handleUsernameChange} />
      </div>
      <div>
        <label>Password</label>
        <input type="password" value={password} onChange={handlePasswordChange} />
      </div>
      <div>
        <label>Confirm Password</label>
        <input type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} />
      </div>
      <button type="submit">Register</button>
    </form>
    );
    };
    
    export default Register;
