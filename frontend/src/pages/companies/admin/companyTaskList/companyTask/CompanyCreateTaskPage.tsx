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

  const onFinish = async (values: any) => {

    values['task_force'] = Number(id);
    try{
      const response = await createTasks(values);
      if(response.status==201){
        message.success('任務建立成功')
      }else{
        message.success('任務建立失敗')
      }
    }catch (error){
      message.error('任務建立失敗')
    }
    //navigate(`/admin/company/task-list/${id}/details`);
  };

  const recommendAssignee = async () => {
    const { task_description, task_name } = form.getFieldsValue();

    if (!task_description || !task_name) {
      message.error('任务描述和标题是必填项。');
      return;
    }

    const selectAssignee = await findSuitableAssignee(companyId, task_description, task_name);
    if (selectAssignee.data) {
      const selectedId = selectAssignee.data.candidates[0].resume.user.id;
      // 获取选中的assignee对象
      const selectedAssigneeObject: any = assignees.find(assignee => assignee.user_id.id === selectedId);

      if (selectedAssigneeObject) {
        form.setFieldsValue({ assignee: selectedAssigneeObject.id });
        setSelectedAssignee(selectedAssigneeObject.id)
      } else {
        message.error('没有找到适合给定任务描述和标题的领导。');
      }
    } else {
      message.error('没有找到适合给定任务描述和标题的领导。');
    }

  };

  const setAssignee = (value:any) => {
    setSelectedAssignee(value)
    form.setFieldsValue({ assignee: value });
  }


  return (
    <div>
      <h1>建立任務</h1>
      <Form onFinish={onFinish} form={form} layout='vertical'>
        <Form.Item
          label="任務名稱"
          name="task_name"
          rules={[{ required: true, message: 'Please enter the task name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="描述"
          name="task_description"
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item label="人選" name="assignee">
          <Input.Group compact>
            <Select
              showSearch
              placeholder="Select an assignee"
              optionFilterProp="children"
              onChange={setAssignee}
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
            <Button type="primary" onClick={recommendAssignee}>
              Recommend
            </Button>
          </Input.Group>
        </Form.Item>
        <Form.Item label="狀態" name="status">
          <Select>
            <Option value="Pending">待處理</Option>
            <Option value="In Progress">進行中</Option>
            <Option value="Completed">已完成</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="完成日期"
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
