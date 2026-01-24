import PageHeading from "./PageHeading";    // 匯入自定義的頁面標題元件
import ProductListings from "./ProductListings"; // 匯入自定義的商品列表元件
import apiClient from "../api/apiClient";   // 匯入預先設定好的 Axios 實例 (用來發送 API 請求)
import { useLoaderData } from "react-router-dom";
import { useLocation } from "react-router-dom";


export default function Home() {
 

  // 獲取 loader 回傳的數據
    const products = useLoaderData();


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

//定義 Loader 函式 (必須在元件外部 export)
// 這個函式不依賴 React Hooks，是一個標準的 JS async 函式
export async function productsLoader() {
  try {
    // 假設這裡延遲了 3 秒 (模擬慢速網路)
    // await new Promise(resolve => setTimeout(resolve, 3000));
    const response = await apiClient.get("/products");
    return response.data;
  } catch (error) {
    // 核心步驟：拋出 Response 物件
    // 參數 1 (Body): 錯誤訊息
    // 參數 2 (Options): 包含 status 等元數據
    throw new Response(
     error.response?.data?.errorMessage || 
      error.message || 
      "Failed to fetch products. Please try again.",
      { status: error.status || 500 }
    );
  }
}