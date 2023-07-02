// import React from 'react';
// import { Form, DatePicker, Input, Button } from 'antd';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '../../../app/store';
// import { applyLeave } from '../reducers/leaveReducers';

// const ApplicationLeavePage: React.FC = () => {
//   const [form] = Form.useForm();
//   const dispatch = useDispatch();
//   const companyEmployees = useSelector((state: RootState) => state.companyEmployees);

//   const onFinish = (values: any) => {
//     dispatch(applyLeave(values));
//     form.resetFields();
//   };

//   return (
//     <Form form={form} onFinish={onFinish}>
//       <Form.Item
//         name="companyEmployee_id"
//         label="Company Employee ID"
//         rules={[{ required: true, message: 'Please select an employee.' }]}
//       >
//         <Select>
//           {/* 根据实际需求，使用适当的数据源来渲染选项 */}
//           {companyEmployees.map((employee) => (
//             <Option key={employee.id} value={employee.id}>
//               {employee.name}
//             </Option>
//           ))}
//         </Select>
//       </Form.Item>
//       <Form.Item name="startDate" label="Start Date" rules={[{ required: true, message: 'Please select a start date.' }]}>
//         <DatePicker />
//       </Form.Item>
//       <Form.Item name="endDate" label="End Date" rules={[{ required: true, message: 'Please select an end date.' }]}>
//         <DatePicker />
//       </Form.Item>
//       <Form.Item name="reason" label="Reason" rules={[{ required: true, message: 'Please enter a reason.' }]}>
//         <Input.TextArea />
//       </Form.Item>
//       <Form.Item>
//         <Button type="primary" htmlType="submit">
//           Submit
//         </Button>
//       </Form.Item>
//     </Form>
//   );
// };

// export default ApplicationLeavePage;
export {};