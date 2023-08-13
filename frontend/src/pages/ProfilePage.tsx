import React, { useEffect, useState } from 'react';
import { Form, Input, Button, DatePicker, Select, Timeline, Table, Tabs, Popconfirm, Collapse, message, Card, Row, Col, Image } from 'antd';

import * as userActions from '../reducers/userReducers';
import { useSelector, useDispatch } from 'react-redux';

import { AnyAction } from '@reduxjs/toolkit';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../app/store';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; // 导入中文本地化插件
import { cancelApplicationIdApi, updateOfferStatusApi } from '../api';


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

  const cancelApplication = async (applicationId: number) => {
    // dispatch(userActions.cancelApplicationId(applicationId));
    const response = await cancelApplicationIdApi(applicationId);
    if(response.status == 200){
      message.success('取消應聘記錄成功');
      dispatch(userActions.fetchUserApplicationRecord());
    }
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

  const acceptOffer = async (record: number) => {
    // const status = "Accept";
    // dispatch(userActions.updateOfferStatus(record, status));
    const response = await updateOfferStatusApi(record,{status: 'Accept'});
    if(response.status == 200){
      message.success('操作成功');
      dispatch(userActions.fetchUserApplicationRecord());
    }
  };

  const declineOffer = async (record: any) => {
    // const status = "Reject";
    // dispatch(userActions.updateOfferStatus(record, status));
    const response = await updateOfferStatusApi(record,{status: 'Reject'});
    if(response.status == 200){
      message.success('操作成功');
      dispatch(userActions.fetchUserApplicationRecord());
    }
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
          {/* {applicationData.map((application) => (
            <Card bodyStyle={{padding:'8px'}} style={{marginBottom:'4px'}}
            title={
                <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                  <div>
                      <Row gutter={[4, 0]} style={{display:'flex', alignItems:'center'}}>
                          <Col><Image src={application.companyRecruitment_id.companyEmployeePosition.company_id.logo} style={{height:'50px', width:'50px'}}/></Col>
                          <Col>
                              <Row><Col>
                                {application.companyRecruitment_id.companyEmployeePosition.company_id.name}
                                <span> - </span>
                                {application.companyRecruitment_id.title}
                              </Col></Row>
                          </Col>
                      </Row>
                  </div>
                  <div>
                    <span>{application.status}</span>
                  </div>
               </div>
            }>
              <div style={{}}>
                {application.status === 'Offering' && (
                  <>
                    <Button type="primary" style={{marginRight:'8px'}} onClick={() => acceptOffer(application.id)}>
                      Accept Offer
                    </Button>
                    <Button danger style={{marginRight:'8px'}} onClick={() => declineOffer(application.id)}>
                      Decline Offer
                    </Button>
                  </>
                )}
                
                {(application.status !== 'Reject' && application.status !== 'Withdrawn') && (
                  <Popconfirm
                    title="確定取消嗎？"
                    onConfirm={() => cancelApplication(application.id)}
                    okText="确定"
                    cancelText="關閉">
                    <Button type="default" style={{marginRight:'8px'}}>Cancel Application</Button>
                  </Popconfirm>
                )}
                <Button type="link" style={{marginRight:'8px'}}>查看</Button>
              </div>
            </Card>
          ))} */}


          <Collapse accordion>
            {applicationData.map((application) => (
              <Panel style={{backgroundColor:'white'}}
                header={
                  <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                    <div>
                        <Row gutter={[4, 0]} style={{display:'flex', alignItems:'center'}}>
                            <Col><Image src={application.companyRecruitment_id.companyEmployeePosition.company_id.logo} style={{height:'50px', width:'50px'}}/></Col>
                            <Col>
                                <Row><Col>
                                  {application.companyRecruitment_id.companyEmployeePosition.company_id.name}
                                  <span> - </span>
                                  {application.companyRecruitment_id.title}
                                </Col></Row>
                            </Col>
                        </Row>
                    </div>
                    <div>
                      <span style={{marginRight:'16px'}}>{application.status}</span>
                    </div>
                  </div>
              }
                key={application.id}>

                <div style={{textAlign:'right'}}>
                {application.status === 'Offering' && (
                  <>
                    <Popconfirm title="確定接受嗎？"okText="确定"cancelText="關閉"
                      onConfirm={() => acceptOffer(application.id)} >
                      <Button type="primary" style={{marginRight:'8px'}}>Accept Offer</Button>
                  </Popconfirm>
                    <Popconfirm title="確定拒絕嗎？"okText="确定"cancelText="關閉"
                      onConfirm={() => declineOffer(application.id)} >
                      <Button danger style={{marginRight:'8px'}}>Decline Offer</Button>
                  </Popconfirm>
                  </>
                )}
                
                {(application.status !== 'Accept' && application.status !== 'Reject' && application.status !== 'Withdrawn') && (
                  <Popconfirm
                    title="確定取消嗎？"
                    onConfirm={() => cancelApplication(application.id)}
                    okText="确定"
                    cancelText="關閉">
                    <Button type="default" style={{marginRight:'8px'}}>Cancel Application</Button>
                  </Popconfirm>
                )}
                <Button type="link" style={{marginRight:'8px'}}>查看</Button>
              </div>
              </Panel>
            ))}
          </Collapse>
        </TabPane>
      </Tabs>




    </div>
  );
};

export default ProfilePage;
