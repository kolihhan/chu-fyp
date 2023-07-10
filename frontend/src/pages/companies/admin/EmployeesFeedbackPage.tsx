import React, { useEffect, useState } from 'react';
import { Input, Select, Table } from 'antd';
import { getAllEmployeesFeedback } from '../../../api';

const { Option } = Select;

const EmployeesFeedbackPage: React.FC = () => {
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [searchEmployee, setSearchEmployee] = useState('');
  const [searchContent, setSearchContent] = useState('');
  const [filteredFeedback, setFilteredFeedback] = useState<any[]>([]);
  const [employeeOptions, setEmployeeOptions] = useState<string[]>([]);

  useEffect(() => {
    fetchEmployeesFeedback();
  }, []);

  const fetchEmployeesFeedback = async () => {
    try {
      const response = await getAllEmployeesFeedback();
      setFeedbackList(response.data);

      // 获取唯一的员工选项
      const uniqueEmployees : any = Array.from(new Set(response.data.map((feedback : any) => feedback.companyEmployee_id)));
      setEmployeeOptions(uniqueEmployees);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    filterFeedback();
  }, [feedbackList, searchEmployee, searchContent]);

  const filterFeedback = () => {
    const filtered = feedbackList.filter(
      (feedback) =>
        feedback.companyEmployee_id.toLowerCase().includes(searchEmployee.toLowerCase()) &&
        feedback.remarks.toLowerCase().includes(searchContent.toLowerCase())
    );
    setFilteredFeedback(filtered);
  };

  const handleSearchEmployee = (value: string) => {
    setSearchEmployee(value);
  };

  const handleSearchContent = (value: string) => {
    setSearchContent(value);
  };

  const columns = [
    { title: 'Employee ID', dataIndex: 'companyEmployee_id', key: 'companyEmployee_id' },
    { title: 'Company ID', dataIndex: 'company_id', key: 'company_id' },
    { title: 'Remarks', dataIndex: 'remarks', key: 'remarks' },
  ];

  return (
    <div>
      <h1>Employees Feedback</h1>
      <Select placeholder="Search employee" style={{ width: 200, marginBottom: 16 }} onChange={handleSearchEmployee}>
        {employeeOptions.map((employee) => (
          <Option key={employee} value={employee}>
            {employee}
          </Option>
        ))}
      </Select>
      <Input.Search
        placeholder="Search content"
        onSearch={handleSearchContent}
        style={{ width: 300, marginBottom: 16 }}
      />
      <Table dataSource={filteredFeedback} columns={columns} />
    </div>
  );
};

export default EmployeesFeedbackPage;
