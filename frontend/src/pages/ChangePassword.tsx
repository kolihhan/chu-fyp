import { Button, Card, Form, Input, Space, message } from "antd"
import { changeUserPassword, resetUserPassword } from "../api"
import { useState } from "react"
import { getCookie } from "../utils"

const ChangePassword: React.FC = () => {
    const [form] = Form.useForm()
    const [isLoading, setIsLoading] = useState(false)
    const userId = Number(getCookie('userId'))
    const resetPassword = async (values: any) => {
        if(values.newPassword==values.confirmPassword){
            setIsLoading(true)
            try{
                const response = await changeUserPassword(userId, values)
                if(response.status==200){
                    message.success('密碼重設成功')
                }else{
                    message.error(response.data.message)
                }
            }catch(error){
                message.success('密碼重設失敗, 請稍後再嘗試')
            }
            setIsLoading(false)
        }else{
            message.error('新密碼與確認密碼不一致')
        }
    }
return (
    <div className="container">
        <h1>變更密碼</h1>
        <Form form={form} onFinish={resetPassword} layout='vertical'>
            <Form.Item name="oldPassword" label="舊密碼">
                <Input.Password></Input.Password>
            </Form.Item>
            <Form.Item name="newPassword" label="新密碼">
                <Input.Password></Input.Password>
            </Form.Item>
            <Form.Item name="confirmPassword" label="確認密碼">
                <Input.Password></Input.Password>
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading}>變更</Button>
        </Form>
    </div>
)
}

export default ChangePassword