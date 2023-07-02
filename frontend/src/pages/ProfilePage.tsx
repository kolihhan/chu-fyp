import React, { useEffect, useState } from 'react';
import { Form, Input, Button, DatePicker, Select, Timeline, Table, Tabs, Popconfirm, Collapse } from 'antd';

import * as userActions from '../reducers/userReducers';
import { useSelector, useDispatch } from 'react-redux';

import { AnyAction } from '@reduxjs/toolkit';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../app/store';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; // 导入中文本地化插件


const { TabPane } = Tabs;
const { Panel } = Collapse;

const ProfilePage: React.FC = () => {
  // 定义 dispatch 类型
  type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const userDataWithDayjs = {
    ...user,
    birthday: user?.birthday ? dayjs(user.birthday) : null,
  };

  const resumes = useSelector(userActions.selectUserResume);
  const applicationData = useSelector(userActions.selectUserApplicationRecord);
  const navigate = useNavigate();

  const { Option } = Select;
  const [activeTab, setActiveTab] = useState('profile');
  const [userData] = useState(userDataWithDayjs || {});


  useEffect(() => {
    dispatch(userActions.fetchUserApplicationRecord());
  }, []);

  const toggleTab = (tab: string) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const handleSubmit = (values: any) => {
    const { username, email, gender, birthday, address, phone, avatarUrl } = values;
    dispatch(userActions.updateUserInfo(username, email, gender, birthday, address, phone, avatarUrl));
  };

  const cancelApplication = (applicationId: number) => {
    dispatch(userActions.cancelApplicationId(applicationId));
  };

  const handleCreate = () => {
    navigate(`/resumes`);
  }

  const handleEdit = (record: any) => {
    navigate(`/resumes/${record}`);
  };

  const handleDelete = (record: any) => {
    dispatch(userActions.deleteResume(record));
  };

  const acceptOffer = (record: any) => {
    const status = "Accept";
    dispatch(userActions.updateOfferStatus(record, status));
  };

  const declineOffer = (record: any) => {
    const status = "Reject";
    dispatch(userActions.updateOfferStatus(record, status));
  };

  return (
    <div>

      <Tabs activeKey={activeTab} onChange={toggleTab} >
        <TabPane tab="个人资料" key="profile" >
          <Form onFinish={handleSubmit} initialValues={userData}>
            <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Please enter your username' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please enter your email' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Gender" name="gender">
              <Select>
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Birthday" name="birthday">
              <DatePicker />
            </Form.Item>
            <Form.Item label="Address" name="address">
              <Input />
            </Form.Item>
            <Form.Item label="Phone" name="phone">
              <Input />
            </Form.Item>
            <Form.Item label="Avatar URL" name="avatarUrl">
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                修改
              </Button>
            </Form.Item>
          </Form>

        </TabPane>


        <TabPane tab="简历管理" key="resume">
          <div style={{ marginBottom: '16px' }}>
            <Button type="primary" onClick={handleCreate}>
              新建
            </Button>
          </div>
          <Table dataSource={resumes}>
            <Table.Column
              title="履历"
              dataIndex="title" // 修改为"title"
              key="resume" // 为每列提供唯一的key值，例如："resume"和"actions"
              render={(title) => ( // 修改参数为"title"
                <span>{title}</span>
              )}
            />

            <Table.Column
              title="操作"
              dataIndex="id"
              key="actions" // 修改为唯一的key值，例如："actions"
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
          <Collapse accordion>
            {applicationData.map((application) => (
              <Panel
                header={
                  <div>
                    <span style={{ marginRight: '10px' }}>{application.companyRecruitment_id.companyEmployeePosition.company_id.name} - </span>
                    <span>{application.companyRecruitment_id.title}</span>
                  </div>
                }
                key={application.id}
              >
                <p>Status: {application.status}</p>
                {application.status === 'Offering' && (
                  <div>
                    <p>Expected Salary: {application.userofferrecord.expected_salary}</p>
                    <p>Provided Salary: {application.userofferrecord.provided_salary}</p>
                    <p>Contract Duration: {application.userofferrecord.contract_duration}</p>
                    <p>Start Date: {dayjs(application.userofferrecord.start_date).format('YYYY-MM-DD')}</p>
                    {application.userofferrecord.end_date && (
                      <p>End Date: {dayjs(application.userofferrecord.end_date).format('YYYY-MM-DD')}</p>
                    )}

                    <Button onClick={() => acceptOffer(application.id)}>Accept Offer</Button>
                    <Button onClick={() => declineOffer(application.id)}>Decline Offer</Button>
                  </div>
                )}

                {application.status === 'Pending' && (
                  <Popconfirm
                    title="確定取消嗎？"
                    onConfirm={() => cancelApplication(application.id)}
                    okText="确定"
                    cancelText="關閉"
                  >
                    <Button>Cancel Application</Button>
                  </Popconfirm>
                )}
              </Panel>
            ))}
          </Collapse>
        </TabPane>
      </Tabs>




    </div>
  );
};

export default ProfilePage;
