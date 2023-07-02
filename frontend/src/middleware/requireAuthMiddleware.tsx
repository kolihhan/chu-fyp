import { message } from 'antd';

async function requireAuthMiddleware(store: any) {
  const { user } = store.getState().auth; 

  if (!user) {
    // 显示错误消息
    message.error('请登录后再执行此操作');

    // 延迟导航到登录页面
    setTimeout(() => {
      window.location.href = '/login';
    }, 500); // 延迟 2 秒导航到登录页面

    return false;
  }

  return true;
}

export default requireAuthMiddleware;
