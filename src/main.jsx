import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider,createRoutesFromElements,Route } from "react-router-dom";
import About from "./components/About.jsx";
import Contact, { contactAction } from "./components/Contact.jsx";
import Login from "./components/Login.jsx";
import Cart from "./components/Cart.jsx";
import Home from './components/Home.jsx';
import ErrorPage from './components/ErrorPage.jsx';
import { productsLoader } from "./components/Home.jsx";

import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import ProductDetail from './components/ProductDetail.jsx';
import { CartProvider } from './store/cart-context';


// 定義路由變數
const routeDefinitions = createRoutesFromElements(
  <Route path="/" element={<App />} errorElement={<ErrorPage />}>
    {/* 第一個子路由：Index Route (首頁預設內容) */}
    <Route index element={<Home /> } loader={productsLoader}/>
    
    {/* 其他子路由 */}
    <Route path="home" element={<Home />} loader={productsLoader}/>
    <Route path="about" element={<About />} />
    <Route path="contact" element={<Contact />} action={contactAction}/>
    <Route path="login" element={<Login />} />
    <Route path="cart" element={<Cart />} />
    <Route path="products/:productId" element={<ProductDetail/>} 
/>
  </Route>
);

// 將定義好的路由結構傳入 createBrowserRouter
const appRouter = createBrowserRouter(routeDefinitions);


createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    <ToastContainer
      position="top-center"        // 位置：上方置中
      autoClose={3000}             // 自動關閉時間：3秒
      hideProgressBar={false}      // 是否隱藏進度條
      newestOnTop={false}          // 最新訊息是否在最上方
      closeOnClick                 // 點擊關閉
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"                // 主題：light, dark, colored
      transition={Bounce}          // 動畫效果
    />
    <CartProvider>
     <RouterProvider router={appRouter} />
    </CartProvider>
    
  </StrictMode>,
)
