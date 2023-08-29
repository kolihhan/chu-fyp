import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select } from 'antd';
import { getAllEmployees, getRecruitments, getIDRecommendations } from '../../../api';
import { useParams } from 'react-router-dom';

const { Option } = Select;

const EmployeesRecruitmentRecommendation: React.FC = () => {

  const { id } = useParams<{ id: string | undefined }>();
  const companyId = Number(id);

  const [jobList, setJobList] = useState<any[]>([]); // 存储ApplicationRecords
  const [jobId, setJobId] = useState<any>(null); // 用于输入招聘职位ID
  const [jobRequirements, setJobRequirements] = useState<string>(''); // 存储招聘职位要求
  const [candidates, setCandidates] = useState<any[]>([]); // 存储推荐的候选人

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
      const response = await getIDRecommendations(jobId);

      console.log(response.data.candidates)

      setJobRequirements(response.data.job_requirements);
      setCandidates(response.data.candidates);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  // 渲染推荐结果
  const renderCandidates = () => {
    return candidates.map((candidate: any) => (
      <div key={candidate.resume_id}>
        <h3>候选人ID: {candidate.resume_id}</h3>
        <p>推薦原因: {Array.isArray(candidate.recommendation_reason) ? candidate.matched_skills.join(', ') : candidate.recommendation_reason}</p>
        <p>匹配的关键词: {Array.isArray(candidate.matched_skills) ? candidate.matched_skills.join(', ') : candidate.matched_skills}</p>
        <p>履历内容: {candidate.resume_text}</p>
      </div>
    ));
  };


  return (
    <div>
      <Select value={jobId} onChange={(value) => setJobId(value)} style={{ width: '500px' }}>
        {jobList.length === 0 ? (
          <Option disabled value={null}>Loading...</Option>
        ) : (
          jobList.map((e) => (
            <Option key={e.id} value={e.id}>
              {e.title}
            </Option>
          ))
        )}
      </Select>


      <button onClick={getRecommendations}>获取推荐</button>
      <h2>招聘职位要求:</h2>
      <p>{jobRequirements}</p>
      <h2>推荐的候选人:</h2>
      {renderCandidates()}
    </div>
  );
};

export default EmployeesRecruitmentRecommendation;
