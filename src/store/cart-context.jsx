// 引入 React 的 Context API 相關函數
import { createContext, useContext } from 'react';
// 引入 React 的狀態管理和副作用 Hooks
import { useState, useEffect } from 'react';

// 初始購物車 Context 的結構定義(已註解,作為參考)
// const initialCartContext = {
//   cart: [],             // 存放購物車商品的陣列
//   setCart: () => {},    // 用於更新購物車的函式 (目前為空)
//   addToCart: () => {console.log("Product added to cart")},  // 新增商品函式
//   removeFromCart: () => {}, // 移除商品函式
//   totalQuantity: 0      // 購物車商品總數
// };

// 創建購物車 Context,用於在組件樹中共享購物車狀態
export const CartContext = createContext();

// 自定義 Hook:提供便捷的方式來使用 CartContext
export const useCart = () => useContext(CartContext);

// 購物車 Provider 組件:負責管理購物車的所有邏輯和狀態
export const CartProvider = ({ children }) => {

    // 初始化購物車狀態
    // 從 localStorage 讀取已保存的購物車數據,若無則使用空陣列
    const [cart, setCart] = useState(() => {
        try {
            // 嘗試從 localStorage 取得購物車數據
            const storedCart = localStorage.getItem("cart");
            // 若存在則解析 JSON,否則返回空陣列
            return storedCart ? JSON.parse(storedCart) : [];
        } catch (error) {
            // 若解析失敗(例如數據損壞),記錄錯誤並返回空陣列
            console.log("Failed to parse cart from localStorage:", error);
            return [];
        }
    });
    
    // 副作用:每當購物車狀態變化時,自動保存到 localStorage
    useEffect(() => {
        try {
            // 將購物車數據序列化為 JSON 並存入 localStorage
            localStorage.setItem("cart", JSON.stringify(cart));
        } catch (error) {
            // 若保存失敗(例如容量已滿),記錄錯誤
            console.log("Failed to save cart to localStorage:", error);
        }
    }, [cart]); // 依賴項:當 cart 變化時執行

    // 新增商品到購物車的函數
    // @param product - 要添加的商品物件
    // @param quantity - 要添加的數量
    const addToCart = (product, quantity) => {
        setCart((preval) => { // preval 是購物車的前一個狀態
            // 檢查商品是否已存在於購物車中
            const existItem = preval.find(
                (item) => {
                    return item.productId === product.productId
                });
            
            // 若商品已存在,更新其數量
            if (existItem) {
                return preval.map((item) => {
                    // 找到匹配的商品,增加數量;其他商品保持不變
                    return item.productId === product.productId 
                        ? { ...item, quantity: item.quantity + quantity } 
                        : item
                });
            }
            
            // 若商品不存在,將新商品添加到購物車
            return [...preval, { ...product, quantity }];
        });
    };

    // 從購物車中移除商品的函數
    // @param productId - 要移除的商品 ID
    const removeFromCart = (productId) => {
        setCart((preval) => {
            // 過濾掉指定 ID 的商品,保留其他商品
            return preval.filter((item) => {
                return item.productId !== productId
            });
        });
    }

    // 計算購物車中商品的總數量
    // 使用 reduce 累加所有商品的 quantity 屬性
    const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);

    // 提供 Context 的值給所有子組件
    return (
        <CartContext.Provider value={{ 
            cart,              // 購物車商品陣列
            setCart,           // 直接設置購物車狀態的函數
            addToCart,         // 新增商品的函數
            removeFromCart,    // 移除商品的函數
            totalQuantity      // 購物車商品總數
        }}>
            {children} {/* 渲染所有子組件 */}
        </CartContext.Provider>
    );
};