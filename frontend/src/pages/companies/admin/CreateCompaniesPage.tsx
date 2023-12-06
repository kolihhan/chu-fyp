import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Upload, Image, message } from "antd";
import { createCompany } from "../../../api";
import { useLoading } from "../../../components/LoadingScreen";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { setEmployees, setSelectCompany } from "../../../reducers/employeeReducers";
import { UserOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined, CalendarOutlined } from '@ant-design/icons';

const CreateCompaniesPage: React.FC = () => {
  const history = useNavigate();
  const isUser = useSelector((state: RootState) => state.auth.user);
  const isEmployee = useSelector((state: RootState) => state.employee.employees);
  const image = "/image/empty.png"
  const { setLoading } = useLoading();
  setLoading(false);

  const [logo, setLogo] = useState(image)
  const dispatch = useDispatch()

  const beforeUpload = (file: any) => {
    if (file.type.indexOf('image/') === -1) {
      message.error('You can only upload image files!');
      return false;
    }
    return true;
  };
  const uploadImage = async (file:any) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setLogo(reader!.result!.toString())
    };
  }
  
  const handlerTAChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    evt.target.style.height = 'auto'
    evt.target.style.height = `${evt.target.scrollHeight}px`
  }

  const onFinish = async (values: any) => {
    setLoading(true);
    values["boss_id"] = isUser?.id;
    values["logo"] = logo
    try {
      const response = await createCompany(values);
      if(response.status==200){
        message.success('公司創建成功')
        dispatch(setEmployees(response.data.employee))
        history("/company/list");
      }else{
        message.success('公司創建失敗')
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="container">
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>創建公司</h1>

      <Form
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
      >
        <Form.Item
          label="公司 Logo"
          name="logo2"
          rules={[{ required: true, message: '請上傳公司 Logo' }]}
        >
          <Upload
            listType="picture-card"
            showUploadList={false}
            multiple={false}
            maxCount={1}
            beforeUpload={beforeUpload}
            customRequest={({ file }) => uploadImage(file)}
          >
            <Image preview={false} src={logo} style={{ width: '100px', height: '100px' }} />
          </Upload>
      </Form.Item>

      <Form.Item
        label="公司名稱"
        name="name"
        rules={[{ required: true, message: '請輸入公司名稱' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="電子郵件" name="email" rules={[{ required: true, message: '請輸入公司邮箱' }]}>
        <Input prefix={<MailOutlined />} />
      </Form.Item>

      <Form.Item label="電話" name="phone" rules={[{ required: true, message: '請輸入公司电话' }]}>
        <Input prefix={<PhoneOutlined />} />
      </Form.Item>

      <Form.Item label="地址" name="address" rules={[{ required: true, message: '請輸入公司地址' }]}>
        <Input prefix={<EnvironmentOutlined />} />
      </Form.Item>

      <Form.Item
        label="公司描述"
        name="company_desc"
        rules={[{ required: true, message: '請輸入公司描述' }]}
      >
        <Input.TextArea rows={4} onChange={handlerTAChange} />
      </Form.Item>

      <Form.Item
        label="公司福利"
        name="company_benefits"
        rules={[{ required: true, message: '請輸入公司福利' }]}
      >
        <Input.TextArea rows={4} onChange={handlerTAChange} />
      </Form.Item>

      <Form.Item label="產業類別" name="industry" rules={[{ required: true, message: '請輸入產業類別' }]}>
        <Input />
      </Form.Item>

      <Form.Item label="公司網址" name="website" rules={[{ required: true, message: '請輸入公司網址' }]}>
        <Input />
      </Form.Item>

      <Form.Item label="聯絡人" name="contact" rules={[{ required: true, message: '請輸入聯絡人' }]}>
        <Input />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
        <Button type="primary" htmlType="submit">
          創建
        </Button>
      </Form.Item>
    </Form>
  </div>
  );
};

export default CreateCompaniesPage;
