import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, message, Card, Row, Col } from 'antd';

import { RootState } from '../app/store';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from '@reduxjs/toolkit';
import { useLoading } from '../components/LoadingScreen';

import { fetchApplicationDetails, selectJobsDetails } from '../reducers/userReducers';
import ApplyJobModal from '../components/ApplyJobModal';
import RecentJobsList from '../components/RecentJobsList';

const ApplicationDetailsPage: React.FC = () => {
  const employee = useSelector((state: RootState) => state.employee.employees);
  const user = useSelector((state: RootState) => state.auth.user);
  const { Meta } = Card;
  const { id } = useParams<{ id: string | undefined }>();
  const applicationId = parseInt(id || '', 10);
  const navigate = useNavigate();

  type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;
  const dispatch: AppDispatch = useDispatch();
  const application = useSelector(selectJobsDetails);
  const { setLoading } = useLoading();

  const isMessageDisplayed = useRef(false);

  useEffect(() => {
    setLoading(true);

    if (isNaN(applicationId) && !isMessageDisplayed.current) {
      message.error('工作詳情不存在');
      isMessageDisplayed.current = true;
      navigate('/');
    } else {
      dispatch(fetchApplicationDetails(applicationId));
      document.title = application?.title || '工作詳情頁面';
    }

    setLoading(false);
    console.log();
  }, [dispatch, applicationId, navigate, setLoading, application?.title]);

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="container mt-4">
      <Button onClick={handleBack} style={{ marginBottom: '20px' }}>
        返回
      </Button>
      {application ? (
        <Row gutter={16}>
          <Col xs={24} sm={24} md={16}>
            <h1>{application.title ?? "工作詳情"}</h1>
            <Card className="cardContainer mt-4" style={{ width: '100%' }}>
              <Meta title={application.title} description={application.description} />
              <br></br>
              <p>
                <strong>公司：</strong>
                {application.companyEmployeePosition.company_id.name}
              </p>
              <p>
                <strong>需求：</strong>
                {application.requirement}
              </p>
              <p>
                <strong>薪資：</strong>
                {application.min_salary} ~ {application.max_salary}
              </p>
              <p>
                <strong>工作地點：</strong>
                {application.location}
              </p>
              <p>
                <strong>工作性質：</strong>
                {application.job_nature}
              </p>
              <p>
                <strong>員工需求：</strong>
                {application.employee_need}
              </p>
              <p>
                <strong>工作類別：</strong>
                {application.job_category}
              </p>
              <p>
                <strong>開始日期：</strong>
                {new Date(application.start_at).toLocaleDateString()}
              </p>
              <p>
                <strong>截止日期：</strong>
                {new Date(application.close_at).toLocaleDateString()}
              </p>
 
              <ApplyJobModal
                isEmployee={employee == null}
                loggedIn={user != null}
                jobId={applicationId}
                jobTitle={application.title}
              />
            </Card>
            <Card className="cardContainer mt-4" style={{ width: '100%' }}>
              <h2 className="cardTitle">公司介紹</h2>
              <div className="cardContent">
                <p>
                  <strong>公司名稱：</strong>
                  {application.companyEmployeePosition.company_id.name}
                </p>
                <p>
                  <strong>公司描述：</strong>
                  {application.companyEmployeePosition.company_id.company_desc}
                </p>
                <p>
                  <strong>員工福利：</strong>
                  {application.companyEmployeePosition.companyBenefits_id.map((benefit: any) => (
                    <span key={benefit.id}>{benefit.benefit_desc}</span>
                  ))}
                </p>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <RecentJobsList />
            </div>
          </Col>
        </Row>
      ) : null}
    </div>
  );
};

export default ApplicationDetailsPage;
