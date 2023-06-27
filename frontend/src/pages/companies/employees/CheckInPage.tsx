import React, { useState } from 'react';
import { Button, message } from 'antd';

const CheckInPage: React.FC = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const handleCheckIn = () => {
    // 模拟签到过程
    // 可以将实际的签到逻辑替换为后端 API 调用或其他操作
    // 在这里可以处理异步请求、更新状态等操作

    // 假设签到成功
    setIsCheckedIn(true);
    message.success('签到成功！');
  };

  const handleCheckOut = () => {
    // 模拟签出过程
    // 可以将实际的签出逻辑替换为后端 API 调用或其他操作
    // 在这里可以处理异步请求、更新状态等操作

    // 假设签出成功
    setIsCheckedIn(false);
    message.success('签出成功！');
  };

  return (
    <div>
      <h1>Check-In Page</h1>
      {isCheckedIn ? (
        <div>
          <p>您已经签到。</p>
          <Button type="primary" onClick={handleCheckOut}>
            签出
          </Button>
        </div>
      ) : (
        <div>
          <p>请点击下方按钮完成签到。</p>
          <Button type="primary" onClick={handleCheckIn}>
            签到
          </Button>
        </div>
      )}
    </div>
  );
};

export default CheckInPage;
