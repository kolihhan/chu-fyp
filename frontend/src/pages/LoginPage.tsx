import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../reducers/authReducers';
import { AnyAction} from '@reduxjs/toolkit';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../app/store';
import { Form, Input, Button } from 'antd';


const Login: React.FC = () => {
  useEffect(() => {
    document.title = "登入頁面"; // 設置新的網頁標題
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
    dispatch(login(username, password));
  };

  return (
    <div style={{ backgroundColor: '#f0f2f5', padding: '20px', borderRadius: '5px' }}>
      <h1>Login Page</h1>
      <Form onFinish={handleSubmit}>
        <Form.Item name="username" label="Username">
          <Input value={username} onChange={handleUsernameChange} />
        </Form.Item>
        <Form.Item name="password" label="Password">
          <Input.Password value={password} onChange={handlePasswordChange} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Log in
          </Button>
        </Form.Item>
        <Form.Item>
          <Link to="/register">Register</Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
