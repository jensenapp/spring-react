import React, { useEffect } from 'react';
import { Outlet, Navigate, useLocation} from 'react-router-dom';
import { useAuth } from '../store/auth-context';

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
 const location =useLocation();

 useEffect(()=>{
  if (!isAuthenticated && location.pathname !=="/login") {
    sessionStorage.setItem("redirectPath",location.pathname);
  }
 },[isAuthenticated,Location.pathname])
  
  // 驗證邏輯：已登入顯示子組件，否則重導向登入頁
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}
