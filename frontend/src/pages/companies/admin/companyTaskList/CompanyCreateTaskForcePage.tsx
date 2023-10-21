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
      form.setFieldsValue(response.data.data); // Set form initial values here
    } catch (error) {
      console.log(error);
    }
  };

  const onFinish = (values: any) => {
    if (id) {
      values['company_id'] = Number(getCookie('companyId'));
      updateTaskForces(Number(id), values);
    } else {
      
      values['company_id'] = Number(getCookie('companyId'));
      createTaskForces(values);
    }

    //navigate(`/admin/company/task-list`);
  };

  const recommendLeader = (values: any) => {

    //navigate(`/admin/company/task-list`);
  };

  return (
    <div>
      <h1>{id ? 'Update' : 'Create'} Task Force</h1>
      <Form form={form} onFinish={onFinish}>
      <Form.Item
          label="Task Force Title"
          name="name"
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Task Force Description"
          name="description"
        >
          <Input.TextArea />
        </Form.Item>
          

        <Input.Group compact>
  <Form.Item label="Leader Name" name="leader">
    <Select
      showSearch
      placeholder="Select an leader"
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
<Button type="primary" onClick={recommendLeader}>
      Recommend
    </Button>
  </Input.Group>
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
