import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  DesktopOutlined,
  UserOutlined,
  TeamOutlined,
  AppstoreOutlined,
  SolutionOutlined,
  ApartmentOutlined,
  ToolOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { getCookie } from '../utils';

const { Sider } = Layout;
const { SubMenu } = Menu;

const AdminNavBar: React.FC = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  const screenHeight = window.innerHeight;
  const id = getCookie('companyId')

  const linkEmployeeList = `/admin/company/employees`
  const linkCreateEmployee = `/admin/user/create` //todo
  const linkCompanyList = `/admin/company/list`
  const linkCreateCompany = `/admin/company/create`
  const linkManageDepartment = `/admin/company/department-manage/`
  const linkPosition = `admin/company/position-manage`
  const linkAnnouncement = `admin/company/announcement-manage/`
  // const linkCreateDepartment = `/admin/department/create`
  // const linkCreatePosition = `/admin/position/create`
  // const linkPermission = `/admin/permission/list`
  // const linkCreatePermission = `/admin/permission/create`
  // const linkCreateAnnouncement = `/admin/permission/create`

  return (
    <div style={{height:screenHeight-64, position:'fixed', top:64, bottom:0, left:0, overflowY:'auto', background:'white'}}>
        {(isAdminPath) &&
          <Sider width={200} className="site-layout-background">
            <Menu
              mode="inline"
              theme="light"
              style={{ height: '100%', borderRight: 0 }}
              defaultOpenKeys={['sub1', 'sub2']}
              defaultSelectedKeys={['1']} >
              <SubMenu key="sub1" icon={<UserOutlined />} title="職員管理">
                <Menu.Item key="1">
                  <Link to={linkEmployeeList}>公司職員</Link>
                </Menu.Item>
                <Menu.Item key="2">
                  <Link to={linkCreateEmployee}>新增職員</Link>
                </Menu.Item>
              </SubMenu>
              <SubMenu key="sub2" icon={<TeamOutlined />} title="公司管理">
                <Menu.Item key="3">
                  <Link to={linkCompanyList}>公司列表</Link>
                </Menu.Item>
                <Menu.Item key="4">
                  <Link to={linkCreateCompany}>创建公司</Link>
                </Menu.Item>
              </SubMenu>
              <SubMenu key="sub3" icon={<AppstoreOutlined />} title="部門&職位管理">
                <Menu.Item key="5">
                  <Link to={linkManageDepartment}>部门列表</Link>
                </Menu.Item>
                <Menu.Item key="7">
                  <Link to={linkPosition}>职位列表</Link>
                </Menu.Item>
              </SubMenu>
              <SubMenu key="sub7" icon={<FileTextOutlined />} title="公告管理">
                <Menu.Item key="13">
                  <Link to={linkAnnouncement}>公告列表</Link>
                </Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
        }
    </div>
  );
};

export default AdminNavBar;
