import { useMemo } from "react";
import PageTitle from "./PageTitle";
import { Link } from "react-router-dom"; 
import emptyCartImage from "../assets/util/emptycart.png";
import { useCart } from "../store/cart-context";
import CartTable from "./CartTable";
import { useAuth } from "../store/auth-context";

export default function Cart() {
  // 1. 從 AuthContext 取得使用者資訊
  // isAuthenticated: 是否已登入 (boolean)
  // user: 使用者詳細資料物件 (包含 address 等資訊)
  const { isAuthenticated, user } = useAuth();

  /**
   * 核心邏輯：判斷地址是否不完整 (isAddressIncomplete)
   * 使用 useMemo 是為了效能優化，只有當 [user, isAuthenticated] 改變時才重新計算
   * 回傳值：true (不完整，需阻擋) / false (完整，可放行)
   */
  const isAddressIncomplete = useMemo(() => {
    // 狀況 A: 如果使用者根本沒登入
    // 回傳 false 的原因：我們不希望在這裡阻擋他，而是讓他在點擊「結帳」時，
    // 透過既有的路由保護機制 (Protected Route) 自動導向去登入頁面。
    if (!isAuthenticated) return false;
    
    // 狀況 B: 已登入，但 user 物件內完全沒有 address 物件 (可能是新註冊用戶)
    if (!user.address) return true;

    // 狀況 C: 有 address 物件，但檢查內部個別欄位是否為空
    const { street, city, state, postalCode, country } = user.address;
    
    // 如果任一欄位是 falsy (空字串、null、undefined)，則視為不完整 (true)
    return !street || !city || !state || !postalCode || !country;

  }, [user, isAuthenticated]); // 依賴陣列：這些變數變動時，重新執行上述邏輯


  // 2. 從 CartContext 取得購物車內容
  const { cart } = useCart();

  // 計算購物車是否為空 (用於決定顯示購物清單或是空購物車圖片)
  const isCartEmpty = useMemo(() => cart.length === 0, [cart.length]);

  return (
    <div className="min-h-[852px] py-12 bg-normalbg dark:bg-darkbg font-primary">
      <div className="max-w-4xl mx-auto px-4">
        <PageTitle title="Your Cart" />

        {/* 條件渲染：如果不為空，顯示購物車內容；否則顯示空車圖片 */}
        {!isCartEmpty ? (
          <>
            {/* --- 錯誤提示區塊 --- */}
            {/* 只有在「地址不完整」時才渲染這段紅色警告文字 */}
            {isAddressIncomplete && (
              <p className="text-red-500 text-lg mt-2 text-center">
                Please update your address in your profile to proceed to checkout.
              </p>
            )}

            {/* 顯示購物車表格 (商品列表) */}
            <CartTable />

            {/* 底部按鈕區塊 */}
            <div className="flex justify-between mt-8 space-x-4">
              
              {/* 按鈕 1: 返回商品列表 */}
              <Link
                to="/home"
                className="py-2 px-4 bg-primary dark:bg-light text-white dark:text-black text-xl font-semibold rounded-sm flex justify-center items-center hover:bg-dark dark:hover:bg-lighter transition"
              >
                Back to Products
              </Link>
              
              {/* 按鈕 2: 前往結帳 (Proceed to Checkout) - 重點邏輯 */}
              <Link
                // 邏輯 A: 導航路徑控制
                // 如果地址不完整，to 指向 "#" (當前頁面，不跳轉)
                // 如果地址完整，to 指向 "/checkout"
                to={isAddressIncomplete ? "#" : "/checkout"}

                // 邏輯 B: 動態樣式控制 (Template Literal)
                // 根據 isAddressIncomplete 切換顏色與游標樣式
                className={`py-2 px-4 text-xl font-semibold rounded-sm flex justify-center items-center transition
                            ${
                              isAddressIncomplete
                                ? "bg-gray-400 cursor-not-allowed" // 不完整：灰色背景 + 禁止符號
                                : "bg-primary dark:bg-light hover:bg-dark dark:hover:bg-lighter" // 完整：主色背景 + Hover效果
                            } text-white dark:text-black`}
                
                // 邏輯 C: 事件阻擋 (雙重保險)
                // 雖然 to="#" 已經不會跳轉，但加上 preventDefault 可以防止 URL 變成 http://.../#
                // 並且確保完全沒有任何導航行為發生
                onClick={(e) => {
                  if (isAddressIncomplete) {
                    e.preventDefault();
                  }
                }}
              >
                Proceed to Checkout
              </Link>
            </div>
          </>
        
        ) : (
          /* --- 購物車為空時的顯示區塊 --- */
          <div className="text-center text-gray-600 dark:text-lighter flex flex-col items-center">
            <p className="max-w-[576px] px-2 mx-auto text-base mb-4">
              Oops... Your cart is empty. Continue shopping
            </p>
            <img
              src={emptyCartImage}
              alt="Empty Cart"
              className="max-w-[300px] mx-auto mb-6 dark:bg-light dark:rounded-md"
            />
            
            <Link
              to="/home"
              className="py-2 px-4 bg-primary dark:bg-light text-white dark:text-black text-xl font-semibold rounded-sm flex justify-center items-center hover:bg-dark dark:hover:bg-lighter transition"
            >
              Back to Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}