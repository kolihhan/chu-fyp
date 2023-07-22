import { Card, Col, Image, Row } from "antd"
import { useEffect, useState } from "react"

interface CompanyHeaderProps{
    company: any
}

const CompanyHeader: React.FC<CompanyHeaderProps> = ({company}) => {
    
    const [imageUrl, setImageUrl] = useState("/image/empty.png")

    useEffect(() => {
        setImageUrl(company?.logo ? company.logo : "/image/empty.png")
    })

    return (
        <div>
        <Card className="companyHeader" bodyStyle={{padding:'0px', paddingLeft:'16px'}}
            title={ 
                <Row gutter={[16, 0]} style={{ display: "flex", alignItems: "center" }}>
                    <Col>
                        <Image src={imageUrl} style={{height: "120px", width:'120px'}}/> 
                    </Col>
                    <Col>
                        <Row gutter={[16, 0]}>
                            <Col><h1 style={{margin:'0px'}}>{company?.name}</h1></Col>
                        </Row>
                        <Row gutter={[16, 0]}>
                            <Col><h3 style={{margin:'0px'}}>{company?.company_desc}</h3></Col>
                        </Row>
                    </Col>
                </Row>
                }
            />
    
        </div>        
    )
}

export default CompanyHeader