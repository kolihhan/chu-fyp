import React, { useState, useEffect } from 'react';
import { Button, Card, Form, Input, Collapse, Select, message, Steps } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';
import { findSuitableAssignee, getAllEmployees, getTaskForceMilestone, getTasksByTf_id, updateTasks } from '../../../../../api';
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
  const [assignees, setAssignees] = useState<any[]>([]);
  const [milestone, setMilestone] = useState<any[]>([]);
  const [milestoneCurrent, setMileStoneCurrent] = useState(0);
  const [taskForce, setTaskForce] = useState<any>({});
  const {Step} = Steps

  const uniqueAssignees = Array.from(new Set(memberTasks.map(task => task.assignee)));
  
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
    try{
      const response = await getTaskForceMilestone(Number(id))
      console.log(response.data.data)
      let items: any = []
      response.data.data.milestone.map((milestone: any) => {
        items.push({title: milestone.date, description:milestone.taskName})
      })
      setMilestone(items)
      setMileStoneCurrent(response.data.data.current)
    }catch(error){
      console.log(error)
    }
  }

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
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h1>{taskForce['name']}</h1>
        <a href={`/admin/company/task-list/${id}/details/create`}>
          <Button type="primary">Create New Task</Button>
        </a>
      </div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'start'}}>
        <div style={{flex:2, display:'flex', overflowY:'auto', height: 'calc(100vh - 125px)', marginRight:'8px'}}>
          <Card title={<center>Milestone</center>} style={{flex:1}}>
            <Steps direction="vertical" size="small" current={milestoneCurrent} 
              style={{ display: 'flex', flexWrap: 'wrap' }}>
              {milestone.map((item, index) => (
                <Step key={index} title={item.title} description={item.description} style={{ flex: '1 1 auto', marginBottom:'16px'}} />
              ))}
            </Steps>
          </Card>
        </div>
        <div style={{flex:10, overflowY:'auto', height: 'calc(100vh - 125px)'}}>
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

      </div>

      
    </div>
  );
};

export default CompanyTaskDetailPage;
