import React from 'react';
import { Form, Input, Button, Select } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { createTasks } from '../../../../../api';


const CompanyCreateTaskPage: React.FC = () => {
  const id = useParams<{ id: string }>();
  const { Option } = Select;
  const navigate = useNavigate();
  const onFinish = (values: any) => {
    

    createTasks(values);

    navigate(`/admin/company/task-list/${id}/details`);
  };

  return (
    <div>
      <h1>Create or Update Task</h1>
      <Form onFinish={onFinish}>
        <Form.Item
          label="Task Name"
          name="task_name"
          rules={[{ required: true, message: 'Please enter the task name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Task Description"
          name="task_description"
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label="Assignee"
          name="assignee"
        >
          <Input />
        </Form.Item>
        <Form.Item label="Status" name="status">
          <Select>
            <Option value="Pending">待處理</Option>
            <Option value="In Progress">進行中</Option>
            <Option value="Completed">已完成</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Due Date"
          name="due_date"
        >
          <Input type="date" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CompanyCreateTaskPage;
