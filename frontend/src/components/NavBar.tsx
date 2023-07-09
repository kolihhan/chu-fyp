import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { logout } from '../reducers/authReducers';
import { AnyAction } from '@reduxjs/toolkit';
import { ThunkDispatch } from 'redux-thunk';
import { Menu, Dropdown, Button, Collapse } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { UserOutlined, TeamOutlined } from '@ant-design/icons';

import AdminNavBar from './AdminNavBar';
import { selectSelectedCompany, setSelectCompany } from '../reducers/employeeReducers';


const { SubMenu, Item, Divider } = Menu;
const { Panel } = Collapse;

const DropDownIcon: React.FC<{ isManage: boolean; isEmployee: any[]; companyId: number }> = ({
  isManage,
  isEmployee,
  companyId,
}) => {
  // 定义 dispatch 类型
  type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

  const dispatch: AppDispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const isAuthenticated = useSelector((state: RootState) => state.auth.accessToken);
  const isUser = useSelector((state: RootState) => state.auth.user);
  const companyNum = useSelector(selectSelectedCompany);

  const menuItems: React.ReactNode[] = [];

  if (isManage) {
    menuItems.push(

      <Item key="admin-grp" title="管理員專區" icon={<TeamOutlined />} className="menu-group">
        <Link to="/admin">管理員專區</Link>
        <Divider />
      </Item>



    );
  }

  if (isEmployee && isEmployee[companyNum]) {
    menuItems.push(
      <Menu.ItemGroup key="employee-grp" title={<span><UserOutlined /> 會員專區</span>}>
      <Menu.Item key="employee-page">
        <Link to={`/company/${companyId}/checkIn`}>首頁</Link>
      </Menu.Item>
      <Menu.Item key="employee-feedback">
        <Link to={`/company/${companyId}/feedback`}>Feedback</Link>
      </Menu.Item>
      <Menu.Item key="employee-application">
        <Link to={`/company/${companyId}/applicationleave`}>ApplicationLeave</Link>
      </Menu.Item>
      <Divider />
    </Menu.ItemGroup>
    );
  }


  menuItems.push(

    <Item key="profile-key">
      <Link to="/profile">Profile</Link>
    </Item>,
    <Item key="logout-key" onClick={handleLogout}>
      Logout
    </Item>

  );




  const menu = <Menu>{menuItems}</Menu>;
  const imageUrl = (isAuthenticated) ? isUser?.avatarUrl ?? "https://picsum.photos/200/300" : 'https://picsum.photos/200/300';


  return (
    <Dropdown overlay={menu} arrow={false}>
      <Button
        className="mt-2 mb-2 btn btn-secondary dropdown-toggle rounded-circle"
        shape="circle"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          width: '50px',
          height: '50px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', // Add box shadow for a subtle shadow effect
        }}
      />
    </Dropdown >
  );
};



const CompanySwitcher: React.FC<{ isEmployee: any[], companyNum: number }> = ({ isEmployee, companyNum }) => {
  type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

  const dispatch: AppDispatch = useDispatch();

  const handleCompanySelect = (companyId: number) => {
    dispatch(setSelectCompany(companyId));
  };

  const menu = (
    <Menu>
      {isEmployee.map((company, i) => (
        <Item key={company.id} onClick={() => handleCompanySelect(i)}>
          {company.name}
          <Divider />
        </Item>

      ))}
    </Menu>
  );

  return (
    <Dropdown overlay={menu}>
      <a className="ml-auto mr-3 ant-dropdown-link" href='' onClick={(e) => e.preventDefault()}>
        {isEmployee[companyNum].name}
      </a>
    </Dropdown>
  );
};

const Navbar: React.FC = () => {
  const location = useLocation();

  const isUser = useSelector((state: RootState) => state.auth.user);
  const isAdminPath = location.pathname.startsWith('/admin');
  const isEmployee = useSelector((state: RootState) => state.employee.employees);
  const companyNum = useSelector(selectSelectedCompany);
  const isAuthenticated = useSelector((state: RootState) => state.auth.accessToken);

  console.log(companyNum);
  console.log(isEmployee[companyNum]);

  return (isAdminPath) ? (
    <AdminNavBar />
  ) : (
    <div style={{ backgroundColor: '#f0f2f5' }}>
      <Header className="navbar navbar-expand navbar-light bg-light">
        <div className="navbar-brand">
          <a href="/"><img src="#" alt="Logo" /></a>
        </div>
        <Menu theme="light" mode="horizontal" defaultSelectedKeys={['1']}>
          <Item key="1">
            <Link to='/'>首頁</Link>
          </Item>

        </Menu>

        {isEmployee && isEmployee[companyNum] ? (
          <>
            {isEmployee.length > 1 ? (
              <CompanySwitcher isEmployee={isEmployee} companyNum={isEmployee[companyNum].company_id} />
            ) : (
              <span className="ml-auto mr-3">{isEmployee[companyNum].name ?? ""}</span>
            )}
          </>
        )
          :
          <>
            <span className="ml-auto mr-3"></span>
          </>
        }

        {isAuthenticated ?
          <DropDownIcon isManage={isUser?.type !== "staff"} isEmployee={isEmployee} companyId={isEmployee[companyNum].company_id} />
          :
          <Menu>
            <Item key="login-key">
              <Link to="/login">Login</Link>
            </Item>
          </Menu>
        }

      </Header>
    </div>
  )
};




export default Navbar;
