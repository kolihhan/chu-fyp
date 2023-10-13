import React, { useState, useEffect } from 'react';
import { Table, Select, Button, message } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';

const { Option } = Select;

const EmployeeTaskPage: React.FC = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    // 在此处使用fetch或其他API调用来获取员工的任务列表
    // 假设您有一个API端点返回员工任务列表
    fetch('https://api.example.com/employee-tasks') 
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error('Error fetching employee tasks:', error));
  }, []);

  const columns = [
    {
      title: 'Task Name',
      dataIndex: 'task_name',
      key: 'task_name',
    },
    {
      title: 'Task Description',
      dataIndex: 'task_description',
      key: 'task_description',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text : any, record : any) => (
        <Select
          defaultValue={text}
          style={{ width: 120 }}
          onChange={(value) => handleStatusChange(record, value)}
        >
          <Option value="Pending">Pending</Option>
          <Option value="In Progress">In Progress</Option>
          <Option value="Completed">Completed</Option>
        </Select>
      ),
    },
    {
      title: 'Due Date',
      dataIndex: 'due_date',
      key: 'due_date',
    },
  ];

  const handleStatusChange = (record : any, value : any) => {
    // 在此处处理状态更改，并向后端发送更新请求
    // 假设您有一个API端点用于更新任务状态
    const updatedTasks : any = tasks.map((task : any) => {
      if (task.id === record.id) {
        task.status = value;
      }
      return task;
    });

    // 模拟API请求成功后的更新
    setTasks(updatedTasks);
    message.success('Status updated successfully');
  };

  return (
    <div>
      <h1>Your Tasks</h1>
      <Table dataSource={tasks} columns={columns} />
    </div>
  );
};

export default EmployeeTaskPage;
