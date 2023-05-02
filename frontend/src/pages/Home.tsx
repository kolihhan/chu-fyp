import React, { useEffect } from 'react';


const Home: React.FC = () => {
  useEffect(() => {
        document.title = "Home"; // 設置新的網頁標題
      });

  return (
    <h1>Test Page</h1>
  );
};

export default Home;
