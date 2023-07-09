import { useNavigate } from "react-router-dom";
import CompanyItem from "../../../components/Company/CompanyItem";
import { useLoading } from "../../../components/LoadingScreen";
import { useDispatch, useSelector } from "react-redux";
import * as bossCompanyAction from "../../../reducers/companiesReducers";
import { useEffect } from "react";
import { ThunkDispatch } from "redux-thunk";
import { RootState } from "../../../app/store";
import { AnyAction } from "redux";
import { getUserId } from "../../../utils";


const CompaniesPage: React.FC = () => {
    type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;
    const dispatch: AppDispatch = useDispatch();
    const companies = useSelector(bossCompanyAction.bossCompanies)
    const { setLoading } = useLoading();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "公司"
        setLoading(true)
        dispatch(bossCompanyAction.fetchCompanies())
        setLoading(false)
        console.log(companies)
    }, [])

    return (
        <div>
            {
                companies?.map((cmp) => (
                    <CompanyItem id={cmp['id']} title={cmp['name']} />
                ))
            }
        </div>
    )
};

export default CompaniesPage;

// import React, { useState, useEffect } from 'react';
// import { Card, Spin } from 'antd';
// // import 'antd/dist/antd.min.css';
// // import 'antd/dist/antd.css'

// interface Company {
//   id: number;
//   name: string;
//   address: string;
//   // Add more fields as needed
// }

// const CompaniesPage: React.FC = () => {
//   const [companies, setCompanies] = useState<Company[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     // fetchCompanies();
//     setCompanies([{"id": 42,"name": "Hello Company Hihi 1","address": "this is address",},{"id": 43,"name": "Hello Company Hihi 2","address": "this is address",}])
//   }, []);

//   const fetchCompanies = async () => {
//     try {
//       const response = await fetch('your-api-endpoint');
//       const data = await response.json();
//       setCompanies(data);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching companies:', error);
//     }
//   };

  
//   return (
//     <div className="companies-page">
//       <h1>Companies</h1>
//       {loading ? (
//         <Spin size="large" />
//       ) : (
//         <div className="company-list">
//           {companies.map((company) => (
//             <Card key={company.id} className="company-card">
//               <h2>{company.name}</h2>
//               <p>{company.address}</p>
//               {/* Add more fields or components as needed */}
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CompaniesPage;