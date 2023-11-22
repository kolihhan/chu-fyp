import React, { useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber, Modal, Pagination, Select, Table, message } from 'antd';
import { Link, useParams } from 'react-router-dom';
import { createCompanyEmployee, fireCompanyEmployee, getAllEmployees, getEmployeePositions, getUserByEmail, sendInvitation } from '../../../api';
import { getCookie } from '../../../utils';

const CompanyEmployeePage: React.FC = () => {
  const { id } = useParams<{ id: string | undefined }>();
  // const companyId = Number(id);
  const companyId = Number(getCookie('companyId'))
  const { Option } = Select;
  const [employees, setEmployees] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm();
  const [availablePosition, setAvailablePosition] = useState<any[]>([]);

  useEffect(() => {
    fetchCompanyEmployees();
    fetchCompanyPosition()
  }, []);

  const fetchCompanyEmployees = async () => {
    try {
      const employeeResponse = await getAllEmployees(companyId);
      console.log(employeeResponse.data);
      setEmployees(employeeResponse.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCompanyPosition = async () => {
    try {
      const response = await getEmployeePositions(companyId);
      setAvailablePosition(response.data.data)
    }catch (error) {
      console.log(error)
    }
  };

  const inviteEmployee = async () => {
    const data = {
      'email':form.getFieldValue('email'),
      'companyId':companyId
    }
    const response = await sendInvitation(data)
    if(response.status==200){
        message.success('邀請成功')
        fetchCompanyEmployees();
      }
    // const userResposne = await getUserByEmail(form.getFieldValue('email'))
    // if(userResposne.status==200){
    //   const data = {
    //     company_id: companyId,
    //     user_id: userResposne.data.id,
    //     companyEmployeePosition_id: form.getFieldValue("position"),
    //     salary: form.getFieldValue("salary")
    //   }
    //   const response = await createCompanyEmployee(data)
    //   if(response.status==200){
    //     message.success('邀請成功')
    //     fetchCompanyEmployees();
    //   }
    // }else{
    //   // user not found, send invitation to the email
    // }
  }

  const fireEmployee = async (id:number) => {
      const response = await fireCompanyEmployee(id)
      if(response.status==200){
        message.success('解雇成功')
        fetchCompanyEmployees();
      }
  }

  const handleInviteEmployee = () => {
    setModalVisible(true)
  }
  const handleModalCancel = () => {
    setModalVisible(false)
  }
  const handleModalSubmit = () => {
    inviteEmployee()
    setModalVisible(false)
  }

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const filteredEmployees = employees.filter((employee) =>
    employee.user_id.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    { title: 'Employee', key: 'employee', render: (_ : any, record: any) =>  <span>{record.user_id.name}</span> },
    { title: 'Department', dataIndex: 'department', key: 'department', render:(_ : any, record: any) => <span>{record.companyEmployeePosition_id.companyDepartment_id.department_name }</span> },
    { title: 'Position', dataIndex: 'position', key: 'position', render:(_ : any, record: any) => <span>{record.companyEmployeePosition_id.position_name}</span> },
    { title: 'Actions', key: 'actions', render: (_ : any, record: any) => (
      <>
        <Link to={`/admin/company/manage/${record.id}`}>Manage Permissions</Link>
        <Button type='link' onClick={() => fireEmployee(record.id)}>Fire Employee</Button>
      </>
    )},
  ];

    // Pagination configuration
    const paginationConfig = {
      pageSize: 10, // Number of items per page
      total: filteredEmployees.length, // Total number of items
      // showSizeChanger: true, // Show options to change page size
      // showQuickJumper: true, // Show quick jumper to navigate pages
      showTotal: (total:any, range:any) => `${range[0]}-${range[1]} of ${total} items`,
    };

  return (
    <div>
      <h1>公司職員</h1>
      <div style={{display:'flex', justifyContent:'space-between'}}>
        <Input.Search placeholder="Search employee" onSearch={handleSearch} style={{ width: 200, marginBottom: 16 }} />
        <Button onClick={handleInviteEmployee}>邀請員工</Button>
      </div>
      <Table dataSource={filteredEmployees} columns={columns} />
      <Modal 
        visible={modalVisible}
        onCancel={handleModalCancel}
        onOk={handleModalSubmit}
        title="邀請員工">
          <Form form={form}>
            <Form.Item name="email" label="員工" rules={[{ required:true }]}>
              <Input />
            </Form.Item>
            <Form.Item
              name="position"
              label="職位"
              rules={[{ required: true, message: "請輸入職位" }]}>
              <Select placeholder="員工">
                {availablePosition.map((position) => (
                  <Option value={position.id}>{position.position_name}</Option>
                ))}
              </Select>
          </Form.Item>
          <Form.Item label="薪資" name="salary" rules={[{ required: true, message: "請輸入薪資" }]}>
              <InputNumber style={{width:'100%'}} min={0} type="number"/>
            </Form.Item>
          </Form>
        </Modal>


      {/* Button to navigate to permission settings page */}
      {/* <Button type="primary">
        <Link to="/permission-settings">Permission Settings</Link>
      </Button> */}
    </div>
  );
};

//   const columns = [
//     { title: 'User ID', key: 'user_id', render: (_ : any, record: any) =>  <span>{record.user_id.name}</span> },
//     { title: 'Company ID', dataIndex: 'company_id', key: 'company_id' },
//     { title: 'Salary', dataIndex: 'salary', key: 'salary' },
//     { title: 'Actions', key: 'actions', render: (_ : any, record: any) => <Link to={`/admin/company/${id}/manage/${record.id}`}>Manage Permissions</Link> },
//   ];

//   return (
//     <div>
//       <h1>Company Employees</h1>
//       <Input.Search placeholder="Search employee" onSearch={handleSearch} style={{ width: 200, marginBottom: 16 }} />
//       <Table dataSource={filteredEmployees} columns={columns} />

//       {/* Button to navigate to permission settings page */}
//       <Button type="primary">
//         <Link to="/permission-settings">Permission Settings</Link>
//       </Button>
//     </div>
//   );
// };

export default CompanyEmployeePage;
