import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Card, Descriptions, Pagination, message } from 'antd';
import { getAllEmployees, getRecruitments, getIDRecommendations } from '../../../api';
import { useParams } from 'react-router-dom';
import { getCookie } from '../../../utils';

const { Option } = Select;

const EmployeesRecruitmentRecommendation: React.FC = () => {

  // const { id } = useParams<{ id: string | undefined }>();
  const companyId = Number(getCookie('companyId'));

  const [jobList, setJobList] = useState<any[]>([]); // 存储ApplicationRecords
  const [jobId, setJobId] = useState<any>(null); // 用于输入招聘职位ID
  const [jobRequirements, setJobRequirements] = useState<string>(''); // 存储招聘职位要求
  const [candidates, setCandidates] = useState<any[]>([]); // 存储推荐的候选人

  const [currentPage, setCurrentPage] = useState(1); // 假設初始頁碼為1
  const pageSize = 2; // 每頁顯示的候選人數量
  const [hasSelectedOption, setHasSelectedOption] = useState(false);
  
  const handleSelectChange = (value: any) => {
    setJobId(value);
    setHasSelectedOption(!!value); // 更新選擇狀態
  };
  

  useEffect(() => {
    fetchAllApplicaiton()
  }, []);

  const fetchAllApplicaiton = async () => {
    try {
      const response = await getRecruitments(companyId);


      setJobList(response.data.data);
      setJobId(jobList[0].id);

    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };


  // 获取推荐结果
  const getRecommendations = async () => {
    try {

      if (!hasSelectedOption) {
        message.error("請選擇一個招聘信息");
        return;
      }
      const response = await getIDRecommendations(jobId);

      console.log(response.data.candidates)

      setJobRequirements(response.data.job_requirements);
      setCandidates(response.data.candidates);
    } catch (error) {

      setJobRequirements('');
      setCandidates([]);
      message.error("推薦有誤，請檢查是否有應聘記錄");
    }
  };

  // 渲染推荐结果
  const renderCandidates = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const currentCandidates = candidates.slice(startIndex, endIndex);

    return (
      <>
        {currentCandidates.map((candidate) => (
          <Card
            style={{
              margin: '10px 0',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              transition: 'box-shadow 0.3s',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                {candidate && (
                  <div>
                    <Button
                      className="mt-3 mb-2 btn btn-secondary rounded-circle"
                      shape="circle"
                      style={{
                        backgroundImage: `url(https://picsum.photos/200/300)`, //${assignee.user_id.avatarUrl}
                        backgroundSize: 'cover',
                        width: '100px',
                        height: '100px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                      }}
                      disabled
                    />
                  </div>
                )}
                <div style={{ fontSize: '1.2em', marginBottom: '10px' }}>
                  <strong>推薦人選：</strong> {candidate ? candidate.resume_id : 'Unknown'}
                </div>

              </div>

              <div style={{ padding: '16px', flex: 2 }}>
                <div style={{ borderBottom: '1px solid #f0f0f0', marginBottom: '10px' }}>
                  <h4 style={{ fontSize: '1.5em', fontWeight: 'bold', margin: 0 }}>{candidate.resume_id}</h4>
                </div>
              </div>
            </div>
          </Card>
        ))}
        {currentCandidates.length > 0 && (
          <Pagination
            current={currentPage}
            total={candidates.length}
            pageSize={pageSize}
            onChange={(page) => setCurrentPage(page)}
            style={{ marginTop: '20px', textAlign: 'center' }}
          />
        )}

      </>
    );
  };



  return (
    <div className="container mt-4">
      <h1>職位推薦</h1>
      <Card key={"summary"} bordered={false}>
        <div className="row">
          <div className="col-md-6">
            <Select
              value={jobId}
              onChange={(value) => handleSelectChange(value)}
              style={{ width: '100%' }}
              placeholder="選擇職位"
            >
              {jobList.map((e) => (
                <Select.Option key={e.id} value={e.id}>
                  {e.title}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className="col-md-6">
            <Button className="btn btn-primary" onClick={getRecommendations}>
              获取推薦
            </Button>
          </div>
        </div>

        <Card title="招聘职位要求" style={{ marginTop: '20px' }}>
          <Descriptions column={1}>
            <Descriptions.Item label="要求">{jobRequirements}</Descriptions.Item>
          </Descriptions>
        </Card>
      </Card>

      <div className="row mt-4">
        <div className="col-md-12">
          {renderCandidates()}
        </div>
      </div>
    </div>
  );

};

export default EmployeesRecruitmentRecommendation;
