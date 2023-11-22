import { Button, Card, Col, DatePicker, Form, Input, Row, Select, Table} from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { applyLeave, selectSelectedCompany, selectSelf } from '../../../reducers/employeeReducers';

import { applyLeaveApi, getLeaveRecords } from '../../../api';

import { AnyAction } from '@reduxjs/toolkit';
import { ThunkDispatch } from 'redux-thunk';
import dayjs from 'dayjs';
import { getCookie } from '../../../utils';


const { RangePicker } = DatePicker;

const ApplicationLeavePage: React.FC = () => {
  const { Option } = Select;
  const [form] = Form.useForm();
  type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;
  const dispatch: AppDispatch = useDispatch();

  const [leaveRecords, setLeaveRecords] = useState<any[]>([]);
  const employeeSelect = useSelector(selectSelectedCompany);
  const companyId = getCookie('companyId')
  const employeeId = getCookie('employeeId')

  useEffect(() => {
    // 获取请假记录
    fetchDatas();
  }, []);

  const onFinish = async (values: any) => {
    values['leave_start'] = dayjs(values['leave_start']).format('YYYY-MM-DD HH:mm:ss');
    values['leave_end'] = dayjs(values['leave_end']).format('YYYY-MM-DD HH:mm:ss');
    values['company_id'] = companyId;
    values['companyEmployee_id'] = employeeId;

    // dispatch(applyLeave(values));
    const response = await applyLeaveApi(values);
    if(response.data){
      form.resetFields();
      fetchDatas()
    }
  };

  const fetchDatas = async () => {
    try {
      const response = await getLeaveRecords(employeeId);
      setLeaveRecords(response.data.data);
      console.log(response.data);

    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    { title: '開始日期', dataIndex: 'leave_start', key: 'leave_start', render: (text:any) => dayjs(text).format('YYYY-MM-DD') },
    { title: '結束日期', dataIndex: 'leave_end', key: 'leave_end', render: (text:any) => dayjs(text).format('YYYY-MM-DD') },
    { title: '原因', dataIndex: 'reason', key: 'reason' },
    { title: '類型', dataIndex: 'type', key: 'type' },
    { title: '狀態', dataIndex: 'status', key: 'status' },
    { title: '評論', dataIndex: 'comment', key: 'comment', render: (text:any) => (text==null?"-":text) },
  ];

  return (
    <div>
      {/* 请假表单 */}      
      <Card title="請假申請" style={{marginBottom:'16px'}} bodyStyle={{paddingBottom:'0px'}}>
        <Form form={form} onFinish={onFinish}>
          <Row gutter={[16,0]}>
            <Col>
              <Form.Item name="leave_start" label="開始日期"
                rules={[{ required: true, message: '請選擇開始日期.' }]} >
                  <DatePicker showTime placeholder="選擇日期" />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name="leave_end" label="結束日期"
                rules={[{ required: true, message: '請選擇結束日期.' }]} >
                  <DatePicker showTime placeholder="選擇日期" />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name="type" label="請假類型"
                rules={[{ required: true, message: '請選擇請假類型.' }]} >
                  <Select style={{minWidth:"200px"}}>
                    <Option value="Annual Leave">年假</Option>
                    <Option value="Sick Leave">病假</Option>
                    <Option value="Personal Leave">事假</Option>
                    <Option value="Maternity Leave">產假</Option>
                    <Option value="Paternity Leave">陪產假</Option>
                  </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16,0]}>
            <Col flex='auto'>
              <Form.Item name="reason" label="原因" 
                rules={[{ required: true, message: '請寫原因.' }]} >
                  <Input.TextArea rows={1} autoSize={{ minRows: 1, maxRows: 4 }} />
              </Form.Item>
            </Col>
            <Col flex='none' style={{textAlign:'right'}}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      
      {/* 请假记录 */}
      <Card title="請假記錄" bodyStyle={{paddingBottom:'0px'}}>
      <Table dataSource={Array.isArray(leaveRecords) ? leaveRecords : []} columns={columns} bordered />
      </Card>

    </div>
  );
};

export default ApplicationLeavePage;
