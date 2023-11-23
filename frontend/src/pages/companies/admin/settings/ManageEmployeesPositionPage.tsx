import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table, Button, Modal, Form, Input, Select } from "antd";
import { getEmployeePositions, createPosition, updatePosition, deletePosition, getDepartments } from "../../../../api";
import { getCookie } from "../../../../utils";

const ManageEmployeesPositionPage: React.FC = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const companyId = Number(getCookie('companyId'));
  const [employeePositions, setEmployeePositions] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedPosition, setSelectedPosition] = useState<any | null>(null);
  const [availableDepartments, setAvailableDepartments] = useState<any[]>([]);

  useEffect(() => {
    document.title = "职位管理";
    fetchEmployeePositions();
    fetchDepartment();
  }, []);

  const fetchEmployeePositions = async () => {
    try {
      const response = await getEmployeePositions(companyId);
      console.log(response.data.data)
      response.data.data.forEach((item: any) => {
        const department_name = item?.companyDepartment_id?.department_name || '';
        item['department_name'] = department_name;
        item['companyDepartment_id'] = item?.companyDepartment_id?.id;

      })
      setEmployeePositions(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreatePosition = async (values: any) => {
    try {
      const response = await createPosition({ ...values, company_id: companyId });
      // setEmployeePositions([...employeePositions, response.data.data]);
      fetchEmployeePositions();
      setIsModalVisible(false);
      form.resetFields();
      setSelectedPosition(null)
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditPosition = (position: any) => {
    setSelectedPosition(position);
    setIsModalVisible(true);
    form.setFieldsValue(position);
  };

  const fetchDepartment = async () => {
    const response = await getDepartments(companyId);
    setAvailableDepartments(response.data.data);
  }

  const handleUpdatePosition = async (values: any) => {
    try {
      const response =  await updatePosition(companyId, selectedPosition.id, values);
      // const updatedPositions = employeePositions.map((position) =>
      //   position.id === selectedPosition.id ? response.data.data : position
      // );
      // setEmployeePositions(updatedPositions);
      fetchEmployeePositions();
      setIsModalVisible(false);
      form.resetFields();
      setSelectedPosition(null)
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePosition = async (positionId: number) => {
    try {
      await deletePosition(companyId, positionId);
      setEmployeePositions(employeePositions.filter((position) => position.id !== positionId));
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    { title: "職位名稱", dataIndex: "position_name", key: "position_name" },
    { title: "部門", dataIndex: "department_name", key: "department_name" },
    {
      title: "操作",
      key: "actions",
      render: (_: any, record: any) => (
        <>
          <Button type="link" onClick={() => handleEditPosition(record)}>
            编辑
          </Button>
          <Button type="link" onClick={() => handleDeletePosition(record.id)}>
            删除
          </Button>
        </>
      ),
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <div>
      <h1>職位管理</h1>

      <div style={{ marginBottom: '16px', textAlign: 'right' }}>
        <Button type="primary" onClick={showModal}>
          創建職位
        </Button>
      </div>

      <Table dataSource={employeePositions} columns={columns} />

      <Modal
        title={selectedPosition ? '編輯職位' : '創建職位'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={selectedPosition ? handleUpdatePosition : handleCreatePosition} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
          <Form.Item
            name="position_name"
            label="職位名稱"
            rules={[{ required: true, message: '請輸入職位名稱' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="companyDepartment_id"
            label="部門"
            rules={[{ required: true, message: '請選擇部門' }]}
          >
            <Select
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option?.props?.children?.toString()?.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {availableDepartments?.map((department: any) => (
                <Select.Option key={department.id} value={department.id}>
                  {department.department_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Button type="primary" htmlType="submit">
              {selectedPosition ? '更新' : '創建'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};


export default ManageEmployeesPositionPage;
