import React, { useState, useEffect } from 'react';
import { Button, Card, Form, Input, Collapse, Select } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';
import { getTasksByTf_id, updateTasks } from '../../../../../api';

const { Panel } = Collapse;

const CompanyTaskDetailPage: React.FC = () => {
  const { Option } = Select;
  const [memberTasks, setMemberTasks] = useState<any[]>([]);
  const [editMode, setEditMode] = useState<{ [key: number]: boolean }>({});
  const [selectedMember, setSelectedMember] = useState<string>('');
  const [form] = Form.useForm();
  const { id } = useParams<{ id: string | undefined }>();

  const uniqueAssignees = Array.from(new Set(memberTasks.map(task => task.assignee)));
  useEffect(() => {
    fetchTasksByTf_id();
  }, []);

  const fetchTasksByTf_id = async () => {
    try {
      const response = await getTasksByTf_id(Number(id));
      setMemberTasks(response.data.data);
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

  const recommendAssignee = (values: any) => {
    // Handle recommendation logic here
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
                        >
                          {/* Add options for assignee here */}
                          <Select.Option value={1}>Leader 1</Select.Option>
                          <Select.Option value={2}>Leader 2</Select.Option>
                          <Select.Option value={3}>Leader 3</Select.Option>
                          <Select.Option value={null}>NULL Leader</Select.Option>
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
