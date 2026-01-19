import './App.css'
import Header from './components/Header'
import Home from './components/Home';
import { Outlet, useNavigation } from "react-router-dom";
import Footer from './components/footer/Footer';
import React from 'react';


function App() {
    const navigation=useNavigation(); // 獲取導航物件
return (
    <>
      <Header />
      {/* 判斷狀態 */}
      {navigation.state === "loading" ? (
        // 🔹 載入時顯示的 UI
        <div className="flex items-center justify-center min-h-[852px]">
           <span className="text-4xl font-semibold text-primary dark:text-light">
             Loading...
           </span>
        </div>
      ) : (
        // 🔹 資料載入完畢，顯示實際內容
        <Outlet />
      )}
      <Footer />
    </>
  );
}

export default App
