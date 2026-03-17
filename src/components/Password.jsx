import React, { useState } from 'react'
import apiClient from '../api/apiClient';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../store/auth-context";

export default function Password() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("新密碼長度須超過8字元")
      return;
    }

    if (newPassword !== repeatPassword) {
      toast.error("兩次密碼輸入不一致");
      return;
    }

    const data = { oldPassword, newPassword };

    try {
      await apiClient.put("/auth/change-password", data);
      toast.success("密碼修改成功");
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Change password error:", error);
      toast.error(error.response?.data?.statusMsg || "密碼修改失敗，請確認舊密碼是否正確！");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Change Password
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Old Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Old Password
            </label>
            <input
              type="password"
              name="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              placeholder="Enter old password"
              maxLength={80}
              minLength={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="Enter new password"
              maxLength={80}
              minLength={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
          </div>

          {/* Repeat Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Repeat Password
            </label>
            <input
              type="password"
              name="repeatPassword"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              required
              placeholder="Confirm new password"
              maxLength={50}
              minLength={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}