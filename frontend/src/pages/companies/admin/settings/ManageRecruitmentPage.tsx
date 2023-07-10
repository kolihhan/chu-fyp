import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Table, Button, Modal, Form, Input, DatePicker, InputNumber } from "antd";
import {
  getRecruitments,
  createRecruitment,
  deleteRecruitment,
} from "../../../../api";

const ManageRecruitmentPage: React.FC = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const companyId = Number(id);
  const [recruitments, setRecruitments] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    document.title = "招聘管理";
    fetchRecruitments();
  }, []);

  const fetchRecruitments = async () => {
    try {
      const response = await getRecruitments(companyId);
      setRecruitments(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateRecruitment = async (values: any) => {
    try {
      await createRecruitment(companyId, values);
      form.resetFields();
      setIsModalVisible(false);
      fetchRecruitments();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteRecruitment = async (recruitmentId: number) => {
    try {
      await deleteRecruitment(recruitmentId);
      fetchRecruitments();
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Location", dataIndex: "location", key: "location" },
    { title: "Start Date", dataIndex: "start_at", key: "start_at" },
    { title: "Employee Need", dataIndex: "employee_need", key: "employee_need" },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Button type="link" onClick={() => handleDeleteRecruitment(record.id)}>
          Delete
        </Button>
      ),
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <h1>招聘管理</h1>

      <Button type="primary" onClick={showModal}>
        创建招聘职位
      </Button>

      <Table dataSource={recruitments} columns={columns} />

      <Modal title="创建招聘职位" visible={isModalVisible} onCancel={handleCancel} footer={null}>
        <Form form={form} onFinish={handleCreateRecruitment}>
          <Form.Item name="title" label="Title" rules={[{ required: true, message: "请输入职位标题" }]}>
            <Input />
          </Form.Item>

          <Form.Item name="location" label="Location" rules={[{ required: true, message: "请输入地点" }]}>
            <Input />
          </Form.Item>

          <Form.Item name="start_at" label="Start Date" rules={[{ required: true, message: "请选择开始日期" }]}>
            <DatePicker />
          </Form.Item>

          <Form.Item
            name="employee_need"
            label="Employee Need"
            rules={[{ required: true, message: "请输入需要的员工人数" }]}
          >
            <InputNumber min={1} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              创建
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageRecruitmentPage;
