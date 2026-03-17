import React, { useEffect } from "react";
import apiClient from "../api/apiClient";
import {
  Form,
  useLoaderData,
  useActionData,
  useNavigation,
  useNavigate,
} from "react-router-dom";
import PageTitle from "./PageTitle";
import { toast } from "react-toastify";
import { useAuth } from "../store/auth-context";

const LABEL_STYLE = "block text-lg font-semibold text-primary dark:text-light mb-2";
const INPUT_STYLE = "w-full px-4 py-2 text-base border rounded-md transition border-primary dark:border-light focus:ring focus:ring-dark dark:focus:ring-lighter focus:outline-none text-gray-800 dark:text-lighter bg-white dark:bg-gray-600 placeholder-gray-400 dark:placeholder-gray-300";

export default function Profile() {
  // 1. 「畫面初次載入時」的資料
  const initialProfile = useLoaderData();
  
  // 2. Action：拿取送出後的結果 (包含成功/失敗、錯誤訊息、以及後端給的新資料)
  const actionData = useActionData();
  
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  
  const navigate = useNavigate();
  const { logout, loginSuccess } = useAuth();

  const handlePassword=()=>{
    navigate("/change-password");
  }

  useEffect(() => {
    if (actionData?.success) {
      // 3. 讀取 Action 回傳的 "updatedProfile" 屬性
      if (actionData.updatedProfile.emailUpdated) {
        sessionStorage.setItem("skipRedirectPath", "true");
        logout();
        toast.success("Logged out successfully! Login again with updated email");
        navigate("/login");
      } else {
        toast.success("Your Profile details are saved successfully!");
        
        // 合併舊資料與新資料，更新 Context
        const updatedUser = { ...initialProfile, ...actionData.updatedProfile };
        loginSuccess(localStorage.getItem("jwtToken"), updatedUser);
      }
    }
  }, [actionData, logout, navigate, initialProfile, loginSuccess]);

  return (
    <div className="max-w-[1152px] min-h-[852px] mx-auto px-6 py-8 font-primary bg-normalbg dark:bg-darkbg">
      <div className="flex flex-col sm:flex-row justify-between items-center max-w-[768px] mx-auto mb-8">
        <PageTitle title="My Profile" />
        
       
        <button 
          onClick={handlePassword}
          className="mt-4 sm:mt-0 px-4 py-2 text-sm font-semibold border-2 border-primary dark:border-light text-primary dark:text-light rounded-md transition duration-200 hover:bg-primary hover:text-white dark:hover:bg-light dark:hover:text-black"
        >
          Change Password
        </button>
      </div>

      <Form method="PUT" className="space-y-6 max-w-[768px] mx-auto">

        <div>
          <h2 className="block text-2xl font-semibold text-primary dark:text-light mb-2">Personal Details</h2>
          <label htmlFor="name" className={LABEL_STYLE}>Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Your Name"
            className={INPUT_STYLE}
            required
            minLength={5}
            maxLength={30}
            defaultValue={initialProfile.name} // 使用 initialProfile 當作預設值
          />
          {actionData?.errors?.name && <p className="text-red-500 text-sm mt-1">{actionData.errors.name}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className={LABEL_STYLE}>Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Your Email"
              className={INPUT_STYLE}
              required
              defaultValue={initialProfile.email}
            />
            {actionData?.errors?.email && <p className="text-red-500 text-sm mt-1">{actionData.errors.email}</p>}
          </div>

          <div>
            <label htmlFor="mobileNumber" className={LABEL_STYLE}>Mobile Number</label>
            <input
              id="mobileNumber"
              name="mobileNumber"
              type="tel"
              required
              pattern="^\d{10}$"
              title="Mobile number must be exactly 10 digits"
              placeholder="Your Mobile Number"
              className={INPUT_STYLE}
              defaultValue={initialProfile.mobileNumber}
            />
            {actionData?.errors?.mobileNumber && <p className="text-red-500 text-sm mt-1">{actionData.errors.mobileNumber}</p>}
          </div>
        </div>

        <div>
          <h2 className="block text-2xl font-semibold text-primary dark:text-light mb-2">Address Details</h2>
          <label htmlFor="street" className={LABEL_STYLE}>Street</label>
          <input
            id="street"
            name="street"
            type="text"
            placeholder="Street details"
            className={INPUT_STYLE}
            required
            minLength={5}
            maxLength={30}
            defaultValue={initialProfile.address?.street}
          />
          {actionData?.errors?.street && <p className="text-red-500 text-sm mt-1">{actionData.errors.street}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="city" className={LABEL_STYLE}>City</label>
            <input
              id="city"
              name="city"
              type="text"
              placeholder="Your City"
              className={INPUT_STYLE}
              required
              minLength={3}
              maxLength={30}
              defaultValue={initialProfile.address?.city}
            />
            {actionData?.errors?.city && <p className="text-red-500 text-sm mt-1">{actionData.errors.city}</p>}
          </div>

          <div>
            <label htmlFor="state" className={LABEL_STYLE}>State</label>
            <input
              id="state"
              name="state"
              type="text"
              placeholder="Your State"
              className={INPUT_STYLE}
              required
              minLength={2}
              maxLength={30}
              defaultValue={initialProfile.address?.state}
            />
            {actionData?.errors?.state && <p className="text-red-500 text-sm mt-1">{actionData.errors.state}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="postalCode" className={LABEL_STYLE}>Postal Code</label>
            <input
              id="postalCode"
              name="postalCode"
              type="text"
              placeholder="Your Postal Code"
              className={INPUT_STYLE}
              required
              pattern="^\d{5}$"
              title="Postal code must be exactly 5 digits"
              defaultValue={initialProfile.address?.postalCode}
            />
            {actionData?.errors?.postalCode && <p className="text-red-500 text-sm mt-1">{actionData.errors.postalCode}</p>}
          </div>

          <div>
            <label htmlFor="country" className={LABEL_STYLE}>Country</label>
            <input
              id="country"
              name="country"
              type="text"
              placeholder="Your Country"
              className={INPUT_STYLE}
              required
              minLength={2}
              maxLength={2}
              defaultValue={initialProfile.address?.country}
            />
            {actionData?.errors?.country && <p className="text-red-500 text-sm mt-1">{actionData.errors.country}</p>}
          </div>
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting}
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
// Loader 保持不變
// ==========================================
export async function profileLoader() {
  try {
    const response = await apiClient.get("/profile");
    return response.data;
  } catch (error) {
    throw new Response(
      error.response?.data?.errorMessage || error.message || "Failed to fetch profile details.",
      { status: error.status || 500 }
    );
  }
}

// ==========================================
// Action Function (處理表單提交)
// ==========================================
export async function profileAction({ request }) {
  const data = await request.formData();

  // 1. 準備送出的包裹 (Payload)
  const payloadToSend = {
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
    // 2. 打 API 送出包裹
    const response = await apiClient.put("/profile", payloadToSend);
    
    // 3. 收回傳的包裹，並貼上明確的標籤 "updatedProfile"
    return { success: true, updatedProfile: response.data };
    
  } catch (error) {
    if (error.response?.status === 400) {
      return { success: false, errors: error.response?.data };
    }
    throw new Response(
      error.response?.data?.errorMessage || error.message || "Failed to save profile details.",
      { status: error.status || 500 }
    );
  }
}