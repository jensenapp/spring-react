// 從 React 匯入必要的 hooks 和功能
import {
  createContext,  // 建立 Context 的函式
  useState,       // 狀態管理 hook (此處未使用)
  useEffect,      // 副作用處理 hook
  useContext,     // 使用 Context 的 hook
  useReducer,     // 複雜狀態管理 hook
} from "react";

// 建立購物車的 Context,用於在元件樹中共享購物車狀態
export const CartContext = createContext();

// 自定義 hook,簡化 Context 的使用方式
// 使用此 hook 可以直接取得購物車的狀態和方法
export const useCart = () => useContext(CartContext);

// 定義 action 類型常數,避免拼寫錯誤
const ADD_TO_CART = "ADD_TO_CART";           // 新增商品到購物車
const REMOVE_FROM_CART = "REMOVE_FROM_CART"; // 從購物車移除商品
const CLEAR_CART = "CLEAR_CART";             // 清空購物車

/**
 * 購物車的 reducer 函式
 * @param {Array} prevCart - 當前的購物車狀態(商品陣列)
 * @param {Object} action - 包含 type 和 payload 的動作物件
 * @returns {Array} 更新後的購物車狀態
 */
const cartReducer = (prevCart, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      // 從 payload 中解構出商品和數量
      const { product, quantity } = action.payload;
      
      // 檢查購物車中是否已存在該商品
      const existingItem = prevCart.find(
        (item) => item.productId === product.productId
      );
      
      // 如果商品已存在,則增加數量
      if (existingItem) {
        return prevCart.map((item) =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + quantity } // 更新數量
            : item // 其他商品保持不變
        );
      }
      
      // 如果是新商品,則加入購物車
      return [...prevCart, { ...product, quantity }];
    
    case REMOVE_FROM_CART:
      // 過濾掉指定的商品,返回新的購物車陣列
      return prevCart.filter(
        (item) => item.productId !== action.payload.productId
      );
    
    case CLEAR_CART:
      // 返回空陣列,清空購物車
      return [];
    
    default:
      // 未知的 action 類型,返回原狀態
      return prevCart;
  }
};

/**
 * 購物車 Provider 元件
 * 提供購物車狀態和操作方法給所有子元件
 * @param {Object} props
 * @param {ReactNode} props.children - 子元件
 */
export const CartProvider = ({ children }) => {
  /**
   * 初始化購物車狀態
   * 使用 IIFE (立即執行函式) 從 localStorage 讀取購物車資料
   */
  const initialCartState = (() => {
    try {
      // 嘗試從 localStorage 讀取購物車資料
      const storedCart = localStorage.getItem("cart");
      // 如果存在則解析 JSON,否則返回空陣列
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      // 如果解析失敗(例如資料損壞),記錄錯誤並返回空陣列
      console.error("Failed to parse cart from localStorage:", error);
      return [];
    }
  })();

  // 使用 useReducer 管理購物車狀態
  // cart: 當前購物車狀態
  // dispatch: 用於觸發狀態更新的函式
  const [cart, dispatch] = useReducer(cartReducer, initialCartState);

  /**
   * 副作用:當購物車狀態改變時,同步到 localStorage
   * 這樣即使重新整理頁面,購物車資料也不會遺失
   */
  useEffect(() => {
    try {
      // 將購物車資料轉換為 JSON 字串並存入 localStorage
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      // 如果儲存失敗(例如空間不足),記錄錯誤
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [cart]); // 依賴陣列:只有 cart 改變時才執行

  /**
   * 新增商品到購物車
   * @param {Object} product - 商品物件,必須包含 productId
   * @param {number} quantity - 要新增的數量
   */
  const addToCart = (product, quantity) => {
    dispatch({ type: ADD_TO_CART, payload: { product, quantity } });
  };

  /**
   * 從購物車移除商品
   * @param {string|number} productId - 要移除的商品 ID
   */
  const removeFromCart = (productId) => {
    dispatch({ type: REMOVE_FROM_CART, payload: { productId } });
  };

  /**
   * 清空購物車
   */
  const clearCart = () => {
    dispatch({ type: CLEAR_CART });
  };

  /**
   * 計算購物車中所有商品的總數量
   * 使用 reduce 累加每個商品的數量
   */
  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);

  // 返回 Provider 元件,提供購物車狀態和方法給子元件
  return (
    <CartContext.Provider
      value={{ 
        cart,           // 購物車商品陣列
        addToCart,      // 新增商品的方法
        removeFromCart, // 移除商品的方法
        clearCart,      // 清空購物車的方法
        totalQuantity   // 商品總數量
      }}
    >
      {children}
    </CartContext.Provider>
  );
};