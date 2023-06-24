import React, { useState } from 'react';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { Form, Input, Button, DatePicker, Select, Timeline, Table } from 'antd';

import { useDispatch } from 'react-redux';
import { register } from '../reducers/authReducers';
import { AnyAction } from '@reduxjs/toolkit';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../app/store';
import dayjs from 'dayjs';  // 引入 dayjs 库

const ProfilePage: React.FC = () => {
  // 定义 dispatch 类型
  type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

  const dispatch: AppDispatch = useDispatch();

  const { Option } = Select;
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

  const [activeTab, setActiveTab] = useState('profile');

  const toggleTab = (tab: string) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const onFinish = (values: any) => {
    console.log('Received values:', values);
  };

  const resumeData = [
    { id: 1, name: 'John Doe', experience: '5 years', skills: 'JavaScript, React, HTML, CSS' },
    { id: 2, name: 'Jane Smith', experience: '3 years', skills: 'Python, Django, SQL' },
    // 其他简历数据
  ];
  
  const resumeColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Experience', dataIndex: 'experience', key: 'experience' },
    { title: 'Skills', dataIndex: 'skills', key: 'skills' },
    // 其他表格列配置
  ];
  
  const applicationData = [
    { id: 1, position: 'Software Engineer', status: 'In Progress' },
    { id: 2, position: 'Data Analyst', status: 'Rejected' },
    // 其他应聘进度数据
  ];
  
  const cancelApplication = (applicationId: number) => {
    // 取消应聘逻辑
  };


  return (
    <div>
      <Nav tabs>
        <NavItem>
          <NavLink
            className={activeTab === 'profile' ? 'active' : ''}
            onClick={() => toggleTab('profile')}
          >
            个人资料
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={activeTab === 'resume' ? 'active' : ''}
            onClick={() => toggleTab('resume')}
          >
            简历管理
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={activeTab === 'application' ? 'active' : ''}
            onClick={() => toggleTab('application')}
          >
            应聘进度
          </NavLink>
        </NavItem>
      </Nav>

      <TabContent activeTab={activeTab}>
        <TabPane tabId="profile">
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
            <Form.Item label="Confirm Password" name="check-password" rules={[{ required: true, message: 'Please enter your password' }]}>
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
        </TabPane>

        <TabPane tabId="resume">
          <Table dataSource={resumeData} columns={resumeColumns} />
        </TabPane>

        <TabPane tabId="application">
          <Timeline>
            {applicationData.map((application) => (
              <Timeline.Item key={application.id}>
                <p>{application.position}</p>
                <p>{application.status}</p>
                <Button onClick={() => cancelApplication(application.id)}>
                  Cancel Application
                </Button>
                <Button onClick={() => cancelApplication(application.id)}>
                  接受
                </Button>
              </Timeline.Item>
            ))}
          </Timeline>
        </TabPane>



      </TabContent>
    </div>
  );
};

export default ProfilePage;
