// 引入 React 核心函式庫
import React from "react";
// 引入購物車的 Context Hook,用於管理購物車狀態
import { useCart } from "../store/cart-context";
// 引入 FontAwesome 圖標組件
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// 引入關閉/刪除圖標
import { faTimes } from "@fortawesome/free-solid-svg-icons";
// 引入 React Router 的 Link 組件用於頁面導航
import { Link } from "react-router-dom";

// 購物車表格組件
export default function CartTable() {
  // 從 Context 中取得購物車數據和操作方法
  const { cart, addToCart, removeFromCart } = useCart();
  
  // 計算購物車總金額(小計)
  // reduce 遍歷所有商品,累加每個商品的價格 × 數量
  // toFixed(2) 保留兩位小數
  const subtotal = cart
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2);
  
  // 更新購物車中特定商品的數量
  const updateCartQuantity = (productId, quantity) => {
    // 從購物車中找到對應的商品
    const product = cart.find((item) => item.productId === productId);
    // 計算數量差異並更新(新數量 - 當前數量)
    
    addToCart(product, quantity - (product?.quantity || 0));
  };
  
  return (
    // 主容器:最小高度 80、最大寬度 4xl、水平居中、垂直間距 8、全寬、使用主要字體
    <div className="min-h-80 max-w-4xl mx-auto my-8 w-full font-primary">
      {/* 購物車表格 */}
      <table className="w-full">
        {/* 表格標題行 */}
        <thead>
          <tr className="uppercase text-sm text-primary dark:text-light border-b border-primary dark:border-light">
            {/* 商品欄 */}
            <th className="px-6 py-4">Product</th>
            {/* 數量欄 */}
            <th className="px-6 py-4">Quantity</th>
            {/* 價格欄 */}
            <th className="px-6 py-4">Price</th>
            {/* 刪除按鈕欄 */}
            <th className="px-6 py-4">Remove</th>
          </tr>
        </thead>
        
        {/* 表格內容區,每行之間有分隔線 */}
        <tbody className="divide-y divide-primary dark:divide-light">
          {/* 遍歷購物車中的每個商品 */}
          {cart.map((item) => (
            <tr
              key={item.productId}
              className="text-sm sm:text-base text-primary dark:text-light text-center"
            >
              {/* 商品信息欄:包含圖片和名稱 */}
              <td className="px-4 sm:px-6 py-4 flex items-center">
                {/* 點擊可跳轉到商品詳情頁 */}
                <Link
                  to={`/products/${item.productId}`}
                  state={{ product: item }}
                  className="flex items-center"
                >
                  {/* 商品圖片:帶懸停放大效果 */}
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 rounded-md object-cover mr-4 hover:scale-110 transition-transform"
                  />
                  {/* 商品名稱:帶懸停底線效果 */}
                  <span className="text-primary dark:text-light hover:underline">
                    {item.name}
                  </span>
                </Link>
              </td>
              
              {/* 數量輸入欄 */}
              <td className="px-4 sm:px-6 py-4">
                {/* 數字輸入框 */}
                <input
                  type="number"
                  inputMode="numeric" // 在行動裝置上顯示數字鍵盤
                  value={item.quantity}
                  onChange={(e) =>
                    updateCartQuantity(
                      item.productId,
                      parseInt(e.target.value, 10) || 1 // 解析為整數,無效時預設為 1
                    )
                  }
                  className="w-16 px-2 py-1 border rounded-md focus:ring focus:ring-light dark:focus:ring-gray-600 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </td>
              
              {/* 價格欄:顯示單價 */}
              <td className="px-4 sm:px-6 py-4 text-base font-light">
                ${item.price.toFixed(2)}
              </td>
              
              {/* 刪除按鈕欄 */}
              <td className="px-4 sm:px-6 py-4">
                <button
                  aria-label="delete-item" // 無障礙標籤
                  onClick={() => removeFromCart(item.productId)}
                  className="text-primary dark:text-red-400 border border-primary dark:border-red-400 p-2 rounded hover:bg-lighter dark:hover:bg-gray-700"
                >
                  {/* 顯示刪除圖標 */}
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </td>
            </tr>
          ))}
          
          {/* 小計行:只在購物車有商品時顯示 */}
          {cart.length > 0 && (
            <tr className="text-center">
              <td></td> {/* 空白欄 */}
              {/* 小計標籤 */}
              <td className="text-base text-gray-600 dark:text-gray-300 font-semibold uppercase px-4 sm:px-6 py-4">
                Subtotal
              </td>
              {/* 小計金額 */}
              <td className="text-lg text-primary dark:text-blue-400 font-medium px-4 sm:px-6 py-4">
                ${subtotal}
              </td>
              <td></td> {/* 空白欄 */}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}