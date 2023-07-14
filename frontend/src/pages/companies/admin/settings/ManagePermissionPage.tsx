import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table, Button, Modal, Form, Input } from "antd";
import { getPermissions, createPermission, deletePermission, updatePermission } from "../../../../api";

const ManagePermissionPage: React.FC = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const companyId = Number(id);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedPermission, setSelectedPermission] = useState<any | null>(null);

  useEffect(() => {
    document.title = "权限管理";
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const response = await getPermissions(companyId);
      setPermissions(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreatePermission = () => {
    setSelectedPermission(null);
    setIsModalVisible(true);
  };

  const handleEditPermission = (permission: any) => {
    setSelectedPermission(permission);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handlePermissionSubmit = async (values: any) => {
    try {
      if (selectedPermission) {
        // Update existing permission
        await updatePermission(companyId, selectedPermission.id, values);
      } else {
        // Create new permission
        await createPermission({ ...values, company_id: companyId });
      }

      setIsModalVisible(false);
      form.resetFields();
      fetchPermissions();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePermission = async (permissionId: number) => {
    try {
      await deletePermission(companyId, permissionId);
      fetchPermissions();
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    { title: "权限名称", dataIndex: "permission_name", key: "permission_name" },
    { title: "描述", dataIndex: "permission_desc", key: "permission_desc" },
    {
      title: "操作",
      key: "actions",
      render: (_: any, record: any) => (
        <>
          <Button type="link" onClick={() => handleEditPermission(record)}>
            编辑
          </Button>
          <Button type="link" onClick={() => handleDeletePermission(record.id)}>
            删除
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h1>权限管理</h1>
      <Button type="primary" onClick={handleCreatePermission}>
        创建权限
      </Button>
      <Table dataSource={permissions} columns={columns} />

      <Modal
        title={selectedPermission ? "编辑权限" : "创建权限"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} initialValues={selectedPermission} onFinish={handlePermissionSubmit}>
          <Form.Item
            name="permission_name"
            label="权限名称"
            rules={[{ required: true, message: "请输入权限名称" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="permission_desc"
            label="描述"
            rules={[{ required: true, message: "请输入描述" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {selectedPermission ? "更新" : "创建"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManagePermissionPage;
