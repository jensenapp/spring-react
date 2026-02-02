import React, { useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/auth-context';

export default function ProtectedRoute() {
  // 1. 從我們自定義的 Hook 取得「是否已登入」的狀態
  const { isAuthenticated } = useAuth();
  
  // 2. 取得當前網址物件
  const location = useLocation();

  // 3. 紀錄重新導向路徑 (UX 優化 + 防呆邏輯)
  useEffect(() => {
    // [新增] 讀取「是否跳過紀錄」的標記
    // 通常在執行「登出(Logout)」動作前，會將此標記設為 "true"
    const skipRedirect = sessionStorage.getItem("skipRedirectPath") === "true";

    // 判斷邏輯：
    // (1) 使用者未登入
    // (2) 當前路徑不是登入頁
    // (3) 且沒有被標記為「跳過」 (!skipRedirect)
    if (!isAuthenticated && location.pathname !== "/login" && !skipRedirect) {
      
      // 只有在「非主動登出」的情況下 (例如 Token 過期、直接輸入網址)，
      // 才將這個路徑存起來，供登入後跳轉使用
      sessionStorage.setItem("redirectPath", location.pathname);
    }
  }, [isAuthenticated, location.pathname]); 
  
  // 4. 核心渲染邏輯：已登入顯示內容，未登入踢回 Login 頁
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}