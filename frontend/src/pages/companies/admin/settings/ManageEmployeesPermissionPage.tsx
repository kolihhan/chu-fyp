import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, Select, message } from "antd";
import {
  getBenefitsByCompany,
  getDepartments,
  getEmployeePositions,
  getEmployeePositionsByDepartment,
  getEmployeeSettings,
  getPermissions,
  getPositionById,
  updateEmployeeSettings,
} from "../../../../api";

const ManageEmployeesSettingPage: React.FC = () => {
  const { id, employee_id } = useParams<{ id: string | undefined; employee_id: string | undefined }>();
  const employeeId = Number(employee_id);
  const companyId = Number(id);
  const [employeeData, setEmployeeData] = useState<any>();
  const [availableDepartments, setAvailableDepartments] = useState<any[]>([]);
  const [availablePosition, setAvailablePosition] = useState<any[]>([]);
  const [availablePermissions, setAvailablePermissions] = useState<any[]>([]);
  const [availableBenefits, setAvailableBenefits] = useState<any[]>([]);
  const [form] = Form.useForm();
  const { Option } = Select;
  const navigate = useNavigate()
  const [isFirstFetchCmpPosition, setIsFirstFetchCmpPosition] = useState(true)

  useEffect(() => {
    document.title = "更改权限";
    fetchEmployeeSettings();
    fetchSettingOptions();
  }, []);
  
  useEffect(() => {
    fetchCompanyPosition(employeeData?.companyEmployeePosition_id.companyDepartment_id)
  }, [availableDepartments])

  const fetchSettingOptions = async () => {
    try {
      const response1 = await getDepartments(companyId);
      const response2 = await getPermissions(companyId);
      const response3 = await getBenefitsByCompany(companyId);
      setAvailableDepartments(response1.data.data);
      setAvailablePermissions(response2.data.data);
      setAvailableBenefits(response3.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchEmployeeSettings = async () => {
    try {
      const response = await getEmployeeSettings(employeeId);
      setEmployeeData(response.data.data);
      form.setFieldsValue(response.data.data);
      form.setFieldsValue({
        position_id: [response.data.data.companyEmployeePosition_id.id],
      })
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCompanyPosition = async (id: number) => {
    try {
      const response = await getEmployeePositionsByDepartment(id);
      setAvailablePosition(response.data.data)
      if (response.data.data[0]!==undefined){
        if(isFirstFetchCmpPosition){
          setIsFirstFetchCmpPosition(false)
        }else{
          form.setFieldsValue({
            position_id: [response.data.data[0]?.id],
          })
          fillPermissionAndBenefit(response.data.data[0].id)
        }
      }
    }catch (error) {
      console.log(error)
    }
  };

  const fillPermissionAndBenefit = async (values: any) =>{
    try {
      const response = await getPositionById(values);
      form.setFieldsValue({
        companyPermission_id: response.data.data.companyPermission_id,
        companyBenefits_id: response.data.data.companyBenefits_id,
      })
    } catch (error) {
      console.log(error);
    }
  }

  const handleUpdateSettings = async (values: any) => {
    try {
      const updateData = {
        "companyEmployeePosition_id":values[0]
      }
      const response = await updateEmployeeSettings(employeeId, updateData);
      if(response.status===200){
        message.success("員工職位更新成功")
        navigate(`/admin/company/${companyId}/employees`)
      }else{
        message.error("員工職位更新失敗，請重新嘗試")
      }
      await fetchEmployeeSettings();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div style={{display:'flex', alignItems:'center'}}>
        <h1>管理員工</h1>
        <h2> - {employeeData?.user_id.name}</h2>
      </div>
      {
        employeeData?(
          <Form form={form} onFinish={((value) => handleUpdateSettings(value.position_id))} initialValues={employeeData.companyEmployeePosition_id}>

            <Form.Item name="companyDepartment_id" label="部門" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
              <Select showSearch optionFilterProp="children" 
                filterOption={(input, option) =>
                  option?.props?.children?.toString()?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                onSelect={(value) => {
                  // form.setFieldsValue({
                  //   position_id: [],
                  //   companyPermission_id: [],
                  //   companyBenefits_id: [],
                  //   companyDepartment_id: value
                  // })
                  fetchCompanyPosition(value);
                }}>
                {availableDepartments?.map((department: any) => (
                  <Select.Option key={department.id} value={department.id}>
                    {department.department_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="position_id" label="職位" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
              <Select showSearch optionFilterProp="children" 
                filterOption={(input, option) =>
                  option?.props.children?.toString()?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                onSelect={(value) => { fillPermissionAndBenefit(value) }}>
                {
                  availablePosition?.map((position: any) => (
                    <Option key={position.id} value={position.id}>{position.position_name}</Option>
                  ))
                }
              </Select>
              
            </Form.Item>

            <Form.Item name="companyPermission_id" label="職位權限" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
              <Select open={false} style={{pointerEvents:'none'}} mode="multiple" showSearch optionFilterProp="children" filterOption={(input, option) =>
                option?.props?.children?.toString()?.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }>
                {availablePermissions.map((permission: any) => (
                  <Option key={permission.id} value={permission.id}>
                    {permission.permission_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="companyBenefits_id" label="職位福利" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
              <Select open={false} style={{pointerEvents:'none'}} mode="multiple" showSearch optionFilterProp="children" filterOption={(input, option) =>
                option?.props?.children?.toString()?.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }>
                {availableBenefits?.map((benefit: any) => (
                  <Option key={benefit.id} value={benefit.id}>
                    {benefit.benefit_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                更新設定
              </Button>
            </Form.Item>
          </Form>
        ):(
          <h1>Loading</h1>
        )
      }

      
    </div>
  );
};

export default ManageEmployeesSettingPage;