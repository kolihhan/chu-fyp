import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table, Button } from "antd";
import { getAnnouncementsByCompany } from "../../../../api";

const ManageAnnouncementPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await getAnnouncementsByCompany(); // Replace with actual API call
      setAnnouncements(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Content", dataIndex: "content", key: "content" },
    { title: "Actions", key: "actions", render: () => <Button>Edit</Button> },
  ];

  return (
    <div>
      <h1>Manage Announcements</h1>
      <Table dataSource={announcements} columns={columns} />
    </div>
  );
};

export default ManageAnnouncementPage;
