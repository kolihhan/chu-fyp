import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table, Button, Modal, Form, Input, DatePicker } from "antd";
import { getAnnouncementsByCompany, addAnnouncement, deleteAnnouncement, updateAnnouncement } from "../../../../api";
import { useParams } from "react-router-dom";
import { selectSelectedCompany, selectSelf } from "../../../../reducers/employeeReducers";

import dayjs from 'dayjs';

const ManageAnnouncementPage: React.FC = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const companyId = Number(sessionStorage.getItem('companyId'));

  const employeeId = useSelector(selectSelf);
  const employeeSelect = useSelector(selectSelectedCompany);

  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any | null>(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await getAnnouncementsByCompany(companyId);
      setAnnouncements(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addNewAnnouncement = async (values: any) => {
    values['company_id'] = companyId;
    values['companyEmployee_id'] = employeeId[employeeSelect].id;
    if(values['expire_at']){
      values['expire_at'] = dayjs(values['expire_at']);
    }
    try {
      await addAnnouncement(values);
      fetchAnnouncements();
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteSelectedAnnouncement = async (announcementId: number) => {
    try {
      await deleteAnnouncement(announcementId);
      fetchAnnouncements();
    } catch (error) {
      console.log(error);
    }
  };

  const updateSelectedAnnouncement = async (values: any) => {
    try {
      await updateAnnouncement(selectedAnnouncement.id, values);
      fetchAnnouncements();
      setModalVisible(false);
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    { title: "標題", dataIndex: "title", key: "title" },
    { title: "內容", dataIndex: "content", key: "content" },
    { title: "過期時間", key: "expire_at",
      render: (_: any, record: any) => (
        <span>{dayjs(record.expire_at).format("YYYY-MM-DD")}</span>
      ),

    },
    {
      title: "操作",
      key: "actions",
      render: (_: any, record: any) => (
        <>
          <Button onClick={() => handleEdit(record)}>編輯</Button>
          <Button onClick={() => deleteSelectedAnnouncement(record.id)}>刪除</Button>
        </>
      ),
    },
  ];

  const handleAdd = () => {
    setSelectedAnnouncement(null);
    setModalVisible(true);
  };

  const handleEdit = (record: any) => {
    record.expire_at = dayjs(record.expire_at).format("YYYY-MM-DD")
    setSelectedAnnouncement(record);
    form.setFieldsValue({
      expire_at: dayjs(record.expire_at)
    })
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    form.resetFields();
    form.setFieldsValue({
      expire_at: null
    })
  };

  const handleModalSubmit = () => {
    form.validateFields().then((values) => {
      if (selectedAnnouncement) {
        updateSelectedAnnouncement(values);
      } else {
        addNewAnnouncement(values);
      }
    });
  };

  return (
    <div>
      <h1>管理公告</h1>
      <Button onClick={handleAdd}>新增公告</Button>
      <Table dataSource={announcements} columns={columns} />

      <Modal
        visible={modalVisible}
        onCancel={handleModalCancel}
        onOk={handleModalSubmit}
        destroyOnClose
        title="發佈公告"
      >
        <Form form={form} initialValues={selectedAnnouncement}>
          <Form.Item name="title" label="標題" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="content" label="內容" rules={[{ required: true }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="expire_at" label="過期時間">
            <DatePicker />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageAnnouncementPage;
