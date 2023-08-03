import { useEffect, useState } from "react";
import { getCookie } from "../../../utils";
import { Button, Card, Col, Modal, Row, Table } from "antd";
import { createCheckInApi, getAnnouncementsByCompany, getCheckInRecord } from "../../../api";
import dayjs from 'dayjs';
import { Label } from "reactstrap";
import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../app/store";

const EmployeeHomePage: React.FC = () => {
    const companyId = Number(getCookie('companyId'))
    const employeeId = Number(getCookie('employeeId'))
    const dispatch: AppDispatch = useDispatch();
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null)
    const [checkInText, setCheckInText] = useState("签到")
    const [checkInStatus, setCheckInStatus] = useState(1)
    
    useEffect(() => {
        document.title = "公司首頁"
        fetchAnnouncements();
        checkIsCheckin()
    }, []);

    const fetchAnnouncements = async () => {
        try {
          const response = await getAnnouncementsByCompany(companyId);
          const announcementData = response.data.data.reverse().slice(0,3)
          setAnnouncements(announcementData);
        } catch (error) {
          console.log(error);
        }
    };

    const handleViewAnnouncement = (announcement: any) => {
        setModalVisible(true)
        setSelectedAnnouncement(announcement)
        console.log(announcement)
    }

    const handleModalCancel = () => {
        setModalVisible(false)
        setSelectedAnnouncement(null)
    }

    const columns = [
        { title: "標題", dataIndex: "title", key: "title" },
        { title: "內容", dataIndex: "content", key: "content" },
        { title: "過期時間", key: "expire_at",
          render: (_: any, record: any) => (
            <span style={{whiteSpace:'nowrap'}}>{dayjs(record.expire_at).format("YYYY-MM-DD")}</span>
          ),
    
        },
        {
          title: "操作",
          key: "actions",
          render: (_: any, announcement: any) => (
            <>
              <Button onClick={() => handleViewAnnouncement(announcement)}>查看</Button>
            </>
          ),
        },
      ];

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
        <div style={{padding:'16px'}}>
            <div style={{textAlign:'right'}}>
                <Button 
                    type="primary" 
                    onClick={handleButtonCheckIn}
                    style={{marginBottom:'16px', textAlign:'right'}}>
                        {checkInText}
                </Button>
            </div>
            <div>
                <Card>
                    <h3>最新公告</h3>
                    <Table dataSource={announcements} columns={columns} pagination={false}/>
                    <Modal
                        title="查看公告"
                        destroyOnClose
                        visible={modalVisible}
                        onOk={handleModalCancel}
                        onCancel={handleModalCancel}
                        // footer={null} 
                        cancelButtonProps={{style: {display:"none"}}} >
                            {
                                selectedAnnouncement?(
                                    <>
                                    <Row gutter={[16,16]} style={{alignItems:'center'}}>
                                        <Col span={4}>
                                            <Label>
                                                標題 : 
                                            </Label>
                                        </Col>
                                        <Col span={20}>
                                            <Label style={{border: "1px solid #ccc", borderRadius:'8px', padding:'4px', width:'100%'}}>
                                                {selectedAnnouncement.title}
                                            </Label>
                                        </Col>
                                    </Row>
                                    <br/>
                                    <Row gutter={[16,16]}>
                                        <Col span={4}>
                                            <Label style={{paddingTop:'4px'}}>
                                                内容 : 
                                            </Label>
                                        </Col>
                                        {/* <Col span={20}><Label><pre>{selectedAnnouncement.content}</pre></Label></Col> */}
                                        <Col span={20}>
                                            <Label style={{border: "1px solid #ccc", borderRadius:'8px', padding:'4px', width:'100%'}}>
                                                {selectedAnnouncement.content.split('\n').map((line: string, index: number) => (
                                                    <React.Fragment key={index}>
                                                        {line} <br />
                                                    </React.Fragment>
                                                ))}
                                            </Label>
                                        </Col>
                                    </Row>
                                    <br/>
                                    <Row gutter={[16,16]} style={{alignItems:'center'}}>
                                        <Col span={4}>
                                            <Label>
                                                過期時間 : 
                                            </Label>
                                        </Col>
                                        <Col span={20}>
                                            <Label style={{border: "1px solid #ccc", borderRadius:'8px', padding:'4px', width:'100%'}}>
                                            {selectedAnnouncement.expire_at?(
                                                dayjs(selectedAnnouncement.expire_at).format("YYYY-MM-DD")
                                            ):("-")}
                                            </Label>
                                        </Col>
                                    </Row>
                                    </>
                                ):(
                                    <></>
                                )

                                
                            }
                        
                    </Modal>
                </Card>
            </div>
        </div>
    )
};

export default EmployeeHomePage;