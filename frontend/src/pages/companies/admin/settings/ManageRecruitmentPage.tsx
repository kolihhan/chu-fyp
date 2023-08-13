import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table, Button, Modal, Form, Input, DatePicker, InputNumber, Row, Col, Select, Checkbox } from "antd";
import { getRecruitments, createRecruitment, deleteRecruitment, updateRecruitment, getEmployeePositions, closeRecruitment, getRecruitmentApplicationRecord, updateOfferStatusApi } from "../../../../api";
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

  const handleOfferApplicants = async (applicantId: number) => {
    try {
      await updateOfferStatusApi(applicantId, {status: 'Offering'});
      const updatedData = recruitmentApplicants.map((applicant) => {
        return applicant.id === applicantId ? { ...applicant, status:"Offering"} : applicant
      })
      setRecruitmentsApplicants(updatedData)
    } catch (error) {
      console.log(error);
    }
  };

  const handleRejectApplicants = async (applicantId: number) => {
    try {
      await updateOfferStatusApi(applicantId, {status: 'Reject'});
      const updatedData = recruitmentApplicants.map((applicant) => {
        return applicant.id === applicantId ? { ...applicant, status:"Reject"} : applicant
      })
      setRecruitmentsApplicants(updatedData)
    } catch (error) {
      console.log(error);
    }
  };

  const handleContactApplicants = async (applicantId: number) => {
    try {
      await updateOfferStatusApi(applicantId, {status: 'Interviewing'});
      const updatedData = recruitmentApplicants.map((applicant) => {
        return applicant.id === applicantId ? { ...applicant, status:"Interviewing"} : applicant
      })
      setRecruitmentsApplicants(updatedData)
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    { title: "标题", dataIndex: "title", key: "title" },
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
    { title: "入职日期", dataIndex: "start_at", key: "start_at",
      render:(_:any, rec:any) => (
        <span>{dayjs(rec.start_at).format("YYYY-MM-DD")}</span>
      )
    },
    { title: "人数", dataIndex: "employee_need", key: "employee_need" },
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
            删除
          </Button>
          <Button type="link" onClick={() => handleManageApplicants(record.id)}>
            應聘人員
          </Button>
        </>
      ),
    },
  ];

  const applicantsColumns = [
    { title: "名字", dataIndex: "user", key: "user" },
    { title: "電郵", dataIndex: "user", key: "user" },
    { title: "履歷", dataIndex: "userResume_id", key: "userResume_id" },
    { title: "狀態", dataIndex: "status", key: "status"},
    { title: "操作", key: "actions",
      render: (_: any, record: any) => (
        <>
          <Button type="link" onClick={() => handleOfferApplicants(record.id)}>
            Offer
          </Button>
          <Button type="link" onClick={() => handleRejectApplicants(record.id)}>
            Reject
          </Button>
          <Button type="link" onClick={() => handleContactApplicants(record.id)}>
            Contact
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h1>招聘管理</h1>
      <Button type="primary" onClick={handleCreateRecruitment}>
        创建招聘职位
      </Button>
      <Table dataSource={recruitments} columns={columns} />

      <Modal width='80%' bodyStyle={{maxHeight:'70vh', overflowY: 'auto'}}
        title={selectedRecruitment ? "编辑招聘职位" : "创建招聘职位"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null} >
        <Form form={form} initialValues={selectedRecruitment} onFinish={handleRecruitmentSubmit}
          labelAlign='left' labelCol={{ span: 2 }} wrapperCol={{ span:24 }} >
          <Form.Item
            name="title"
            label="招聘標題"
            rules={[{ required: true, message: "请输入招聘标题" }]}>
            <Input placeholder="招聘標題"/>
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: "请输入招聘描述" }]}>
            <Input.TextArea autoSize={{minRows:1, maxRows:6}} placeholder="描述工作内容" />
          </Form.Item>
          
          <Form.Item
            name="companyEmployeePosition"
            label="職位"
            rules={[{ required: true, message: "请输入招聘职位" }]}>
            <Select placeholder="全职">
              {availablePosition.map((position) => (
                <Option value={position.id}>{position.position_name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="requirement"
            label="要求"
            rules={[{ required: true, message: "请输入能力要求" }]}>
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
            rules={[{ required: true, message: "请输入地点" }]}
          >
            <Input placeholder="公司/居家辦公" />
          </Form.Item>

          <Form.Item
            name="offered_at"
            label="入職日期"
            rules={[{ required: true, message: "请选择入職日期" }]}>
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
            rules={[{ required: true, message: "请输入需要的员工人数" }]}
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
            <Select value={jobNature} placeholder="全职">
              <Option value="全职">全职</Option>
              <Option value="兼职">兼职</Option>
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
              {selectedRecruitment ? "更新" : "创建"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal width='80%' bodyStyle={{maxHeight:'70vh', overflowY: 'auto'}}
        title="應聘人員管理"
        visible={isRecruitmentApplicantsModalVisible}
        onCancel={handleCancelManageApplications}
        footer={null}>
          <Table dataSource={recruitmentApplicants} columns={applicantsColumns} />
        </Modal>
    </div>
  );
};

export default ManageRecruitmentPage;
