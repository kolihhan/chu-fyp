import React, { useEffect, useState } from 'react';
import { Input, Select, Table } from 'antd';
import { getAllEmployeesPromotionHistory } from '../../../api';
import { useParams } from 'react-router-dom';

const { Option } = Select;

const EmployeesPromotionHistoryPage: React.FC = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const companyId = Number(id);

  
  const [promotionHistory, setPromotionHistory] = useState<any[]>([]);
  const [searchEmployee, setSearchEmployee] = useState('');
  const [filteredHistory, setFilteredHistory] = useState<any[]>([]);
  const [employeeOptions, setEmployeeOptions] = useState<string[]>([]);

  useEffect(() => {
    fetchPromotionHistory();
  }, []);

  const fetchPromotionHistory = async () => {
    try {
      const response = await getAllEmployeesPromotionHistory(companyId);
      setPromotionHistory(response.data);

      // 获取唯一的员工选项
      const uniqueEmployees : any = Array.from(new Set(response.data.map((promotion : any) => promotion.companyEmployee_id)));
      setEmployeeOptions(uniqueEmployees);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    filterHistory();
  }, [promotionHistory, searchEmployee]);

  const filterHistory = () => {
    const filtered = promotionHistory.filter((promotion) =>
      promotion.companyEmployee_id.toLowerCase().includes(searchEmployee.toLowerCase())
    );
    setFilteredHistory(filtered);
  };

  const handleSearchEmployee = (value: string) => {
    setSearchEmployee(value);
  };

  const columns = [
    { title: 'Employee Name' , key: 'companyEmployee_id' , render: (_ : any, record: any) =>  <span>{record.companyEmployee_id.user_id.name}</span>},
    { title: 'Company ID', dataIndex: 'company_id', key: 'company_id' },
    { title: 'Previous Position', dataIndex: 'previous_position', key: 'previous_position' },
    { title: 'New Position', dataIndex: 'new_position', key: 'new_position' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Remarks', dataIndex: 'remarks', key: 'remarks' },
  ];

  return (
    <div>
      <h1>Employees Promotion History</h1>
      <Select placeholder="Search employee" style={{ width: 200, marginBottom: 16 }} onChange={handleSearchEmployee}>
        {employeeOptions.map((employee) => (
          <Option key={employee} value={employee}>
            {employee}
          </Option>
        ))}
      </Select>
      <Table dataSource={filteredHistory} columns={columns} />
    </div>
  );
};

export default EmployeesPromotionHistoryPage;
