import { useEffect, useState } from "react";
import { getCookie } from "../../../utils";
import { Button, Card, Col, Modal, Row, Table } from "antd";
import { createCheckInApi, getAnnouncementsByCompany, getCheckInRecord, getCompanyById } from "../../../api";
import dayjs from 'dayjs';
import { Label } from "reactstrap";
import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../app/store";
import CompanyHeader from "../../../components/Company/CompanyHeader";
import { CompanyInfo } from "../admin/CompanyDetailPage";
import EmployeeItem from "../../../components/Company/EmployeeItem";
import EmptyComponent from "../../../components/EmptyComponent";

const EmployeeHomePage: React.FC = () => {
    const companyId = Number(getCookie('companyId'))
    const employeeId = Number(getCookie('employeeId'))
    const dispatch: AppDispatch = useDispatch();
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null)
    const [company, setCompany] = useState<any>();
    const [companyEmployees, setCompanyEmployees] = useState([])
    
    useEffect(() => {
        document.title = "公司首頁"
        fetchAnnouncements();
        fetchCompany();
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

    const fetchCompany = async () => {
        try {
          const response = await getCompanyById(companyId);
          setCompany(response.data.data.company);
          const aa:any = [
            ...response.data.data.employees,
          ]
          setCompanyEmployees(aa)
        //   setCompanyRecruitments(response.data.data.recruitments)
        } catch (error) {
          console.log(error);
        }
      };
    return (
        <div style={{ paddingLeft:'10%', paddingRight:'10%', paddingTop: '16px', backgroundColor: "#F4F4F4" }}>
            
            <CompanyHeader company={company} checkInButton={true} />

            <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", marginTop:'8px' }}>
                <div style={{ flex: 7, background:"transparent", padding: "0px", display:'flex', flexDirection:'column', height: 'calc(100vh - 250px)', marginRight:'8px' }} >
                    <Card id="cmpAnnouncements" 
                        style={{flex:'auto', overflowY: "auto"}}
                        bodyStyle={{ backgroundColor: "white", paddingTop: "0px", overflowY: "auto" }}
                        title={<h2 style={{ margin: "0px" }}>最新公告</h2>} >
                        <Table dataSource={announcements} columns={columns} pagination={false}/>
                        <Modal
                            title="查看公告"
                            destroyOnClose
                            visible={modalVisible}
                            onOk={handleModalCancel}
                            onCancel={handleModalCancel}
                            // footer={null} 
                            cancelButtonProps={{style: {display:"none"}}} >
                                {selectedAnnouncement?(
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
                                </>):(<></>)}
                            
                        </Modal>
                    </Card>
                    <Card id="cmpDetails"
                        style={{ marginTop: "8px", flex:'none' }}
                        bodyStyle={{ backgroundColor: "white", paddingTop: "0px" }}
                        title={<h2 style={{ margin: "0px" }}>公司信息</h2>} >
                        <CompanyInfo company={company}/>
                    </Card>
                </div>

                <div style={{ flex: 3, padding: "0px", display:'flex', flexDirection:'column', height: 'calc(100vh - 250px)' }} >
                    <Card id="cmpDetailEmployees"
                        style={{flex:'1', overflowY: "auto"}}
                        bodyStyle={{ backgroundColor: "white", paddingTop: "0px", overflowY: "auto" }}
                        title={<h2 style={{ margin: "0px" }}>員工列表</h2>} >
                        {
                        companyEmployees ? (
                            companyEmployees.length > 0 ? (
                            companyEmployees?.map((employee: any) => (
                                <EmployeeItem key={employee.id} id={employee.id} employee={employee} />
                            ))
                            ):( <EmptyComponent /> )
                        ):( <EmptyComponent /> )
                        }
                    </Card>
                </div>

            </div>
        </div>
    )
};

export default EmployeeHomePage;