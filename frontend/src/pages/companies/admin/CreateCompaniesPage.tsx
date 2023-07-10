import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button } from "antd";
import { createCompany } from "../../../api";

const CreateCompaniesPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const history = useNavigate();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await createCompany(values);
      history("/"); // 跳转到公司列表页面
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <h1>创建公司</h1>
      <Form
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
      >
        <Form.Item
          label="公司名称"
          name="name"
          rules={[{ required: true, message: "请输入公司名称" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="邮箱"
          name="email"
          rules={[{ required: true, message: "请输入公司邮箱" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="电话"
          name="phone"
          rules={[{ required: true, message: "请输入公司电话" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="地址"
          name="address"
          rules={[{ required: true, message: "请输入公司地址" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="公司描述"
          name="company_desc"
          rules={[{ required: true, message: "请输入公司描述" }]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          label="公司福利"
          name="company_benefits"
          rules={[{ required: true, message: "请输入公司福利" }]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            创建
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateCompaniesPage;
