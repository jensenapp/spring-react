import React from "react";
import PageTitle from "./PageTitle";
import { Form,useActionData,useNavigation} from "react-router-dom";
import { useRef,useEffect } from "react";
import apiClient from "../api/apiClient"; 
import { toast } from "react-toastify";


export default function Contact() {
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";
    const actionData = useActionData();
    const formRef = useRef(null);

    useEffect(() => {
        if (actionData?.success) {
            formRef.current?.reset();
            toast.success("Your message has been submitted successfully!");
        }
    }, [actionData]);

    // 定義樣式變數 (保留 UI 樣式)
    const labelStyle = "block text-lg font-semibold text-primary dark:text-light mb-2";
    const textFieldStyle = "w-full px-4 py-2 text-base border rounded-md transition border-primary dark:border-light focus:ring focus:ring-dark dark:focus:ring-lighter focus:outline-none text-gray-800 dark:text-lighter bg-white dark:bg-gray-600 placeholder-gray-400 dark:placeholder-gray-300";

    return (
        <div className="max-w-[1152px] min-h-[852px] mx-auto px-6 py-8 font-primary bg-normalbg dark:bg-darkbg">
            <PageTitle title="Contact Us" />

            <p className="max-w-[768px] mx-auto mt-8 text-gray-600 dark:text-lighter mb-8 text-center">
                We’d love to hear from you! If you have any questions, feedback, or
                suggestions, please don’t hesitate to reach out.
            </p>

            {/* 重點優化在這裡：直接在 onSubmit 處理攔截邏輯 */}
            <Form
                ref={formRef}
                method="POST"
                className="space-y-6 max-w-[768px] mx-auto"
                onSubmit={(e) => {
                    if (!window.confirm("Are you sure you want to submit the form?")) {
                        e.preventDefault(); // 只有在「取消」時，才阻止表單送出
                        toast.info("Form submission cancelled.");
                    }
                    // 如果按「確定」，什麼都不用做！
                    // React Router 會自動攔截畫面跳轉，並把所有的 input 收集成 FormData 送給 action！
                }}
            >
                {/* Name Field */}
                <div>
                    <label htmlFor="name" className={labelStyle}>Name</label>
                    <input id="name" name="name" type="text" placeholder="Your Name" className={textFieldStyle} required minLength={5} maxLength={30} />
                    {actionData?.errors?.name && <p className="text-red-500 text-sm mt-1">{actionData.errors.name}</p>}
                </div>

                {/* Email and mobile Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="email" className={labelStyle}>Email</label>
                        <input id="email" name="email" type="email" placeholder="Your Email" className={textFieldStyle} required />
                        {actionData?.errors?.email && <p className="text-red-500 text-sm mt-1">{actionData.errors.email}</p>}
                    </div>

                    <div>
                        <label htmlFor="mobileNumber" className={labelStyle}>Mobile Number</label>
                        <input id="mobileNumber" name="mobileNumber" type="tel" required pattern="^\d{10}$" title="Mobile number must be exactly 10 digits" placeholder="Your Mobile Number" className={textFieldStyle} />
                        {actionData?.errors?.mobileNumber && <p className="text-red-500 text-sm mt-1">{actionData.errors.mobileNumber}</p>}
                    </div>
                </div>

                {/* Message Field */}
                <div>
                    <label htmlFor="message" className={labelStyle}>Message</label>
                    <textarea id="message" name="message" rows="4" placeholder="Your Message" className={textFieldStyle} required minLength={5} maxLength={500} />
                    {actionData?.errors?.message && <p className="text-red-500 text-sm mt-1">{actionData.errors.message}</p>}
                </div>

                {/* Submit Button */}
                <div className="text-center">
                    <button type="submit" disabled={isSubmitting} className="px-6 py-2 text-white dark:text-black text-xl rounded-md transition duration-200 bg-primary dark:bg-light hover:bg-dark dark:hover:bg-lighter disabled:opacity-50">
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                </div>
            </Form>
        </div>
    );
}

export async function contactAction({request}){
const data= await request.formData();
const contactData={
  name:data.get("name"),
  email:data.get("email"),
  mobileNumber:data.get("mobileNumber"),
  message:data.get("message")
};
try {
  await apiClient.post("/contacts",contactData);
   return{success:true};
} catch (error) {
  if (error.response?.status === 400) {
      return { 
        success: false, 
        errors: error.response?.data  // 返回後端的驗證錯誤 Map
      };
    }
    throw new Response(
      error.response?.data?.errorMessage || error.message,
      { status: error.status || 500 }
    );
  }
}
