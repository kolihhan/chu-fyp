import { useEffect, useState } from "react"
import { getCookie } from "../../../utils"
import { fireCompanyEmployee, getCompanyEmployees, resignCompanyEmployee, updateEmployeeSettings } from "../../../api"
import { Button, Descriptions, Form, Modal, Popconfirm, Select, Tag, message } from "antd"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../../app/store"
import { logout } from "../../../reducers/authReducers"

const EmployeeProfilePage: React.FC = () => {

    const userId = getCookie('userId')
    const employeeId = getCookie('employeeId')
    const role = getCookie("role")
    const [employeeData, setEmployeeData] = useState<any>(null)
    const [options, setOptions] = useState<any>([])
    const [editSkillsVisible, setEditSkillsVisible] = useState(false)
    const [form] = Form.useForm();
    const [resignLoading, setResignLoading] = useState(false)
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        if(employeeId!=null){
            getEmployeeData()
          }
    }, [])

    const getEmployeeData = async () => {
        const response = await getCompanyEmployees(employeeId)
        if(response.status==200){
            console.log(response.data)
            setEmployeeData(response.data)
        }
    }

    const handleEditSkills = (open: boolean) => {
        setEditSkillsVisible(open)
        if(open==true){
            form.setFieldsValue({
                'skills':employeeData.skills
            })
        }
    }

    const updateSkills = async() => {
        const updateData = {
            'skills':form.getFieldValue('skills')
        }
        const response = await updateEmployeeSettings(Number(employeeId), updateData);
        if(response.status==200){
            handleEditSkills(false)
            message.success('專長更新成功')
            employeeData.skills = form.getFieldValue('skills')
        }else{
            message.error('專長更新失敗，請稍後再嘗試')
        }
    }

    const resign = async () => {
        setResignLoading(true)
        try{
            const response = await resignCompanyEmployee(Number(employeeId))
            if(response.status==200){
                if(response.data.status=='success'){
                    message.success(response.data.message).then(()=>dispatch(logout()))
                }else{
                    message.error(response.data.message)
                }
            }
            setResignLoading(false)
        }catch(error){
            setResignLoading(false)
        }
    }

    return (
        <div className="container">
            <Descriptions column={1} bordered title={
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div>員工資料</div>
                    <div>
                        <Popconfirm
                            title="确定要離職吗？"
                            onConfirm={resign}
                            okButtonProps={{ loading:resignLoading}}
                            okText="确定"
                            cancelText="取消">
                                <Button danger style={{marginRight:'8px'}}>離職</Button>
                        </Popconfirm>
                        <Button type="primary" onClick={() => handleEditSkills(true)}>編輯</Button>
                    </div>
                </div>
            }>
                <Descriptions.Item label="賬號">{employeeData?.user_id.email}</Descriptions.Item>
                <Descriptions.Item label="公司">{employeeData?.company_id.name}</Descriptions.Item>
                <Descriptions.Item label="部門">
                    {employeeData?.companyEmployeePosition_id.companyDepartment_id.department_name}
                </Descriptions.Item>
                <Descriptions.Item label="薪資">{employeeData?.salary}</Descriptions.Item>
                <Descriptions.Item label="專長">
                    {
                        employeeData?.skills?.map((skills:any, index:any) => (
                            <Tag>{skills}</Tag>
                        ))
                    }
                </Descriptions.Item>
            </Descriptions>

            <Modal open={editSkillsVisible} 
                onOk={updateSkills} 
                onCancel={() => handleEditSkills(false)}
                footer={null}
                closable={false}
                title={
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                        <div>編輯專長</div>
                        <div>
                            <Button type="primary" onClick={updateSkills}>編輯</Button>
                        </div>
                    </div>
                }>
                <Form form={form}  initialValues={employeeData}>
                    <Form.Item name="skills">
                        <Select mode='tags'
                            options={options.filter((option: any) => option.option_name=="skill")}
                            tokenSeparators={[',', '，']} showSearch={false} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default EmployeeProfilePage