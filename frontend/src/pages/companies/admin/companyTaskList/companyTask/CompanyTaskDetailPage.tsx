import React, { useState, useEffect } from 'react';
import { Button, Card, Form, Input, Collapse, Select, message } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';
import { findSuitableAssignee, getAllEmployees, getTasksByTf_id, updateTasks } from '../../../../../api';
import { getCookie } from '../../../../../utils';

const { Panel } = Collapse;

const CompanyTaskDetailPage: React.FC = () => {
  const { Option } = Select;
  const companyId = Number(getCookie('companyId'));
  const [memberTasks, setMemberTasks] = useState<any[]>([]);
  const [editMode, setEditMode] = useState<{ [key: number]: boolean }>({});
  const [selectedMember, setSelectedMember] = useState<string>('');
  const [form] = Form.useForm();
  const { id } = useParams<{ id: string | undefined }>();

  const [selectedAssignee, setSelectedAssignee] = useState<number | null>(null);
  const [assignees, setAssignees] = useState([]);

  const uniqueAssignees = Array.from(new Set(memberTasks.map(task => task.assignee)));
  useEffect(() => {
    fetchTasksByTf_id();
  }, []);

  const fetchTasksByTf_id = async () => {
    try {
      const response = await getTasksByTf_id(Number(id));
      const response2 = await getAllEmployees(companyId);
      setMemberTasks(response.data.data);
      setAssignees(response2.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleMemberSelect = (member: string) => {
    setSelectedMember(member);
  };

  const handleEdit = (taskId: number) => {
    setEditMode({ ...editMode, [taskId]: !editMode[taskId] });
  };

  const handleSave = (taskId: number) => {
    const data = form.getFieldsValue();
    data['task_force'] = Number(id);
    updateTasks(taskId, data);
    setEditMode({ ...editMode, [taskId]: false });
  };

  const recommendAssignee = async() => {

    const { task_description, task_name } = form.getFieldsValue(); // 获取表单字段的值
  
    if (!task_description || !task_name) {
      message.error('任务描述和标题是必填项。');
      return; // 停止继续执行
    }
  
    // 在这里编写查找适合的人选的逻辑，假设找到了适合的人选，将其存储在selectedAssignee中
    const selectedAssignee = await findSuitableAssignee(companyId,task_description, task_name);
  
    if (selectedAssignee.data.data) {
      setSelectedAssignee(selectedAssignee.data.data);
    } else {
      message.error('没有找到适合给定任务描述和标题的Assignee。');
    }
  };

  return (
    <div>
      <a href={`/admin/company/task-list/${id}/details/create`}>
        <Button type="primary">Create New Task</Button>
      </a>
      <h1>Member Task List</h1>
      {uniqueAssignees.map((assignee, index) => (
        <Card key={index} onClick={() => handleMemberSelect(assignee)}>
          <Button>{assignee}</Button>
        </Card>
      ))}
      <Collapse>
        <Panel header={selectedMember} key="1">
          {memberTasks
            .filter(task => task.assignee === selectedMember)
            .map(task => (
              <Card key={task.id}>
                {editMode[task.id] ? (
                  <Form form={form} onFinish={() => handleSave(task.id)} initialValues={task}>
                    <Form.Item
                      label="Task Name"
                      name="task_name"
                      rules={[{ required: true, message: 'Please enter the task name!' }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item label="Task Description" name="task_description">
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

                        {assignees.map((assignee : any) => (
                          <Select.Option key={assignee.value } value={assignee.value}>
                              {assignee.label}
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
                    <Form.Item label="Due Date" name="due_date">
                      <Input type="date" />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        Save
                      </Button>
                    </Form.Item>
                  </Form>
                ) : (
                  <>
                    <p>{task.task_description}</p>
                    <p>Assignee: {task.assignee}</p>
                    <p>Status: {task.status}</p>
                    <p>Due Date: {task.due_date}</p>
                  </>
                )}
                <Button type="primary" onClick={() => handleEdit(task.id)}>
                  {editMode[task.id] ? "Return" : "Edit"}
                </Button>
              </Card>
            ))}
        </Panel>
      </Collapse>
    </div>
  );
};

export default CompanyTaskDetailPage;
