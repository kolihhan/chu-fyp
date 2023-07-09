import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import * as bossCompanyAction from "../../../reducers/companiesReducers"
import { Card, Carousel, Col, Image, Row, Table } from "antd"
import CompanyHeader from "../../../components/Company/CompanyHeader"
import EmployeeItem from "../../../components/Company/EmployeeItem"
import RecruitmentItem from "../../../components/Company/RecruitmentItem"

const CompanyDetailPage: React.FC = () => {

    const { id } = useParams<{id: string | undefined}>();
    const companyId = Number(id)
    const companyList = useSelector(bossCompanyAction.companyById(companyId))
    const company = companyList? companyList[0] : null
    useEffect(() => {
        document.title = "公司信息"
        console.log(company)
        console.log(id)
        console.log(company.company_benefits)
    }, [])

    const imageList = [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Convex_lens_%28magnifying_glass%29_and_upside-down_image.jpg/341px-Convex_lens_%28magnifying_glass%29_and_upside-down_image.jpg',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjYFV-bwRLTx5vbXeIRyRZDH86KNG-4ktGcg&usqp=CAU',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Convex_lens_%28magnifying_glass%29_and_upside-down_image.jpg/341px-Convex_lens_%28magnifying_glass%29_and_upside-down_image.jpg',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjYFV-bwRLTx5vbXeIRyRZDH86KNG-4ktGcg&usqp=CAU'
    ]
    const [currentImage, setCurrentImage] = useState(0)
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prevImage) => (prevImage + 1 ) %imageList.length)
        }, 5000)

        return clearInterval(interval)
    }, [imageList.length])
    const handleIndicatorClick = (index:number) => {
        setCurrentImage(index);
      };
    

    return (
        <div style={{padding:'15%', paddingTop:'16px', backgroundColor:'#F4F4F4'}}>
            <CompanyHeader company={company} />
            display flex change to block and set the width to 100%<br/>can set the right side panel to bottom 
            <div style={{display:'flex', alignItems:'start', justifyContent:'space-between'}}>
                <div style={{width:"70%", marginRight:'8px'}}>
                    <Card id="cmpDetails"
                        style={{marginTop:'8px'}} 
                        bodyStyle={{backgroundColor:'white', paddingTop:'0px'}} 
                        title={<h2 style={{margin:'0px'}}>公司信息</h2>}>
                            <div style={{display:'flex', alignItems:'start', justifyContent:'space-between', maxWidth:"70%"}}>
                                <table>
                                    <tr>
                                        <td style={{paddingRight:'16px', fontSize:'16px'}}><b>產業類別</b></td>
                                        <td style={{fontSize:'16px'}}>{company.address}</td>
                                    </tr>
                                    <tr>
                                        <td style={{paddingRight:'16px', fontSize:'16px'}}><b>員工人數</b></td>
                                        <td style={{fontSize:'16px'}}>{company.address}</td>
                                    </tr>
                                    <tr>
                                        <td style={{paddingRight:'16px', fontSize:'16px'}}><b>公司網址</b></td>
                                        <td style={{fontSize:'16px'}}>{company.address}</td>
                                    </tr>
                                </table>
                                <table>
                                    <tr>
                                        <td style={{paddingRight:'16px', fontSize:'16px'}}><b>聯絡人</b></td>
                                        <td style={{fontSize:'16px'}}>{company.address}</td>
                                    </tr>
                                    <tr>
                                        <td style={{paddingRight:'16px', fontSize:'16px'}}><b>電話</b></td>
                                        <td style={{fontSize:'16px'}}>{company.phone}</td>
                                    </tr>
                                    <tr>
                                        <td style={{paddingRight:'16px', fontSize:'16px'}}><b>地址</b></td>
                                        <td style={{fontSize:'16px'}}>{company.address}</td>
                                    </tr>
                                </table>
                            </div>
                    </Card>
                    
                    <Card id="cmpDetailBenefits"
                        style={{marginTop:'8px'}} 
                        bodyStyle={{backgroundColor:'white', paddingTop:'0px'}} 
                        title={<h2 style={{margin:'0px'}}>{company.company_benefits}</h2>}>                           
                            {company.company_benefits.split("\n").map((benefit: String, index:number) => {
                                return(
                                    <div key={index}>{benefit}<br/></div>
                                )
                            })}
                    </Card>
                    <Card id="cmpDetailImage"
                        style={{marginTop:'8px'}} 
                        bodyStyle={{backgroundColor:'white', paddingTop:'0px'}} 
                        title={<h2 style={{margin:'0px'}}>公司環境照片</h2>}>
                            {/* <center>
                                <Carousel autoplay effect="fade" beforeChange={(prev, current) => setCurrentImage(current)} dots={false}>
                                    {imageList.map((image, index) => (
                                        <div key={index}>
                                        <img src={image} alt={`Image ${index}`} style={{ width: 'auto', height: '200px' }} />
                                        </div>
                                    ))}
                                </Carousel>
                            </center>
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                            {imageList.map((image, index) => (
                                <div
                                key={index}
                                style={{
                                  width: '24px',
                                  height: '24px',
                                  borderRadius: '50%',
                                  backgroundColor: index === currentImage ? '#1890ff' : '#ccc',
                                  margin: '0 4px',
                                  cursor: 'pointer',
                                }}
                                onClick={() => handleIndicatorClick(index)}
                              />
                            ))}
                            </div> */}
                    </Card>
                </div>
                <div style={{width:"30%"}}>
                    <Card id="cmpDetailEmployees"
                        style={{marginTop:'8px'}} 
                        bodyStyle={{backgroundColor:'white', paddingTop:'0px', maxHeight:'360px', overflowY: 'auto'}} 
                        title={<h2 style={{margin:'0px'}}>員工列表</h2>}>
                            <EmployeeItem id={0} name={"Chia0"} position={"Boss"}/>
                            <EmployeeItem id={1} name={"Chia1"} position={"Accountant"}/>
                            <EmployeeItem id={2} name={"Chia2"} position={"HR"}/>
                            <EmployeeItem id={3} name={"Chia3"} position={"Employee"}/>
                            <EmployeeItem id={4} name={"Chia4"} position={"Employee"}/>
                            <EmployeeItem id={5} name={"Chia5"} position={"Employee"}/>
                            <EmployeeItem id={6} name={"Chia6"} position={"Employee"}/>
                    </Card>
                    <Card id="cmpDetailRecruitList"
                        style={{marginTop:'8px'}} 
                        bodyStyle={{backgroundColor:'white', paddingTop:'0px', maxHeight:'360px', overflowY: 'auto'}} 
                        title={<h2 style={{margin:'0px'}}>招聘列表</h2>}>
                            <RecruitmentItem  id={1} title={"收銀員"} desc={"-"}/>
                            <RecruitmentItem  id={2} title={"服務員"} desc={"負責招待客戶"}/>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default CompanyDetailPage