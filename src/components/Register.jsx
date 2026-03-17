import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import { toast } from "react-toastify";
import PageTitle from "./PageTitle";

// 共用的 CSS 樣式字串，保持 JSX 結構乾淨
const LABEL_STYLE = "block text-lg font-semibold text-primary dark:text-light mb-2";
const INPUT_STYLE = "w-full px-4 py-2 text-base border rounded-md transition border-primary dark:border-light focus:ring focus:ring-dark dark:focus:ring-lighter focus:outline-none text-gray-800 dark:text-lighter bg-white dark:bg-gray-600 placeholder-gray-400 dark:placeholder-gray-300";

export default function Register() {
  const navigate = useNavigate();
  
  // 新增 State 來管理「載入狀態」與「錯誤訊息」
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({}); 

  // 傳統的表單送出處理函式
  const handleSubmit = async (event) => {
    event.preventDefault(); // 阻止表單預設的重整行為
    setErrors({}); // 每次送出前先清空舊的錯誤訊息

    // 取得表單內所有 input 的資料
    const formData = new FormData(event.target);
    const password = formData.get("password");
    const confirmPwd = formData.get("confirmPwd");

    // 1. 前端驗證：確認密碼是否一致
    if (password !== confirmPwd) {
      toast.error("Passwords do not match!");
      setErrors({ confirmPwd: "Passwords do not match!" }); // 將錯誤存入 state
      return; // 終止執行，不打 API
    }

    // 2. 準備要傳給後端的資料
    const registerData = {
      name: formData.get("name"),
      email: formData.get("email"),
      mobileNumber: formData.get("mobileNumber"),
      password: password,
    };

    // 3. 呼叫 API
    try {
      setIsSubmitting(true); // 開始載入
      await apiClient.post("/auth/register", registerData);
      
      // 成功：跳轉並顯示成功訊息
      toast.success("Registration completed successfully. Try login..");
      navigate("/login");
      
    } catch (error) {
      // 失敗：處理後端回傳的錯誤
      if (error.response?.status === 400) {
        // 將後端的欄位驗證錯誤存入 state，畫面就會自動更新顯示紅字
        setErrors(error.response?.data); 
      } else {
        // 伺服器壞掉或其他非 400 的錯誤
        toast.error(error.response?.data?.errorMessage || error.message || "Failed to submit. Please try again.");
      }
    } finally {
      setIsSubmitting(false); // 無論成功失敗，最後都關閉載入狀態
    }
  };

  return (
    <div className="min-h-[752px] flex items-center justify-center font-primary dark:bg-darkbg">
      <div className="bg-white dark:bg-gray-700 shadow-md rounded-lg max-w-md w-full px-8 py-6">
        <PageTitle title="Register" />

        {/*標準的 <form> 並綁定 onSubmit 事件 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label htmlFor="name" className={LABEL_STYLE}>Name</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Your Name"
              required
              minLength={5}
              maxLength={30}
              className={INPUT_STYLE}
            />
            {/* 由 errors state 來讀取錯誤 */}
            {errors?.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="email" className={LABEL_STYLE}>Email</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Your Email"
                autoComplete="email"
                required
                className={INPUT_STYLE}
              />
              {errors?.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="mobileNumber" className={LABEL_STYLE}>Mobile Number</label>
              <input
                id="mobileNumber"
                type="tel"
                name="mobileNumber"
                placeholder="Your Mobile Number"
                required
                pattern="^\d{10}$"
                title="Mobile number must be exactly 10 digits"
                className={INPUT_STYLE}
              />
              {errors?.mobileNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.mobileNumber}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="password" className={LABEL_STYLE}>Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Your Password"
              required
              autoComplete="new-password"
              minLength={8}
              maxLength={20}
              className={INPUT_STYLE}
            />
            {errors?.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPwd" className={LABEL_STYLE}>Confirm Password</label>
            <input
              id="confirmPwd"
              type="password"
              name="confirmPwd"
              placeholder="Confirm Your Password"
              required
              autoComplete="confirm-password"
              minLength={8}
              maxLength={20}
              className={INPUT_STYLE}
            />
            {errors?.confirmPwd && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPwd}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-2 text-white dark:text-black text-xl bg-primary dark:bg-light hover:bg-dark dark:hover:bg-lighter rounded-md transition duration-200"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary dark:text-light hover:text-dark dark:hover:text-primary transition duration-200"
          >
            Login Here
          </Link>
        </p>
      </div>
    </div>
  );
}