import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { logout } from '../reducers/authReducers';
import { AnyAction } from '@reduxjs/toolkit';
import { ThunkDispatch } from 'redux-thunk';
import { Dropdown, Menu } from 'antd';


const AdminNavBar: React.FC = () => {

    return  (
     <div style={{ backgroundColor: '#f0f2f5', padding: '10px' }}>
        <Menu mode="vertical" theme="light" style={{ border: 'none' }}>

        </Menu>
    </div>
    )
};

export default AdminNavBar;
