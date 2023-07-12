import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Card, Carousel, Col, Image, Row, Table } from "antd";
import CompanyHeader from "../../../components/Company/CompanyHeader";
import EmployeeItem from "../../../components/Company/EmployeeItem";
import RecruitmentItem from "../../../components/Company/RecruitmentItem";
import { getCompanyById } from "../../../api";

const CompanyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const companyId = Number(id);
  const [company, setCompany] = useState<any>(null);

  useEffect(() => {
    document.title = "公司信息";
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      const response = await getCompanyById(companyId);
      setCompany(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const imageList = [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Convex_lens_%28magnifying_glass%29_and_upside-down_image.jpg/341px-Convex_lens_%28magnifying_glass%29_and_upside-down_image.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjYFV-bwRLTx5vbXeIRyRZDH86KNG-4ktGcg&usqp=CAU",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Convex_lens_%28magnifying_glass%29_and_upside-down_image.jpg/341px-Convex_lens_%28magnifying_glass%29_and_upside-down_image.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjYFV-bwRLTx5vbXeIRyRZDH86KNG-4ktGcg&usqp=CAU",
  ];
  const [currentImage, setCurrentImage] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % imageList.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [imageList.length]);
  const handleIndicatorClick = (index: number) => {
    setCurrentImage(index);
  };

  return (
    <div style={{ backgroundColor: "#F4F4F4" }}>
      <CompanyHeader company={company} />
      {/* display flex change to block and set the width to 100% */}
      {/* can set the right side panel to bottom */}
      <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between" }}>
        <div style={{ width: "70%", marginRight: "8px" }}>
          <Card
            id="cmpDetails"
            style={{ marginTop: "8px" }}
            bodyStyle={{ backgroundColor: "white", paddingTop: "0px" }}
            title={<h2 style={{ margin: "0px" }}>公司信息</h2>}
          >
            <div
              style={{ display: "flex", alignItems: "start", justifyContent: "space-between", maxWidth: "70%" }}
            >
              {/* 其他代码略 */}
            </div>
          </Card>

          {/* 其他代码略 */}

          <Card
            id="cmpDetailImage"
            style={{ marginTop: "8px" }}
            bodyStyle={{ backgroundColor: "white", paddingTop: "0px" }}
            title={<h2 style={{ margin: "0px" }}>公司環境照片</h2>}
          >
            <center>
              <Carousel autoplay effect="fade" beforeChange={(prev, current) => setCurrentImage(current)} dots={false}>
                {imageList.map((image, index) => (
                  <div key={index}>
                    <img src={image} alt={`Image ${index}`} style={{ width: "auto", height: "200px" }} />
                  </div>
                ))}
              </Carousel>
            </center>
            <div style={{ display: "flex", justifyContent: "center", marginTop: "16px" }}>
              {imageList.map((image, index) => (
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
          </Card>
        </div>
        <div style={{ width: "30%" }}>
          <Card
            id="cmpDetailEmployees"
            style={{ marginTop: "8px" }}
            bodyStyle={{ backgroundColor: "white", paddingTop: "0px", maxHeight: "360px", overflowY: "auto" }}
            title={<h2 style={{ margin: "0px" }}>員工列表</h2>}
          >
            {company && company?.employees?.map((employee: any) => (
              <EmployeeItem key={employee.id} id={employee.id} name={employee.name} position={employee.position} />
            ))}
          </Card>

          <Card
            id="cmpDetailRecruitList"
            style={{ marginTop: "8px" }}
            bodyStyle={{ backgroundColor: "white", paddingTop: "0px", maxHeight: "360px", overflowY: "auto" }}
            title={<h2 style={{ margin: "0px" }}>招聘列表</h2>}
          >
            {company && company?.recruitments?.map((recruitment: any) => (
              <RecruitmentItem key={recruitment.id} id={recruitment.id} title={recruitment.title} desc={recruitment.description} />
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailPage;
