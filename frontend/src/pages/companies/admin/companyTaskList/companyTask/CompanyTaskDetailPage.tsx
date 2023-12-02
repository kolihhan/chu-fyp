import React, { useState, useEffect } from 'react';
import { Button, Card, Form, Input, Collapse, Select, message, Steps, Descriptions, Modal, Tooltip } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation, useParams } from 'react-router-dom';
import { findSuitableAssignee, getAllEmployees, getTaskForceMilestone, getTasksByTf_id, updateTasks } from '../../../../../api';
import { getCookie } from '../../../../../utils';

const { Panel } = Collapse;

const CompanyTaskDetailPage: React.FC = () => {
  const { Option } = Select;
  const companyId = Number(getCookie('companyId'));
  const [memberTasks, setMemberTasks] = useState<any[]>([]);
  const [editMode, setEditMode] = useState<{ [key: number]: boolean }>({});
  const [selectedTask, setSelectedTask] = useState(null) as any;
  const [selectedMember, setSelectedMember] = useState<string | null>(''); // or useState<string>('');
  const [selectedMemberName, setselectedMemberName] = useState<string>('');

  const [form] = Form.useForm();
  const { id } = useParams<{ id: string | undefined }>();

  const [assignees, setAssignees] = useState<any[]>([]);
  const [milestone, setMilestone] = useState<any[]>([]);
  const [milestoneCurrent, setMileStoneCurrent] = useState(0);
  const [taskForce, setTaskForce] = useState<any>({});
  const { Step } = Steps

  const uniqueAssigneeIds = Array.from(new Set(memberTasks.map(task => task.assignee)));
  // Filter assigneesData based on uniqueAssigneeIds
  const uniqueAssignees = assignees.filter(assignee => uniqueAssigneeIds.includes(assignee.id));
  const location = useLocation()
  const isAdminPath = location.pathname.startsWith('/admin');

  useEffect(() => {
    fetchTasksByTf_id();
    getMilestone()
  }, []);

  const fetchTasksByTf_id = async () => {
    try {
      const response = await getTasksByTf_id(Number(id));
      const response2 = await getAllEmployees(companyId);
      setMemberTasks(response.data.data);
      setAssignees(response2.data);
      setTaskForce(response.data.taskForce)
    } catch (error) {
      console.log(error);
    }
  };

  const getMilestone = async () => {
    try {
      const response = await getTaskForceMilestone(Number(id))
      console.log(response.data.data)
      let items: any = []
      response.data.data.milestone.map((milestone: any) => {
        items.push({ title: milestone.date, description: milestone.taskName })
      })
      setMilestone(items)
      setMileStoneCurrent(response.data.data.current)
    } catch (error) {
      console.log(error)
    }
  }

  const handleMemberSelect = (member: string) => {

    setSelectedMember(member);

    if (member === "") {
      setselectedMemberName("");
    } else {
      setselectedMemberName(uniqueAssignees.find(assignee => assignee.id === Number(member))?.user_id.name);
    }

  };

  const handleEdit = (taskId: any) => {
    // Set edit mode for the clicked task
    const newEditMode = { ...editMode, [taskId]: !editMode[taskId] };
    setEditMode(newEditMode);

    // Find the selected task by ID
    const taskToEdit = memberTasks.find((task) => task.id === taskId);

    // Set the selected task for editing
    setSelectedTask(newEditMode[taskId] ? taskToEdit : null);
    form.setFieldsValue(taskToEdit); // Set form initial values here
  };

  const clearTask = () => {
    form.resetFields(); // Reset form fields to their initial values
    setSelectedTask(null);
  }

  const handleSave = (taskId: number) => {
    const data = form.getFieldsValue();
    data['task_force'] = Number(id);
    updateTasks(taskId, data);
    setEditMode({ ...editMode, [taskId]: false });
    setSelectedTask(null);
    form.resetFields(); // Reset form fields to their initial values
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
      } else {
        message.error('没有找到适合给定任务描述和标题的领导。');
      }
    } else {
      message.error('没有找到适合给定任务描述和标题的领导。');
    }

  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>{taskForce['name']}</h1>
        {isAdminPath?
          <a href={`/admin/company/task-list/${id}/details/create`}>
            <Button type="primary">Create New Task</Button>
          </a>
          :
          <a href={`/company/task-list/${id}/details/create`}>
            <Button type="primary">Create New Task</Button>
          </a>

        }
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div style={{ flex: 2, display: 'flex', overflowY: 'auto', height: 'calc(100vh - 125px)', marginRight: '8px' }}>
          <Card title={<center>Milestone</center>} style={{ flex: 1 }}>
            <Steps direction="vertical" size="small" current={milestoneCurrent}
              style={{ display: 'flex', flexWrap: 'wrap' }}>
              {milestone.map((item, index) => (
                <Step key={index} title={item.title} description={item.description} style={{ flex: '1 1 auto', marginBottom: '16px' }} />
              ))}
            </Steps>
          </Card>
        </div>
        <div style={{ flex: 10, overflowY: 'auto', height: 'calc(100vh - 125px)' }}>

          <Card key={"summary"}>
  
              <Descriptions title="Task Force Details" bordered column={1}>
                <Descriptions.Item label="Task Force Name">{taskForce.name}</Descriptions.Item>
                <Descriptions.Item label="Description">{taskForce.description}</Descriptions.Item>
                <Descriptions.Item label="Goals">{taskForce.goals}</Descriptions.Item>
                <Descriptions.Item label="Deadline">{taskForce.deadline}</Descriptions.Item>
                <Descriptions.Item label="Status">{taskForce.status}</Descriptions.Item>
              </Descriptions>
     
            
            <div>
              <div className="mt-2" style={{ marginBottom: '8px' }}><h2>Members</h2></div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ textAlign: 'center', marginRight: '8px' }}>
                  <Button
                    className="mt-3 mb-2 btn btn-secondary rounded-circle"
                    shape="circle"
                    onClick={() => handleMemberSelect("")}
                    style={{
                      backgroundImage: `url(https://picsum.photos/200/300)`, //${assignee.user_id.avatarUrl}
                      backgroundSize: 'cover',
                      width: '50px',
                      height: '50px',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                    }}
                  />
                  <div>All Tasks</div>
                </div>
                {uniqueAssignees.map((assignee) => (
                  <div key={assignee.id} style={{ textAlign: 'center', marginRight: '8px' }}>
                    <Button
                      className="mt-3 mb-2 btn btn-secondary rounded-circle"
                      shape="circle"
                      onClick={() => handleMemberSelect(assignee.id)}
                      style={{
                        backgroundImage: `url(https://picsum.photos/200/300)`, //${assignee.user_id.avatarUrl}
                        backgroundSize: 'cover',
                        width: '50px',
                        height: '50px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                      }}
                    />
                    <div>{assignee.user_id.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Collapse defaultActiveKey={1}>
            <Panel header={selectedMemberName ? `${selectedMemberName}'s tasks` : "All Tasks"} key="1">
              {memberTasks
                .filter(task => !selectedMember || task.assignee === selectedMember)
                .map(task => {
                  const assigneeInfo = uniqueAssignees.find(assignee => assignee.id === task.assignee);

                  return (
                    <Tooltip title="Click to Edit" key={task.id}>
                      <Card
                        style={{
                          margin: '10px 0',
                          borderRadius: '10px',
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                          transition: 'box-shadow 0.3s',
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)')}
                        onMouseOut={(e) => (e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)')}
                        onClick={() => handleEdit(task.id)}
                      >
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                          <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                            {assigneeInfo && (
                              <div>
                                <Button
                                  className="mt-3 mb-2 btn btn-secondary rounded-circle"
                                  shape="circle"
                                  style={{
                                    backgroundImage: `url(https://picsum.photos/200/300)`, //${assignee.user_id.avatarUrl}
                                    backgroundSize: 'cover',
                                    width: '100px',
                                    height: '100px',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                                  }}
                                  disabled
                                />
                              </div>
                            )}
                            <div style={{ fontSize: '1.2em', marginBottom: '10px' }}>
                              <strong>Assignee:</strong> {assigneeInfo ? assigneeInfo.user_id.name : 'Unknown'}
                            </div>

                          </div>

                          <div style={{ padding: '16px', flex: 2 }}>
                            <div style={{ borderBottom: '1px solid #f0f0f0', marginBottom: '10px' }}>
                              <h4 style={{ fontSize: '1.5em', fontWeight: 'bold', margin: 0 }}>{task.task_name}</h4>
                            </div>
                            <div style={{ fontSize: '1.2em', marginBottom: '10px' }}>
                              <strong>Task Description:</strong> {task.task_description}
                            </div>
                            <div style={{ fontSize: '1.2em', marginBottom: '10px' }}>
                              <strong>Status:</strong> {task.status}
                            </div>
                            <div style={{ fontSize: '1.2em', marginBottom: '10px' }}>
                              <strong>Due Date:</strong> {task.due_date}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Tooltip>
                  );
                })}








            </Panel>

          </Collapse>

          <Modal
            title={'Edit Task'}
            visible={!!selectedTask}
            onCancel={() => clearTask()}
            footer={null}
          >
            {selectedTask && (
              <Form form={form} onFinish={() => handleSave(selectedTask.id)} initialValues={selectedTask}>
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
                      {assignees.map((assignee, index) => (
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
                <Form.Item label="Due Date" name="due_date">
                  <Input type="date" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Save
                  </Button>
                </Form.Item>
              </Form>
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default CompanyTaskDetailPage;
