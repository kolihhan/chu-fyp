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
      title: '任務組名稱',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '領導',
      dataIndex: 'leader',
      key: 'leader',
      render: (status: any) => {
        return status.user_id.name;
      },
    },
    {
      title: '狀態',
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
      title: '操作',
      dataIndex: 'id',
      key: 'actions',
      render: (id: any) => (
        <div>
         <a className="mr-2" href={`/admin/company/task-list/${id}/details`}>
           <Button type="primary">
             查看
           </Button>
         </a>
         
         <a className="mr-2" href={`/admin/company/task-list/${id}/update`}>
           <Button type="primary">
             編輯
           </Button>
         </a>

          <Popconfirm
            title="你確定要刪除此任務組嗎？"
            onConfirm={() => handleDelete(id)}
            okText="是"
            cancelText="否"
          >
            <Button danger>刪除</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1>公司任務組名單</h1>
      <a href="/admin/company/task-list/create">
      <div style={{ textAlign: 'right' }}>
        <Button type="primary">
          創建任務組
        </Button>
      </div>
      </a>
      <Table dataSource={taskForces} columns={columns} />
    </div>
  );
};

export default CompanyTaskForcePage;
