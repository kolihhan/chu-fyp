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

const { Sider } = Layout;
const { SubMenu } = Menu;

const AdminNavBar: React.FC = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  const screenHeight = window.innerHeight;
  const id = sessionStorage.getItem('companyId')

  const linkEmployeeList = `/admin/company/${id}/employees`
  const linkCreateEmployee = `/admin/user/create` //todo
  const linkCompanyList = `/admin/company/list`
  const linkCreateCompany = `/admin/company/create`
  const linkManageDepartment = `/admin/company/${id}/department-manage/`
  const linkCreateDepartment = `/admin/department/create` //todo
  const linkPosition = `/admin/position/list` //todo
  const linkCreatePosition = `/admin/position/create` //todo
  const linkPermission = `/admin/permission/list` //todo
  const linkCreatePermission = `/admin/permission/create` //todo
  const linkAnnouncement = `/admin/permission/create` //todo
  const linkCreateAnnouncement = `/admin/permission/create` //todo

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
              <SubMenu key="sub1" icon={<UserOutlined />} title="用户管理">
                <Menu.Item key="1">
                  <Link to={linkEmployeeList}>公司職員</Link>
                </Menu.Item>
                <Menu.Item key="2">
                  <Link to={linkCreateEmployee}>创建用户</Link>
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
              <SubMenu key="sub3" icon={<AppstoreOutlined />} title="部门管理">
                <Menu.Item key="5">
                  <Link to={linkManageDepartment}>部门列表</Link>
                </Menu.Item>
                <Menu.Item key="6">
                  <Link to={linkCreateDepartment}>创建部门</Link>
                </Menu.Item>
              </SubMenu>
              <SubMenu key="sub4" icon={<SolutionOutlined />} title="职位管理">
                <Menu.Item key="7">
                  <Link to={linkPosition}>职位列表</Link>
                </Menu.Item>
                <Menu.Item key="8">
                  <Link to={linkCreatePosition}>创建职位</Link>
                </Menu.Item>
              </SubMenu>
              {/* <SubMenu key="sub5" icon={<ApartmentOutlined />} title="部门职位管理">
                <Menu.Item key="9">
                  <Link to="/admin/department-position/list">部门职位列表</Link>
                </Menu.Item>
                <Menu.Item key="10">
                  <Link to="/admin/department-position/create">创建部门职位</Link>
                </Menu.Item>
              </SubMenu> */}
              <SubMenu key="sub6" icon={<ToolOutlined />} title="权限管理">
                <Menu.Item key="11">
                  <Link to={linkPermission}>权限列表</Link>
                </Menu.Item>
                <Menu.Item key="12">
                  <Link to={linkCreatePermission}>创建权限</Link>
                </Menu.Item>
              </SubMenu>
              <SubMenu key="sub7" icon={<FileTextOutlined />} title="公告管理">
                <Menu.Item key="13">
                  <Link to={linkAnnouncement}>公告列表</Link>
                </Menu.Item>
                <Menu.Item key="14">
                  <Link to={linkCreateAnnouncement}>创建公告</Link>
                </Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
        }
    </div>
  );
};

export default AdminNavBar;
