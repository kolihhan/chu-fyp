import React, { useEffect } from 'react';
import { Button, Card, Col, Row } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate  } from 'react-router-dom'; // 导入 useHistory 钩子
import { applyJobs,fetchJobs, selectJobs } from '../reducers/userReducers';

import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../app/store';
import { AnyAction } from '@reduxjs/toolkit';
import { useLoading } from '../components/LoadingScreen';

const Home: React.FC = () => {
  // 定义 dispatch 类型
  type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

  const dispatch: AppDispatch = useDispatch();
  const { setLoading } = useLoading();
  const history = useNavigate (); // 使用 useHistory 钩子来实现页面导航

  const jobs = useSelector(selectJobs);

  useEffect(() => {
    document.title = '首頁';
    setLoading(true);
    dispatch(fetchJobs());
    setLoading(false);
  
  }, [dispatch, setLoading]);

  const handleApply = (jobId: number) => {
    // 处理應聘按钮点击事件的逻辑
    dispatch(applyJobs(jobId));
  };

  const handleViewPage = (jobId: number) => {
    // 处理查看頁面按钮点击事件的逻辑
    history(`/detailsPage/${jobId}`); // 实现页面导航
  };

  return (
    <div className="container">
      <h1>招聘信息</h1>
      <Row gutter={[16, 16]}>
        {jobs != null ? (
          jobs.map((job) => (
            <Col span={8} key={job.id ?? ''}>
              <Card title={job.title ?? ''} bordered={false}>
                <p>公司：{job.company ?? ''}</p>
                <p>地点：{job.location ?? ''}</p>
                <p>描述：{job.description ?? ''}</p>
                <Button type="primary" onClick={() => handleApply(job.id)}>
                  應聘
                </Button>
                <Button onClick={() => handleViewPage(job.id)}>查看頁面</Button> 
              </Card>
            </Col>
          ))
        ) : (
          ''
        )}
      </Row>
    </div>
  );
};

export default Home;
