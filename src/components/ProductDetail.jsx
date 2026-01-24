import { useLocation } from "react-router-dom";
import {
  faArrowLeft,
  faShoppingCart,
  faShoppingBasket,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";
import { useCart } from "../store/cart-context";

export default function ProductDetail() {
  // 1. 獲取路由狀態 (Location State)
  const location = useLocation();
  
  // 核心：從上一頁 (ProductCard) 傳遞過來的 state 中讀取 product 物件
  // 使用 ?. (Optional Chaining) 防止 location.state 為空時程式崩潰
  // 注意：如果是直接複製網址進入此頁面，state 會是 null，導致 product 為 undefined
  const product = location.state?.product;

  // 2. 導航工具 (用於按鈕跳轉)
  const navigate = useNavigate();

  // 3. 狀態管理
  const [quantity, setQuantity] = useState(1); // 商品數量
  const zoomRef = useRef(null); // 綁定圖片容器 DOM，用於計算座標
  const [isHovering, setIsHovering] = useState(false); // 是否滑鼠懸停
  const [backgroundPosition, setBackgroundPosition] = useState("center"); // 背景圖位置 (控制放大鏡視角)
  const {addToCart}=useCart();

  const handleAddToCart=()=>{
    if(quantity<1){
      return
    }
    addToCart(product,quantity);
  }

  // --- 圖片放大鏡核心邏輯 ---
  const handleMouseMove = (e) => {
    // A. 取得圖片容器相對於視窗的位置與尺寸
    // left/top: 元素距離視窗左上角的距離
    // width/height: 元素本身的寬高
    const { left, top, width, height } = zoomRef.current.getBoundingClientRect();

    // B. 計算滑鼠在圖片容器內部的相對座標 (百分比)
    // e.pageX: 滑鼠在整頁的 X 座標 -> 減去 left 得到容器內 X 座標
    // 除以 width 再乘 100 轉為百分比
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;

    // C. 更新背景位置，讓放大後的背景圖隨著滑鼠移動
    setBackgroundPosition(`${x}% ${y}%`);
  };

  // 滑鼠進入：開啟放大模式
  const handleMouseEnter = () => setIsHovering(true);

  // 滑鼠離開：關閉放大模式並重置位置
  const handleMouseLeave = () => {
    setIsHovering(false);
    setBackgroundPosition("center");
  };

  // 點擊 "View Cart" 的處理函式 (程式化導航)
  const handleViewCart = () => navigate("/cart");

  return (
    <div className="min-h-[852px] flex items-center justify-center px-6 py-8 font-primary bg-normalbg dark:bg-darkbg">
      <div className="max-w-5xl w-full mx-auto flex flex-col md:flex-row md:space-x-8 px-6 p-8">
        
        {/* --- 左側：產品圖片區 (含放大鏡特效) --- */}
        <div
          ref={zoomRef} // 綁定 ref 以獲取 DOM 資訊
          onMouseMove={isHovering ? handleMouseMove : null} // 優化：只有懸停時才監聽移動
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="w-full md:w-1/2 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg overflow-hidden bg-cover"
          // 這裡運用 CSS 背景圖技巧來實現放大
          style={{
            backgroundImage: `url(${product.imageUrl})`,
            // 關鍵：懸停時背景尺寸變為 200% (放大效果)，否則為 cover (正常顯示)
            backgroundSize: isHovering ? "200%" : "cover",
            // 關鍵：根據滑鼠位置移動背景圖
            backgroundPosition: backgroundPosition,
          }}
        >
          {/* 這個 img 標籤的作用是撐開 div 的高度與寬度，保持比例。
             opacity-0 讓它不可見，實際使用者看到的是 div 的 backgroundImage。
          */}
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full opacity-0" 
          />
        </div>

        {/* --- 右側：產品詳細資訊區 --- */}
        <div className="w-full md:w-1/2 flex flex-col space-y-6 mt-8 md:mt-0">
          
          {/* 返回首頁連結 */}
          <Link
            to="/home"
            className="inline-flex items-center text-primary dark:text-light font-medium hover:text-dark dark:hover:text-lighter"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back To All Products
          </Link>

          {/* 標題、描述與價格 */}
          <div>
            <h1 className="text-3xl font-extrabold text-primary dark:text-light mb-4">
              {product.name}
            </h1>
            <p className="text-lg text-dark dark:text-lighter mb-4">
              {product.description}
            </p>
            <div className="text-2xl font-bold text-primary dark:text-light">
              ${product.price}
            </div>
          </div>

          {/* 操作區塊：數量與按鈕 */}
          <div className="flex flex-col space-y-4">
            
            {/* 數量輸入框 (Controlled Component) */}
            <div className="flex items-center space-x-4">
              <label
                htmlFor="quantity"
                className="text-primary dark:text-light"
              >
                Qty:
              </label>
              <input
                type="number"
                id="quantity"
                min="1"
                value={quantity}
                // 使用 parseInt 確保狀態是數字，|| 1 防止使用者清空輸入框導致錯誤
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-16 px-2 py-1 border rounded-md focus:ring focus:ring-light dark:focus:ring-gray-600 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* 加入購物車按鈕 (目前僅為 UI 展示) */}
            <button 
            onClick={handleAddToCart}
            className="w-full px-4 py-2 bg-primary dark:bg-light text-white dark:text-black rounded-md text-lg font-semibold hover:bg-dark dark:hover:bg-lighter transition">
              Add to Cart
              <FontAwesomeIcon icon={faShoppingCart} className="ml-2" />
            </button>

            {/* 查看購物車按鈕 (觸發 navigate) */}
            <button
              onClick={handleViewCart}
              className="w-full px-4 py-2 bg-primary dark:bg-light text-white dark:text-black rounded-md text-lg font-semibold hover:bg-dark dark:hover:bg-lighter transition"
            >
              View Cart
              <FontAwesomeIcon icon={faShoppingBasket} className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}