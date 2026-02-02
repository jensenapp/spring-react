import React, { useEffect } from "react";
import PageTitle from "./PageTitle";
// 引入 React Router 的表單處理相關 Hooks
import { Link, Form, useActionData, useNavigation, useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import { toast } from "react-toastify";
import { useAuth } from "../store/auth-context";


export default function Login() {
  // 1. 獲取 Action 回傳的結果 (對應下方的 loginAction)
  // 如果 action 執行完畢，這裡會收到 return 的物件 (如 { success: true, ... })
  const actionData = useActionData();

  // 2. 獲取導航狀態 (例如: "idle", "submitting", "loading")
  const navigation = useNavigation();
  
  // 3. 獲取程式化導航函數 (用來手動切換頁面)
  const navigate = useNavigate();
  
  // 4. 從 AuthContext 取得 "更新全域登入狀態" 的函數
  const { loginSuccess } = useAuth(); 
  
  // 5. 決定登入後要跳轉去哪裡
  // 優先嘗試讀取 ProtectedRoute 存下的 "原本想去的路徑"
  // 如果沒有，則預設跳轉回 "/home"
  const from = sessionStorage.getItem("redirectPath") || "/home";

  // --- 監聽登入結果 ---
  useEffect(() => {
    // 如果 actionData 存在且標記為成功
    if (actionData?.success) {
      // A. 更新全域 Context 狀態 (這會觸發 AuthProvider 把 Token 寫入 LocalStorage)
      loginSuccess(actionData.jwtToken, actionData.user);
      
      // B. 任務完成，清除 Session Storage 中的重導向路徑，避免下次誤用
      sessionStorage.removeItem("redirectPath");
      
      // C. 延遲跳轉 (為了確保 Context 更新完成，雖然通常不需要 setTimeout，但這裡加上 100ms 緩衝更保險)
      setTimeout(() => {
        navigate(from); // 執行跳轉
      }, 100);
      
    } else if (actionData?.errors) {
      // 如果 actionData 包含錯誤訊息，顯示 Toast 通知
      toast.error(actionData.errors.message || "Login failed");
    }
  }, [actionData]); // 當 actionData 改變時 (即表單提交後) 觸發


  // 判斷當前是否正在提交表單中 (用來鎖定按鈕)
  const isSubmitting = navigation.state === "submitting";

  // 定義樣式 (Tailwind CSS)
  const labelStyle =
    "block text-lg font-semibold text-primary dark:text-light mb-2";
  const textFieldStyle =
    "w-full px-4 py-2 text-base border rounded-md transition border-primary dark:border-light focus:ring focus:ring-dark dark:focus:ring-lighter focus:outline-none text-gray-800 dark:text-lighter bg-white dark:bg-gray-600 placeholder-gray-400 dark:placeholder-gray-300";
    
  return (
    <div className="min-h-[852px] flex items-center justify-center font-primary dark:bg-darkbg">
      <div className="bg-white dark:bg-gray-700 shadow-md rounded-lg max-w-md w-full px-8 py-6">
        {/* 標題組件 */}
        <PageTitle title="Login" />
        
        {/* React Router 的 <Form> 組件 
            - 它會攔截傳統的 HTML Form 提交行為
            - 自動將資料傳送給路由定義中的 `action` 函數處理
            - 頁面不會重新刷新 (SPA 行為)
        */}
        <Form method="POST" className="space-y-6">
          
          {/* Email/Username 輸入框 */}
          <div>
            <label htmlFor="username" className={labelStyle}>
              Username
            </label>
            <input
              id="username"
              type="text"
              name="username" // 必須設定 name 屬性，action 才能讀取
              placeholder="Your Username"
              required
              className={textFieldStyle}
            />
          </div>

          {/* Password 輸入框 */}
          <div>
            <label htmlFor="password" className={labelStyle}>
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password" // 必須設定 name 屬性
              placeholder="Your Password"
              required
              minLength={5}
              maxLength={20}
              className={textFieldStyle}
            />
          </div>

          {/* 提交按鈕 */}
          <div>
            <button
              disabled={isSubmitting} // 提交中禁用按鈕，防止重複點擊
              type="submit"
              className="w-full px-6 py-2 text-white dark:text-black text-xl rounded-md transition duration-200 bg-primary dark:bg-light hover:bg-dark dark:hover:bg-lighter"
            >
                {/* 根據狀態顯示不同文字 */}
                {isSubmitting ? 'Authenticating...' : 'Login'}
            </button>
          </div>
        </Form>

        {/* 註冊連結 */}
        <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-primary dark:text-light hover:text-dark dark:hover:text-primary transition duration-200"
          >
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
}

// ==========================================
// Action Function (表單處理邏輯)
// ==========================================
// 這是一個純函數，不屬於 React Component，運行在路由層級
export async function loginAction({ request }) {
  // 1. 從 Request 中解析表單資料
  const data = await request.formData();

  // 2. 構建要發送給後端的 payload
  const loginData = {
    username: data.get("username"),
    password: data.get("password"),
  };

  try {
    // 3. 發送 API 請求
    const response = await apiClient.post("/auth/login", loginData);
    
    // 4. 解構後端回傳的資料
    const { message, user, jwtToken } = response.data;
    
    // 5. 回傳成功物件給 Component (透過 useActionData 接收)
    return { success: true, message, user, jwtToken };
    
  } catch (error) {
    // 6. 錯誤處理
    
    // 情境 A: 帳號密碼錯誤 (401 Unauthorized)
    if (error.response?.status === 401) {
      // 回傳錯誤物件，而不是拋出 Error，這樣 Component 依然可以渲染並顯示錯誤訊息
      return {
        success: false,
        errors: { message: "Invalid username or password" },
      };
    }
    
    // 情境 B: 伺服器掛了或其他嚴重錯誤
    // 拋出 Response 會觸發路由的 Error Element (如果有設定的話)
    throw new Response(
      error.response?.data?.message ||
        error.message ||
        "Failed to login. Please try again.",
      { status: error.response?.status || 500 }
    );
  }
}