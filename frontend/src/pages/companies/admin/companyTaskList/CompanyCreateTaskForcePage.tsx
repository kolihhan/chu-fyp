import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { createTaskForces, findSuitableAssignee, fetchTaskForcesById, getAllEmployees, updateTaskForces } from '../../../../api';
import { getCookie } from '../../../../utils';

const { Option } = Select;

const CompanyCreateTaskForcePage: React.FC = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Planning');
  const companyId = Number(getCookie('companyId'));
  const [selectedAssignee, setSelectedAssignee] = useState<number | null>(null);
  const [assignees, setAssignees] = useState([]);



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
    fetchAssignees();
  }, [id]);

  const fetchAssignees = async () => {
    try {
      const response2 = await getAllEmployees(companyId);
      setAssignees(response2.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  
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

  const recommendLeader = async() => {
    const { description, name } = form.getFieldsValue(); // 获取表单字段的值
  
    if (!description || !name) {
      message.error('任务描述和标题是必填项。');
      return; // 停止继续执行
    }
  
    // 在这里编写查找适合的人选的逻辑，假设找到了适合的人选，将其存储在selectedAssignee中
    const selectedAssignee = await findSuitableAssignee(companyId,description, name);
  
    if (selectedAssignee.data.data) {
      setSelectedAssignee(selectedAssignee.data.data);
    } else {
      message.error('没有找到适合给定任务描述和标题的领导。');
    }
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
      value={selectedAssignee}
    >

      {assignees.map((assignee  : any) => (
        <Select.Option key={assignee.value} value={assignee.value}>
            {assignee.label}
        </Select.Option>
        ))}
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
