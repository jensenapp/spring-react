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
import { loginAction } from './components/Login.jsx';
import { AuthProvider } from './store/auth-context.jsx';
import CheckoutForm from './components/CheckoutForm.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import Profile, { profileAction, profileLoader } from "./components/Profile.jsx";
import Orders,{ordersLoader} from "./components/Orders.jsx";
import AdminOrders,{adminOrdersLoader} from "./components/admin/AdminOrders.jsx";
import Messages, { messagesLoader } from "./components/admin/Messages.jsx";
import Register, { registerAction } from './components/Register.jsx';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import OrderSuccess from './components/OrderSuccess.jsx';



const stripePromise = loadStripe(
  "pk_test_51SvzdWJH0hVLuzWZWPAgJMLQcgOvocdRXZNxrkhkQqUH0SnZCuRDYMjcHMIh4FKFDwbgepFjD1iq50WWGbPsdC5200cJJVRKM2"
);

// 定義路由變數
const routeDefinitions = createRoutesFromElements(
  <Route path="/" element={<App />} errorElement={<ErrorPage />}>
    {/* 第一個子路由：Index Route (首頁預設內容) */}
    <Route index element={<Home /> } loader={productsLoader}/>
    
    {/* 其他子路由 */}
    <Route path="/home" element={<Home />} loader={productsLoader}/>
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} action={contactAction}/>
    <Route path="/login" element={<Login />} action={loginAction}/>
    <Route path="/register" element={<Register/>} action={registerAction}/>
    <Route path="/cart" element={<Cart />} />
    <Route path="/products/:productId" element={<ProductDetail/>} />
    
    <Route element={<ProtectedRoute />}>
    <Route path="/checkout" element={<CheckoutForm />} />
    <Route 
    path="/profile" 
    element={<Profile />} 
    action={profileAction} 
    loader={profileLoader}
    shouldRevalidate={({ actionResult }) => {
          return !actionResult?.success;
        }}
    />
    <Route path="/orders" element={<Orders />} loader={ordersLoader}/>
    <Route path="/admin/orders" element={<AdminOrders />} loader={adminOrdersLoader}/>
    <Route path="/admin/messages" element={<Messages />} loader={messagesLoader}/>
    <Route path="/order-success" element={<OrderSuccess />} />
    </Route>
  </Route>
);

// 將定義好的路由結構傳入 createBrowserRouter
const appRouter = createBrowserRouter(routeDefinitions);


createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    <Elements stripe={stripePromise}>
    <AuthProvider>
    <CartProvider>
     <RouterProvider router={appRouter} />
    </CartProvider>
    </AuthProvider>
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
    </Elements>
  </StrictMode>,
)
