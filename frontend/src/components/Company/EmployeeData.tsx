import React, { useEffect, useState } from 'react';
import { Card, Row, Col } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, LineChart, Line, Pie } from 'recharts';
import { getChartData } from '../../api';
import { getCookie } from '../../utils';

const EmployeeData: React.FC = () => {
    const [employeeData, setEmployeeData] = useState(null) as any;
    const companyId = Number(getCookie('companyId'));
    
    useEffect(() => {
        fetchChartData();
    }, []);

    const fetchChartData = async () => {
        try {
            const response = await getChartData(companyId);
            setEmployeeData(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    if (!employeeData) {
        return <div>Loading HR data...</div>;
    }

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
  };

  const chartCardStyle: React.CSSProperties = {
    flexBasis: '50%',
    width: '50%',
    padding: '10px',
  };

  return (
    <div style={containerStyle} className="employee-data-container">
      <div style={rowStyle} className="row">
        <div style={chartCardStyle} className="chart-card-50">
          <Card title="Gender Distribution">
            <PieChart width={400} height={300}>
              <Pie dataKey="value" data={employeeData.genderDistribution} cx={200} cy={150} outerRadius={60} label />
            </PieChart>
          </Card>
        </div>
        <div style={chartCardStyle} className="chart-card-50">
          <Card title="Age Distribution">
            <BarChart width={400} height={300} data={employeeData.ageDistribution}>
              <XAxis dataKey="user_id__birthday" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" name="Age Count" />
            </BarChart>
          </Card>
        </div>
      </div>
      <div style={rowStyle} className="row">
        <div style={chartCardStyle} className="chart-card-50">
          <Card title="Education Level Distribution">
            <BarChart width={400} height={300} data={employeeData.educationLevelDistribution}>
              <XAxis dataKey="user_id__userresume__education__educational_qualifications" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" name="Education Count" />
            </BarChart>
          </Card>
        </div>
        <div style={chartCardStyle} className="chart-card-50">
          <Card title="Department Distribution">
            <BarChart width={400} height={300} data={employeeData.departmentDistribution}>
              <XAxis dataKey="companyDepartment_id__department_name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="employeeCount" fill="#8884d8" name="Department Employee Count" />
            </BarChart>
          </Card>
        </div>
      </div>
    </div>
  );
  
};

export default EmployeeData;
