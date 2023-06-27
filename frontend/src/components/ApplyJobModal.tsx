import React, { useEffect, useState } from 'react';
import { Button, Modal, Select } from 'antd';
import { applyJobs, selectUserResume } from '../reducers/userReducers';

import { useSelector, useDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../app/store';
import { AnyAction } from '@reduxjs/toolkit';

import { message } from 'antd';

interface ApplyJobModalProps {
    loggedIn: boolean;
    jobId: number;
    jobTitle: string;
}

const ApplyJobModal: React.FC<ApplyJobModalProps> = ({ loggedIn, jobId, jobTitle }) => {
    type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

    const dispatch: AppDispatch = useDispatch();
    const [isModalVisible, setIsModalVisible] = useState(false);
    
    const resumes = useSelector(selectUserResume);
    const [selectedResumeId, setSelectedResumeId] = useState(resumes.length > 0 ? resumes[0].title : '');

    const handleApply = (jobId: number, selectedResumeId: number) => {
        dispatch(applyJobs(jobId, selectedResumeId));
    };

    const showModal = () => {
        if (loggedIn) {
            setIsModalVisible(true);
        } else {
            // 显示错误消息
            message.error('请登录后再执行此操作');

            // 延迟导航到登录页面
            setTimeout(() => {
                window.location.href = '/login';
            }, 500); // 延迟 2 秒导航到登录页面
        }
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setSelectedResumeId('');
    };

    const handleApplySubmit = () => {
        if (selectedResumeId) {
            handleApply(jobId, selectedResumeId);
            setIsModalVisible(false);
            setSelectedResumeId('');
        } else {
            // Display error message or handle invalid resume selection
            console.log('Please select a resume');
        }
    };

    return (
        <>
            <Button type="primary" onClick={showModal}>
                應聘
            </Button>
            <Modal
                title={`應聘工作 - ${jobTitle}`}
                open={isModalVisible}
                onCancel={handleModalCancel}
                onOk={handleApplySubmit}
                okButtonProps={{ disabled: !selectedResumeId }}
            >
                <p>請選擇一個履歷</p>
                <Select
                    value={selectedResumeId}
                    onChange={(value) => setSelectedResumeId(value)}
                    style={{ width: '100%' }}
                    optionLabelProp="title"
                >
                    {resumes.length > 0 ? (
                        resumes.map((resume) => (
                            <Select.Option key={resume.id} value={resume.id} title={resume.title}>
                                {resume.title}
                            </Select.Option>
                        ))
                    ) : (
                        <Select.Option selected value="" disabled>
                            没有履历
                        </Select.Option>
                    )}
                </Select>


            </Modal>
        </>
    );
};

export default ApplyJobModal;
