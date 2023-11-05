import React, { useEffect, useState } from 'react';
import { Card, Row, Col } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getChartData } from '../../api';
import { getCookie } from '../../utils';

const EmployeeData = () => {
    const [hrData, setHrData] = useState(null);
    const companyId = Number(getCookie('companyId'));
    
    useEffect(() => {
        fetchChartData();
    }, []);

    const fetchChartData = async () => {
        try {
            const response = await getChartData(companyId);
            setHrData(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    if (!hrData) {
        return <div>Loading HR data...</div>;
    }

    return (
        <Card title="Multi-dimension Analytics Dashboard">
            <Row gutter={16}>
                {Object.keys(hrData).map((dataKey) => (
                    <Col span={8} key={dataKey}>
                        <Card title={dataKey}>
                            <BarChart data={hrData[dataKey]} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#8884d8" />
                            </BarChart>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Card>
    );
};

export default EmployeeData;
