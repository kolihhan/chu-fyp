import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Table, Button, Modal, Form, TimePicker, Input, Space } from "antd";
import { getCheckInRules, getCheckInRecords, addCheckInRule, updateCheckInRule, deleteCheckInRule } from "../../../../api";
import dayjs from "dayjs";

const ManageCheckInPage: React.FC = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const companyId = Number(id);
  const [checkInRules, setCheckInRules] = useState<any[]>([]);
  const [checkInRecords, setCheckInRecords] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedCheckInRule, setSelectedCheckInRule] = useState<any | null>(null);

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

  const addNewCheckInRule = async (values: any) => {
    try {
      await addCheckInRule({ ...values, company_id: companyId });
      fetchCheckInRules();
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.log(error);
    }
  };

  const updateSelectedCheckInRule = async (values: any) => {
    try {
      await updateCheckInRule(selectedCheckInRule.id, values);
      fetchCheckInRules();
      setModalVisible(false);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteSelectedCheckInRule = async (checkInRuleId: number) => {
    try {
      await deleteCheckInRule(checkInRuleId);
      fetchCheckInRules();
    } catch (error) {
      console.log(error);
    }
  };

  const checkInRulesColumns = [
    { title: "Work Time Start", dataIndex: "work_time_start", key: "work_time_start" },
    { title: "Work Time End", dataIndex: "work_time_end", key: "work_time_end" },
    { title: "Late Tolerance", dataIndex: "late_tolerance", key: "late_tolerance" },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button onClick={() => deleteSelectedCheckInRule(record.id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setSelectedCheckInRule(null);
    setModalVisible(true);
  };

  const handleEdit = (record: any) => {
    setSelectedCheckInRule(record);
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  const handleModalSubmit = () => {
    form.validateFields().then((values) => {
      const startTime = dayjs(values.work_time_start).format("HH:mm:ss");
      const endTime = dayjs(values.work_time_end).format("HH:mm:ss");
      const lateTolerance = dayjs(values.late_tolerance).diff(dayjs().startOf('day'), 'millisecond');
      values.work_time_start = startTime;
      values.work_time_end = endTime;
      values.late_tolerance = lateTolerance;
      if (selectedCheckInRule) {
        updateSelectedCheckInRule(values);
      } else {
        addNewCheckInRule(values);
      }
    });
  };

  return (
    <div>
      <h1>打卡管理</h1>

      <h2>打卡规则</h2>
      <Button onClick={handleAdd}>Add Rule</Button>
      <Table dataSource={checkInRules} columns={checkInRulesColumns} />

      <Modal
        visible={modalVisible}
        onCancel={handleModalCancel}
        onOk={handleModalSubmit}
        destroyOnClose
      >
        <Form form={form} initialValues={selectedCheckInRule}>
          <Form.Item name="work_time_start" label="Work Time Start" rules={[{ required: true }]}>
            <TimePicker format="HH:mm:ss" />
          </Form.Item>
          <Form.Item name="work_time_end" label="Work Time End" rules={[{ required: true }]}>
            <TimePicker format="HH:mm:ss" />
          </Form.Item>
          <Form.Item name="late_tolerance" label="Late Tolerance" rules={[{ required: true }]}>
            <TimePicker format="HH:mm:ss" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageCheckInPage;
