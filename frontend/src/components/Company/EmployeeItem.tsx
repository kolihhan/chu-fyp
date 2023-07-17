import { Card, Col, Row, Image, Button } from "antd"

interface EmployeeItemProps {
    id: Number,
    name: String,
    position: String,
    avatarUrl: string,
}

const EmployeeItem: React.FC<any> = ({employee}) => {

    const imageUrl = employee.user_id.avatar_url?employee.user_id.avatar_url:'https://img.freepik.com/free-photo/red-white-cat-i-white-studio_155003-13189.jpg?w=2000'
    
    return (
        <div>
            <Card bodyStyle={{padding:'8px'}} style={{marginBottom:'4px'}}>
                <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                    <div>
                        <Row gutter={[4, 0]} style={{display:'flex', alignItems:'center'}}>
                            <Col><Image src={imageUrl} style={{height:'50px', width:'50px'}}/></Col>
                            <Col>
                                <Row><Col style={{ maxHeight: '1.4em', overflow: 'hidden', textOverflow: 'ellipsis', marginRight:'8px'}}>{employee.user_id.name}</Col></Row>
                                <Row><Col style={{ maxHeight: '1.4em', overflow: 'hidden', textOverflow: 'ellipsis', marginRight:'8px'}}>{employee.companyEmployeePosition_id.position_name}</Col></Row>
                            </Col>
                        </Row>
                    </div>
                    <div>
                        <Button type="primary">查看</Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default EmployeeItem