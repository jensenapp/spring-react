import axios from "axios";

// 建立一個 axios 實例 (Instance)
const apiClient = axios.create({
    // 1. 設定 Base URL
    // 使用 import.meta.env 存取 Vite 的環境變數
    baseURL: import.meta.env.VITE_API_BASE_URL,

    // 2. 設定 Timeout (逾時)
    // 設定為 10000 毫秒 (即 10 秒)
    // 如果後端在 10 秒內沒有回應，前端會拋出錯誤 (Error)
    timeout: 10000,
});

// 匯出這個設定好的實例，供其他組件使用
export default apiClient;