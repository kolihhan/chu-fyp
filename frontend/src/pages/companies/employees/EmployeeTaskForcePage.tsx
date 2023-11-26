import React, { useState, useEffect } from 'react';
import { Button, Table, Popconfirm} from 'antd';
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
          title: '任務組名稱',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '內容',
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
          render: (id: any, record: any) => (
            <div>
             <a className="mr-2" href={`/company/task-list/${id}/details`}>
               <Button type="primary">
                 查看
               </Button>
             </a>
            {record.leader.id == employeeId && 
                <a className="mr-2" href={`/company/task-list/${id}/update`}>
                <Button type="primary">
                    編輯
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
                <Button danger>刪除</Button>
                </Popconfirm>
            }
            </div>
          ),
        },
      ];

    return(
        <div>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <h1>我的任務組</h1>
            <a href="/company/task-list/create">
            <Button type="primary">
                創建任務組
            </Button>
            </a>
          </div>
            <Table dataSource={taskForces} columns={columns} />
        </div>
    )
}

export default EmployeeTaskForcePage