import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../reducers/authReducers';
import { AnyAction } from '@reduxjs/toolkit';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../app/store';
import { Form, Input, Button, DatePicker, Select } from 'antd';
import dayjs from 'dayjs';  // 引入 dayjs 库

const { Option } = Select;

const Register: React.FC = () => {
  // 定义 dispatch 类型
  type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

  const dispatch: AppDispatch = useDispatch();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [gender, setGender] = useState('');
  const [birthday, setBirthday] = useState<dayjs.Dayjs | null>(null);  // 使用 Dayjs 类型的状态
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleCheckPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckPassword(event.target.value);
  };

  const handleGenderChange = (value: string) => {
    setGender(value);
  };

  const handleBirthdayChange = (date: any) => {
    setBirthday(date);
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(event.target.value);
  };

  const handleAvatarUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarUrl(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {

    dispatch(register(username, email, password, checkPassword, gender, birthday, address, phone, avatarUrl));
  };

  return (
    <div style={{ backgroundColor: '#f0f2f5', padding: '20px', borderRadius: '5px' }}>
      <h1>Register Page</h1>
      <Form onFinish={handleSubmit}>
        <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Please enter your username' }]}>
          <Input value={username} onChange={handleUsernameChange} />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please enter your email' }]}>
          <Input value={email} onChange={handleEmailChange} />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter your password' }]}>
          <Input.Password value={password} onChange={handlePasswordChange} />
        </Form.Item>
        <Form.Item
          label="Confirm Password"
          name="check-password"
          rules={[
            { required: true, message: 'Please enter your password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('需跟密碼相同'));
              },
            }),
          ]}
        >
          <Input.Password value={checkPassword} onChange={handleCheckPasswordChange} />
        </Form.Item>
          <Form.Item label="Gender" name="gender">
            <Select value={gender} onChange={handleGenderChange}>
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Birthday" name="birthday">
            <DatePicker value={birthday} onChange={handleBirthdayChange} />
          </Form.Item>
          <Form.Item label="Address" name="address">
            <Input value={address} onChange={handleAddressChange} />
          </Form.Item>
          <Form.Item label="Phone" name="phone">
            <Input value={phone} onChange={handlePhoneChange} />
          </Form.Item>
          <Form.Item label="Avatar URL" name="avatarUrl">
            <Input value={avatarUrl} onChange={handleAvatarUrlChange} />
          </Form.Item>
          {/* 其他字段以相同的方式添加 */}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
          </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
