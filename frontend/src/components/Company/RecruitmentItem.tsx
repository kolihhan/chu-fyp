import { Card, Col, Row, Image, Button, Modal } from "antd"
import { useEffect, useState } from "react"

interface RecruitmentItemProps {
    id: Number
    title: String
    desc: String
}

const RecruitmentItem: React.FC<any> = ({recruitmentItem}) => {

    const [modalVisible, setModalVisible] = useState(false)
    
    const checkRecruitment = () => {
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
                        <Row gutter={[4, 0]}>
                            <Col>
                                <Row><Col style={{fontSize:'16px', maxHeight: '1.4em', overflow: 'hidden', textOverflow: 'ellipsis', marginRight:'8px'}}><b>{recruitmentItem.title}</b></Col></Row>
                                <Row><Col style={{ maxHeight: '1.4em', overflow: 'hidden', textOverflow: 'ellipsis', marginRight:'8px'}}>{recruitmentItem.description}</Col></Row>
                            </Col>
                        </Row>
                    </div>
                    <div>
                        <Button type="primary" onClick={checkRecruitment}>查看</Button>
                    </div>
                </div>
            </Card>

            <Modal
                title={recruitmentItem.title}
                open={modalVisible}
                onOk={closeCheck}
                onCancel={closeCheck}
                footer={<div><Button type="primary" onClick={closeCheck}>OK</Button></div>}>
                <Row gutter={[4, 0]} >
                    <Col  style={{ display: 'flex', flexDirection: 'column', justifyContent:'space-between' }}>
                        <Row>
                            <Col>職位：</Col>
                            <Col>{recruitmentItem.companyEmployeePosition.position_name}</Col>
                        </Row>
                        <Row>
                            <Col>描述：</Col>
                            <Col>{recruitmentItem.description}</Col>
                        </Row>
                        <Row>
                            <Col>要求：</Col>
                            <Col>{recruitmentItem.requirement}</Col>
                        </Row>
                        <Row>
                            <Col>薪資：</Col>
                            <Col>{recruitmentItem.min_salary}</Col>
                            <Col> - </Col>
                            <Col>{recruitmentItem.max_salary}</Col>
                        </Row>
                    </Col>
                </Row>
            </Modal>
        </div>
    )
}

export default RecruitmentItem