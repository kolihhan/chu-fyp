import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'antd';

import { RootState } from '../app/store';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from '@reduxjs/toolkit';
import { useLoading } from '../components/LoadingScreen';

import { fetchApplicationDetails, selectJobsDetails } from '../reducers/userReducers';

interface ApplicationDetailsProps {
    applicationId: number;
}

const ApplicationDetailsPage: React.FC<ApplicationDetailsProps> = ({ applicationId }) => {
    // 定义 dispatch 类型
    type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

    const dispatch: AppDispatch = useDispatch();
    const application = useSelector(selectJobsDetails);
    const { setLoading } = useLoading();

    useEffect(() => {

        setLoading(true);
        dispatch(fetchApplicationDetails(applicationId));
        
        document.title = application?.title || "";
        setLoading(false);
    }, [dispatch, applicationId]);

    const handleApply = () => {
        console.log('Applying for job:', application);
        // 处理应聘逻辑，可以使用dispatch调用相关Redux action
        // 例如：dispatch(applyForJob(application.id));
    };

    return (
        <div>
            {application != null ? (
                <div>
                    <h1>Job Details</h1>
                    <p>Title: {application.title}</p>
                    <p>Description: {application.description}</p>
                    <p>Requirement: {application.requirement}</p>
                    <p>Min Salary: {application.minSalary}</p>
                    <p>Max Salary: {application.maxSalary}</p>
                    {/* 根据您的需求添加其他招聘详细信息字段 */}
                    <Button type="primary" onClick={handleApply}>
                        Apply Now
                    </Button>
                </div>
            ) : null}



        </div>
    );
};

export default ApplicationDetailsPage;
