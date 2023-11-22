import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { acceptInvitation } from "../api"

const AcceptInvitePage: React.FC = () => {

    const navigate = useNavigate()
    const code = useParams<{ code: string }>();
    
    useEffect(() => {
        acceptLink()
    }, [])

    const acceptLink = async () => {
        const data = {
            'code':code.code
        }
        const response = await acceptInvitation(data);
        if(response.status==200){
            navigate('/')
        }
    }
    return (<></>)
}

export default AcceptInvitePage