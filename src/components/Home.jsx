import PageHeading from "./PageHeading";    // 匯入自定義的頁面標題元件
import ProductListings from "./ProductListings"; // 匯入自定義的商品列表元件
import apiClient from "../api/apiClient";   // 匯入預先設定好的 Axios 實例 (用來發送 API 請求)
import { useState, useEffect } from "react"; // 從 React 匯入必要的 Hooks

export default function Home() {
  // --- 狀態定義 (State Definitions) ---
  
  // products: 儲存從後端獲取的商品列表，初始值為空陣列
  const [products, setProducts] = useState([]);
  
  // loading: 追蹤是否正在載入資料，初始值為 true (一進來就顯示載入中)
  const [loading, setLoading] = useState(true);
  
  // error: 儲存錯誤訊息，若請求失敗會更新此狀態，初始值為 null
  const [error, setError] = useState(null);

  // --- 副作用 (Side Effects) ---
  
  // useEffect: 當元件掛載 (Mount) 完成後執行
  // 依賴陣列為 [] (空陣列)，代表這段程式碼只會在「第一次渲染」後執行一次
  useEffect(() => {
    fetchProducts();
  }, []);

  // --- 輔助函式 (Helper Functions) ---

  // fetchProducts: 定義非同步函式來處理 API 請求
  const fetchProducts = async () => {
    try {
      setLoading(true); // 1. 開始請求前，確保載入狀態為 true
      
      // 2. 發送 GET 請求到 '/products' 路徑 (等待回應)
      const response = await apiClient.get("/products"); 
      
      // 3. 請求成功：將後端回傳的資料 (response.data) 更新到 products 狀態
      setProducts(response.data); 
    } catch (error) {
      // 4. 請求失敗：處理錯誤
      // 使用 Optional Chaining (?.) 安全地讀取後端可能回傳的具體錯誤訊息
      // 如果後端沒回傳 message，則顯示預設的錯誤文字
      setError(
        error.response?.data?.message ||
        "Failed to fetch products. Please try again."
      ); 
    } finally {
      // 5. 最終步驟：無論成功或失敗，都將 loading 設為 false，結束載入狀態
      setLoading(false);
    }
  };

  // --- 條件渲染 (Conditional Rendering) ---

  // 情況 1: 若正在載入 (loading 為 true)，顯示載入中的轉圈圈或文字
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-xl font-semibold">Loading products...</span>
      </div>
    );
  }

  // 情況 2: 若發生錯誤 (error 有值)，顯示紅色的錯誤訊息
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-xl text-red-500">Error: {error}</span>
      </div>
    );
  }

  // 情況 3: 正常顯示 (載入完成且無錯誤)
  return (

    <div className="max-w-[1152px] mx-auto px-6 py-8">
      
      {/* 顯示頁面標題與描述 */}
      <PageHeading title="Explore Eazy Stickers!">
        Add a touch of creativity to your space with our wide range of fun and
        unique stickers. Perfect for any occasion!
      </PageHeading>
      {/* 顯示商品列表，並將 products 狀態作為 props 傳遞給子元件 */}
      <ProductListings products={products} />
    </div>
  );
}