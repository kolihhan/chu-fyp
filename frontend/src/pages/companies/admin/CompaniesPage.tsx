import React, { useState, useEffect } from 'react';
import { Card, Spin } from 'antd';
import 'antd/dist/antd.css';

interface Company {
  id: number;
  name: string;
  address: string;
  // Add more fields as needed
}

const CompaniesPage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch('your-api-endpoint');
      const data = await response.json();
      setCompanies(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  return (
    <div className="companies-page">
      <h1>Companies</h1>
      {loading ? (
        <Spin size="large" />
      ) : (
        <div className="company-list">
          {companies.map((company) => (
            <Card key={company.id} className="company-card">
              <h2>{company.name}</h2>
              <p>{company.address}</p>
              {/* Add more fields or components as needed */}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompaniesPage;
