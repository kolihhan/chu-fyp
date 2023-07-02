// import React, { useState } from 'react';
// import { Form, Input, Button, Select } from 'antd';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '../app/store';
// import { createFeedback } from '../reducers/feedbackReducers';

// const { Option } = Select;

// const FeedBackPage: React.FC = () => {
//   const [form] = Form.useForm();
//   const dispatch = useDispatch();
//   const companyEmployees = useSelector((state: RootState) => state.companyEmployees);

//   const onFinish = (values: any) => {
//     dispatch(createFeedback(values));
//     form.resetFields();
//   };

//   return (
//     <Form form={form} onFinish={onFinish}>
//       <Form.Item name="company_id" label="Company ID" rules={[{ required: true, message: 'Please select a company.' }]}>
//         <Select>
//           {/* 根据实际需求，使用适当的数据源来渲染选项 */}
//           {companyEmployees.map((employee) => (
//             <Option key={employee.id} value={employee.id}>
//               {employee.name}
//             </Option>
//           ))}
//         </Select>
//       </Form.Item>
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
//       <Form.Item
//         name="feedback_to"
//         label="Feedback To"
//         rules={[{ required: true, message: 'Please select an employee to provide feedback to.' }]}
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
//       <Form.Item name="remarks" label="Remarks" rules={[{ required: true, message: 'Please enter remarks.' }]}>
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

// export default FeedBackPage;
export {};