import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { useEffect, useRef, useState } from "react";
import { message } from "antd";
import Home from "../pages/Home";
import Login from "../pages/LoginPage";
import Register from "../pages/RegisterPage";
import ApplicationDetailsPage from "../pages/ApplicationDetailsPage";
import ProfilePage from "../pages/ProfilePage";
import ResumePage from "../pages/ResumePage";
import CheckInPage from "../pages/companies/employees/CheckInPage";
import FeedBackPage from "../pages/companies/employees/FeedBackPage";
import ApplicationLeavePage from "../pages/companies/employees/ApplicationLeavePage";
import CompaniesPage from "../pages/companies/admin/CompaniesPage";
import CreateCompaniesPage from "../pages/companies/admin/CreateCompaniesPage";
import CompanyDetailPage from "../pages/companies/admin/CompanyDetailPage";
import CompanyEmployeesPage from "../pages/companies/admin/CompanyEmployeesPage";
import EmployeesFeedbackPage from "../pages/companies/admin/EmployeesFeedbackPage";
import EmployeesPerformancePage from "../pages/companies/admin/EmployeesPerformancePage";
import EmployeesPromotionHistoryPage from "../pages/companies/admin/EmployeesPromotionHistoryPage";
import EmployeesTrainingManagementPage from "../pages/companies/admin/EmployeesTrainingManagementPage";
import ManageEmployeesPermissionPage from "../pages/companies/admin/settings/ManageEmployeesPermissionPage";
import ManageAnouncementPage from "../pages/companies/admin/settings/ManageAnouncementPage";
import ManageBenefitsPage from "../pages/companies/admin/settings/ManageBenefitsPage";
import ManageCheckInPage from "../pages/companies/admin/settings/ManageCheckInPage";
import ManageDepartmentPage from "../pages/companies/admin/settings/ManageDepartmentPage";
import ManageEmployeesPositionPage from "../pages/companies/admin/settings/ManageEmployeesPositionPage";
import ManagePermissionPage from "../pages/companies/admin/settings/ManagePermissionPage";
import ManageRecruitmentPage from "../pages/companies/admin/settings/ManageRecruitmentPage";
import EmployeeHomePage from "../pages/companies/employees/EmployeeHomePage";
import ManageEmployeeLeavePage from "../pages/companies/admin/settings/ManageEmployeeLeavePage";
import EmployeesRecruitmentRecommendation from "../pages/companies/admin/EmployeesRecruitmentRecommendation";
import EmployeeProfilePage from "../pages/companies/employees/EmployeeProfilePage";
import CompanyTaskForcePage from "../pages/companies/admin/companyTaskList/CompanyTaskForcePage";
import CompanyCreateTaskForcePage from "../pages/companies/admin/companyTaskList/CompanyCreateTaskForcePage";
import CompanyCreateTaskPage from "../pages/companies/admin/companyTaskList/companyTask/CompanyCreateTaskPage";
import CompanyTaskDetailPage from "../pages/companies/admin/companyTaskList/companyTask/CompanyTaskDetailPage";
import EmployeeTaskPage from "../pages/companies/employees/EmployeeTaskPage";
import EmployeeTaskForcePage from "../pages/companies/employees/EmployeeTaskForcePage";

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
  
const RoutesComponent: React.FC = () =>{
    const location = useLocation();
    const isAdminPath = location.pathname.startsWith('/admin');
    const [leftSize, setLeftSize] = useState(0)
    useEffect(() => {
        if (isAdminPath) setLeftSize(216)
        else setLeftSize(16)
    })
    return (
        <div style={{position: 'absolute', top: 64, left: leftSize, right:16}}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/detailsPage/:id" element={<ApplicationDetailsPage />} />

                {/* Users */}
                <Route path="/profile" element={<Protected><ProfilePage /></Protected>} />
                <Route path="/resumes" element={<Protected><ResumePage /></Protected>} /> {/* 创建新的resume */}
                <Route path="/resumes/:id" element={<Protected><ResumePage /></Protected>} /> {/* 编辑现有的resume */}

                {/* Employees */}
                <Route path="/company/home" element={<ProtectedEmployee><EmployeeHomePage /></ProtectedEmployee>} />
                <Route path="/company/checkIn" element={<ProtectedEmployee><CheckInPage /></ProtectedEmployee>} />
                <Route path="/company/feedback" element={<ProtectedEmployee><FeedBackPage /></ProtectedEmployee>} />
                <Route path="/company/employee/profile" element={<ProtectedEmployee><EmployeeProfilePage /></ProtectedEmployee>} />
                <Route path="/company/applicationleave" element={<ProtectedEmployee><ApplicationLeavePage /></ProtectedEmployee>} />
                <Route path="/company/tasks" element={<ProtectedEmployee><EmployeeTaskPage /></ProtectedEmployee>} />
                <Route path="/company/employee/taskforce" element={<ProtectedAdmin><EmployeeTaskForcePage /></ProtectedAdmin>} />
                <Route path="company/task-list/create" element={<ProtectedAdmin><CompanyCreateTaskForcePage /></ProtectedAdmin>} /> {/* 创建新的 */}
                <Route path="company/task-list/:id/update" element={<ProtectedAdmin><CompanyCreateTaskForcePage /></ProtectedAdmin>} /> {/* 编辑现有 */}
                <Route path="company/task-list/:id/details" element={<ProtectedAdmin><CompanyTaskDetailPage /></ProtectedAdmin>} /> {/* 编辑现有 */}
                <Route path="company/task-list/:id/details/create" element={<ProtectedAdmin><CompanyCreateTaskPage /></ProtectedAdmin>} /> {/* 编辑现有 */}


                {/* Admin */}
                <Route path='company/list' element={<ProtectedAdmin><CompaniesPage /></ProtectedAdmin>} /> {/* X */}
                <Route path='company/create-company' element={<ProtectedAdmin><CreateCompaniesPage /></ProtectedAdmin>} />  {/* X */}
                <Route path='company/view' element={<ProtectedAdmin><CompanyDetailPage /></ProtectedAdmin>} /> {/* 1 */}
                <Route path='admin/company/list' element={<ProtectedAdmin><CompaniesPage /></ProtectedAdmin>} /> {/* X */}
                <Route path='admin/company/create' element={<ProtectedAdmin><CreateCompaniesPage /></ProtectedAdmin>} />  {/* X */}

                <Route path='admin/company/employees' element={<ProtectedAdmin><CompanyEmployeesPage /></ProtectedAdmin>} />  {/* X */}
                <Route path='admin/company/:id/feedback' element={<ProtectedAdmin><EmployeesFeedbackPage /></ProtectedAdmin>} />
                <Route path='admin/company/:id/performance' element={<ProtectedAdmin><EmployeesPerformancePage /></ProtectedAdmin>} />
                <Route path='admin/company/:id/promotion-history' element={<ProtectedAdmin><EmployeesPromotionHistoryPage /></ProtectedAdmin>} />
                <Route path='admin/company/:id/training-management' element={<ProtectedAdmin><EmployeesTrainingManagementPage /></ProtectedAdmin>} />
                <Route path="admin/company/recommend" element={<ProtectedAdmin><EmployeesRecruitmentRecommendation /></ProtectedAdmin>} />
                
                {/* Admin Settings */}
                <Route path='admin/company/manage/:employee_id' element={<ProtectedAdmin><ManageEmployeesPermissionPage /></ProtectedAdmin>} />
                <Route path='admin/company/announcement-manage/' element={<ProtectedAdmin><ManageAnouncementPage /></ProtectedAdmin>} />
                <Route path='admin/company/benefits-manage/' element={<ProtectedAdmin><ManageBenefitsPage /></ProtectedAdmin>} />
                <Route path='admin/company/:id/checkIn-manage/' element={<ProtectedAdmin><ManageCheckInPage /></ProtectedAdmin>} />
                <Route path='admin/company/department-manage/' element={<ProtectedAdmin><ManageDepartmentPage /></ProtectedAdmin>} />
                <Route path='admin/company/position-manage/' element={<ProtectedAdmin><ManageEmployeesPositionPage /></ProtectedAdmin>} />
                <Route path='admin/company/:id/permission-manage/' element={<ProtectedAdmin><ManagePermissionPage /></ProtectedAdmin>} />
                <Route path='admin/company/recruitment-manage/' element={<ProtectedAdmin><ManageRecruitmentPage /></ProtectedAdmin>} />
                <Route path='admin/company/leave-manage/' element={<ProtectedAdmin><ManageEmployeeLeavePage /></ProtectedAdmin>} />

      
                <Route path="admin/company/task-list" element={<ProtectedAdmin><CompanyTaskForcePage /></ProtectedAdmin>} />
                <Route path="admin/company/task-list/create" element={<ProtectedAdmin><CompanyCreateTaskForcePage /></ProtectedAdmin>} /> {/* 创建新的 */}
                <Route path="admin/company/task-list/:id/update" element={<ProtectedAdmin><CompanyCreateTaskForcePage /></ProtectedAdmin>} /> {/* 编辑现有 */}

                <Route path="admin/company/task-list/:id/details" element={<ProtectedAdmin><CompanyTaskDetailPage /></ProtectedAdmin>} /> {/* 编辑现有 */}
                <Route path="admin/company/task-list/:id/details/create" element={<ProtectedAdmin><CompanyCreateTaskPage /></ProtectedAdmin>} /> {/* 编辑现有 */}


            </Routes>
        </div>
        
    )
}

export default RoutesComponent