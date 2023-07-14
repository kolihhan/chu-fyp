import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Form, Input, Select, Table } from 'antd';
import { createEmployeeTraining, getAllEmployees, getAllCompanyTrainings } from '../../../api';
import { useParams } from 'react-router-dom';

const { Option } = Select;

const EmployeesTrainingManagementPage: React.FC = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const companyId = Number(id);

  const [form] = Form.useForm();
  const [employees, setEmployees] = useState<any[]>([]);
  const [trainings, setTrainings] = useState<any[]>([]);

  useEffect(() => {
    fetchEmployees();
    fetchTrainings();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await getAllEmployees(companyId);
      setEmployees(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTrainings = async () => {
    try {
      const response = await getAllCompanyTrainings(companyId);
      setTrainings(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const onFinish = (values: any) => {
    const data = {
      companyEmployee_id: values.companyEmployee_id,
      company_id: values.company_id,
      companyTraining_id: values.companyTraining_id,
      training_result: values.training_result,
    };

    createEmployeeTraining(data)
      .then((response) => {
        console.log(response.data);
        form.resetFields();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const columns = [
    { title: 'Employee ID', dataIndex: 'companyEmployee_id', key: 'companyEmployee_id' },
    { title: 'Company ID', dataIndex: 'company_id', key: 'company_id' },
    { title: 'Training ID', dataIndex: 'companyTraining_id', key: 'companyTraining_id' },
    { title: 'Training Result', dataIndex: 'training_result', key: 'training_result' },
  ];

  return (
    <div>
      <h1>Employees Training Management</h1>

      <Form form={form} onFinish={onFinish}>
        <Form.Item
          name="companyEmployee_id"
          label="Employee"
          rules={[{ required: true, message: 'Please select an employee.' }]}
        >
          <Select>
            {employees.map((employee) => (
              <Option key={employee.id} value={employee.id}>
                {employee.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="company_id"
          label="Company"
          rules={[{ required: true, message: 'Please select a company.' }]}
        >
          <Select>
            {/* Add options for company selection */}
          </Select>
        </Form.Item>
        <Form.Item
          name="companyTraining_id"
          label="Training"
          rules={[{ required: true, message: 'Please select a training.' }]}
        >
          <Select>
            {trainings.map((training) => (
              <Option key={training.id} value={training.id}>
                {training.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="training_result"
          label="Training Result"
          rules={[{ required: true, message: 'Please enter the training result.' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Training
          </Button>
        </Form.Item>
      </Form>

      <Table dataSource={employees} columns={columns} />
    </div>
  );
};

export default EmployeesTrainingManagementPage;
