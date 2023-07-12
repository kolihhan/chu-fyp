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
  return (
    <div>
      {(isAdminPath) &&
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            theme="light"
            style={{ height: '100%', borderRight: 0 }}
            defaultOpenKeys={['sub1', 'sub2']}
            defaultSelectedKeys={['1']}
          >
            <SubMenu key="sub1" icon={<UserOutlined />} title="用户管理">
              <Menu.Item key="1">
                <Link to="/admin/user/list">用户列表</Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="/admin/user/create">创建用户</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" icon={<TeamOutlined />} title="公司管理">
              <Menu.Item key="3">
                <Link to="/admin/company/list">公司列表</Link>
              </Menu.Item>
              <Menu.Item key="4">
                <Link to="/admin/company/create">创建公司</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu key="sub3" icon={<AppstoreOutlined />} title="部门管理">
              <Menu.Item key="5">
                <Link to="/admin/department/list">部门列表</Link>
              </Menu.Item>
              <Menu.Item key="6">
                <Link to="/admin/department/create">创建部门</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu key="sub4" icon={<SolutionOutlined />} title="职位管理">
              <Menu.Item key="7">
                <Link to="/admin/position/list">职位列表</Link>
              </Menu.Item>
              <Menu.Item key="8">
                <Link to="/admin/position/create">创建职位</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu key="sub5" icon={<ApartmentOutlined />} title="部门职位管理">
              <Menu.Item key="9">
                <Link to="/admin/department-position/list">部门职位列表</Link>
              </Menu.Item>
              <Menu.Item key="10">
                <Link to="/admin/department-position/create">创建部门职位</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu key="sub6" icon={<ToolOutlined />} title="权限管理">
              <Menu.Item key="11">
                <Link to="/admin/permission/list">权限列表</Link>
              </Menu.Item>
              <Menu.Item key="12">
                <Link to="/admin/permission/create">创建权限</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu key="sub7" icon={<FileTextOutlined />} title="公告管理">
              <Menu.Item key="13">
                <Link to="/admin/announcement/list">公告列表</Link>
              </Menu.Item>
              <Menu.Item key="14">
                <Link to="/admin/announcement/create">创建公告</Link>
              </Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
      }
    </div>
    // <Sider width={200} className="site-layout-background">
    //   <Menu
    //     mode="inline"
    //     theme="light"
    //     style={{ height: '100%', borderRight: 0 }}
    //     defaultOpenKeys={['sub1', 'sub2']}
    //     defaultSelectedKeys={['1']}
    //   >
    //     <SubMenu key="sub1" icon={<UserOutlined />} title="用户管理">
    //       <Menu.Item key="1">
    //         <Link to="/admin/user/list">用户列表</Link>
    //       </Menu.Item>
    //       <Menu.Item key="2">
    //         <Link to="/admin/user/create">创建用户</Link>
    //       </Menu.Item>
    //     </SubMenu>
    //     <SubMenu key="sub2" icon={<TeamOutlined />} title="公司管理">
    //       <Menu.Item key="3">
    //         <Link to="/admin/company/list">公司列表</Link>
    //       </Menu.Item>
    //       <Menu.Item key="4">
    //         <Link to="/admin/company/create">创建公司</Link>
    //       </Menu.Item>
    //     </SubMenu>
    //     <SubMenu key="sub3" icon={<AppstoreOutlined />} title="部门管理">
    //       <Menu.Item key="5">
    //         <Link to="/admin/department/list">部门列表</Link>
    //       </Menu.Item>
    //       <Menu.Item key="6">
    //         <Link to="/admin/department/create">创建部门</Link>
    //       </Menu.Item>
    //     </SubMenu>
    //     <SubMenu key="sub4" icon={<SolutionOutlined />} title="职位管理">
    //       <Menu.Item key="7">
    //         <Link to="/admin/position/list">职位列表</Link>
    //       </Menu.Item>
    //       <Menu.Item key="8">
    //         <Link to="/admin/position/create">创建职位</Link>
    //       </Menu.Item>
    //     </SubMenu>
    //     <SubMenu key="sub5" icon={<ApartmentOutlined />} title="部门职位管理">
    //       <Menu.Item key="9">
    //         <Link to="/admin/department-position/list">部门职位列表</Link>
    //       </Menu.Item>
    //       <Menu.Item key="10">
    //         <Link to="/admin/department-position/create">创建部门职位</Link>
    //       </Menu.Item>
    //     </SubMenu>
    //     <SubMenu key="sub6" icon={<ToolOutlined />} title="权限管理">
    //       <Menu.Item key="11">
    //         <Link to="/admin/permission/list">权限列表</Link>
    //       </Menu.Item>
    //       <Menu.Item key="12">
    //         <Link to="/admin/permission/create">创建权限</Link>
    //       </Menu.Item>
    //     </SubMenu>
    //     <SubMenu key="sub7" icon={<FileTextOutlined />} title="公告管理">
    //       <Menu.Item key="13">
    //         <Link to="/admin/announcement/list">公告列表</Link>
    //       </Menu.Item>
    //       <Menu.Item key="14">
    //         <Link to="/admin/announcement/create">创建公告</Link>
    //       </Menu.Item>
    //     </SubMenu>
    //   </Menu>
    // </Sider>
  );
};

export default AdminNavBar;
