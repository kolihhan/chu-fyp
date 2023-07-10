import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { logout } from '../reducers/authReducers';
import { AnyAction } from '@reduxjs/toolkit';
import { ThunkDispatch } from 'redux-thunk';
import { Dropdown, Menu } from 'antd';
import { DropDownIcon } from './NavBar';
import { selectSelectedCompany } from '../reducers/employeeReducers';

const { SubMenu, Item } = Menu;

const AdminNavBar: React.FC = () => {
    const location = useLocation();
    const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch();
    const isUser = useSelector((state: RootState) => state.auth.user);


    const isEmployee = useSelector((state: RootState) => state.employee.employees);
    const companyNum = useSelector(selectSelectedCompany);
    const isAuthenticated = useSelector((state: RootState) => state.auth.accessToken);

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <div style={{ backgroundColor: '#f0f2f5', padding: '10px' }}>
            <Menu mode="vertical" theme="light" style={{ border: 'none' }} selectedKeys={[location.pathname]}>
                <SubMenu key="sub1" title="公司">
                    <Item key="list">
                        <Link to="/admin/company/list">公司列表</Link>
                    </Item>
                    <Item key="create-company">
                        <Link to="/admin/company/create-company">创建公司</Link>
                    </Item>
                </SubMenu>
                <SubMenu key="sub2" title="管理員設定">
                    <Item key="announcement-manage">
                        <Link to={`/admin/company/${isEmployee[isEmployee[companyNum].company_id.id].company_id.id}/announcement-manage`}>公告管理</Link>
                    </Item>
                    <Item key="benefits-manage">
                        <Link to={`/admin/company/${isEmployee[companyNum].company_id.id}/benefits-manage`}>福利管理</Link>
                    </Item>
                    <Item key="checkIn-manage">
                        <Link to={`/admin/company/${isEmployee[companyNum].company_id.id}/checkIn-manage`}>打卡管理</Link>
                    </Item>
                    <Item key="department-manage">
                        <Link to={`/admin/company/${isEmployee[companyNum].company_id.id}/department-manage`}>部門管理</Link>
                    </Item>
                    <Item key="position-manage">
                        <Link to={`/admin/company/${isEmployee[companyNum].company_id.id}/position-manage`}>職位管理</Link>
                    </Item>
                    <Item key="permission-manage">
                        <Link to={`/admin/company/${isEmployee[companyNum].company_id.id}/permission-manage`}>權限管理</Link>
                    </Item>
                    <Item key="recruitment-manage">
                        <Link to={`/admin/company/${isEmployee[companyNum].company_id.id}/recruitment-manage`}>招聘管理</Link>
                    </Item>
                </SubMenu>
            </Menu>

            <Menu mode="horizontal" theme="light" selectedKeys={[location.pathname]}>
                <>
                    <span className="ml-auto mr-3"></span>
                </>
                <DropDownIcon isManage={isUser?.type !== "staff"} isEmployee={isEmployee} companyId={isEmployee[isEmployee[companyNum].company_id.id].company_id} />
            </Menu>

        </div>

    );
};

export default AdminNavBar;
