import { Button, Card, Col, Image, Row } from "antd"
import { useEffect, useState } from "react"
import { getCookie } from "../../utils"
import { createCheckInApi, getCheckInRecord } from "../../api"

interface CompanyHeaderProps{
    company: any
    checkInButton?: Boolean
}

const CompanyHeader: React.FC<CompanyHeaderProps> = ({company, checkInButton=false}) => {
    const companyId = Number(getCookie('companyId'))
    const employeeId = Number(getCookie('employeeId'))
    const [checkInText, setCheckInText] = useState("签到")
    const [checkInStatus, setCheckInStatus] = useState(1)
    const [imageUrl, setImageUrl] = useState("/image/empty.png")

    useEffect(() => {
        setImageUrl(company?.logo ? company.logo : "/image/empty.png")
        checkIsCheckin();
    })

    const handleCheckIn = async () => {
        const response = await createCheckInApi(employeeId,"Check In")
        if(response.status==201){
            checkIsCheckin()
        }else{
            // prompt error
        }
    };

    const handleCheckOut = async () => {
        const response = await createCheckInApi(employeeId,"Check Out");
        if(response.status==201){
            checkIsCheckin()
        }else{
            // prompt error
        }
    };

    const handleButtonCheckIn = () => {
        if(checkInStatus===1){
            handleCheckIn()
        }else if(checkInStatus===2){
            handleCheckOut()
        }else {
            //handleCheckOutAlready
        }
    }

    const checkIsCheckin = async () => {
        const checkInResponse = await getCheckInRecord(employeeId);
        if(checkInResponse.data.status===1){
            setCheckInStatus(1)
            setCheckInText("签到")
        }else if(checkInResponse.data.status===2){
            setCheckInStatus(2)
            setCheckInText("签出")
        }else {
            setCheckInStatus(3)
            setCheckInText("已签出")
        }
    }

    return (
        <div>
        <Card className="companyHeader" bodyStyle={{padding:'0px'}}
            title={ 
                <Row gutter={[16, 0]} style={{ display: "flex", alignItems: "center", padding:'16px', paddingLeft:'0px', paddingRight:'0px' }}>
                    <Col>
                        <Image src={imageUrl} style={{height: "120px", width:'120px'}}/> 
                    </Col>
                    <Col flex="auto">
                        <Row gutter={[16, 0]}>
                            <Col><h1 style={{margin:'0px'}}>{company?.name}</h1></Col>
                        </Row>
                        <Row gutter={[16, 0]}>
                            <Col><h3 style={{margin:'0px'}}>{company?.company_desc}</h3></Col>
                        </Row>
                    </Col>
                    <Col>
                        {checkInButton==true?(
                            <Button 
                                type="primary" 
                                onClick={handleButtonCheckIn}
                                style={{textAlign:'right'}}>
                                    {checkInText}
                            </Button>
                        ):(<></>)}
                    </Col>
                </Row>
                }
            />
    
        </div>        
    )
}

export default CompanyHeader