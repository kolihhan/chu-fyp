import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Card, Carousel, Col, Image, Row, Table } from "antd";
import CompanyHeader from "../../../components/Company/CompanyHeader";
import EmployeeItem from "../../../components/Company/EmployeeItem";
import RecruitmentItem from "../../../components/Company/RecruitmentItem";
import { getCompanyById } from "../../../api";
import EmptyComponent from "../../../components/EmptyComponent";
import { getCookie } from "../../../utils";

export const CompanyInfo: React.FC<any> = ({company}) => {
  return (
    <div>
      {company?(
        <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", maxWidth: "70%" }}>   
          <table>
            <tbody>
              <tr>
                <td style={{ paddingRight: "16px", fontSize: "16px" }}>
                  <b>產業類別</b>
                </td>
                <td style={{ fontSize: "16px" }}>{company.industry}</td>
              </tr>
              <tr>
                <td style={{ paddingRight: "16px", fontSize: "16px" }}>
                  <b>員工人數</b>
                </td>
                <td style={{ fontSize: "16px" }}>{company.employeeCount}</td>
              </tr>
              <tr>
                <td style={{ paddingRight: "16px", fontSize: "16px" }}>
                  <b>公司網址</b>
                </td>
                <td style={{ fontSize: "16px" }}>{company.website}</td>
              </tr>
            </tbody>
          </table>
          <table>
            <tbody>
              <tr>
                <td style={{ paddingRight: "16px", fontSize: "16px" }}>
                  <b>聯絡人</b>
                </td>
                <td style={{ fontSize: "16px" }}>{company.contact}</td>
              </tr>
              <tr>
                <td style={{ paddingRight: "16px", fontSize: "16px" }}>
                  <b>電話</b>
                </td>
                <td style={{ fontSize: "16px" }}>{company.phone}</td>
              </tr>
              <tr>
                <td style={{ paddingRight: "16px", fontSize: "16px" }}>
                  <b>地址</b>
                </td>
                <td style={{ fontSize: "16px" }}>{company.address}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ):(<h1>Loading...</h1>)}
    </div>
  )
}

const CompanyBenefits: React.FC<any> = ({company}) => {
  return (
    <div>
      {company?(
        <div>
          {company.company_benefits?.split("\n").map((benefit: string, index: number) => {
            return (
              <div key={index}>{benefit}<br /></div>
              );
            })}  
        </div>
      ): (<h1>Loading...</h1>)}
    </div>
  )
}

const CompanyImage: React.FC<any> = ({companyImage, company}) => {

  const [currentImage, setCurrentImage] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % companyImage.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [companyImage.length]);
  
  const handleIndicatorClick = (index: number) => {
    setCurrentImage(index);
  };

  return (
    <div>
      <center>
          <Carousel autoplay effect="fade" beforeChange={(prev, current) => setCurrentImage(current)} dots={false}>
            {companyImage.map((image: any, index: number) => (
              <div key={index}>
                <img src={image['image']} alt={`Image ${index}`} style={{ width: "auto", height: "200px" }} />
              </div>
            ))}
          </Carousel>
        </center>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "16px" }}>
          {companyImage.map((image: any, index:number) => (
            <div
              key={index}
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                backgroundColor: index === currentImage ? "#1890ff" : "#ccc",
                margin: "0 4px",
                cursor: "pointer",
              }}
              onClick={() => handleIndicatorClick(index)}
            />
          ))}
        </div>
    </div>
  )
}

const CompanyDetailPage: React.FC = () => {
  const companyId = Number(getCookie('companyId'))
  const [company, setCompany] = useState<any>();
  const [companyImage, setCompanyImage] = useState([])
  const [companyEmployees, setCompanyEmployees] = useState([])
  const [companyRecruitments, setCompanyRecruitments] = useState([])

  useEffect(() => {
    document.title = "公司信息";
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      const response = await getCompanyById(companyId);
      setCompany(response.data.data.company);
      setCompanyImage(response.data.data.images)
      setCompanyEmployees(response.data.data.employees)
      setCompanyRecruitments(response.data.data.recruitments)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(companyEmployees)
  })

  return (
    <div style={{ paddingLeft: "10%", paddingRight:'10%', paddingTop: "16px", backgroundColor: "#F4F4F4" }}>
      <CompanyHeader company={company} />

      {/* display flex change to block  */}
      {/* can set the right side panel to bottom */}

      <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between" }}>
        
        <div style={{ flex: 7, background:"transparent", padding: "0px", display:'flex', flexDirection:'column', height: 'calc(100vh - 250px)' }}>
          <Card id="cmpDetails"
            style={{flex:'none', overflowY: "auto"}}
            bodyStyle={{ backgroundColor: "white", paddingTop: "0px", overflowY: "auto" }}
            title={<h2 style={{ margin: "0px" }}>公司信息</h2>} >
            <CompanyInfo company={company}/>
          </Card>

          <Card id="cmpDetailBenefits"
           style={{flex:'none', overflowY: "auto"}}
           bodyStyle={{ backgroundColor: "white", paddingTop: "0px", overflowY: "auto" }}
            title={<h2 style={{ margin: "0px" }}>公司福利</h2>} >
            <CompanyBenefits company={company}/>
          </Card>

          <Card id="cmpDetailImage"
            style={{flex:'auto', overflowY: "auto"}}
            bodyStyle={{ backgroundColor: "white", paddingTop: "0px", overflowY: "auto" }}
            title={<h2 style={{ margin: "0px" }}>公司環境照片</h2>} >
            <CompanyImage companyImage={companyImage} company={company}/>
          </Card>
        </div>

        <div style={{ flex: 3, padding: "0px", display:'flex', flexDirection:'column', height: 'calc(100vh - 250px)' }}>
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

          <Card id="cmpDetailRecruitList"
           style={{flex:'1', overflowY: "auto"}}
           bodyStyle={{ backgroundColor: "white", paddingTop: "0px", overflowY: "auto" }}
            title={<h2 style={{ margin: "0px" }}>招聘列表</h2>} >
            {companyRecruitments ? (
              companyRecruitments.length > 0 ? (
                companyRecruitments.map((recruitment: any) => (
                  <RecruitmentItem key={recruitment.id} recruitmentItem={recruitment} />
                ))
              ):(<EmptyComponent /> )
            ):( <EmptyComponent /> )
          }
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailPage;
