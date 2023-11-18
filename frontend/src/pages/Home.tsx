import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Input, Row } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { applyJobs, fetchJobs, selectJobs } from '../reducers/userReducers';

import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../app/store';
import { AnyAction } from '@reduxjs/toolkit';
import { useLoading } from '../components/LoadingScreen';
import ApplyJobModal from '../components/ApplyJobModal';
import { getCookie } from '../utils';

const Home: React.FC = () => {
  type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch: AppDispatch = useDispatch();
  const { setLoading } = useLoading();
  const navigate = useNavigate();
  const role = getCookie('role');
  const userId = getCookie('userId');
  const employeeId = getCookie('employeeId');
  const [isEmployee, setIsEmployee] = useState(false);
  const jobs = useSelector(selectJobs);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(6);

  useEffect(() => {
    document.title = '首頁';
    dispatch(fetchJobs());
    setLoading(false);
    if (employeeId === undefined && role !== 'Boss') {
      setIsEmployee(false);
    } else {
      setIsEmployee(true);
    }
  }, []);

  const handleViewPage = (jobId: number) => {
    navigate(`/detailsPage/${jobId}`);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const filteredJobs = Array.isArray(jobs)
    ? jobs.filter((job) =>
        job.title?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const noJobsMessage = (
    <div className="text-center mt-4">
      <h3>抱歉，暂无可用工作。</h3>
      <p>请稍后再来查看或尝试其他关键字搜索。</p>
    </div>
  );

  return (
    <div className="container">
      <h1 className="mt-4 mb-4">招聘信息页面</h1>
      <Input.Search
        placeholder="输入关键词进行搜索"
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: '16px' }}
      />
      <Row gutter={[16, 16]}>
        {currentJobs.length === 0 ? (
          noJobsMessage
        ) : (
          currentJobs?.map((job) => (
            <Col span={24} sm={12} lg={8} key={job.id}>
              <Card className="mb-4" title={job.title ?? ''} bordered={false}>
                <p>
                  <strong>公司：</strong>
                  {job.companyEmployeePosition.company_id.name ?? ''}
                </p>
                <p>
                  <strong>地点：</strong>
                  {job.location ?? ''}
                </p>
                <p>
                  <strong>描述：</strong>
                  {job.description ?? ''}
                </p>
                <ApplyJobModal
                  isEmployee={isEmployee}
                  loggedIn={user != null}
                  jobId={job.id}
                  jobTitle={job.title}
                />
                <Button
                  className="mt-2"
                  onClick={() => handleViewPage(job.id)}
                >
                  查看详细信息
                </Button>
              </Card>
            </Col>
          ))
        )}
      </Row>
      <div className="mt-4 text-center">
        <Button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          上一页
        </Button>
        <Button
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastJob >= filteredJobs.length}
          className="ml-2"
        >
          下一页
        </Button>
      </div>
    </div>
  );
};

export default Home;
