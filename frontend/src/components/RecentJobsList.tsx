import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs, selectJobs } from '../reducers/userReducers';
import { Card, Button } from 'antd';
import { AppDispatch } from '../app/store';

const RecentJobsList = () => {
  const dispatch: AppDispatch = useDispatch();
  const jobs = useSelector(selectJobs);
  const [randomJobs, setRandomJobs] = useState<any[]>([]);

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  useEffect(() => {
    // 從所有的工作列表中隨機選取三個工作
    const randomIndexes = getRandomIndexes(jobs.length, 3);
    const selectedJobs = randomIndexes.map((index) => jobs[index]);
    setRandomJobs(selectedJobs);
  }, [jobs]);

  // 生成指定範圍內指定數量的不重複隨機數
  const getRandomIndexes = (max: number, count: number) => {
    const indexes = new Set<number>();
    while (indexes.size < count) {
      const randomIndex = Math.floor(Math.random() * max);
      indexes.add(randomIndex);
    }
    return Array.from(indexes);
  };

  return (
    <div className="recentJobsContainer">
      <ul>
        <h2>推薦其他工作</h2>
        {randomJobs.map((job: any) => (
          <Card key={job.id} className="mb-4" title={job.title ?? ''} bordered={false}>
            <p>
              <strong>公司：</strong>
              {job.companyEmployeePosition.company_id.name ?? ''}
            </p>
            <p>
              <strong>地点：</strong>
              {job.location ?? ''}
            </p>
            <Button
              className="mt-2"
              onClick={() => window.location.href = `/detailsPage/${job.id}` }
            >
              查看详细信息
            </Button>
          </Card>
        ))}
      </ul>
    </div>
  );
};

export default RecentJobsList;

