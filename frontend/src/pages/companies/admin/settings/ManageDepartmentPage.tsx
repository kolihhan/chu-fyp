import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Table, Modal, Form, Input, Button } from "antd";
import { createDepartment, getDepartments, deleteDepartment } from "../../../../api";

const ManageDepartmentPage: React.FC = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const companyId = Number(id);
  const [departments, setDepartments] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    document.title = "部门管理";
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await getDepartments(companyId);
      setDepartments(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateDepartment = async (values: any) => {
    try {
      await createDepartment(companyId, values.department_name);
      form.resetFields();
      setIsModalVisible(false);
      fetchDepartments();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteDepartment = async (departmentId: number) => {
    try {
      await deleteDepartment(departmentId);
      fetchDepartments();
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    { title: "Department Name", dataIndex: "department_name", key: "department_name" },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Button type="link" onClick={() => handleDeleteDepartment(record.id)}>
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
      <h1>部门管理</h1>

      <Button type="primary" onClick={showModal}>
        创建部门
      </Button>

      <Table dataSource={departments} columns={columns} />

      <Modal title="创建部门" visible={isModalVisible} onCancel={handleCancel} footer={null}>
        <Form form={form} onFinish={handleCreateDepartment}>
          <Form.Item name="department_name" label="部门名称" rules={[{ required: true, message: "请输入部门名称" }]}>
            <Input />
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

export default ManageDepartmentPage;
