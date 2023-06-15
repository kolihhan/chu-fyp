import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { logout } from '../reducers/authReducers';
import { AnyAction} from '@reduxjs/toolkit';
import { ThunkDispatch } from 'redux-thunk';
import { Menu } from 'antd';

const Navbar: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.accessToken);
  // 定义 dispatch 类型
  type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

  const dispatch: AppDispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };
  
  return (
    <div style={{ backgroundColor: '#f0f2f5', padding: '10px' }}>
      <Menu mode="horizontal" theme="light" style={{ border: 'none' }}>
        <Menu.Item key="home">
          <Link to="/">Home</Link>
        </Menu.Item>
        {isAuthenticated ? (
          <>
            <Menu.Item key="profile">
              <Link to="/profile">Profile</Link>
            </Menu.Item>
            <Menu.Item key="logout">
              <button onClick={handleLogout}>Logout</button>
            </Menu.Item>
          </>
        ) : (
          <Menu.Item key="login">
            <Link to="/login">Login</Link>
          </Menu.Item>
        )}
      </Menu>
    </div>
  );
};

export default Navbar;
