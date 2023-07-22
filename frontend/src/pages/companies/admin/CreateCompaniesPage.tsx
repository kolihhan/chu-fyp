import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Upload, Image, message } from "antd";
import { createCompany } from "../../../api";
import { useLoading } from "../../../components/LoadingScreen";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";

const CreateCompaniesPage: React.FC = () => {
  const history = useNavigate();
  const isUser = useSelector((state: RootState) => state.auth.user);
  const image = "/image/empty.png"
  const { setLoading } = useLoading();
  setLoading(false);

  const [logo, setLogo] = useState(image)

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
      await createCompany(values);
      history("/"); 
    } catch (error) {
      console.log(error);
      
    }
    setLoading(false);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <h1>创建公司</h1>
      <Form
        onFinish={onFinish} onFinishFailed={onFinishFailed}
        labelCol={{ span: 1 }} wrapperCol={{ span:24 }} labelAlign='left'>

        <div style={{display:'flex', alignItems:'end'}}>
          <Form.Item label="" name="logo2" labelCol={{ span: 1 }} wrapperCol={{ span:24 }} style={{height:'100px', width:'100px', marginRight:'16px'}}>
            <Upload 
              listType="picture-card" showUploadList={false} multiple={false} maxCount={1} 
              beforeUpload={beforeUpload} customRequest={({file}) => uploadImage(file)}>
                <Image preview={false} src={logo} style={{height:'100px', width:'100px'}}></Image>
            </Upload>
          </Form.Item>
          <Form.Item label="公司名称"
            name="name" labelCol={{span:24}} style={{width:'100%'}}
            rules={[{ required: true, message: "请输入公司名称" }]} >
            <Input />
          </Form.Item>
        </div>

        <Form.Item label="邮箱" name="email"
          rules={[{ required: true, message: "请输入公司邮箱" }]} >
          <Input />
        </Form.Item>

        <Form.Item label="电话" name="phone"
          rules={[{ required: true, message: "请输入公司电话" }]} >
          <Input />
        </Form.Item>

        <Form.Item label="地址" name="address"
          rules={[{ required: true, message: "请输入公司地址" }]} >
          <Input />
        </Form.Item>

        <Form.Item label="公司描述" name="company_desc"
          rules={[{ required: true, message: "请输入公司描述" }]} >
          <Input.TextArea onChange={handlerTAChange} />
        </Form.Item>

        <Form.Item label="公司福利" name="company_benefits"
          rules={[{ required: true, message: "请输入公司福利" }]} >
          <Input.TextArea onChange={handlerTAChange} />
        </Form.Item>

        <Form.Item label="產業類別" name="industry"
          rules={[{ required: true, message: "请输入公司福利" }]} >
          <Input />
        </Form.Item>

        <Form.Item label="公司網址" name="website"
          rules={[{ required: true, message: "请输入公司福利" }]} >
          <Input />
        </Form.Item>

        <Form.Item label="聯絡人" name="contact"
          rules={[{ required: true, message: "请输入公司福利" }]} >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            创建
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateCompaniesPage;
