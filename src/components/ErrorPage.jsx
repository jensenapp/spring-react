import React from "react";
import Header from "./Header";
import Footer from "./footer/Footer";
import PageTitle from "./PageTitle";
import errorImg from "../assets/util/error.png";
import { Link } from "react-router-dom";
import { useRouteError} from "react-router-dom";


export default function ErrorPage() {
  // 1. 呼叫 Hook 取得錯誤資訊
  const routeError = useRouteError();

  // 設定預設值 (防禦性程式設計，處理 routeError 可能為 null 的情況)
  let errorTitle = "Oops! Something went wrong";
  let errorMessage = "An unexpected error occurred. Please try again later.";

  if (routeError) {
    // 對應 loader 中的 throw new Response(message, { status: ... })
    errorTitle = routeError.status; 
    errorMessage = routeError.data; 
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* 2. 必須手動加入 Header，因為 App 組件已被取代 */}
      <Header />

      <main className="flex-grow flex flex-col items-center justify-center py-10">
        <div className="text-center">
          {/* 3. 使用 routeError.status 顯示狀態碼 (例如 404) */}
          <PageTitle title={routeError.status} />
          
          <div className="mt-4">
             {/* 4. 使用 routeError.data 顯示錯誤訊息 */}
            <p className="text-xl text-red-500 font-semibold">
              {routeError.data}
            </p>
          </div>

          <img src={errorImg} alt="Error" className="w-64 h-64 object-contain my-6 mx-auto" />

          {/* 5. 提供返回首頁的按鈕 */}
          <Link 
            to="/" 
            className="bg-primary text-white px-6 py-2 rounded hover:bg-dark transition"
          >
            Back to Home
          </Link>
        </div>
      </main>

      {/* 6. 為了避免內容太少導致 Footer 浮上來，可設定 min-height 或 flex-grow */}
      <Footer />
    </div>
  );
}