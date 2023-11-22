import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUserResume, fetchResumes, editResume, createNewResume } from '../reducers/userReducers';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, Select, Collapse, CollapseProps, DatePicker, Radio, Card, Checkbox } from 'antd';
import { UserOutlined, CalendarOutlined } from '@ant-design/icons';

import { AnyAction } from '@reduxjs/toolkit';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../app/store';
import dayjs from 'dayjs';
import { createNewResumeApi, getResume } from '../api';
import { getCookie } from '../utils';

const ResumePage: React.FC = () => {
  const params = useParams<{ id: string }>();
  const id = Number(params.id); // 将id转换为数字类型

  const savedResumes = useSelector(selectUserResume);
  const navigate = useNavigate();
  // 定义 dispatch 类型
  type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

  const dispatch: AppDispatch = useDispatch();

  // 根据 id 找到对应的 resume 对象
  const selectedResume = savedResumes.find(resume => resume.id === id);

  const [form] = Form.useForm();
  const [resumeData, setResumeData] = useState<any>({});
  const [stopResume, setStopResume] = useState(false);
  const [options, setOptions] = useState<any>([])
  const userId = getCookie('userId')

  useEffect(() => {
    // dispatch(fetchResumes());
    // setResumeData(selectedResume);
    form.resetFields(); // 重置表单以填充新的初始值
    if (id) { getResumeById() }
  }, [resumeData]);

  const getResumeById = async () => {
    const response = await getResume(id)
    if (response.status == 200) {
      console.log(response.data)
      if (stopResume == false) {
        setResumeData(response.data.data)
        setTimeout(() => {
          if (response.data.data.experience != null) {
            form.setFieldsValue({
              experience: {
                start_date: dayjs(response.data.data.experience.start_date).format("YYYY/MM"),
                end_date: dayjs(response.data.data.experience.end_date).format("YYYY/MM")
              }
            })
          }
          if (response.data.data.education != null) {
            form.setFieldsValue({
              education: {
                start_date: dayjs(response.data.data.education.start_date).format("YYYY/MM"),
                end_date: dayjs(response.data.data.education.end_date).format("YYYY/MM")
              }
            })
          }
        }, 200)
      }
      setStopResume(true)
    }
  }

  const onFinish = async (values: any) => {
    console.log(values)
    values.experience.start_date = dayjs(values.experience.start_date)
    values.experience.end_date = dayjs(values.experience.end_date)
    values.education.start_date = dayjs(values.education.start_date)
    values.education.end_date = dayjs(values.education.end_date)
    console.log(values)
    if (id) {
      console.log("finish: update")
      dispatch(editResume(id, values));
    } else {
      console.log("finish: create")
      dispatch(createNewResume(values));
    }

    // navigate(`/profile`);
  };

  const jobNatureOptions = ['全职', '兼职']
  const qualificationsOptions = ['PhD', 'Master', 'Degree', 'Diploma', 'High School', 'Higher vocational education', 'Junior high school (inclusive) and below']
  const statusOptions = ['graduated', 'studying', 'drop out of school'];

  return (
    <div className='profileForm'>
    <Form form={form} onFinish={onFinish} initialValues={resumeData} layout="vertical">
      <Form.Item label="履歷名稱" name="title" rules={[{ required: true, message: '此欄為必填' }]}>
        <Input/>
      </Form.Item>
      <Form.Item label="簡介" name="summary" rules={[{ required: true, message: '此欄為必填' }]}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item label="工作經歷">
        <Card title={"編輯工作經歷"}>
          <Form.Item label="公司" name={["experience", "we_company_name"]} rules={[{ required:true, message:'此欄為必填'}]}>
            <Input />
          </Form.Item>
          <Form.Item label="職務" name={["experience", "position"]} rules={[{ required:true, message:'此欄為必填'}]}>
            <Input />
          </Form.Item>
          <Form.Item label="工作内容" name={["experience", "working_desc"]} rules={[{ required:true, message:'此欄為必填'}]}>
            <Input />
          </Form.Item>
          <Form.Item label="職務類別" name={["experience", "job_nature"]} rules={[{ required:true, message:'此欄為必填'}]}>
            <Radio.Group options={jobNatureOptions} />
          </Form.Item>
          <Form.Item label="開始日期" name={["experience", "start_date"]} rules={[{ required:true, message:'此欄為必填'}, 
          { pattern: /^(19|20)\d{2}\/(0[1-9]|1[0-2])$/,message: '日期格式必須為YYYY/MM'}]}>
            <Input />
          </Form.Item>
          <Form.Item label="結束日期" name={["experience","end_date"]} rules={[{ required:true, message:'此欄為必填'}, 
          { pattern: /^(19|20)\d{2}\/(0[1-9]|1[0-2])$/,message: '日期格式必須為YYYY/MM'}]}>
            {/* <DatePicker picker="month" format={'YYYY/MM'} /> */}
            <Input />
          </Form.Item>
          <Form.Item label="在職中" name={["experience", "still_employed"]} valuePropName='checked'>
            <Checkbox></Checkbox>
          </Form.Item>
        </Card>
      </Form.Item>
      <Form.Item label="學歷">
        <Card title="編輯學歷">
          <Form.Item label="學校" name={["education", "school_name"]} rules={[{ required:true, message:'此欄為必填'}]}>
            <Input />
          </Form.Item>
          <Form.Item label="學歷" name={["education", "educational_qualifications"]} rules={[{ required:true, message:'此欄為必填'}]}>
          <Radio.Group options={qualificationsOptions} />
          </Form.Item>
          <Form.Item label="科系名稱" name={["education", "department_name"]} rules={[{ required:true, message:'此欄為必填'}]}>
            <Input />
          </Form.Item>
          <Form.Item label="開學日期" name={["education", "start_date"]} rules={[{ required:true, message:'此欄為必填'}, 
          { pattern: /^(19|20)\d{2}\/(0[1-9]|1[0-2])$/,message: '日期格式必須為YYYY/MM'}]}>
            <Input />
          </Form.Item>
          <Form.Item label="畢業日期" name={["education", "end_date"]} rules={[{ required:true, message:'此欄為必填'}, 
          { pattern: /^(19|20)\d{2}\/(0[1-9]|1[0-2])$/,message: '日期格式必須為YYYY/MM'}]}>
            <Input />
          </Form.Item>
          <Form.Item label="就學狀態" name={["education", "school_status"]} rules={[{ required:true, message:'此欄為必填'}]}>
            <Radio.Group options={statusOptions} />
          </Form.Item>
        </Card>          
      </Form.Item>
      <Form.Item label="專長" name="skills" rules={[{ required: true, message: '此欄為必填' }]}>
        <Select mode='tags' options={options.filter((option: any) => option.option_name=="skill")} 
          tokenSeparators={[',', '，']} showSearch={false} />
      </Form.Item>
      <Form.Item label="希望職類" name="prefer_work" rules={[{ required: true, message: '此欄為必填' }]}>
      <Select mode='tags' options={options.filter((option: any) => option.option_name=="work")}
          tokenSeparators={[',', '，']} showSearch={false} />
      </Form.Item>
      <Form.Item label="語文能力" name="language" rules={[{ required: true, message: '此欄為必填' }]}>
      <Select mode='tags' options={options.filter((option: any) => option.option_name=="language")}
          tokenSeparators={[',', '，']} showSearch={false} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          儲存
        </Button>
      </Form.Item>
    </Form>
    </div>

  );
};

export default ResumePage;
