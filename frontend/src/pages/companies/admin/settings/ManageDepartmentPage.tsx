import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Table, Modal, Form, Input, Button } from "antd";
import { createDepartment, getDepartments, deleteDepartment, updateDepartment } from "../../../../api";

const ManageDepartmentPage: React.FC = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const companyId = Number(id);
  const [departments, setDepartments] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedDepartment, setSelectedDepartment] = useState<any | null>(null);

  useEffect(() => {
    document.title = "部门管理";
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await getDepartments(companyId);
      setDepartments(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateDepartment = async (values: any) => {
    try {
      await createDepartment({ ...values, company_id: companyId });
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

  const handleEditDepartment = (department: any) => {
    setSelectedDepartment(department);
    setIsModalVisible(true);
  };

  const handleUpdateDepartment = async (values: any) => {
    try {
      await updateDepartment(selectedDepartment.id, values);
      form.resetFields();
      setIsModalVisible(false);
      fetchDepartments();
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    { title: "部門", dataIndex: "department_name", key: "department_name" },
    {
      title: "",
      key: "actions",
      render: (_: any, record: any) => (
        <div style={{textAlign:'right'}}>
          <Button type="primary" onClick={() => handleEditDepartment(record)} style={{marginRight:'8px'}}>
            Edit
          </Button>
          <Button type="default" onClick={() => handleDeleteDepartment(record.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const showModal = () => {
    setSelectedDepartment(null);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <h1>部门管理</h1>

      <div style={{marginBottom:'8px', textAlign:'right', width:'100%'}}>
        <Button type="primary" onClick={showModal}>
          创建部门
        </Button>
      </div>

      <Table dataSource={departments} columns={columns} />

      <Modal
        title={selectedDepartment ? "编辑部门" : "创建部门"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} initialValues={selectedDepartment} onFinish={selectedDepartment ? handleUpdateDepartment : handleCreateDepartment}>
          <Form.Item name="department_name" label="部门名称" rules={[{ required: true, message: "请输入部门名称" }]}>
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {selectedDepartment ? "更新" : "创建"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageDepartmentPage;
