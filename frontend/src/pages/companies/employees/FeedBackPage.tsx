import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { createFeedback, selectSelectedCompany, selectSelf } from '../../../reducers/employeeReducers';

import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from '@reduxjs/toolkit';

import { getAllEmployees } from '../../../api';

const { Option } = Select;

const FeedBackPage: React.FC = () => {
  const [form] = Form.useForm();

  type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;
  const dispatch: AppDispatch = useDispatch();

  const [companyEmployees, setCompanyEmployees] = useState<any[]>([]);
  const employeeId = useSelector(selectSelf);
  const employeeSelect = useSelector(selectSelectedCompany);


  useEffect(() => {
    // 获取请假记录
    fetchCompanyEmployees();
  }, []);


  const onFinish = (values: any) => {

    values['company_id'] = employeeId[employeeSelect].company_id;
    values['companyEmployee_id'] = employeeId[employeeSelect].id;

    dispatch(createFeedback(values));
    form.resetFields();
  };

  const fetchCompanyEmployees = async () => {
    try {
      const response = await getAllEmployees(employeeId[employeeSelect].company_id.id);
      setCompanyEmployees(response.data);
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item
        name="feedback_to"
        label="Feedback To"
        rules={[{ required: true, message: 'Please select an employee to provide feedback to.' }]}
      >
        <Select>
          {Array.isArray(companyEmployees) &&
            companyEmployees.map((employee) => (
              <Option key={employee.id} value={employee.id}>
                {employee.user_id.name}
              </Option>
            ))}
        </Select>

      </Form.Item>
      <Form.Item name="remarks" label="Remarks" rules={[{ required: true, message: 'Please enter remarks.' }]}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FeedBackPage;
