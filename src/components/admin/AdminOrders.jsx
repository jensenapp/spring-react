import { toast } from "react-toastify";
import apiClient from "../../api/apiClient"
import { useLoaderData,useRevalidator} from "react-router-dom";


export default function AdminOrders() {

  const adminOrders=useLoaderData();
  const revalidator=useRevalidator();

    const handleConfirm=async(orderId)=>{
     try {
       await apiClient.patch(`/admin/orders/${orderId}/confirm`);
       toast.success("Order confirmed.");
       revalidator.revalidate();
     } catch (error) {
      toast.error("Failed to confirm order.");
     }
    }

        const handleCancel=async(orderId)=>{
     try {
       await apiClient.patch(`/admin/orders/${orderId}/cancel`);
       toast.success("Order cancelled.");
       revalidator.revalidate();
     } catch (error) {
      toast.error("Failed to cancell order.");
     }
    }


    function formatDate(isoDate) {
    if (!isoDate) return "N/A";
    return new Date(isoDate).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div>
     {adminOrders.length===0 ? <p>No orders found.</p> : (adminOrders.map((order)=>(
        <div key={order.orderId}>
          <h2>OrderId:{order.orderId}</h2>
          <p>Status:{order.status}</p>
          <p>Price:${order.totalPrice}</p>
          <p>Date:{formatDate(order.createdAt)}</p>
          <button onClick={()=>handleConfirm(order.orderId)}>Confirm</button>   
          <button onClick={()=>handleCancel(order.orderId)}>Cancell</button> 
          {order.items.map((item,index)=>(
            <div key={index}>
            <img src={item.imageUrl} alt={item.productName} />
            <span>{item.productName}</span>
            <span>{item.quantity}</span>
            </div>
          ))}       
        </div>       
      )))}
    </div>
  )
}

export async function adminOrderLoader(){
  try {
    const response=await apiClient.get("/admin/orders");
    return response.data;
  } catch (error) {
    throw new Response(
       error.response?.data?.errorMessage ||
        error.message ||
        "Failed to fetch orders. Please try again.",
      { status: error.status || 500 }
    );
    
  }
}
