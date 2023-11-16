import React, { useState, useEffect } from 'react';
import { Table, Select, Button, message, Timeline, Drawer } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getCookie } from '../../../utils';
import { fetchTasksByEmployeeId, generateTimetable, updateTasks } from '../../../api';

const { Option } = Select;

const EmployeeTaskPage: React.FC = () => {
  const [tasks, setTasks] = useState([] as any);
  const [selectedTask, setSelectedTask] = useState(null);
  const [timetable, setTimetable] = useState<any>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const employeeId = Number(getCookie('employeeId'));

  useEffect(() => {
    fetchTasks();
    generateTimeTable()
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetchTasksByEmployeeId(employeeId); // 使用从Cookie获取的employeeId
      console.log(response.data.data)
      setTasks(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const generateTimeTable = async() => {
    try{
      let tt = []
      const response = await generateTimetable(employeeId)
      console.log(response.data.data)
      setTimetable(response.data.data)
      for(let i=0; i<8; i++){
        console.log(response.data.data[i])
        let priority = response.data.data[i].priority
        let color = priority==4? 'red' : priority==3? 'orange' : priority==2? 'yellow' : priority==1? 'green' : 'blue'
        tt.push({
          color: color,
          label: <p>{response.data.data[i].time}</p>,
          children: <p>{response.data.data[i].task_name}</p>
        })
      }
      console.log(tt)
      setTimetable(tt)
      // setTimetable(tt)
    }catch(error){
      console.log(error)
    }
  }

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
    {
      title: 'Priority',
      dataIndex: 'task_force',
      key: 'task_force',
      render: (text: any, record: any) => (
        console.log(text),
        <Select
          disabled
          defaultValue={text.priority}
          style={{ width: 120 }}
        >
            <Option value="Low">Low</Option>
            <Option value="Medium">Medium</Option>
            <Option value="High">High</Option>
            <Option value="Emergency">Emergency</Option>
        </Select>
      ),
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

  const showDrawer = () => {
    setDrawerOpen(true)
  }
  const closeDrawer = () => {
    setDrawerOpen(false)
  }

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h1>Your Tasks</h1>
        <Button type='primary' onClick={showDrawer}>時間表</Button>
      </div>
      <Table dataSource={tasks} columns={columns} />
      <Drawer title="時間表" placement='left' open={drawerOpen} onClose={closeDrawer}>
        <Timeline mode="left" items={timetable} />
      </Drawer>
    </div>
  );
};

export default EmployeeTaskPage;
