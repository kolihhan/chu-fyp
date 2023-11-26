import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table, Button, Modal, Form, Input } from "antd";
import { getBenefitsByCompany, addBenefit, updateBenefit, deleteBenefit } from "../../../../api";
import { useParams } from "react-router-dom";
import { getCookie } from "../../../../utils";

const ManageBenefitsPage: React.FC = () => {
  const companyId = Number(getCookie('companyId'));

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
      setBenefits(response.data.data);
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
    { title: "名稱", dataIndex: "benefit_name", key: "benefit_name" },
    { title: "描述", dataIndex: "benefit_desc", key: "benefit_desc" },
    {
      title: "操作",
      key: "actions",
      render: (_: any, record: any) => (
        <>
          <Button onClick={() => handleEdit(record)}>編輯</Button>
          <Button onClick={() => deleteSelectedBenefit(record.id)}>刪除</Button>
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
  <div style={{ padding: '20px', margin: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
    <div style={{ background: '#f0f0f0', padding: '10px', borderBottom: '1px solid #ccc' }}>
      <h1>福利管理</h1>
    </div>
    
    <div style={{ textAlign: 'right' }}>
      <Button onClick={handleAdd} type="primary" style={{ marginBottom: '16px' }}>
        新增福利
      </Button>
    </div>
    
    <Table
      dataSource={benefits}
      columns={columns}
      style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '5px', overflow: 'hidden' }}
    />

    <Modal
      visible={modalVisible}
      onCancel={handleModalCancel}
      onOk={handleModalSubmit}
      destroyOnClose
      title="編輯福利"
    >
      <Form form={form} initialValues={selectedBenefit} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Form.Item name="benefit_name" label="名稱" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="benefit_desc" label="描述" rules={[{ required: true }]}>
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  </div>
);
};


export default ManageBenefitsPage;
