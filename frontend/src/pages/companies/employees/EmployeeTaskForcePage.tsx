import React, { useState, useEffect } from 'react';
import { Button, Table, Popconfirm } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { AnyAction } from '@reduxjs/toolkit';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../../../app/store';
import { useSelector, useDispatch } from 'react-redux';
import { deleteTaskForce, getEmployeeTaskForce } from '../../../api';
import { getCookie } from '../../../utils';

const EmployeeTaskForcePage: React.FC = () => {

    const companyId = Number(getCookie('companyId'))
    const employeeId = Number(getCookie('employeeId'))
    const [taskForces, setTaskForces] = useState([]);
    
    useEffect(() => {
        getTaskForce()
    }, [])

    const getTaskForce = async () => {
        const response = await getEmployeeTaskForce(companyId, employeeId)
        console.log(response.data.data)
        setTaskForces(response.data.data)
    }
    
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
          render: (status: any) => {
            return status.user_id.name;
          },
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
          render: (id: any, record: any) => (
            <div>
             <a className="mr-2" href={`/company/task-list/${id}/details`}>
               <Button type="primary">
                 View
               </Button>
             </a>
            {record.leader.id == employeeId && 
                <a className="mr-2" href={`/company/task-list/${id}/update`}>
                <Button type="primary">
                    Edit
                </Button>
                </a>
            }
    
            {record.leader.id == employeeId && 
                <Popconfirm
                title="Are you sure you want to delete this task force?"
                onConfirm={() => handleDelete(id)}
                okText="Yes"
                cancelText="No"
                >
                <Button danger>Delete</Button>
                </Popconfirm>
            }
            </div>
          ),
        },
      ];

    return(
        <div>
            <h1>My Task Force</h1>
            <a href="/admin/company/task-list/create">
            <Button type="primary">
                Create Task Force
            </Button>
            </a>
            <Table dataSource={taskForces} columns={columns} />
        </div>
    )
}

export default EmployeeTaskForcePage