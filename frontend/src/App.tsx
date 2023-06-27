import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // 导入 useHistory 钩子
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
import { message } from 'antd';




import { fetchUsersInfo, selectAccessToken } from './reducers/authReducers';
import { AnyAction } from '@reduxjs/toolkit';
import { ThunkDispatch } from 'redux-thunk';

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
  }, [user, navigate]);

  return <>{children}</>;
};


const App: React.FC = () => {

  // 定义 dispatch 类型
  type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;
  const dispatch: AppDispatch = useDispatch();
  const checkToken = useSelector(selectAccessToken);

  useEffect(() => {
    // 从sessionStorage中获取accessToken
    const accessToken = sessionStorage.getItem('accessToken');

    if (!checkToken && accessToken) {
       // 将accessToken存储到Redux状态中
       dispatch(fetchUsersInfo(accessToken));
    }

  }, [dispatch, checkToken]);


  return (
    <Router>
      <LoadingScreen>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/detailsPage/:id" element={<ApplicationDetailsPage />} />

          <Route path="/profile" element={<Protected><Profile /></Protected>} />
        </Routes>
      </LoadingScreen>
    </Router>
  );
};

export default App;

