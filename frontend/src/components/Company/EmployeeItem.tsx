import { Card, Col, Row, Image, Button, Modal } from "antd"
import { useEffect, useState } from "react"

interface EmployeeItemProps {
    id: Number,
    name: String,
    position: String,
    avatarUrl: string,
}

const EmployeeItem: React.FC<any> = ({employee}) => {

    const imageUrl = employee.user_id.avatar_url?employee.user_id.avatar_url:'https://img.freepik.com/free-photo/red-white-cat-i-white-studio_155003-13189.jpg?w=2000'
    const [modalVisible, setModalVisible] = useState(false)
    
    const checkEmployee = () => {
        setModalVisible(true)
    }
    const closeCheck = () => {
        setModalVisible(false)
    }

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
                        <Button type="primary" onClick={checkEmployee}>查看</Button>
                    </div>
                </div>
            </Card>

            <Modal
                title={employee.user_id.name}
                open={modalVisible}
                onOk={closeCheck}
                onCancel={closeCheck}
                footer={<div><Button type="primary" onClick={closeCheck}>OK</Button></div>}>
                <Row gutter={[4, 0]} >
                    <Col><Image src={imageUrl} style={{height:'100px', width:'100px'}}/></Col>
                    <Col  style={{ display: 'flex', flexDirection: 'column', justifyContent:'space-between' }}>
                        <Row>
                            <Col>職位：</Col>
                            <Col>{employee.companyEmployeePosition_id.position_name}</Col>
                        </Row>
                        <Row>
                            <Col>部門：</Col>
                            <Col>{employee.companyEmployeePosition_id.companyDepartment_id.department_name}</Col>
                        </Row>
                        <Row>
                            <Col>電郵：</Col>
                            <Col>{employee.user_id.email}</Col>
                        </Row>
                    </Col>
                </Row>
            </Modal>
        </div>
    )
}

export default EmployeeItem