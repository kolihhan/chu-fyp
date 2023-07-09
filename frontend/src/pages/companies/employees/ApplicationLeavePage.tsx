import { Button, DatePicker, Form, Input, Select, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { applyLeave, selectSelectedCompany, selectSelf } from '../../../reducers/employeeReducers';

import { getLeaveRecords } from '../../../api';

import { AnyAction } from '@reduxjs/toolkit';
import { ThunkDispatch } from 'redux-thunk';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const ApplicationLeavePage: React.FC = () => {
  const { Option } = Select;
  const [form] = Form.useForm();
  type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;
  const dispatch: AppDispatch = useDispatch();

  const [leaveRecords, setLeaveRecords] = useState<any[]>([]);
  const employeeId = useSelector(selectSelf);
  const employeeSelect = useSelector(selectSelectedCompany);

  useEffect(() => {
    // 获取请假记录
    fetchDatas();
  }, []);

  const onFinish = (values: any) => {
    values['leave_start'] = dayjs(values['leave_start']).format('YYYY-MM-DD HH:mm:ss');
    values['leave_end'] = dayjs(values['leave_end']).format('YYYY-MM-DD HH:mm:ss');
    values['company_id'] = employeeId[employeeSelect].company_id;
    values['companyEmployee_id'] = employeeId[employeeSelect].id;

    dispatch(applyLeave(values));
    form.resetFields();
  };

  const fetchDatas = async () => {
    try {
      const response = await getLeaveRecords(employeeId[employeeSelect].id);
      setLeaveRecords(response.data.data);
      console.log(response.data);

    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    { title: 'Start Date', dataIndex: 'leave_start', key: 'leave_start', render: (text:any) => dayjs(text).format('YYYY-MM-DD') },
    { title: 'End Date', dataIndex: 'leave_end', key: 'leave_end', render: (text:any) => dayjs(text).format('YYYY-MM-DD') },
    { title: 'Reason', dataIndex: 'reason', key: 'reason' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Comment', dataIndex: 'comment', key: 'comment' },
  ];
  return (
    <div>
      <h1>Application Leave</h1>

      {/* 请假记录 */}
      <Table dataSource={Array.isArray(leaveRecords) ? leaveRecords : []} columns={columns} />

      {/* 请假表单 */}
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          name="leave_start"
          label="Start Date"
          rules={[{ required: true, message: 'Please select a start date.' }]}
        >
          <DatePicker showTime />
        </Form.Item>
        <Form.Item
          name="leave_end"
          label="End Date"
          rules={[{ required: true, message: 'Please select an end date.' }]}
        >
          <DatePicker showTime />
        </Form.Item>
        <Form.Item
          name="reason"
          label="Reason"
          rules={[{ required: true, message: 'Please enter a reason.' }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="type"
          label="Leave Type"
          rules={[{ required: true, message: 'Please select a leave type.' }]}
        >
          <Select>
            <Option value="Annual Leave">Annual Leave</Option>
            <Option value="Sick Leave">Sick Leave</Option>
            <Option value="Personal Leave">Personal Leave</Option>
            <Option value="Maternity Leave">Maternity Leave</Option>
            <Option value="Paternity Leave">Paternity Leave</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ApplicationLeavePage;
