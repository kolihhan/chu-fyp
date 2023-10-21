import React from 'react';
import { Form, Input, Button, Select } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { createTasks } from '../../../../../api';


const CompanyCreateTaskPage: React.FC = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const { Option } = Select;
  const navigate = useNavigate();
  const onFinish = (values: any) => {
    
    values['task_force'] = Number(id);
    createTasks(values);

    //navigate(`/admin/company/task-list/${id}/details`);
  };

const recommendAssignee = (values: any) => {

    //navigate(`/admin/company/task-list`);
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

  <Input.Group compact>
  <Form.Item label="Assignee" name="assignee">
    <Select
      showSearch
      placeholder="Select an assignee"
      optionFilterProp="children"
      filterOption={(input, option) =>
        String(option?.children)?.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      <Select.Option value={1}>Leader 1</Select.Option>
      <Select.Option value={2}>Leader 2</Select.Option>
      <Select.Option value={3}>Leader 3</Select.Option>
    </Select>
</Form.Item>
<Button type="primary" onClick={recommendAssignee}>
      Recommend
    </Button>
  </Input.Group>
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
