import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table, Switch } from "antd";
import { getEmployeePermissions, updateEmployeePermission } from "../../../../api";

const ManageEmployeesPermissionPage: React.FC = () => {
  const { id,employee_id } = useParams<{ id: string | undefined , employee_id: string | undefined }>();
  const employeeId = Number(employee_id);
  const [employeePermissions, setEmployeePermissions] = useState<any[]>([]);

  useEffect(() => {
    document.title = "更改权限";
    fetchEmployeePermissions();
  }, []);

  const fetchEmployeePermissions = async () => {
    try {
      const response = await getEmployeePermissions(employeeId);
      setEmployeePermissions(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePermissionChange = async (permissionId: number, checked: boolean) => {
    try {
      await updateEmployeePermission(employeeId, permissionId, checked);
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    { title: "权限名称", dataIndex: "permission_name", key: "permission_name" },
    { title: "描述", dataIndex: "permission_desc", key: "permission_desc" },
    {
      title: "开启",
      key: "switch",
      render: (_: any, record: any) => (
        <Switch
          checked={record.enabled}
          onChange={(checked) => handlePermissionChange(record.id, checked)}
        />
      ),
    },
  ];

  return (
    <div>
      <h1>更改权限</h1>
      <Table dataSource={employeePermissions} columns={columns} />
    </div>
  );
};

export default ManageEmployeesPermissionPage;
