import { Button, Card, Form, Input, Space, message } from "antd"
import { resetUserPassword } from "../api"
import { useState } from "react"

const ResetPassword: React.FC = () => {
    const [form] = Form.useForm()
    const [isLoading, setIsLoading] = useState(false)
    const resetPassword = async (values: any) => {
        setIsLoading(true)
        const response = await resetUserPassword({'email':values.email})
        if(response.status==200){
            message.success('密碼重設成功，請檢查電郵')
        }else{
            message.error(response.data.message)
        }
        setIsLoading(false)
    }
return (
    <div className="container">
        <h1>重設密碼</h1>
        <Form form={form} onFinish={resetPassword}>
            <Form.Item name="email" label="電郵">
                <Input></Input>
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading}>確定</Button>
        </Form>
    </div>
)
}

export default ResetPassword