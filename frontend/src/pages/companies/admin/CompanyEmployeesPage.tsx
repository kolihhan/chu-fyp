import React, { useEffect, useState } from 'react';
import { Button, Input, Table } from 'antd';
import { Link, useParams } from 'react-router-dom';
import { getAllEmployees } from '../../../api';

const CompanyEmployeePage: React.FC = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const companyId = Number(id);
  
  const [employees, setEmployees] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');


  useEffect(() => {
    fetchCompanyEmployees();
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
    { title: 'Actions', key: 'actions', render: (_ : any, record: any) => <Link to={`/admin/company/${id}/manage/${record.id}`}>Manage Permissions</Link> },
  ];

  return (
    <div>
      <h1>Company Employees</h1>
      <Input.Search placeholder="Search employee" onSearch={handleSearch} style={{ width: 200, marginBottom: 16 }} />
      <Table dataSource={filteredEmployees} columns={columns} />

      {/* Button to navigate to permission settings page */}
      <Button type="primary">
        <Link to="/permission-settings">Permission Settings</Link>
      </Button>
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
