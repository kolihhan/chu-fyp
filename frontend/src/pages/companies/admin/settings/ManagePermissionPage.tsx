import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table } from "antd";
import { getPermissions } from "../../../../api";

const ManagePermissionPage: React.FC = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const companyId = Number(id);
  const [permissions, setPermissions] = useState<any[]>([]);

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

  const columns = [
    { title: "权限名称", dataIndex: "permission_name", key: "permission_name" },
    { title: "描述", dataIndex: "permission_desc", key: "permission_desc" },
  ];

  return (
    <div>
      <h1>权限管理</h1>
      <Table dataSource={permissions} columns={columns} />
    </div>
  );
};

export default ManagePermissionPage;
