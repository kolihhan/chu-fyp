import React, { useEffect, useState } from 'react';
import { Form, Input, Button, DatePicker, Select, Timeline, Table, Tabs, Popconfirm } from 'antd';

import { selectUserResume, selectUserApplicationRecord, fetchResumes, fetchUserApplicationRecord} from '../reducers/userReducers';
import { useSelector, useDispatch } from 'react-redux';

import { AnyAction } from '@reduxjs/toolkit';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../app/store';
import dayjs from 'dayjs';  // 引入 dayjs 库


const { TabPane } = Tabs;

const ProfilePage: React.FC = () => {
  // 定义 dispatch 类型
  type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserApplicationRecord());
  });

  const user = useSelector((state: RootState) => state.auth.user);
  const resumes = useSelector(selectUserResume);
  const applicationData = useSelector(selectUserApplicationRecord);

  const { Option } = Select;
  const [username, setUsername] = useState(user?.username);
  const [email, setEmail] = useState(user?.email);
  const [password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [gender, setGender] = useState(user?.gender);
  const [birthday, setBirthday] = useState<dayjs.Dayjs | null>(user?.birthday ?? null);
  const [address, setAddress] = useState(user?.address);
  const [phone, setPhone] = useState(user?.phone);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl);
  const [activeTab, setActiveTab] = useState('profile');

  const toggleTab = (tab: string) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };


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

    // dispatch(register(username, email, password, checkPassword, gender, birthday, address, phone, avatarUrl));
  };

  const cancelApplication = (applicationId: number) => {
    // 取消应聘逻辑
  };

  const handleEdit = (record: any) => {
    // 处理删除逻辑，可以调用相应的删除 API 或执行其他操作
  };

  const handleDelete = (record: any) => {
    // 处理删除逻辑，可以调用相应的删除 API 或执行其他操作
  };

  const acceptOffer = (record: any) => {
    // 处理删除逻辑，可以调用相应的删除 API 或执行其他操作
  };

  const declineOffer = (record: any) => {
    // 处理删除逻辑，可以调用相应的删除 API 或执行其他操作
  };

  return (
    <div>

      <Tabs activeKey={activeTab} onChange={toggleTab}>
        <TabPane tab="个人资料" key="profile">
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
            <Form.Item>
              <Button type="primary" htmlType="submit">
                修改
              </Button>
            </Form.Item>
          </Form>
        </TabPane>


        <TabPane tab="简历管理" key="resume">
          <Table dataSource={resumes}>
            <Table.Column
              title="履历"
              dataIndex="id"
              key="resume"
              render={(id, record, index) => (
                <span>第{index + 1}个履历</span>
              )}
            />
            <Table.Column
              title="操作"
              dataIndex="id"
              key="actions"
              render={(id) => (
                <div>
                  <Button type="primary" onClick={() => handleEdit(id)}>
                    编辑
                  </Button>
                  <Popconfirm
                    title="确定删除吗？"
                    onConfirm={() => handleDelete(id)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button danger>删除</Button>
                  </Popconfirm>
                </div>
              )}
            />
          </Table>
        </TabPane>





        <TabPane tab="应聘进度" key="application">
          <Timeline>
            {applicationData.map((application) => (
              <Timeline.Item key={application.id}>
                <p>{application.position}</p>
                <p>{application.status}</p>
                {application.userOfferRecord ? (
                  <div>
                    <p>Expected Salary: {application.userOfferRecord.expected_salary}</p>
                    <p>Provided Salary: {application.userOfferRecord.provided_salary}</p>
                    <p>Contract Duration: {application.userOfferRecord.contract_duration}</p>
                    <p>Start Date: {application.userOfferRecord.start_date}</p>
                    {application.userOfferRecord.end_date && (
                      <p>End Date: {application.userOfferRecord.end_date}</p>
                    )}
                    <Button onClick={() => acceptOffer(application.id)}>Accept Offer</Button>
                    <Button onClick={() => declineOffer(application.id)}>Decline Offer</Button>
                  </div>
                ) : (
                  <Button onClick={() => cancelApplication(application.id)}>Cancel Application</Button>
                )}
              </Timeline.Item>
            ))}
          </Timeline>

        </TabPane>
      </Tabs>




    </div>
  );
};

export default ProfilePage;
