import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { createTasks, findSuitableAssignee, getAllEmployees } from '../../../../../api';
import { getCookie } from '../../../../../utils';


const CompanyCreateTaskPage: React.FC = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const { Option } = Select;
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const companyId = Number(getCookie('companyId'));
  const [selectedAssignee, setSelectedAssignee] = useState<number | null>(null);
  const [assignees, setAssignees] = useState<any[]>([]);


useEffect(() => {
  fetchAssignees();
  }, []);

const fetchAssignees = async () => {
    try {
      const response2 = await getAllEmployees(companyId);
      setAssignees(response2.data);
    } catch (error) {
      console.log(error);
    }
  };

const onFinish = (values: any) => {
    
    values['task_force'] = Number(id);
    createTasks(values);

    //navigate(`/admin/company/task-list/${id}/details`);
  };

  const recommendAssignee = async () => {
    const { description, name } = form.getFieldsValue();
  
    if (!description || !name) {
      message.error('任务描述和标题是必填项。');
      return;
    }
  
    const selectAssignee = await findSuitableAssignee(companyId, description, name);
  
    if (selectAssignee.data) {
      const firstIndex = selectAssignee.data.candidates[0];
      const firstArray = firstIndex[0];
      const defaultId = firstArray[0];
  
      if (typeof defaultId === 'string') {
        const getId = defaultId.match(/'id': (\d+)/g);
        if (getId) {
          const ids = getId.map(match => (match.match(/\d+/)?.[0] ?? ''));
          const selectedId = Number(ids[0]);
  
          // 获取选中的assignee对象
          const selectedAssigneeObject : any = assignees.find(assignee => assignee.user_id.id === selectedId);
    
          if (selectedAssigneeObject) {
            form.setFieldsValue({ assignee: selectedAssigneeObject.id });
          } else {
            message.error('没有找到适合给定任务描述和标题的领导。');
          }
        } else {
          message.error('没有找到适合给定任务描述和标题的领导。');
        }
      } else {
        message.error('没有找到适合给定任务描述和标题的领导。');
      }
    } else {
      message.error('没有找到适合给定任务描述和标题的领导。');
    }
  };


  return (
    <div>
      <h1>Create or Update Task</h1>
      <Form onFinish={onFinish} form={form}>
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
      value={selectedAssignee}
    >

      {assignees.map((assignee: any, index) => (
        <Select.Option key={index} value={assignee.id}>
          {assignee.user_id.name}
        </Select.Option>
      ))}
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
