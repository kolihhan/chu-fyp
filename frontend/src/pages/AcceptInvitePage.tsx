import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { acceptInvitation, getInvitation } from "../api"
import { Button, Descriptions } from "antd"

const AcceptInvitePage: React.FC = () => {

    const navigate = useNavigate()
    const code = useParams<{ code: string }>();
    const [invitation, setInvitation] = useState<any>()
    const [invitationMessage, setInvitationMessage] = useState<any>()
    const [invitationStatus, setInvitationStatus] = useState(0)
    const [inviteResponse, setInviteResponse] = useState<any>()
    const [isRejected, setIsRejected] = useState(false)
    
    useEffect(() => {
        showInvitation()
    }, [])

    useEffect(() => {
        if(invitation?.status=='Pending'){
            setInvitationStatus(0)
        }else if(invitation?.status=='Accept'){
            setInvitationStatus(1)
        }else if(invitation?.status=='Reject'){
            setInvitationStatus(2)
        }else if(invitation?.status=='Expire'){
            setInvitationStatus(3)
        }
    }, [invitation])

    const showInvitation = async () => {
        const response = await getInvitation(code.code!!)
        if(response.status==200){
            setInvitation(response.data.invitation)
            setInvitationMessage(response.data.message)
        }
    }

    const acceptLink = async (accept: Boolean) => {
        const data = {
            'code':code.code,
            'accept':accept
        }
        const response = await acceptInvitation(data);
        if(response.status==201 || response.status==200){
            setInviteResponse(response.data)
            setInvitation(response.data.invitation)
            setInvitationMessage(response.data.message)
        }else{}
    }
    
    const navigateLoginPage = () => {
        navigate('/login')
    }
    
    return (
        <div className="container">
            <Descriptions bordered title={
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div>邀請</div>
                    <div style={{display:invitationStatus==0?'block':'none'}}>
                        <Button danger onClick={()=>acceptLink(false)} style={{marginRight:'8px'}}>拒絕</Button>
                        <Button type="primary" onClick={()=>acceptLink(true)}>接受</Button>
                    </div>
                </div>
            }>
                <Descriptions.Item label="公司">{invitation?.company_id.name}</Descriptions.Item>
                <Descriptions.Item label="職位">{invitation?.position.position_name}</Descriptions.Item>
                <Descriptions.Item label="薪資">{invitation?.salary}</Descriptions.Item>
                <Descriptions.Item label="電郵">{invitation?.email}</Descriptions.Item>
                <Descriptions.Item label="狀態" span={2}>{invitationMessage}</Descriptions.Item>
            </Descriptions>

            <Descriptions bordered style={{marginTop:'16px', display:inviteResponse?.isNewUser===true?'block':'none'}}>
                <Descriptions.Item label="賬號" span={1.5}>{invitation?.company_id.name}</Descriptions.Item>
                <Descriptions.Item label="密碼" span={1.5}>{inviteResponse?.password}</Descriptions.Item>
                <Descriptions.Item label="登入">
                    <Button type="link"style={{ padding:'0px' }} onClick={navigateLoginPage}>http://localhost:3000/login</Button>
                </Descriptions.Item>
            </Descriptions>
        </div>
    )
}

export default AcceptInvitePage