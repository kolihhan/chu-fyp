import { Middleware } from 'redux';
import { RootState } from '../app/store';
import { message } from 'antd';

const requireAuthMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {

    const { user } = store.getState().auth; 

    if (!user) {
      const navigateToLogin = () => {
          // 显示错误消息
          message.error('请登录后再执行此操作');

          // 延迟导航到登录页面
          setTimeout(() => {
            window.location.href = '/login';
          }, 500); // 延迟 2 秒导航到登录页面
        }
        
      
  
      navigateToLogin();
      return; // Return early to prevent further execution of the action
    }
  

  return next(action);
};

export default requireAuthMiddleware;
