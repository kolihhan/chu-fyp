import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, message, Card } from 'antd';

import { RootState } from '../app/store';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from '@reduxjs/toolkit';
import { useLoading } from '../components/LoadingScreen';

import { fetchApplicationDetails, selectJobsDetails } from '../reducers/userReducers';
import ApplyJobModal from '../components/ApplyJobModal';

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
        <div>
          <h1>工作詳情</h1>
          <Card className="mt-4" style={{ width: 500 }}>
            <Meta title={application.title} description={application.description} />
            <p>
              <strong>公司：</strong>
              {application.companyEmployeePosition.company_id.name}
            </p>
            <p>
              <strong>需求：</strong>
              {application.requirement}
            </p>
            <p>
              <strong>最低薪資：</strong>
              {application.min_salary}
            </p>
            <p>
              <strong>最高薪資：</strong>
              {application.max_salary}
            </p>
            {/* 根据您的需求添加其他招聘详细信息字段 */}
            <ApplyJobModal isEmployee={employee != null} loggedIn={user != null} jobId={applicationId} jobTitle={application.title} />
          </Card>
        </div>
      ) : null}
    </div>
  );
};

export default ApplicationDetailsPage;
