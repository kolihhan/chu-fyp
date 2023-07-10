import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table } from "antd";
import { getEmployeePositions } from "../../../../api";

const ManageEmployeesPositionPage: React.FC = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const employeeId = Number(id);
  const [employeePositions, setEmployeePositions] = useState<any[]>([]);

  useEffect(() => {
    document.title = "职位管理";
    fetchEmployeePositions();
  }, []);

  const fetchEmployeePositions = async () => {
    try {
      const response = await getEmployeePositions(employeeId);
      setEmployeePositions(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    { title: "职位名称", dataIndex: "position_name", key: "position_name" },
    { title: "部门", dataIndex: "department_name", key: "department_name" },
  ];

  return (
    <div>
      <h1>职位管理</h1>
      <Table dataSource={employeePositions} columns={columns} />
    </div>
  );
};

export default ManageEmployeesPositionPage;
