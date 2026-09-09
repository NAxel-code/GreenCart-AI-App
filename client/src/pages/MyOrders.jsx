import React, { useEffect, useState, useContext } from 'react'
import { AppContext } from '../context/AppContext';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

const MyOrders = () => {
    const { user, currency, myOrders, setMyOrders } = useContext(AppContext);

    const [loading, setLoading] = useState(true);

    const fetchMyOrders = async () => {
        setLoading(true);
        try {
            const { data } = await axiosInstance.post(API_PATHS.AUTH.HISTORY, {
                userId: user._id
            });

            // console.log("Fetched Orders:", data);

            if (data.success)
                setMyOrders(data.history);

            else
                console.error("Failed to fetch orders:", data.message);
        } catch (error) {
            console.error("Error fetching orders:", error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!user || !user._id) {
        console.warn("User not available yet");
        return;
    }

        fetchMyOrders();

    }, [user]);

    return (
        <div className='mt-16 pb-16'>
            <div className='flex flex-col items-start w-max mb-8'>
                <p className='text-2xl font-medium uppercase'>My Orders</p>
                <div className='w-12 h-0.5 bg-primary rounded-full'></div>
                <div className='border-gray-300 rounded-lg mb-10 
        p-4 py-5 max-w-4xl'>

                    {loading ? (
                        <p className='text-primary'>Loading your orders...</p>
                    ) : !user ? (
                        <p className='text-red-500 font-semibold items-center'>Unknown User</p>
                    ) : myOrders.length === 0 ? (
                        <p className='text-primary'>You have no orders yet.</p>
                    ) : (
                        myOrders.map((order, index) => (
                            <div key={order.orderId || index} className='mb-8 p-4 border border-gray-300 rounded'>
                                <p className='flex justify-between md:items-center text-gray-400 md:font-medium max-md:flex-col'>
                                    <span>Order ID: {order.orderId}</span>
                                    <span>Payment : {order.paymentType}</span>
                                    <span>Total Amount : {currency}{order.amount}</span>
                                </p>
                                {order.items.map((item, index) => (
                                    <div key={item.productId || index}
                                        className={`relative bg-white text-gray-500/70 ${order.items.length !== index + 1 && "border-b"} border-gray-300 flex flex-col md:flex-row md:items-center justify-between p-4 py-5 md:gap-16 w-full max-w-4xl`}>

                                        <div className='flex items-center mb-4 md:mb-0'>
                                            <div className='bg-primary/10 p-4 rounded-lg'>
                                                <img src={item.image?.[0] || "/fallback.png"} alt=""
                                                    className='w-16 h-16' />
                                            </div>
                                            <div className='ml-4'>
                                                <h2 className='text-xl font-medium text-gray-800'>{item.name}</h2>
                                                <p>Category: {item.category}</p>
                                            </div>
                                        </div>

                                        <div className='flex flex-col justify-center md:ml-8 mb-4 md:mb-0'>
                                            <p>Quantity: {item.quantity || "1"}</p>
                                            <p>Status: {order.status}</p>
                                            <p>Date: {new Date(order.date).toLocaleDateString()}</p>
                                        </div>

                                        <p className='text-primary text-lg font-medium'>
                                            Amount: {currency}{item.offerPrice * item.quantity}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}


export default MyOrders