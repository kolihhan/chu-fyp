import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table, Button, Modal, Form, Input, DatePicker, InputNumber } from "antd";
import { getRecruitments, createRecruitment, deleteRecruitment, updateRecruitment } from "../../../../api";

const ManageRecruitmentPage: React.FC = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const companyId = Number(id);
  const [recruitments, setRecruitments] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedRecruitment, setSelectedRecruitment] = useState<any | null>(null);

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

  const handleCreateRecruitment = () => {
    setSelectedRecruitment(null);
    setIsModalVisible(true);
  };

  const handleEditRecruitment = (recruitment: any) => {
    setSelectedRecruitment(recruitment);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleRecruitmentSubmit = async (values: any) => {
    try {
      if (selectedRecruitment) {
        // Update existing recruitment
        await updateRecruitment(companyId, selectedRecruitment.id, values);
      } else {
        // Create new recruitment
        await createRecruitment({ ...values, company_id: companyId });
      }

      setIsModalVisible(false);
      form.resetFields();
      fetchRecruitments();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteRecruitment = async (recruitmentId: number) => {
    try {
      await deleteRecruitment(companyId, recruitmentId);
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
      title: "操作",
      key: "actions",
      render: (_: any, record: any) => (
        <>
          <Button type="link" onClick={() => handleEditRecruitment(record)}>
            编辑
          </Button>
          <Button type="link" onClick={() => handleDeleteRecruitment(record.id)}>
            删除
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h1>招聘管理</h1>
      <Button type="primary" onClick={handleCreateRecruitment}>
        创建招聘职位
      </Button>
      <Table dataSource={recruitments} columns={columns} />

      <Modal
        title={selectedRecruitment ? "编辑招聘职位" : "创建招聘职位"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} initialValues={selectedRecruitment} onFinish={handleRecruitmentSubmit}>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "请输入职位标题" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: "请输入地点" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="start_at"
            label="Start Date"
            rules={[{ required: true, message: "请选择开始日期" }]}
          >
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
              {selectedRecruitment ? "更新" : "创建"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageRecruitmentPage;
