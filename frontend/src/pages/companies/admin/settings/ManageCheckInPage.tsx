import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Table } from "antd";
import { getCheckInRules, getCheckInRecords } from "../../../../api";

const ManageCheckInPage: React.FC = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const companyId = Number(id);
  const [checkInRules, setCheckInRules] = useState<any[]>([]);
  const [checkInRecords, setCheckInRecords] = useState<any[]>([]);

  useEffect(() => {
    document.title = "打卡管理";
    fetchCheckInRules();
    fetchCheckInRecords();
  }, []);

  const fetchCheckInRules = async () => {
    try {
      const response = await getCheckInRules(companyId);
      setCheckInRules(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCheckInRecords = async () => {
    try {
      const response = await getCheckInRecords(companyId);
      setCheckInRecords(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const checkInRulesColumns = [
    { title: "Work Time Start", dataIndex: "work_time_start", key: "work_time_start" },
    { title: "Work Time End", dataIndex: "work_time_end", key: "work_time_end" },
    { title: "Late Tolerance", dataIndex: "late_tolerance", key: "late_tolerance" },
    // Add more columns as needed
  ];

  const checkInRecordsColumns = [
    { title: "Employee", dataIndex: "employee_name", key: "employee_name" },
    { title: "Check In Type", dataIndex: "type", key: "type" },
    { title: "Check In Time", dataIndex: "create_at", key: "create_at" },
    // Add more columns as needed
  ];

  return (
    <div>
      <h1>打卡管理</h1>

      <h2>打卡规则</h2>
      <Table dataSource={checkInRules} columns={checkInRulesColumns} />

      <h2>打卡记录</h2>
      <Table dataSource={checkInRecords} columns={checkInRecordsColumns} />
    </div>
  );
};

export default ManageCheckInPage;
