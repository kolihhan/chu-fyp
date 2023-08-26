import { Button, Form, Input, Modal, Table } from "antd";
import { useEffect, useState } from "react";
import { getCookie } from "../../../../utils";
import { getCompanyAllLeaveRecords, getLeaveRecords, updateLeaveRecords } from "../../../../api";
import dayjs from 'dayjs';

const ManageEmployeeLeavePage: React.FC = () => {
    const [form] = Form.useForm();
    const companyId = getCookie('companyId')
    const employeeId = getCookie('employeeId')
    const role = getCookie('role')
    const [leaveRecords, setLeaveRecords] = useState<any[]>([]);
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedLeaveId, setSelectedLeaveId] = useState<any>()
    const [leaveAction, setLeaveAction] = useState<any>()
    
    useEffect(() => {
        document.title = "請假管理"
        fetchDatas()
    }, [])

    const fetchDatas = async () => {
        try {
        const response = await getCompanyAllLeaveRecords(companyId);
        setLeaveRecords(response.data.data);
        console.log(response.data);
    
        } catch (error) {
        console.log(error);
        }
    };

    const handlerLeave = (leaveId: Number, leaveAction: String) => {
        form.setFieldsValue({
            comment:''
        })
        setModalVisible(true)
        setSelectedLeaveId(leaveId)
        setLeaveAction(leaveAction)
    }
  
    const handleModalCancel = () => {
        setModalVisible(false)
        setSelectedLeaveId(null)
        setLeaveAction(null)
    }
  
    const handleModalSubmit = async () => {
        const data = {
            status: leaveAction,
            comment: form.getFieldValue('comment').toString().trim()=='' ? null : form.getFieldValue('comment'),
            approve_at: dayjs()
        }
        console.log(selectedLeaveId)
        try{
            const response = await updateLeaveRecords(selectedLeaveId, data)
            console.log(response)
        }catch (error){
            console.log(error)
        }
        setModalVisible(false)
        setSelectedLeaveId(null)
        setLeaveAction(null)
        fetchDatas()
    }
    
    
    const columns = [
        { title: 'Employee', dataIndex: 'companyEmployee_id', key: 'company_employee_id', render: (companyEmployee:any) => 
            companyEmployee.user_id.name
        },
        { title: 'Start Date', dataIndex: 'leave_start', key: 'leave_start', render: (text:any) => dayjs(text).format('YYYY-MM-DD') },
        { title: 'End Date', dataIndex: 'leave_end', key: 'leave_end', render: (text:any) => dayjs(text).format('YYYY-MM-DD') },
        { title: 'Reason', dataIndex: 'reason', key: 'reason' },
        { title: 'Type', dataIndex: 'type', key: 'type' },
        { title: 'Status', dataIndex: 'status', key: 'status' },
        { title: 'Comment', dataIndex: 'comment', key: 'comment', render: (text:any) => (text==null?"-":text) },
        { title: '', dataIndex:'', key:"action", render: (record: any) => (
            <>
                {record.status=='Pending' && (
                    <>
                    <Button onClick={() => handlerLeave(record.id, "Approve")} type='link'>Approve</Button>
                    <Button onClick={() => handlerLeave(record.id, "Reject")} type='link'>Reject</Button>
                    </>
                )}
            </>
          ),}
      ];

    return (
        <div>

            <Table dataSource={Array.isArray(leaveRecords) ? leaveRecords : []} columns={columns} />
            <Modal
                visible={modalVisible}
                onCancel={handleModalCancel}
                onOk={handleModalSubmit}
                destroyOnClose
                title="Leave Approvement">
                <Form form={form}>
                    <Form.Item name="comment" label="Comment">
                        <Input placeholder='Input if has any'/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
};

export default ManageEmployeeLeavePage;