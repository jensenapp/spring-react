// ✅ React：用來建立元件、管理狀態（useState）
import React, { useState } from "react";

// ✅ 取得目前登入使用者資訊（例如 name / email / 地址）
import { useAuth } from "../store/auth-context";

// ✅ 你封裝過的 axios/fetch 客戶端：用來呼叫後端 API（建立 PaymentIntent、建立訂單）
import apiClient from "../api/apiClient";

// ✅ 購物車狀態：cart 內容、totalPrice 總金額、clearCart 清空購物車
import { useCart } from "../store/cart-context";

// ✅ Stripe Elements：
// - useStripe / useElements：拿到 Stripe 實例與 Elements 容器
// - CardNumberElement / CardExpiryElement / CardCvcElement：Stripe 提供的安全輸入欄位（不會讓卡號直接進到你的前端 state）
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";

// ✅ React Router：
// - useNavigate：付款成功後導頁到成功頁
// - useNavigation：這裡其實沒用到（可刪）
//   （它通常用在 data router 的 loader/action 提交狀態）
import { useNavigate, useNavigation } from "react-router-dom";

// ✅ 頁面標題元件
import PageTitle from "./PageTitle";

// ✅ Toast 通知（成功訊息）
import { toast } from "react-toastify";

export default function CheckoutForm() {
  // =========================
  // 1) 全域狀態 / hooks
  // =========================

  // 從 Auth context 取得登入者資料
  const { user } = useAuth();

  // 從 Cart context 取得購物車與總價、以及清空購物車的方法
  const { cart, totalPrice, clearCart } = useCart();

  // Stripe 實例（載入 Stripe.js 完成後才會有值）
  const stripe = useStripe();

  // Elements 容器（用來拿到 CardNumberElement 等 Stripe 元素）
  const elements = useElements();

  // React Router 的導頁函式
  const navigate = useNavigate();

  // ⚠️ 目前沒使用到，可刪掉，避免 lint 警告
  const navigation = useNavigation();

  // =========================
  // 2) 本地狀態（UI / 錯誤 / 送出狀態）
  // =========================

  // 付款處理中狀態：用來切換 loading UI、避免重複提交
  const [isProcessing, setIsProcessing] = useState(false);

  // 表單層級錯誤訊息：例如 Stripe 沒載入、付款失敗、建立訂單失敗等
  const [errorMessage, setErrorMessage] = useState("");

  // 每個 Stripe Element 欄位的錯誤訊息（卡號/到期日/CVC）
  // 用來在 UI 顯示紅字，也用來控制欄位 class（紅框/正常框）
  const [elementErrors, setElementErrors] = useState({
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });

  // =========================
  // 3) UI 樣式與 Stripe Elements 外觀設定
  // =========================

  // 判斷是否暗色模式（你用 localStorage 存 theme）
  // 目的：調整 Stripe Element 文字顏色/背景色，讓它跟暗色模式一致
  const isDarkMode = localStorage.getItem("theme") === "dark";

  // label 基本樣式（Tailwind）
  const labelStyle =
    "block text-lg font-semibold text-primary dark:text-light mb-2";

  // 欄位容器（包住 Stripe Element 的 div）的基底樣式
  // 注意：Stripe Element 本身不是普通 input，所以要靠外層 div 來做 border/ring/背景色等
  const fieldBaseClass =
    "w-full px-4 py-2 text-base border rounded-md transition border-primary dark:border-light focus:ring focus:ring-dark dark:focus:ring-lighter focus:outline-none text-gray-800 dark:text-lighter bg-white dark:bg-gray-600 placeholder-gray-400 dark:placeholder-gray-300";

  // 欄位錯誤時：border/ring 紅色
  const fieldErrorClass =
    "border-red-400 dark:border-red-500 focus:ring-red-500";

  // 欄位正常：border/ring 正常色
  const fieldValidClass =
    "border-primary dark:border-light focus:ring-dark dark:focus:ring-lighter";

  // 根據某個欄位是否有錯誤，回傳該欄位外層 div 應該套用的 className
  // field 會是 "cardNumber" / "cardExpiry" / "cardCvc"
  const getClassForElement = (field) =>
    `${fieldBaseClass} ${elementErrors[field] ? fieldErrorClass : fieldValidClass}`;

  // Stripe Elements 的內部文字樣式設定（不是 Tailwind，而是 Stripe 的 style config）
  // 目的：讓 Stripe 內建 iframe input 的字體、顏色、背景，跟你的 UI 一致
  const elementOptions = {
    style: {
      base: {
        fontSize: "16px",
        // base：一般狀態下的字體顏色
        color: isDarkMode ? "#E5E7EB" : "#374151",
        // base：背景色
        backgroundColor: isDarkMode ? "#4B5563" : "#FFFFFF",
      },
      invalid: {
        // invalid：輸入錯誤時的字體顏色
        color: "#F87171",
        // invalid：背景色仍維持一致（不要變成奇怪顏色）
        backgroundColor: isDarkMode ? "#4B5563" : "#FFFFFF",
      },
    },
  };

  // =========================
  // 4) Stripe Element 輸入變更處理：即時記錄欄位錯誤
  // =========================

  // field: "cardNumber" / "cardExpiry" / "cardCvc"
  // event: Stripe Element onChange event（包含 event.error、complete、empty 等資訊）
  function handleCardChange(field, event) {
    // 只要 event.error 存在，就把錯誤訊息記到 elementErrors[field]
    // 沒錯誤就清空字串（表示該欄位目前 OK）
    setElementErrors((prev) => ({
      ...prev,
      [field]: event.error ? event.error.message : "",
    }));
  }

  // =========================
  // 5) 提交付款（核心流程）
  // =========================
  const handleSubmit = async (event) => {
    // 阻止表單預設送出行為（避免頁面刷新）
    event.preventDefault();

    // 1) Stripe.js / Elements 尚未就緒時，不能付款
    //    常見於元件剛 render、或 StripeProvider 還沒載入完成
    if (!stripe || !elements) {
      setErrorMessage("Stripe.js is not loaded yet.");
      return;
    }

    // 2) 只要三個欄位任一個有錯誤，就不送出（避免送出無效卡資料）
    //    Object.values(elementErrors) -> ["", "", "xxx"]
    if (Object.values(elementErrors).some((error) => error)) {
      setErrorMessage("Please correct the highlighted errors.");
      return;
    }

    // 3) 開始處理：鎖住按鈕 + 顯示 Processing 畫面
    setIsProcessing(true);
    // 若之前有錯誤，這裡你也可以選擇先清掉
    // setErrorMessage("");

    try {
      // =========================
      // A) 跟後端要 PaymentIntent（clientSecret）
      // =========================
      // amount 用「最小貨幣單位」：USD -> cents，所以 * 100
      // ⚠️ 確保 totalPrice 是數字且避免浮點誤差（常見做法：後端用整數算）
      const response = await apiClient.post("/payment/create-payment-intent", {
        amount: totalPrice * 100,
        currency: "usd",
      });

      // 後端回傳的 clientSecret 是 Stripe confirmCardPayment 必需的憑證
      const { clientSecret } = response.data;

      // =========================
      // B) 用 Stripe 以卡片資料確認付款
      // =========================
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            // 這裡指定要用哪個 Stripe Element 當作卡片來源（卡號欄位即可）
            // Expiry/CVC 已經在 Elements 裡綁定，同一組 elements 即可
            card: elements.getElement(CardNumberElement),

            // 付款人的帳單資料（Stripe 會保存到 payment method / intent）
            // 這些資料通常用來做風控、發票、或 3DS 驗證參考
            billing_details: {
              name: user.name,
              email: user.email,
              phone: user.mobileNumber,
              address: {
                line1: user.street,
                city: user.city,
                state: user.state,
                postal_code: user.postalCode,
                country: user.country,
              },
            },
          },
        }
      );

      // =========================
      // C) 處理 Stripe 回傳結果
      // =========================

      // confirmCardPayment 失敗（卡片被拒、3DS 失敗、clientSecret 錯等）
      if (error) {
        setErrorMessage(error.message || "Payment failed. Please try again.");

        // 付款成功：paymentIntent 存在且 status === "succeeded"
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // 用 toast 提示使用者付款成功
        toast.success("Payment successful!");

        // =========================
        // D) 付款成功後：建立訂單（寫入你的資料庫）
        // =========================
        try {
          await apiClient.post("/orders", {
            totalPrice: totalPrice,
            paymentId: paymentIntent.id,
            paymentStatus: paymentIntent.status,

            // 把購物車 item map 成後端需要的結構
            // 注意：你使用 productId / quantity / price
            items: cart.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          });

          // 用 sessionStorage 放一個 flag，通常用來控制：
          // - 例如在成功頁不要再跳回 checkout
          // - 或避免某些 redirect logic 造成返回付款頁
          sessionStorage.setItem("skipRedirectPath", "true");

          // 清空購物車（避免回到購物車頁還看到舊資料）
          clearCart();

          // 導到成功頁
          navigate("/order-success");
        } catch (orderError) {
          // 訂單建立失敗：付款其實已成功，但你的系統沒記到訂單
          // 這種情況要特別處理（可能需要客服介入）
          console.error("Failed to create order:", orderError);
          setErrorMessage("Order creation failed. Please contact support.");
        }
      }
    } catch (error) {
      // 建立 PaymentIntent 或其他 API 失敗
      setErrorMessage("Error processing payment. Please try again later.");
      console.error("Error creating PaymentIntent:", error);
    } finally {
      // 不管成功或失敗都要解除 processing 狀態，讓 UI 回復
      setIsProcessing(false);
    }
  };

  // =========================
  // 6) JSX UI：付款中畫面 / 表單畫面
  // =========================
  return (
    <div className="min-h-[852px] flex items-center justify-center font-primary dark:bg-darkbg">
      {/* ✅ 付款處理中畫面：避免使用者重整或重複送出 */}
      <div
        className={
          isProcessing
            ? "visible  flex flex-col justify-center items-center my-[200px] "
            : "hidden"
        }
      >
        <p className="mt-4 text-2xl font-normal text-primary dark:text-light">
          Processing Payment.... Don't refresh the page
        </p>
      </div>

      {/* ✅ 付款表單：當 isProcessing === false 才顯示 */}
      <div
        className={
          isProcessing
            ? "hidden"
            : "visible bg-white dark:bg-gray-700 shadow-md rounded-lg max-w-md w-full px-8 py-6"
        }
      >
        <PageTitle title="Complete Your Payment" />

        {/* 顯示本次要扣款金額 */}
        <p className="text-center mt-8 text-lg text-gray-600 dark:text-lighter mb-8">
          Amount to be charged: <strong>${totalPrice.toFixed(2)}</strong>
        </p>

        {/* ✅ onSubmit 觸發 handleSubmit */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 表單級錯誤訊息（例如付款失敗 / Stripe 未載入 / 訂單建立失敗） */}
          {errorMessage && (
            <div className="text-red-500 text-sm text-center">
              {errorMessage}
            </div>
          )}

          {/* =========================
              Card Number（卡號）
             ========================= */}
          <div>
            <label htmlFor="cardNumber" className={labelStyle}>
              Card Number
            </label>

            {/* Stripe Element 外層容器：用它來套 Tailwind 樣式 */}
            <div id="cardNumber" className={getClassForElement("cardNumber")}>
              <CardNumberElement
                // Stripe 自己的 styling config
                options={elementOptions}
                // 即時監聽：有錯誤就更新 elementErrors.cardNumber
                onChange={(event) => handleCardChange("cardNumber", event)}
              />
            </div>

            {/* 顯示卡號欄位錯誤訊息 */}
            {elementErrors.cardNumber && (
              <p className="text-red-500 text-sm mt-1">
                {elementErrors.cardNumber}
              </p>
            )}
          </div>

          {/* =========================
              Card Expiry（到期日）
             ========================= */}
          <div>
            <label htmlFor="cardExpiry" className={labelStyle}>
              Expiry Date
            </label>
            <div id="cardExpiry" className={getClassForElement("cardExpiry")}>
              <CardExpiryElement
                options={elementOptions}
                onChange={(event) => handleCardChange("cardExpiry", event)}
              />
            </div>
            {elementErrors.cardExpiry && (
              <p className="text-red-500 text-sm mt-1">
                {elementErrors.cardExpiry}
              </p>
            )}
          </div>

          {/* =========================
              Card CVC（安全碼）
             ========================= */}
          <div>
            <label htmlFor="cardCvc" className={labelStyle}>
              CVC
            </label>
            <div id="cardCvc" className={getClassForElement("cardCvc")}>
              <CardCvcElement
                options={elementOptions}
                onChange={(event) => handleCardChange("cardCvc", event)}
              />
            </div>
            {elementErrors.cardCvc && (
              <p className="text-red-500 text-sm mt-1">
                {elementErrors.cardCvc}
              </p>
            )}
          </div>

          {/* =========================
              Submit Button（送出付款）
             ========================= */}
          <div>
            <button
              type="submit"
              // Stripe 未就緒或處理中時禁止點擊
              disabled={!stripe || isProcessing}
              className="w-full px-6 py-2 mt-6 text-white dark:text-black text-xl bg-primary dark:bg-light hover:bg-dark dark:hover:bg-lighter rounded-md transition duration-200"
            >
              {/* 依狀態顯示不同文案 */}
              {isProcessing ? "Payment processing..." : "Pay Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
