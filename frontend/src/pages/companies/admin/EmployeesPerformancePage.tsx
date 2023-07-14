import React, { useEffect, useState } from 'react';
import { Input, Select, Table } from 'antd';
import { getAllEmployeesPerformance } from '../../../api';
import { useParams } from 'react-router-dom';

const { Option } = Select;

const EmployeesPerformancePage: React.FC = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const companyId = Number(id);


  const [performanceList, setPerformanceList] = useState<any[]>([]);
  const [searchEmployee, setSearchEmployee] = useState('');
  const [filteredPerformance, setFilteredPerformance] = useState<any[]>([]);
  const [employeeOptions, setEmployeeOptions] = useState<string[]>([]);

  useEffect(() => {
    fetchEmployeesPerformance();
  }, []);

  const fetchEmployeesPerformance = async () => {
    try {
      const response = await getAllEmployeesPerformance(companyId);
      setPerformanceList(response.data);

      // 获取唯一的员工选项
      const uniqueEmployees : any = Array.from(new Set(response.data.map((performance : any) => performance.companyEmployee_id)));
      setEmployeeOptions(uniqueEmployees);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    filterPerformance();
  }, [performanceList, searchEmployee]);

  const filterPerformance = () => {
    const filtered = performanceList.filter((performance) =>
      performance.companyEmployee_id.toLowerCase().includes(searchEmployee.toLowerCase())
    );
    setFilteredPerformance(filtered);
  };

  const handleSearchEmployee = (value: string) => {
    setSearchEmployee(value);
  };

  const columns = [
    { title: 'Employee Name' , key: 'companyEmployee_id' , render: (_ : any, record: any) =>  <span>{record.companyEmployee_id.user_id.name}</span>},
    { title: 'Company ID', dataIndex: 'company_id', key: 'company_id' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Remarks', dataIndex: 'remarks', key: 'remarks' },
  ];

  return (
    <div>
      <h1>Employees Performance</h1>
      <Select placeholder="Search employee" style={{ width: 200, marginBottom: 16 }} onChange={handleSearchEmployee}>
        {employeeOptions.map((employee) => (
          <Option key={employee} value={employee}>
            {employee}
          </Option>
        ))}
      </Select>
      <Table dataSource={filteredPerformance} columns={columns} />
    </div>
  );
};

export default EmployeesPerformancePage;
