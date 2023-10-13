import React, { useState, useEffect } from 'react';
import { Button, Card, Form, Input, Collapse } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';

const { Panel } = Collapse;

const CompanyTaskDetailPage: React.FC = () => {
  const [members, setMembers] = useState<string[]>([]); // 存储成员列表
  const [selectedMember, setSelectedMember] = useState<string | null>(null); // 存储当前选中的成员
  const [memberTasks, setMemberTasks] = useState<any[]>([]); // 存储选中成员的任务列表
  const [editMode, setEditMode] = useState(false); // 用于切换编辑模式
  const [form] = Form.useForm(); // 表单实例

  useEffect(() => {
    // 在此处使用fetch或其他API调用来获取成员列表
    fetch('https://api.example.com/members') // 替换为您的API端点
      .then((response) => response.json())
      .then((data) => setMembers(data))
      .catch((error) => console.error('Error fetching members:', error));
  }, []);

  const handleMemberSelect = (member: string) => {
    // 当用户选择一个成员时，更新selectedMember状态以显示任务列表
    setSelectedMember(member);
    // 清空任务列表
    setMemberTasks([]);
    // 退出编辑模式
    setEditMode(false);

    // 在此处使用fetch或其他API调用来获取选中成员的任务列表
    fetch(`https://api.example.com/members/${member}/tasks`) // 替换为您的API端点
      .then((response) => response.json())
      .then((data) => setMemberTasks(data))
      .catch((error) => console.error('Error fetching member tasks:', error));
  };

  const handleEdit = () => {
    // 启用编辑模式
    setEditMode(true);
  };

  const handleSave = () => {
    // 在此处处理更新任务的逻辑，可以向后端发送PUT请求
    const updatedTask = form.getFieldsValue();
    console.log('Updated Task:', updatedTask);

    // 退出编辑模式
    setEditMode(false);
  };

  const handleCreateTask = () => {
    // 在此处处理创建新任务的逻辑，可以弹出模态框或导航到创建任务页面
    console.log('Create New Task');
  };

  return (
    <div>
      <Button type="primary" onClick={handleCreateTask}>
        Create New Task
      </Button>
      <h1>Member Task List</h1>
      {members.map((member) => (
        <Card key={member}>
          <Button onClick={() => handleMemberSelect(member)}>{member}</Button>
          {selectedMember === member && (
            <Collapse>
              {memberTasks.map((task) => (
                <Panel header={task.task_name} key={task.id}>
                  {editMode ? (
                    <Form form={form} onFinish={handleSave}>
                      {/* 编辑表单字段 */}
                      <Form.Item
                        label="Task Name"
                        name="task_name"
                        initialValue={task.task_name}
                        rules={[{ required: true, message: 'Please enter the task name!' }]}
                      >
                        <Input />
                      </Form.Item>
                      {/* 其他表单字段 */}
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
                  <Button type="primary" onClick={handleEdit}>
                    Edit
                  </Button>
                </Panel>
              ))}
            </Collapse>
          )}
        </Card>
      ))}
    </div>
  );
};

export default CompanyTaskDetailPage;
