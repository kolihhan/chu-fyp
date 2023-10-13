import React, { useState, useEffect } from 'react';
import { Button, Table, Popconfirm } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

import { AnyAction } from '@reduxjs/toolkit';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../../../../app/store';
import { useSelector, useDispatch } from 'react-redux';
import { deleteTaskForce, getTaskForcesByCompany } from '../../../../api';
import { getCookie } from '../../../../utils';

const CompanyTaskForcePage: React.FC = () => {

  type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;
  const dispatch: AppDispatch = useDispatch();
  const companyId = Number(getCookie('companyId'));
  const [taskForces, setTaskForces] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTaskForces();
  }, []);

  const fetchTaskForces = async () => {
    try {
      const response = await getTaskForcesByCompany(companyId); 
      setTaskForces(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async(id: any) => {
    try {
      await deleteTaskForce(id);
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      title: 'Task Force Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Leader',
      dataIndex: 'leader',
      key: 'leader',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        // 將Django模型中的選項轉換為HTML <select> 元素的選項
        const statusOptions = [
          { value: 'Planning', label: '策劃中' },
          { value: 'In Progress', label: '進行中' },
          { value: 'Completed', label: '已完成' },
        ];

        const selectedOption = statusOptions.find(option => option.value === status);
        
        return selectedOption ? selectedOption.label : status;
      },
    },
    {
      title: 'Actions',
      dataIndex: 'id',
      key: 'actions',
      render: (id: any) => (
        <div>
         <a href={`admin/company/task-list/${id}/details`}>
           <Button type="primary">
             View
           </Button>
         </a>
         <a href={`admin/company/task-list/${id}/update`}>
           <Button type="primary">
             Edit
           </Button>
         </a>
          <Popconfirm
            title="Are you sure you want to delete this task force?"
            onConfirm={() => handleDelete(id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1>Company Task Force List</h1>
      <a href="/admin/company/task-list/create">
      <Button type="primary">
        Create Task Force
      </Button>
      </a>
      <Table dataSource={taskForces} columns={columns} />
    </div>
  );
};

export default CompanyTaskForcePage;
