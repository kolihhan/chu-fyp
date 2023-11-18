import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { RootState } from './app/store';
import { useDispatch, useSelector } from 'react-redux';

import Home from './pages/Home';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import Profile from './pages/ProfilePage';
import ApplicationDetailsPage from './pages/ApplicationDetailsPage';
import Navbar from './components/NavBar';
import { LoadingScreen } from './components/LoadingScreen';
import ResumePage from './pages/ResumePage';

import CheckIn from './pages/companies/employees/CheckInPage';
import FeedBack from './pages/companies/employees/FeedBackPage';
import ApplicationLeave from './pages/companies/employees/ApplicationLeavePage';

import { validateUserToken, selectAccessToken } from './reducers/authReducers';
import { AnyAction } from '@reduxjs/toolkit';
import { ThunkDispatch } from 'redux-thunk';

import { Layout, message } from 'antd';
import { useNavigate } from 'react-router-dom'; // 导入 useHistory 钩子
import CompanyItem from './components/Company/CompanyItem';
import CompaniesPage from './pages/companies/admin/CompaniesPage';
import CompanyDetailPage from './pages/companies/admin/CompanyDetailPage';
import CompanyEmployeesPage from './pages/companies/admin/CompanyEmployeesPage';
import CreateCompaniesPage from './pages/companies/admin/CreateCompaniesPage';
import EmployeesFeedbackPage from './pages/companies/admin/EmployeesFeedbackPage';
import EmployeesPerformancePage from './pages/companies/admin/EmployeesPerformancePage';
import EmployeesPromotionHistoryPage from './pages/companies/admin/EmployeesPromotionHistoryPage';
import EmployeesTrainingManagementPage from './pages/companies/admin/EmployeesTrainingManagementPage';
import ManageAnouncementPage from './pages/companies/admin/settings/ManageAnouncementPage';
import ManageBenefitsPage from './pages/companies/admin/settings/ManageBenefitsPage';
import ManageCheckInPage from './pages/companies/admin/settings/ManageCheckInPage';
import ManageDepartmentPage from './pages/companies/admin/settings/ManageDepartmentPage';
import ManageEmployeesPermissionPage from './pages/companies/admin/settings/ManageEmployeesPermissionPage';
import ManageEmployeesPositionPage from './pages/companies/admin/settings/ManageEmployeesPositionPage';
import ManagePermissionPage from './pages/companies/admin/settings/ManagePermissionPage';
import ManageRecruitmentPage from './pages/companies/admin/settings/ManageRecruitmentPage';
import AdminNavBar from './components/AdminNavBar';
import RoutesComponent from './components/RoutesComponent';

const Protected: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const isMessageDisplayed = useRef(false);


  useEffect(() => {
    if (!user && !isMessageDisplayed.current) {

      message.error('请登录后再执行此操作');
      isMessageDisplayed.current = true;
      navigate('/login');
    }
  }, [user]);

  return <>{children}</>;
};

const ProtectedEmployee: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const isMessageDisplayed = useRef(false);


  useEffect(() => {
    if (!user && !isMessageDisplayed.current) {

      message.error('请登录后再执行此操作');
      isMessageDisplayed.current = true;
      navigate('/login');
    }
  }, [user]);

  return <>{children}</>;
};

const ProtectedAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const employees = useSelector((state: RootState) => state.employee.employees);
  const navigate = useNavigate();
  const isMessageDisplayed = useRef(false);


  useEffect(() => {
    if (!employees && !isMessageDisplayed.current) {

      message.error('请登录后再执行此操作');
      isMessageDisplayed.current = true;
      navigate('/login');
    }
  }, [employees]);

  return <>{children}</>;
};

const App: React.FC = () => {

  // 定义 dispatch 类型
  type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;
  const dispatch: AppDispatch = useDispatch();
  const checkToken = useSelector(selectAccessToken);

  useEffect(() => {
    const interval = setInterval(() => {
      if (checkToken) {
        dispatch(validateUserToken(checkToken));
      }
    }, 300000); // 每隔5min执行一次验证操作

    return () => {
      clearInterval(interval); // 在组件卸载时清除定时器
    };
  }, [checkToken]);

  return (
    <Layout style={{minHeight:'150vh'}}>
    <Router>
      <LoadingScreen>
        <Navbar />
        <AdminNavBar />
        <RoutesComponent/>
      </LoadingScreen>
    </Router>
    </Layout>

    // <Layout>
    // <Router>
    //   <LoadingScreen>
    //     <Navbar />
    //     <div style={{display:'flex', width:'100%', position: 'absolute', top: 64, left: 0}}>
    //       <div style={{ position:'sticky', top:64 }}>
    //         <AdminNavBar />
    //       </div>
    //       <div style={{maxWidth:'100%', marginLeft:'16px', marginRight:'16px', flex: 1}}>
    //          <Routes>
    //           <Route path="/" element={<Home />} />
    //           <Route path="/login" element={<Login />} />
    //           <Route path="/register" element={<Register />} />
    //           <Route path="/detailsPage/:id" element={<ApplicationDetailsPage />} />

    //           {/* Users */}
    //           <Route path="/profile" element={<Protected><Profile /></Protected>} />
    //           <Route path="/resumes" element={<Protected><ResumePage /></Protected>} /> {/* 创建新的resume */}
    //           <Route path="/resumes/:id" element={<Protected><ResumePage /></Protected>} /> {/* 编辑现有的resume */}

    //           {/* Employees */}
    //           <Route path="/company/:companyId/checkIn" element={<ProtectedEmployee><CheckIn /></ProtectedEmployee>} />
    //           <Route path="/company/:companyId/feedback" element={<ProtectedEmployee><FeedBack /></ProtectedEmployee>} />
    //           <Route path="/company/:companyId/applicationleave" element={<ProtectedEmployee><ApplicationLeave /></ProtectedEmployee>} />


    //           {/* Admin */}

    //           <Route path='company/list' element={<ProtectedAdmin><CompaniesPage /></ProtectedAdmin>} /> {/* X */}
    //           <Route path='company/create-company' element={<ProtectedAdmin><CreateCompaniesPage /></ProtectedAdmin>} />  {/* X */}
    //           <Route path='company/:id/view' element={<ProtectedAdmin><CompanyDetailPage /></ProtectedAdmin>} /> {/* 1 */}

    //           <Route path='admin/company/:id/employees' element={<ProtectedAdmin><CompanyEmployeesPage /></ProtectedAdmin>} />  {/* X */}
    //           <Route path='admin/company/:id/feedback' element={<ProtectedAdmin><EmployeesFeedbackPage /></ProtectedAdmin>} />
    //           <Route path='admin/company/:id/performance' element={<ProtectedAdmin><EmployeesPerformancePage /></ProtectedAdmin>} />
    //           <Route path='admin/company/:id/promotion-history' element={<ProtectedAdmin><EmployeesPromotionHistoryPage /></ProtectedAdmin>} />
    //           <Route path='admin/company/:id/training-management' element={<ProtectedAdmin><EmployeesTrainingManagementPage /></ProtectedAdmin>} />

    //           {/* Admin Settings */}
    //           <Route path='admin/company/:id/manage/:employee_id' element={<ProtectedAdmin><ManageEmployeesPermissionPage /></ProtectedAdmin>} />
    //           <Route path='admin/company/:id/announcement-manage/' element={<ProtectedAdmin><ManageAnouncementPage /></ProtectedAdmin>} />
    //           <Route path='admin/company/:id/benefits-manage/' element={<ProtectedAdmin><ManageBenefitsPage /></ProtectedAdmin>} />
    //           <Route path='admin/company/:id/checkIn-manage/' element={<ProtectedAdmin><ManageCheckInPage /></ProtectedAdmin>} />
    //           <Route path='admin/company/:id/department-manage/' element={<ProtectedAdmin><ManageDepartmentPage /></ProtectedAdmin>} />
    //           <Route path='admin/company/:id/position-manage/' element={<ProtectedAdmin><ManageEmployeesPositionPage /></ProtectedAdmin>} />
    //           <Route path='admin/company/:id/permission-manage/' element={<ProtectedAdmin><ManagePermissionPage /></ProtectedAdmin>} />
    //           <Route path='admin/company/:id/recruitment-manage/' element={<ProtectedAdmin><ManageRecruitmentPage /></ProtectedAdmin>} />

    //         </Routes>
    //         </div>           
    //      </div>
          
    //   </LoadingScreen>
    // </Router>
    // </Layout>


    // <Layout style={{ minHeight: '100vh', background:'yellow' }}>
    // <Router>
    //   <LoadingScreen>
    //     <Navbar />
    //     <div style={{display:'flex', width:'100%'}}>
    //       <div>
    //         <AdminNavBar />
    //       </div>
    //       <div style={{maxWidth:'100%', marginLeft:'16px', marginRight:'16px', flex: 1}}>
    //          <Routes>
    //           <Route path="/" element={<Home />} />
    //           <Route path="/login" element={<Login />} />
    //           <Route path="/register" element={<Register />} />
    //           <Route path="/detailsPage/:id" element={<ApplicationDetailsPage />} />

    //           {/* Users */}
    //           <Route path="/profile" element={<Protected><Profile /></Protected>} />
    //           <Route path="/resumes" element={<Protected><ResumePage /></Protected>} /> {/* 创建新的resume */}
    //           <Route path="/resumes/:id" element={<Protected><ResumePage /></Protected>} /> {/* 编辑现有的resume */}

    //           {/* Employees */}
    //           <Route path="/company/:companyId/checkIn" element={<ProtectedEmployee><CheckIn /></ProtectedEmployee>} />
    //           <Route path="/company/:companyId/feedback" element={<ProtectedEmployee><FeedBack /></ProtectedEmployee>} />
    //           <Route path="/company/:companyId/applicationleave" element={<ProtectedEmployee><ApplicationLeave /></ProtectedEmployee>} />


    //           {/* Admin */}

    //           <Route path='company/list' element={<ProtectedAdmin><CompaniesPage /></ProtectedAdmin>} /> {/* X */}
    //           <Route path='company/create-company' element={<ProtectedAdmin><CreateCompaniesPage /></ProtectedAdmin>} />  {/* X */}
    //           <Route path='company/:id/view' element={<ProtectedAdmin><CompanyDetailPage /></ProtectedAdmin>} /> {/* 1 */}

    //           <Route path='admin/company/:id/employees' element={<ProtectedAdmin><CompanyEmployeesPage /></ProtectedAdmin>} />  {/* X */}
    //           <Route path='admin/company/:id/feedback' element={<ProtectedAdmin><EmployeesFeedbackPage /></ProtectedAdmin>} />
    //           <Route path='admin/company/:id/performance' element={<ProtectedAdmin><EmployeesPerformancePage /></ProtectedAdmin>} />
    //           <Route path='admin/company/:id/promotion-history' element={<ProtectedAdmin><EmployeesPromotionHistoryPage /></ProtectedAdmin>} />
    //           <Route path='admin/company/:id/training-management' element={<ProtectedAdmin><EmployeesTrainingManagementPage /></ProtectedAdmin>} />

    //           {/* Admin Settings */}
    //           <Route path='admin/company/:id/manage/:employee_id' element={<ProtectedAdmin><ManageEmployeesPermissionPage /></ProtectedAdmin>} />
    //           <Route path='admin/company/:id/announcement-manage/' element={<ProtectedAdmin><ManageAnouncementPage /></ProtectedAdmin>} />
    //           <Route path='admin/company/:id/benefits-manage/' element={<ProtectedAdmin><ManageBenefitsPage /></ProtectedAdmin>} />
    //           <Route path='admin/company/:id/checkIn-manage/' element={<ProtectedAdmin><ManageCheckInPage /></ProtectedAdmin>} />
    //           <Route path='admin/company/:id/department-manage/' element={<ProtectedAdmin><ManageDepartmentPage /></ProtectedAdmin>} />
    //           <Route path='admin/company/:id/position-manage/' element={<ProtectedAdmin><ManageEmployeesPositionPage /></ProtectedAdmin>} />
    //           <Route path='admin/company/:id/permission-manage/' element={<ProtectedAdmin><ManagePermissionPage /></ProtectedAdmin>} />
    //           <Route path='admin/company/:id/recruitment-manage/' element={<ProtectedAdmin><ManageRecruitmentPage /></ProtectedAdmin>} />

    //         </Routes>
    //       </div>
           
    //     </div>
        
    //   </LoadingScreen>
    // </Router>
    // </Layout>
  );
};

export default App;

