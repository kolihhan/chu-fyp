import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../reducers/authReducers';
import { AnyAction } from '@reduxjs/toolkit';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../app/store';
import { Form, Input, Button, DatePicker, Select, Upload, message , Image} from 'antd';
import dayjs from 'dayjs';  // 引入 dayjs 库
import axios from 'axios';

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
  const [type, setType] = useState('');
  const image = "/image/empty.png"

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

  const handlerTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setType(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    dispatch(register(username, email, password, checkPassword, gender, birthday, address, phone, avatarUrl, type));
  };

  useEffect(()=>{
    document.title = "用戶注冊"
    if (avatarUrl=='') setAvatarUrl(image)
  })

  const beforeUpload = (file: any) => {
    // Limit to only one image
    if (file.type.indexOf('image/') === -1) {
      message.error('You can only upload image files!');
      return false;
    }
    return true;
  };

  const uploadImage = async (file:any) => {
    console.log(file)
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setAvatarUrl(reader?.result!.toString())
    };
  }

  return (
    <div style={{ backgroundColor: '#f0f2f5', padding: '20px', borderRadius: '5px' }}>
      <h1>Register Page</h1>
      
      <Form onFinish={handleSubmit} labelAlign='left' labelCol={{ span: 1 }} wrapperCol={{ span:24 }}>
        <div style={{display:'flex', alignItems:'end'}}>
          <Form.Item label="" name="avatarUrl" style={{height:'100px', width:'100px', marginRight:'16px'}}>
            <Upload 
              listType="picture-card" showUploadList={false} multiple={false} maxCount={1} 
              beforeUpload={beforeUpload}
              customRequest={({file}) => uploadImage(file)}>
                <Image preview={false} src={avatarUrl} style={{height:'100px', width:'100px'}}></Image>
            </Upload>
          </Form.Item>
          <Form.Item style={{width:'100%'}} label="用戶名" name="username" labelCol={{span:24}} rules={[{ required: true, message: 'Please enter your username' }]}>
            <Input value={username} onChange={handleUsernameChange} />
          </Form.Item>
        </div>
        <div>
          <Form.Item label="電郵"
            name="email" labelCol={{span:1}} rules={[{ required: true, message: 'Please enter your email' }]}>
            <Input value={email} onChange={handleEmailChange} />
          </Form.Item>
          <Form.Item label="密碼"
            name="password" rules={[{ required: true, message: 'Please enter your password' }]}>
            <Input.Password value={password} onChange={handlePasswordChange} />
          </Form.Item>
          <Form.Item label="確認密碼"
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
          <Form.Item label="類別" name="type">
            <Select value={type} onChange={(value) => {setType(value)}}>
              <Option value="Boss">Boss</Option>
              <Option value="Employee">Employee</Option>
            </Select>
          </Form.Item>
          <Form.Item label="性別" name="gender">
            <Select value={gender} onChange={handleGenderChange}>
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item label="生日" name="birthday">
            <DatePicker value={birthday} style={{width:'100%'}} onChange={handleBirthdayChange} />
          </Form.Item>
          <Form.Item label="地址" name="address">
            <Input value={address} onChange={handleAddressChange} />
          </Form.Item>
          <Form.Item label="手機" name="phone">
            <Input value={phone} onChange={handlePhoneChange} />
          </Form.Item>
        </div>
        <div style={{width:'100%', textAlign:'right'}}>
          <Form.Item >
            <Button type="primary" htmlType="submit">
              Register
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default Register;
