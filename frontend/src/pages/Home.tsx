import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Input, Row } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchJobs, selectJobs } from '../reducers/userReducers';

import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../app/store';
import { AnyAction } from '@reduxjs/toolkit';
import { useLoading } from '../components/LoadingScreen';
import ApplyJobModal from '../components/ApplyJobModal';

const Home: React.FC = () => {
  type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch: AppDispatch = useDispatch();
  const { setLoading } = useLoading();
  const navigate = useNavigate();

  const jobs = useSelector(selectJobs);

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    document.title = '首頁';
    setLoading(true);
    dispatch(fetchJobs());
    setLoading(false);
  }, []);


  const handleViewPage = (jobId: number) => {
    navigate(`/detailsPage/${jobId}`);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredJobs = Array.isArray(jobs) ? jobs.filter((job) =>
  job.title?.toLowerCase().includes(searchTerm.toLowerCase())
) : [];


  return (
    <div className="container">
      <h1>招聘信息</h1>
      <Input.Search
        placeholder="输入关键词进行搜索"
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: '16px' }}
      />
      <Row gutter={[16, 16]}>
        {filteredJobs?.map((job) => (
          <Col span={8} key={job.id ?? ''}>
            <Card title={job.title ?? ''} bordered={false}>
              <p>公司：{job.companyEmployeePosition.company_id.name ?? ''}</p>
              <p>地点：{job.location ?? ''}</p>
              <p>描述：{job.description ?? ''}</p>
              <ApplyJobModal loggedIn={user != null} jobId={job.id} jobTitle = {job.title} />

              <Button onClick={() => handleViewPage(job.id)}>查看頁面</Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Home;
