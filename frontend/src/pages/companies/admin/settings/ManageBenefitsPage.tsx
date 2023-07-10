import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table, Button } from "antd";
import { getBenefitsByCompany } from "../../../../api";

const ManageBenefitsPage: React.FC = () => {
  const [benefits, setBenefits] = useState<any[]>([]);

  useEffect(() => {
    fetchBenefits();
  }, []);

  const fetchBenefits = async () => {
    try {
      const response = await getBenefitsByCompany(); // Replace with actual API call
      setBenefits(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    { title: "Name", dataIndex: "benefit_name", key: "benefit_name" },
    { title: "Description", dataIndex: "benefit_desc", key: "benefit_desc" },
    { title: "Actions", key: "actions", render: () => <Button>Edit</Button> },
  ];

  return (
    <div>
      <h1>Manage Benefits</h1>
      <Table dataSource={benefits} columns={columns} />
    </div>
  );
};

export default ManageBenefitsPage;
