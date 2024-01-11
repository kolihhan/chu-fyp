import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, message, DatePicker } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { createTaskForces, findSuitableAssignee, fetchTaskForcesById, getAllEmployees, updateTaskForces } from '../../../../api';
import { getCookie } from '../../../../utils';
import dayjs from 'dayjs';  // 引入 dayjs 库

const { Option } = Select;

const CompanyCreateTaskForcePage: React.FC = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const [newId, setNewId] = useState<string | undefined>(id) 
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Planning');
  const companyId = Number(getCookie('companyId'));
  const [selectedAssignee, setSelectedAssignee] = useState<number | null>(null);
  const [assignees, setAssignees] = useState<any[]>([]);




  const handlePriorityChange = (value: string) => {
    setPriority(value);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
  };


  useEffect(() => {
    if (newId) {
      fetchTaskForceById();
    }
    fetchAssignees();
  }, [newId]);

  const fetchAssignees = async () => {
    try {
      const response2 = await getAllEmployees(companyId);

      setAssignees(response2.data);
    } catch (error) {
      console.log(error);
    }
  };
  
  const fetchTaskForceById = async () => {
    try {
      const response = await fetchTaskForcesById(Number(newId)); 
      response.data.data.deadline = dayjs(response.data.data.deadline);
      form.setFieldsValue(response.data.data); // Set form initial values here
      form.setFieldsValue({ leader:response.data.data.leader.id })
    } catch (error) {
      console.log(error);
    }
  };

  const onFinish = async (values: any) => {
    values['deadline'] = dayjs().format('YYYY-MM-DD');
    if (newId) {
      values['company_id'] = Number(getCookie('companyId'));

      const response = await updateTaskForces(Number(newId), values);
      if(response.status!=200){
        message.error('Task Force 修改失敗')
      }else{
        setNewId(response.data.id)
        message.success('Task Force 修改成功')
      }
    } else {
      
      values['company_id'] = Number(getCookie('companyId'));
      const response = await createTaskForces(values);
      if(response.status==200){
        message.success('Task Force 建立失敗')
      }else{
        setNewId(response.data.id)
        message.success('Task Force 建立成功')
      }
    }

    //navigate(`/admin/company/task-list`);
  };

  const recommendLeader = async () => {
    const { description, name } = form.getFieldsValue();
  
    if (!description || !name) {
      message.error('任务描述和标题是必填项。');
      return;
    }
    
    const selectAssignee = await findSuitableAssignee(companyId, description, name);
  
    if (selectAssignee.data) {
      const selectedId = selectAssignee.data.candidates[0].resume.user.id;
      
      // 获取选中的assignee对象
      const selectedAssigneeObject: any = assignees.find(assignee => assignee.user_id.id === selectedId);

      if (selectedAssigneeObject) {
        form.setFieldsValue({ leader: selectedAssigneeObject.id });

        // Update the selectedAssignee state
        setSelectedAssignee(selectedAssigneeObject.id);
        
      } else {
        message.error('没有找到适合给定任务描述和标题的领导。');
      }
    } else {
      message.error('没有找到适合给定任务描述和标题的领导。');
    }

  };
  

  return (
    <div className='container'>
    <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
      <h1>{newId ? '更新' : '創建'}任務組</h1>
      <Form form={form} onFinish={onFinish} labelAlign="left">
        <Form.Item
          label="任務組標題"
          name="name"
          labelCol={{ span: 24 }}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="任務組描述"
          name="description"
          labelCol={{ span: 24 }}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item label="領導名字" name="leader" labelCol={{ span: 24 }}>
          <Input.Group compact>
            <Select
              showSearch
              placeholder="選擇領導"
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
            <Button type="primary" onClick={recommendLeader}>
              推薦
            </Button>
          </Input.Group>
        </Form.Item>

        <Form.Item
          label="目標"
          name="goals"
          labelCol={{ span: 24 }}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item label="期限" name="deadline" labelCol={{ span: 24 }} >
          <DatePicker style={{ width: '100%' }} placeholder="選擇日期" />
        </Form.Item>

        <Form.Item label="優先度" name="priority" labelCol={{ span: 24 }}>
          <Select value={priority} onChange={handlePriorityChange}>
            <Select.Option value="Low">低</Select.Option>
            <Select.Option value="Medium">中</Select.Option>
            <Select.Option value="High">高</Select.Option>
            <Select.Option value="Emergency">緊急</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="狀態" name="status" labelCol={{ span: 24 }}>
          <Select value={status} onChange={handleStatusChange}>
            <Select.Option value="Planning">計劃中</Select.Option>
            <Select.Option value="In Progress">進行中</Select.Option>
            <Select.Option value="Completed">已完成</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {newId ? '更新' : '創建'}
          </Button>
        </Form.Item>
      </Form>
    </div>
    </div>
  );
};

export default CompanyCreateTaskForcePage;
