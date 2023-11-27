import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../reducers/authReducers';
import { AnyAction} from '@reduxjs/toolkit';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../app/store';
import { Form, Input, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';


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
    <div className="container">
      <h1 style={{ textAlign: 'center'}}>登入</h1>
      <Form onFinish={handleSubmit} style={{ maxWidth: '300px', margin: '0 auto'}}>
        <Form.Item style={{width: '100%'}} name="username" label="用戶名" labelCol={{span:24}}>
          <Input value={username} onChange={handleUsernameChange} prefix={<UserOutlined />} />
        </Form.Item>
        <Form.Item style={{width: '100%'}} name="password" label="密碼" labelCol={{span:24}}>
          <Input.Password value={password} onChange={handlePasswordChange} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%', marginTop: '25px' }}>
            登入
          </Button>
        </Form.Item>
        <Form.Item>
          <Link to="/register">註冊</Link>
        </Form.Item>
        <Form.Item>
          <Link to="/resetPassword">忘記密碼</Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;