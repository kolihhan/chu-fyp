import React from 'react';
import { Form, Input, Button } from 'antd';

const ResumePage: React.FC = () => {
  const onFinish = (values: any) => {
    console.log('Received values:', values);
    // 这里可以将values发送给后端进行保存
  };

  return (
    <Form onFinish={onFinish}>
      <Form.Item label="Summary" name="summary">
        <Input.TextArea />
      </Form.Item>
      <Form.Item label="Experience" name="experience">
        <Input.TextArea />
      </Form.Item>
      <Form.Item label="Education" name="education">
        <Input.TextArea />
      </Form.Item>
      <Form.Item label="Skills" name="skills">
        <Input.TextArea />
      </Form.Item>
      <Form.Item label="Preferred Work" name="prefer_work">
        <Input.TextArea />
      </Form.Item>
      <Form.Item label="Language" name="language">
        <Input.TextArea />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ResumePage;
