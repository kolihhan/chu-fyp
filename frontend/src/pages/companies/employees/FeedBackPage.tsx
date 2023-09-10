import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Modal, Table, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { createFeedback, selectSelectedCompany, selectSelf } from '../../../reducers/employeeReducers';

import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from '@reduxjs/toolkit';

import { createFeedbackApi, getAllEmployees, getAllEmployeesFeedbackFrom, getAllEmployeesFeedbackTo, getFeedbackScore } from '../../../api';
import { getCookie } from '../../../utils';

import {Chart} from 'react-google-charts';

const { Option } = Select;

const FeedBackPage: React.FC = () => {
  const [form] = Form.useForm();

  type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;
  const dispatch: AppDispatch = useDispatch();

  const [companyEmployees, setCompanyEmployees] = useState<any[]>([]);
  const employeeSelect = useSelector(selectSelectedCompany);
  const companyId = getCookie('companyId')
  const employeeId = Number(getCookie('employeeId'))
  const [modalVisible, setModalVisible] = useState(false)
  const [feedbackFrom, setFeedbackFrom] = useState<any>()
  const [feedbackTo, setFeedbackTo] = useState<any>()
  const [viewFeedbackModalVisible, setViewFeedbackModalVisible] = useState(false)
  const [pieChartData, setPieChartData] = useState<any>([["Remarks", "Count"]])
  const [pieChartOptions, setPieChartOptions] = useState<any>()
  const [feedbackScore, setFeedbackScore] = useState("計算中...")
  const textNothing = '.'
  const feedbackOption = ['積極解決問題', '提升業績', '創造公司利潤', '無私地捐獻資源給公司', '高效率完成工作', '準時達成工作目標', '提前完成工作任務', '細心處理工作', '積極態度', '關心同事', '充分滿足客戶需求', '勤奮工作', '負責任處理工作', '承擔錯誤和負責任', '良好的團隊合作精神', '尊重公司機密和保密政策', '主動學習和成長', '創新和提出改進建議', '善於溝通和協作', '尊重多樣性和包容性', '頻繁發生問題', '導致公司損失', '損害公司財產', '工作效率不足', '未達工作目標', '未能按時完成工作任務', '經常出現錯誤或粗心大意', '缺乏團隊合作精神', '消極態度', '辱罵同事', '忽略客戶需求和反饋', '不遵守公司政策和程序', '拖延或敷衍工作', '逃避責任或找借口', '經常與同事發生衝突或矛盾', '違反公司的機密和保密政策', '忽略專業發展和學習', '不積極尋求改進和創新', '缺乏有效溝通和團隊協作', '不尊重多樣性和缺乏包容性']

  useEffect(() => {
    fetchCompanyEmployees();
    fetchFeedbackData()
  }, []);


  const onFinish = async (values: any) => {

    values['company_id'] = companyId;
    values['companyEmployee_id'] = employeeId;

    // dispatch(createFeedback(values));
    const response = await createFeedbackApi(values);
    if(response.status == 200){
      message.success('評價成功！');
      form.resetFields();
      closeFeedbackModal()
      fetchFeedbackData()
    }
  };

  const fetchCompanyEmployees = async () => {
    try {
      const response = await getAllEmployees(companyId);
      setCompanyEmployees(response.data.filter((item: any) => item.id!==employeeId));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchFeedbackData = async () => {
    const responseTo = await getAllEmployeesFeedbackTo(employeeId)
    const responseFrom = await getAllEmployeesFeedbackFrom(employeeId)
    if(responseTo.data.data.length==0 && responseFrom.data.data.length==0){}
    else{
      let lengthTo = responseTo.data.data.length % 10
      if(lengthTo!=0 || responseTo.data.data.length==0){
        for (let i=0; i< 10-lengthTo; i++){
          responseTo.data.data.push({
            feedback_to:{id: 0, user_id: {name:''}},
            companyEmployee_id:{id: 0, user_id: {name:''}},
            remarks: textNothing,
          })
        }
      }
      let lengthFrom = responseFrom.data.data.length % 10
      if(lengthFrom!=0 || responseFrom.data.data.length==0){
        for (let i=0; i< 10-lengthFrom; i++){
            responseFrom.data.data.push({
              feedback_to:{id: 0, user_id: {name:''}},
              companyEmployee_id:{id: 0, user_id: {name:''}},
              remarks: textNothing,
          })
        }
      }
    }
    setFeedbackFrom(responseTo.data.data)
    setFeedbackTo(responseFrom.data.data)
    setChart()
  }

  const openFeedbackModal = () => {
    setModalVisible(true)
  }
  const closeFeedbackModal = () => {
    setModalVisible(false)
  }

  const openViewFeedbackModal = () => {
    setViewFeedbackModalVisible(true)
    calFeedbackScore()
    setChart()
  }
  
  const closeViewFeedbackModal = () => {
    setViewFeedbackModalVisible(false)
  }

  const columnsFrom = [
    {title: '員工', key:'name', dataIndex:'', 
      render:(_:any, record:any) => <span>{record.companyEmployee_id.user_id.name}</span>
    },
    {title:'remarks', key:'remarks', dataIndex:'',
      render:(_:any, record:any) => <span style={{ color: record.remarks === textNothing ? 'transparent' : 'inherit' }}>
      {record.remarks}
    </span>
    }
  ]

  const columnsTo = [
    {title: '員工', key:'name', dataIndex:'', 
      render:(_:any, record:any) => <span>{record.feedback_to.user_id.name}</span>
    },
    {title:'remarks', key:'remarks', dataIndex:'',
      render:(_:any, record:any) => <span style={{ color: record.remarks === textNothing ? 'transparent' : 'inherit' }}>
      {record.remarks}
    </span>
    }
  ]

  const setChart = () => {
    if(feedbackFrom!=null){
      let pcd = [["Remarks", "Count"]]
      feedbackFrom.filter((fb:any) =>{
        let existingItemIndex = pcd.findIndex((item:any) => item[0] === fb.remarks);
        if(existingItemIndex!==-1){
          pcd[existingItemIndex][1] += 1
        }else{
          pcd.push([fb.remarks, 1])
        }
      })
      let indexNothing = pcd.findIndex((item:any) => item[0]===textNothing)
      pcd.splice(indexNothing, 1)
      setPieChartData(pcd)
    }
  
    setPieChartOptions({
      title:'',
      pieHole: 0.6,
      is3D: false,
      pieSliceText:'value',
      legend:{
        textStyle: {
          fontSize: 16,
        },
      },
      chartArea:{
        left:0,top:0,width:'100%',height:'100%'
      },
    })
  }

  const calFeedbackScore = async () => {
    const response = await getFeedbackScore(employeeId)
    console.log(response.data.data)
    setFeedbackScore(response.data.data.toFixed(2))
  }

  return (
    <div style={{marginLeft:'10%', marginRight:'10%'}}>
      <div style={{textAlign:'right'}}>
        <Button onClick={openFeedbackModal} style={{marginTop:'8px', marginBottom:'8px', marginRight:'8px'}}>Feedback to</Button>
        <Button type="primary" onClick={openViewFeedbackModal} style={{marginTop:'8px', marginBottom:'8px'}}>View</Button>
      </div>
      <div style={{display:'flex', justifyContent:'space-between'}}>
        <Table dataSource={feedbackTo} columns={columnsTo} title={() => '我評價他人'}
          bordered style={{flex:1, height:'100%', marginRight:'8px'}} />
        <Table dataSource={feedbackFrom} columns={columnsFrom} title={() => '他人評價我'}
          bordered style={{flex:1, height:'100%'}} />
      </div>

      <Modal bodyStyle={{margin:0}}
        title="My Feedback"
        open={viewFeedbackModalVisible}
        onCancel={closeViewFeedbackModal}
        footer={null}>
          <div>
            <Chart chartType='PieChart' data={pieChartData} options={pieChartOptions}/>
            <div
              style={{ position: 'absolute', top: '55%', left: '30%',
                transform: 'translate(-50%, -50%)',
                fontSize: '20px', fontWeight: 'bold' }} >
              {feedbackScore}
            </div>
          </div>
      </Modal>

      <Modal 
        title="Feedback to"
        open={modalVisible}
        onCancel={closeFeedbackModal}
        footer={null}>
        <Form form={form} onFinish={onFinish}>
          <Form.Item
            name="feedback_to"
            label="Feedback To"
            rules={[{ required: true, message: 'Please select an employee to provide feedback to.' }]} >
            <Select>
              {Array.isArray(companyEmployees) &&
                companyEmployees.map((employee) => (
                  <Option key={employee.id} value={employee.id}>
                    {employee.user_id.name}
                  </Option>
                ))}
            </Select>

          </Form.Item>
          <Form.Item name="remarks" label="Remarks" rules={[{ required: true, message: 'Please enter remarks.' }]}>
            {/* <Input.TextArea /> */}
            <Select>
              {feedbackOption.map((fbo) =>(
                <Option key={fbo} value={fbo}>{fbo}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FeedBackPage;
