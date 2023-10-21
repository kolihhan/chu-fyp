import React, { useState, useEffect } from 'react';
import { Table, Select, Button, message } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getCookie } from '../../../utils';
import { fetchTasksByEmployeeId, updateTasks } from '../../../api';

const { Option } = Select;

const EmployeeTaskPage: React.FC = () => {
  const [tasks, setTasks] = useState([] as any);
  const [selectedTask, setSelectedTask] = useState(null);
  const employeeId = getCookie('employeeId');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetchTasksByEmployeeId(Number(employeeId) ? 1 : 1); // 使用从Cookie获取的employeeId

      setTasks([response.data.data]);
    } catch (error) {
      console.log(error);
    }
  };

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
      render: (text: any, record: any) => (
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

  const handleStatusChange = (record: any, value: any) => {
    let data : any = [];
    const updatedTasks: any = tasks.map((task: any) => {
      if (task.id === record.id) {
        task.status = value;
        data = task;
      }
      return task;
    });

    setTasks(updatedTasks);
    updateTasks(record.id,data);
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
