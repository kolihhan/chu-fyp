import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUserResume, fetchResumes, editResume, createNewResume } from '../reducers/userReducers';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button } from 'antd';

import { AnyAction } from '@reduxjs/toolkit';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../app/store';

const ResumePage: React.FC = () => {
  const params = useParams<{ id: string }>();
  const id = Number(params.id); // 将id转换为数字类型

  const savedResumes = useSelector(selectUserResume);
  const navigate = useNavigate();
  // 定义 dispatch 类型
  type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

  const dispatch: AppDispatch = useDispatch();

  // 根据 id 找到对应的 resume 对象
  const selectedResume = savedResumes.find(resume => resume.id === id);

  const [form] = Form.useForm();
  const [resumeData, setResumeData] = useState(selectedResume);

  useEffect(() => {
    dispatch(fetchResumes());
    setResumeData(selectedResume);
    form.resetFields(); // 重置表单以填充新的初始值
  }, []);

  const onFinish = (values: any) => {
    if (id) {
      dispatch(editResume(id, values));
    } else {
      dispatch(createNewResume(values));
    }

    navigate(`/profile`);
  };

  return (
    <Form form={form} onFinish={onFinish} initialValues={resumeData}>
      <Form.Item label="Title" name="title" rules={[{ required: true, message: '此欄為必填' }]}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item label="Summary" name="summary" rules={[{ required: true, message: '此欄為必填' }]}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item label="Experience" name="experience" rules={[{ required: true, message: '此欄為必填' }]}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item label="Education" name="education" rules={[{ required: true, message: '此欄為必填' }]}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item label="Skills" name="skills" rules={[{ required: true, message: '此欄為必填' }]}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item label="Preferred Work" name="prefer_work" rules={[{ required: true, message: '此欄為必填' }]}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item label="Language" name="language" rules={[{ required: true, message: '此欄為必填' }]}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ResumePage;
