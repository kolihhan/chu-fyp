import { Card, Col, Row, Image, Button } from "antd"

interface RecruitmentItemProps {
    id: Number
    title: String
    desc: String
}

const RecruitmentItem: React.FC<RecruitmentItemProps> = ({id, title, desc}) => {

    const imageUrl = 'https://img.freepik.com/free-photo/red-white-cat-i-white-studio_155003-13189.jpg?w=2000'

    return (
        <div>
            <Card bodyStyle={{padding:'8px'}} style={{marginBottom:'4px'}}>
                <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                    <div>
                        <Row gutter={[4, 0]} style={{display:'flex', alignItems:'center'}}>
                            <Col>
                                <Row><Col style={{fontSize:'16px'}}><b>{title}</b></Col></Row>
                                <Row><Col>{desc}</Col></Row>
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