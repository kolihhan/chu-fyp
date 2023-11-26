import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table, Button, Modal, Form, Input, DatePicker, InputNumber, Row, Col, Select, Checkbox } from "antd";
import { getRecruitments, createRecruitment, deleteRecruitment, updateRecruitment, getEmployeePositions, closeRecruitment, getRecruitmentApplicationRecord, updateOfferStatusApi, getResume } from "../../../../api";
import { getCookie } from "../../../../utils";
import dayjs from 'dayjs';
import locale from 'antd/es/date-picker/locale/zh_CN';

const ManageRecruitmentPage: React.FC = () => {
  const { Option } = Select;
  const companyId = Number(getCookie('companyId'));
  const [recruitments, setRecruitments] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedRecruitment, setSelectedRecruitment] = useState<any | null>(null);
  const [jobNature, setJobNature] = useState<any | null>(null);
  const [availablePosition, setAvailablePosition] = useState<any[]>([]);
  const [isRecruitmentApplicantsModalVisible, setIsRecruitmentApplicantsModalVisible] = useState(false);
  const [recruitmentApplicants, setRecruitmentsApplicants] = useState<any[]>([]);
  const [isResumeModalVisible, setIsResumeModalVisible] = useState(false);
  const [resume, setResume] = useState<any>();
  const [resumeUserName, setResumeUserName] = useState<any>();

  useEffect(() => {
    document.title = "招聘管理";
    fetchRecruitments();
    fetchCompanyPosition();
    form.setFieldsValue({
      offered_at: dayjs(),
      start_at: dayjs(),
      close_at: dayjs(),
    })
  }, []);

  const fetchRecruitments = async () => {
    try {
      const response = await getRecruitments(companyId);
      setRecruitments(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCompanyPosition = async () => {
    try {
      const response = await getEmployeePositions(companyId);
      setAvailablePosition(response.data.data)
    }catch (error) {
      console.log(error)
    }
  };

  const handleCreateRecruitment = () => {
    setSelectedRecruitment(null);
    setIsModalVisible(true);
    setTimeout(() => {
      form.resetFields();
      form.setFieldsValue({
        offered_at: dayjs(),
        start_at: dayjs(),
        close_at: dayjs(),
      })
    })
  };

  const handleEditRecruitment = (recruitment: any) => {
    setSelectedRecruitment(recruitment);
    setIsModalVisible(true);
    setTimeout(() => {
      form.resetFields()
      form.setFieldsValue({
        companyEmployeePosition: recruitment.companyEmployeePosition.id,
        offered_at: dayjs(recruitment.offered_at),
        start_at: dayjs(recruitment.start_at),
        close_at: dayjs(recruitment.close_at),
      })
    }, 500)
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    form.setFieldsValue({
      offered_at: dayjs(),
      start_at: dayjs(),
      close_at: dayjs(),
    })
  };

  const handleRecruitmentSubmit = async (values: any) => {
    try {
      if (selectedRecruitment) {
        await updateRecruitment(companyId, selectedRecruitment.id, values);
      } else {
        await createRecruitment({ ...values, company_id: companyId });
      }
      setIsModalVisible(false);
      form.resetFields();
      form.setFieldsValue({
        offered_at: dayjs(),
        start_at: dayjs(),
        close_at: dayjs(),
      })
      fetchRecruitments();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseRecruitment = async (recruitmentId: number) => {
    try {
      await closeRecruitment(companyId, recruitmentId);
      fetchRecruitments();
    } catch (error) {
      console.log(error);
    }
  };
  
  const handleDeleteRecruitment = async (recruitmentId: number) => {
    try {
      await deleteRecruitment(companyId, recruitmentId);
      fetchRecruitments();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRecruitmentApplicantionRecord = async (recruitmentId: number) => {
    try {
      const response = await getRecruitmentApplicationRecord(recruitmentId);
      setRecruitmentsApplicants(response.data.data)
    } catch (error) {
      console.log(error);
    }
  };

  const handleManageApplicants = (recruitmentId: number) => {
    fetchRecruitmentApplicantionRecord(recruitmentId)
    setIsRecruitmentApplicantsModalVisible(true)
  }

  const handleCancelManageApplications = () => {
    setIsRecruitmentApplicantsModalVisible(false)
  }

  const handleCheckResume = async (resumeId: any, resumeUserName: any) => {
    setIsResumeModalVisible(true)
    const response = await getResume(resumeId)
    setResume(response.data.data)
    setResumeUserName(resumeUserName)
  }

  const handleCancelCheckResume = () => {
    setIsResumeModalVisible(false)
    setResume(null)
  }

  const handleOfferApplicants = async (applicantId: any) => {
    if(applicantId.status!="Accept"){
      try {
        await updateOfferStatusApi(applicantId.id, {status: 'Offering'});
        const updatedData = recruitmentApplicants.map((applicant) => {
          return applicant.id === applicantId.id ? { ...applicant, status:"Offering"} : applicant
        })
        setRecruitmentsApplicants(updatedData)
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleRejectApplicants = async (applicantId: any) => {
    if(applicantId.status!="Accept"){
      try {
        await updateOfferStatusApi(applicantId.id, {status: 'Reject'});
        const updatedData = recruitmentApplicants.map((applicant) => {
          return applicant.id === applicantId.id ? { ...applicant, status:"Reject"} : applicant
        })
        setRecruitmentsApplicants(updatedData)
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleContactApplicants = async (applicantId: any) => {
    if(applicantId.status!="Accept"){
      try {
        await updateOfferStatusApi(applicantId.id, {status: 'Interviewing'});
        const updatedData = recruitmentApplicants.map((applicant) => {
          return applicant.id === applicantId.id ? { ...applicant, status:"Interviewing"} : applicant
        })
        setRecruitmentsApplicants(updatedData)
      } catch (error) {
        console.log(error);
      }
    }
  };

  const columns = [
    { title: "標题", dataIndex: "title", key: "title" },
    { title: "職位", dataIndex: "companyEmployeePosition", key: "companyEmployeePosition",
      render:(_:any, rec:any) => (
        <span>{rec.companyEmployeePosition.position_name}</span>
      )
    },
    { title: "狀態", dataIndex: "companyEmployeePosition", key: "companyEmployeePosition",
      render:(_:any, rec:any) => (
        <span>
          {
            (dayjs(rec.close_at).isBefore(dayjs())) ? "關閉" : "招聘中"
          }
        </span>
      )
    },
    { title: "入職日期", dataIndex: "start_at", key: "start_at",
      render:(_:any, rec:any) => (
        <span>{dayjs(rec.start_at).format("YYYY-MM-DD")}</span>
      )
    },
    { title: "人數", dataIndex: "employee_need", key: "employee_need" },
    {
      title: "操作",
      key: "actions",
      render: (_: any, record: any) => (
        <>
          <Button type="link" onClick={() => handleEditRecruitment(record)}>
            编辑
          </Button>
          <Button type="link" onClick={() => handleCloseRecruitment(record.id)}>
            關閉
          </Button>
          <Button type="link" onClick={() => handleDeleteRecruitment(record.id)}>
            刪除
          </Button>
          <Button type="link" onClick={() => handleManageApplicants(record.id)}>
            應聘人員
          </Button>
        </>
      ),
    },
  ];

  const applicantsColumns = [
    { title: "名字", dataIndex: "user", key: "user",
      render: (_: any, record: any) => (
        <span>{record.user.name}</span>
      )
    },
    { title: "電郵", dataIndex: "user", key: "user" ,
      render: (_: any, record: any) => (
        <span>{record.user.email}</span>
      )
    },
    { title: "履歷", dataIndex: "userResume_id", key: "userResume_id" ,
      render: (_: any, record: any) => (
        <>
          <Button type="link" style={{paddingLeft:'0px'}}
            onClick={() => handleCheckResume(record.userResume_id, record.user.name)}>
              查看履歷
          </Button>
        </>
      )
    },
    { title: "狀態", dataIndex: "status", key: "status"},
    { title: "操作", key: "actions",
      render: (_: any, record: any) => (
        <>
          <Button type="link" onClick={() => handleOfferApplicants(record)}>
            Offer
          </Button>
          <Button type="link" onClick={() => handleRejectApplicants(record)}>
            Reject
          </Button>
          <Button type="link" onClick={() => handleContactApplicants(record)}>
            Contact
          </Button>
        </>
      ),
    },
  ];

  return (
  <div style={{ padding: '20px', margin: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
    <div style={{ background: '#f0f0f0', padding: '10px', borderBottom: '1px solid #ccc' }}>
      <h1>招聘職位</h1>
    </div>
      <div style={{ textAlign: 'right' }}>
        <Button type="primary" onClick={handleCreateRecruitment}>
          創建招聘職位
        </Button>
      </div>
      <Table dataSource={recruitments} columns={columns} />

      <Modal width='80%' bodyStyle={{maxHeight:'70vh', overflowY: 'auto'}}
        title={selectedRecruitment ? "編輯招聘職位" : "創建招聘職位"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null} >
        <Form form={form} initialValues={selectedRecruitment} onFinish={handleRecruitmentSubmit}
          labelAlign='left' labelCol={{ span: 2 }} wrapperCol={{ span:24 }} >
          <Form.Item
            name="title"
            label="招聘標題"
            rules={[{ required: true, message: "請輸入招聘標題" }]}>
            <Input placeholder="招聘標題"/>
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: "請輸入招聘描述" }]}>
            <Input.TextArea autoSize={{minRows:1, maxRows:6}} placeholder="描述工作內容" />
          </Form.Item>
          
          <Form.Item
            name="companyEmployeePosition"
            label="職位"
            rules={[{ required: true, message: "請輸入招聘職位" }]}>
            <Select placeholder="全職">
              {availablePosition.map((position) => (
                <Option value={position.id}>{position.position_name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="requirement"
            label="要求"
            rules={[{ required: true, message: "請輸入能力要求" }]}>
            <Input.TextArea autoSize={{minRows:1, maxRows:6}} placeholder="完成工作需要的基本能力" />
          </Form.Item>
          
          <Row>
            <Col span={12}>
              <Form.Item label="薪資" name="min_salary" rules={[{ required: true, message: "請輸入最低薪資" }]}
                labelAlign='left' labelCol={{ span: 4 }} wrapperCol={{ span:24 }}>
                <InputNumber style={{width:'100%'}} min={0} name="min_salary" placeholder="Min Salary" type="number"/>
              </Form.Item>
            </Col>
            <Col span={1} style={{textAlign:'center'}}> - </Col>
            <Col span={11}>
              <Form.Item name="max_salary" rules={[{ required: true, message: "請輸入最高薪資" }]}
                labelAlign='left' labelCol={{ span: 4 }} wrapperCol={{ span:24 }} >
                <InputNumber style={{width:'100%'}} min={0} placeholder="Max Salary" type="number"/>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="location"
            label="地點"
            rules={[{ required: true, message: "请輸入地點" }]}
          >
            <Input placeholder="公司/居家辦公" />
          </Form.Item>

          <Form.Item
            name="offered_at"
            label="入職日期"
            rules={[{ required: true, message: "請選擇入職日期" }]}>
            <DatePicker style={{width:'100%'}}/>
          </Form.Item>

          <Row>
            <Col span={12}>
              <Form.Item label="招聘期限" name="start_at" rules={[{ required: true, message: "請輸入招聘開始日期" }]}
                labelAlign='left' labelCol={{ span: 4 }} wrapperCol={{ span:24 }}>
                <DatePicker style={{width:'100%'}} />
              </Form.Item>
            </Col>
            <Col span={1} style={{textAlign:'center'}}> - </Col>
            <Col span={11}>
              <Form.Item name="close_at" rules={[{ required: true, message: "請輸入招聘結束日期" }]}
                labelAlign='left' labelCol={{ span: 4 }} wrapperCol={{ span:24 }} >
                <DatePicker style={{width:'100%'}} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="employee_need"
            label="招聘人數"
            rules={[{ required: true, message: "請輸入需要的員工人數" }]}
          >
            <InputNumber min={1} placeholder="1" />
          </Form.Item>

          <Form.Item
            name="job_category"
            label="職務類別">
            <Input placeholder="服務人員/開發人員/門市店員"/>
          </Form.Item>

          <Form.Item
            name="job_nature"
            label="工作性質">
            <Select value={jobNature} placeholder="全職">
              <Option value="全职">全職</Option>
              <Option value="兼职">兼職</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="buiness_trip"
            label="出差"
            valuePropName="checked" >
            <Checkbox>出差</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {selectedRecruitment ? "更新" : "創建"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal width='60%' bodyStyle={{maxHeight:'50vh', overflowY: 'auto'}}
        title="應聘人員管理"
        visible={isRecruitmentApplicantsModalVisible}
        onCancel={handleCancelManageApplications}
        footer={null}>
          <Table dataSource={recruitmentApplicants} columns={applicantsColumns} />
      </Modal>
      
      <Modal width='60%' bodyStyle={{maxHeight:'70vh', overflowY: 'auto'}}
        title={`${resumeUserName} 履歷`}
        visible={isResumeModalVisible}
        onCancel={handleCancelCheckResume}
        footer={null}>
          {resume?(
            <Form form={form} initialValues={resume} labelAlign="left" labelCol={{ span: 4 }} wrapperCol={{ span:24 }}>
              <Form.Item label="Title" name="title">
                <span>{resume.title}</span>
              </Form.Item>
              <Form.Item label="Summary" name="summary">
                <span>{resume.summary}</span>
              </Form.Item>
              <Form.Item label="Experience" name="experience">
                <span>{resume.experience}</span>
              </Form.Item>
              <Form.Item label="Education" name="education">
                <span>{resume.education}</span>
              </Form.Item>
              <Form.Item label="Skills" name="skills">
                <span>{resume.skills}</span>
              </Form.Item>
              <Form.Item label="Preferred Work" name="prefer_work">
                <span>{resume.prefer_work}</span>
              </Form.Item>
              <Form.Item label="Language" name="language">
                <span>{resume.language}</span>
              </Form.Item>
            </Form>
          ):(<></>)}
          
      </Modal>
    </div>
  );
};

export default ManageRecruitmentPage;
