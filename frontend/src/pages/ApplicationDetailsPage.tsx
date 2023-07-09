import React, { useEffect,useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, message } from 'antd';

import { RootState } from '../app/store';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from '@reduxjs/toolkit';
import { useLoading } from '../components/LoadingScreen';

import { applyJobs, fetchApplicationDetails, selectJobsDetails } from '../reducers/userReducers';
import ApplyJobModal from '../components/ApplyJobModal';

const ApplicationDetailsPage: React.FC = () => {
  const employee = useSelector((state: RootState) => state.employee.employees);
  const user = useSelector((state: RootState) => state.auth.user);
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

    if (isNaN(applicationId)  && !isMessageDisplayed.current) {
      message.error('不存在此工作詳情');
      isMessageDisplayed.current = true;
      navigate('/');
    } else {
      dispatch(fetchApplicationDetails(applicationId));
      document.title = application?.title || '工作詳情頁面';
    }

    setLoading(false);
  }, [dispatch, applicationId, navigate, setLoading, application?.title]);

  return (
    <div>
      {application ? (
        <div>
          <h1>Job Details</h1>
          <p>Company: {application.companyEmployeePosition.company_id.name} </p>
          <p>Title: {application.title}</p>
          <p>Description: {application.description}</p>
          <p>Requirement: {application.requirement}</p>
          <p>Min Salary: {application.min_salary}</p>
          <p>Max Salary: {application.max_salary}</p>
          {/* 根据您的需求添加其他招聘详细信息字段 */}
          <ApplyJobModal isEmployee={employee != null} loggedIn={user != null} jobId={applicationId} jobTitle = {application.title}  />
        </div>
      ) : null}
    </div>
  );
};

export default ApplicationDetailsPage;
