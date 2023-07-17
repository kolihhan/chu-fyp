import { Card, Col, Row, Image, Button } from "antd"

interface RecruitmentItemProps {
    id: Number
    title: String
    desc: String
}

const RecruitmentItem: React.FC<RecruitmentItemProps> = ({id, title, desc}) => {
    return (
        <div>
            <Card bodyStyle={{padding:'8px'}} style={{marginBottom:'4px'}}>
                <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                    <div>
                        <Row gutter={[4, 0]}>
                            <Col>
                                <Row><Col style={{fontSize:'16px', maxHeight: '1.4em', overflow: 'hidden', textOverflow: 'ellipsis', marginRight:'8px'}}><b>{title}</b></Col></Row>
                                <Row><Col style={{ maxHeight: '1.4em', overflow: 'hidden', textOverflow: 'ellipsis', marginRight:'8px'}}>{desc}</Col></Row>
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

export default RecruitmentItem