import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { createTaskForces, fetchTaskForcesById, updateTaskForces } from '../../../../api';
import { getCookie } from '../../../../utils';

const { Option } = Select;

const CompanyCreateTaskForcePage: React.FC = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Planning');
  const [taskForce, setTaskForce] = useState({}); // 将taskForce初始化为一个空对象

  const handlePriorityChange = (value: string) => {
    setPriority(value);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
  };

  useEffect(() => {
    if (id) {
      fetchTaskForceById();
    }
  }, [id]);

  const fetchTaskForceById = async () => {
    try {
      const response = await fetchTaskForcesById(Number(id)); 
      setTaskForce(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  

  const onFinish = (values: any) => {
    if (id) {
      updateTaskForces(Number(id), values);
    } else {
      values['company_id'] = Number(getCookie('companyId'));
      console.log(values);
      createTaskForces(values);
    }

    navigate(`/admin/company/task-list`);
  };

  return (
    <div>
      <h1>{id ? 'Update' : 'Create'} Task Force</h1>
      <Form form={form} onFinish={onFinish} initialValues={taskForce}>
        <Form.Item
          label="Task Force Description"
          name="description"
        >
          <Input.TextArea />
        </Form.Item>
          
        <Form.Item
          label="Leader Name"
          name="leader"
        >
          <Input />
        </Form.Item>
          
        <Form.Item
          label="Goals"
          name="goals"
        >
          <Input.TextArea />
        </Form.Item>
          
        <Form.Item
          label="Deadline"
          name="deadline"
        >
          <Input type="date" />
        </Form.Item>
          
        <Form.Item label="Priority" name="priority">
          <Select value={priority} onChange={handlePriorityChange}>
            <Option value="Low">Low</Option>
            <Option value="Medium">Medium</Option>
            <Option value="High">High</Option>
            <Option value="Emergency">Emergency</Option>
          </Select>
        </Form.Item>
          
        <Form.Item label="Status" name="status">
          <Select value={status} onChange={handleStatusChange}>
            <Option value="Planning">Planning</Option>
            <Option value="In Progress">In Progress</Option>
            <Option value="Completed">Completed</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {id ? 'Update' : 'Create'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CompanyCreateTaskForcePage;
