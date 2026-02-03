import React, { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import {
  Form,
  useLoaderData,
  useActionData,
  useNavigation,
  useNavigate,
  replace, 
} from "react-router-dom";
import PageTitle from "./PageTitle";
import { toast } from "react-toastify";
import {useAuth} from "../store/auth-context";

export default function Profile() {
  // 1. 獲取 Loader 載入的初始資料 (頁面渲染前就已經拿到的後端資料)
  const initialProfileData = useLoaderData();
  
  // 2. 獲取 Action 執行後的結果 (提交表單後後端回傳的成功或失敗訊息)
  const actionData = useActionData();
  
  // 3. 獲取導航狀態 (用來判斷是否正在提交中 "submitting")
  const navigation = useNavigation();
  const navigate = useNavigate();
  const isSubmitting = navigation.state === "submitting";
  
  // 4. 引入登出函數 (來自 AuthContext)
  const { logout,loginSuccess } = useAuth();

  // 5. 設定本地狀態 (Local State)
  // 為什麼有了 loaderData 還要 state？
  // 因為這是一個「受控組件 (Controlled Component)」，我們需要 state 來即時響應使用者的輸入 (onChange)
  const [profileData, setProfileData] = useState(initialProfileData);

  // 6. 處理表單提交後的副作用 (Side Effects)
  useEffect(() => {
    // 如果 Action 回傳成功
    if (actionData?.success) {
      
      // === 特殊邏輯：檢查是否修改了 Email ===
      // 通常 Email 是登入帳號，修改後 Token 會失效或需要重新驗證，所以強制登出
      if (actionData.profileData.emailUpdated) {
        
        // [關鍵點] 設置跳過標記
        // 告訴 ProtectedRoute：「這是我主動要重新登入的，不要記錄這個頁面路徑」
        // 這樣使用者重新登入後，會去首頁，而不是又跳回 Profile 頁面
        sessionStorage.setItem("skipRedirectPath", "true");
        
        logout(); // 執行登出 (清除 Context 和 LocalStorage)
        
        toast.success(
          "Logged out successfully! Login again with updated email"
        );
        navigate("/login"); // 跳轉回登入頁
      } else {
        // === 一般邏輯：只修改了其他資料 ===
        toast.success("Your Profile details are saved successfully!");
        // 更新本地狀態，確保畫面顯示的是最新資料
        setProfileData(actionData.profileData);
        const updatedUser = {
    ...profileData,            
    ...actionData.profileData  
};
loginSuccess(localStorage.getItem("jwtToken"), updatedUser);
      }
      
    }
  }, [actionData]); // 監聽 actionData 的變化

  // 定義樣式 (Tailwind CSS)
  const labelStyle =
    "block text-lg font-semibold text-primary dark:text-light mb-2";
  const h2Style =
    "block text-2xl font-semibold text-primary dark:text-light mb-2";
  const textFieldStyle =
    "w-full px-4 py-2 text-base border rounded-md transition border-primary dark:border-light focus:ring focus:ring-dark dark:focus:ring-lighter focus:outline-none text-gray-800 dark:text-lighter bg-white dark:bg-gray-600 placeholder-gray-400 dark:placeholder-gray-300";

  return (
    <div className="max-w-[1152px] min-h-[852px] mx-auto px-6 py-8 font-primary bg-normalbg dark:bg-darkbg">
      <PageTitle title="My Profile" />

      {/* 使用 React Router 的 <Form> 組件
         method="PUT": 對應後端的更新語義，會觸發下方的 profileAction
      */}
      <Form method="PUT" className="space-y-6 max-w-[768px] mx-auto">
        
        {/* === 個人詳細區塊 === */}
        <div>
          <h2 className={h2Style}>Personal Details</h2>
          <label htmlFor="name" className={labelStyle}>
            Name
          </label>
          <input
            id="name"
            name="name" // Action 讀取資料的關鍵 Key
            type="text"
            placeholder="Your Name"
            className={textFieldStyle}
            // 雙向綁定 (Two-way binding)
            value={profileData.name}
            onChange={(e) =>
              setProfileData((prev) => ({ ...prev, name: e.target.value }))
            }
            required
            minLength={5}
            maxLength={30}
          />
          {/* 顯示後端回傳的欄位錯誤訊息 (如果有) */}
          {actionData?.errors?.name && (
            <p className="text-red-500 text-sm mt-1">
              {actionData.errors.name}
            </p>
          )}
        </div>

        {/* 雙欄佈局 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Email 欄位 */}
          <div>
            <label htmlFor="email" className={labelStyle}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Your Email"
              value={profileData.email}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, email: e.target.value }))
              }
              className={textFieldStyle}
              required
            />
            {actionData?.errors?.email && (
              <p className="text-red-500 text-sm mt-1">
                {actionData.errors.email}
              </p>
            )}
          </div>

          {/* 手機號碼欄位 */}
          <div>
            <label htmlFor="mobileNumber" className={labelStyle}>
              Mobile Number
            </label>
            <input
              id="mobileNumber"
              name="mobileNumber"
              type="tel"
              required
              // HTML5 原生正則驗證 (10位數字)
              pattern="^\d{10}$"
              title="Mobile number must be exactly 10 digits"
              value={profileData.mobileNumber}
              onChange={(e) =>
                setProfileData((prev) => ({
                  ...prev,
                  mobileNumber: e.target.value,
                }))
              }
              placeholder="Your Mobile Number"
              className={textFieldStyle}
            />
            {actionData?.errors?.mobileNumber && (
              <p className="text-red-500 text-sm mt-1">
                {actionData.errors.mobileNumber}
              </p>
            )}
          </div>
        </div>

        {/* === 地址詳細區塊 === */}
        <div>
          <h2 className={h2Style}>Address Details</h2>
          <label htmlFor="street" className={labelStyle}>
            Street
          </label>
          <input
            id="street"
            name="street"
            type="text"
            placeholder="Street details"
            value={profileData?.address.street}
            onChange={(e) =>
              setProfileData((prev) => ({
                ...prev,
                address:{
                  ...prev.address,
                  street: e.target.value
                },
              }))
            }
            className={textFieldStyle}
            required
            minLength={5}
            maxLength={30}
          />
          {actionData?.errors?.street && (
            <p className="text-red-500 text-sm mt-1">
              {actionData.errors.street}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* 城市 */}
          <div>
            <label htmlFor="city" className={labelStyle}>
              City
            </label>
            <input
              id="city"
              name="city"
              type="text"
              placeholder="Your City"
              value={profileData?.address.city}
              onChange={(e) =>
                setProfileData((prev) => ({
                  ...prev,
                 address:{
                  ...prev.address,
                   city: e.target.value  
                 },
                }))
              }
              className={textFieldStyle}
              required
              minLength={3}
              maxLength={30}
            />
            {actionData?.errors?.city && (
              <p className="text-red-500 text-sm mt-1">
                {actionData.errors.city}
              </p>
            )}
          </div>

          {/* 州/省 */}
          <div>
            <label htmlFor="state" className={labelStyle}>
              State
            </label>
            <input
              id="state"
              name="state"
              type="text"
              required
              minLength={2}
              maxLength={30}
              placeholder="Your State"
              value={profileData?.address.state}
              onChange={(e) =>
                setProfileData((prev) => ({
                  ...prev,
                  address:{
                   ...prev.address,
                   state: e.target.value, 
                  },
                }))
              }
              className={textFieldStyle}
            />
            {actionData?.errors?.state && (
              <p className="text-red-500 text-sm mt-1">
                {actionData.errors.state}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* 郵遞區號 */}
          <div>
            <label htmlFor="postalCode" className={labelStyle}>
              Postal Code
            </label>
            <input
              id="postalCode"
              name="postalCode"
              type="text"
              placeholder="Your Postal Code"
              value={profileData?.address.postalCode}
              onChange={(e) =>
                setProfileData((prev) => ({
                  ...prev,
                  address:{
                    ...prev.address,
                    postalCode: e.target.value,
                  }
                }))
              }
              className={textFieldStyle}
              required
              pattern="^\d{5}$" // 限制為5位數字
              title="Postal code must be exactly 5 digits"
            />
            {actionData?.errors?.postalCode && (
              <p className="text-red-500 text-sm mt-1">
                {actionData.errors.postalCode}
              </p>
            )}
          </div>

          {/* 國家 */}
          <div>
            <label htmlFor="country" className={labelStyle}>
              Country
            </label>
            <input
              id="country"
              name="country"
              type="text"
              required
              minLength={2}
              maxLength={2}
              placeholder="Your Country"
              value={profileData?.address.country}
              onChange={(e) =>
                setProfileData((prev) => ({
                  ...prev,
                  address:{
                    ...prev.address,
                    country: e.target.value,
                  },
                }))
              }
              className={textFieldStyle}
            />
            {actionData?.errors?.country && (
              <p className="text-red-500 text-sm mt-1">
                {actionData.errors.country}
              </p>
            )}
          </div>
        </div>

        {/* 提交按鈕 */}
        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting} // 提交中禁用
            className="px-6 py-2 mt-8 text-white dark:text-black text-xl rounded-md transition duration-200 bg-primary dark:bg-light hover:bg-dark dark:hover:bg-lighter"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </Form>
    </div>
  );
}

// ==========================================
// Loader Function (預先載入資料)
// ==========================================
// 在路由渲染 Profile 組件之前，會先執行這個函數
export async function profileLoader() {
  try {
    const response = await apiClient.get("/profile"); // Axios GET Request
    return response.data; // 這份資料會傳給 useLoaderData()
  } catch (error) {
    // 拋出錯誤，觸發 Error Boundary
    throw new Response(
      error.response?.data?.errorMessage ||
        error.message ||
        "Failed to fetch profile details. Please try again.",
      { status: error.status || 500 }
    );
  }
}

// ==========================================
// Action Function (處理表單提交)
// ==========================================
// 當 <Form method="PUT"> 被提交時執行
export async function profileAction({ request }) {
  // 1. 讀取表單資料
  const data = await request.formData();

  // 2. 組裝 payload
  const profileData = {
    name: data.get("name"),
    email: data.get("email"),
    mobileNumber: data.get("mobileNumber"),
    street: data.get("street"),
    city: data.get("city"),
    state: data.get("state"),
    postalCode: data.get("postalCode"),
    country: data.get("country"),
  };
  
  try {
    // 3. 發送 API 更新請求
    const response = await apiClient.put("/profile", profileData);
    
    // 4. 回傳成功資料
    // 這裡的回傳值會變成 component 裡的 actionData
    // 後端應該在 response.data 中包含一個標記 (如 emailUpdated: true/false)
    return { success: true, profileData: response.data };
    
  } catch (error) {
    // 5. 錯誤處理 (例如驗證錯誤 400 Bad Request)
    if (error.response?.status === 400) {
      // 回傳錯誤物件供 UI 顯示 (不拋出異常)
      return { success: false, errors: error.response?.data };
    }
    // 其他嚴重錯誤則拋出
    throw new Response(
      error.response?.data?.errorMessage ||
        error.message ||
        "Failed to save profile details. Please try again.",
      { status: error.status || 500 }
    );
  }
}