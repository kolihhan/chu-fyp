import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table, Button, Modal, Form, Input } from "antd";
import { getBenefitsByCompany, addBenefit, updateBenefit, deleteBenefit } from "../../../../api";
import { useParams } from "react-router-dom";

const ManageBenefitsPage: React.FC = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const companyId = Number(id);

  const [benefits, setBenefits] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedBenefit, setSelectedBenefit] = useState<any | null>(null);

  useEffect(() => {
    fetchBenefits();
  }, []);

  const fetchBenefits = async () => {
    try {
      const response = await getBenefitsByCompany(companyId); 
      setBenefits(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addNewBenefit = async (values: any) => {
    values['company_id'] = companyId;
    
    try {
      await addBenefit(values);
      fetchBenefits();
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.log(error);
    }
  };

  const updateSelectedBenefit = async (values: any) => {
    try {
      await updateBenefit(selectedBenefit.id, values);
      fetchBenefits();
      setModalVisible(false);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteSelectedBenefit = async (benefitId: number) => {
    try {
      await deleteBenefit(benefitId);
      fetchBenefits();
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    { title: "Name", dataIndex: "benefit_name", key: "benefit_name" },
    { title: "Description", dataIndex: "benefit_desc", key: "benefit_desc" },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button onClick={() => deleteSelectedBenefit(record.id)}>Delete</Button>
        </>
      ),
    },
  ];

  const handleAdd = () => {
    setSelectedBenefit(null);
    setModalVisible(true);
  };

  const handleEdit = (record: any) => {
    setSelectedBenefit(record);
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  const handleModalSubmit = () => {
    form.validateFields().then((values) => {
      if (selectedBenefit) {
        updateSelectedBenefit(values);
      } else {
        addNewBenefit(values);
      }
    });
  };

  return (
    <div>
      <h1>Manage Benefits</h1>
      <Button onClick={handleAdd}>Add Benefit</Button>
      <Table dataSource={benefits} columns={columns} />

      <Modal
        visible={modalVisible}
        onCancel={handleModalCancel}
        onOk={handleModalSubmit}
        destroyOnClose
      >
        <Form form={form} initialValues={selectedBenefit}>
          <Form.Item name="benefit_name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="benefit_desc" label="Description" rules={[{ required: true }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageBenefitsPage;
