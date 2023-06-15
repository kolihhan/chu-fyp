import React from 'react';
import { useNavigate } from 'react-router-dom'; // 导入 useHistory 钩子
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { RootState } from './app/store';
import { useSelector } from 'react-redux';

import Home from './pages/Home';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import Profile from './pages/ProfilePage';
import Navbar from './components/NavBar';
import { LoadingScreen } from './components/LoadingScreen';
import { message } from 'antd';

const Protected: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  if (!user) {
      navigate('/login');
      // 显示错误消息
      message.error('请登录后再执行此操作');




  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <LoadingScreen>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/profile" element={<Protected><Profile /></Protected>} />
        </Routes>
      </LoadingScreen>
    </Router>
  );
};

export default App;

