import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table, Switch, Button, Modal, Form, Input, Select } from "antd";
import {
  getBenefitsByCompany,
  getDepartments,
  getEmployeeSettings,
  getPermissions,
  updateEmployeeSettings,
} from "../../../../api";

const ManageEmployeesSettingPage: React.FC = () => {
  const { id, employee_id } = useParams<{ id: string | undefined; employee_id: string | undefined }>();
  const employeeId = Number(employee_id);
  const companyId = Number(id);
  const [employeePermissions, setEmployeePermissions] = useState<any[]>([]);
  const [availableDepartments, setAvailableDepartments] = useState<any[]>([]);
  const [availablePermissions, setAvailablePermissions] = useState<any[]>([]);
  const [availableBenefits, setAvailableBenefits] = useState<any[]>([]);
  const [form] = Form.useForm();

  const { Option } = Select;


  useEffect(() => {
    document.title = "更改权限";
    fetchEmployeeSettings();
    fetchSettingOptions();
  }, []);

  const fetchSettingOptions = async () => {
    try {
      const response1 = await getDepartments(companyId);
      const response2 = await getPermissions(companyId);
      const response3 = await getBenefitsByCompany(companyId);

      setAvailableDepartments(response1.data);
      setAvailablePermissions(response2.data);
      setAvailableBenefits(response3.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchEmployeeSettings = async () => {
    try {
      const response = await getEmployeeSettings(employeeId);
      setEmployeePermissions(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateSettings = async (values: any) => {
    try {
      await updateEmployeeSettings(employeeId, values);
      await fetchEmployeeSettings();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>更改員工設定</h1>

      <Form form={form} onFinish={handleUpdateSettings} initialValues={employeePermissions}>

        <Form.Item name="companyDepartment_id" label="公司部門">
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option?.props?.children?.toString()?.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {/* Display the available departments */}
            {availableDepartments.map((department: any) => (
              <Option key={department.id} value={department.id}>
                {department.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="companyPermission_id" label="公司權限">
          <Select mode="multiple" showSearch optionFilterProp="children" filterOption={(input, option) =>
            option?.props?.children?.toString()?.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }>
            {/* Display the available permissions */}
            {availablePermissions.map((permission: any) => (
              <Option key={permission.id} value={permission.id}>
                {permission.name}
              </Option>
            ))}
          </Select>
        </Form.Item>


        <Form.Item name="companyBenefits_id" label="公司福利">
          <Select mode="multiple" showSearch optionFilterProp="children" filterOption={(input, option) =>
            option?.props?.children?.toString()?.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }>
            {/* Display the available benefits */}
            {availableBenefits?.map((benefit: any) => (
              <Option key={benefit.id} value={benefit.id}>
                {benefit.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Submit button */}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            更新設定
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ManageEmployeesSettingPage;