import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'

const Order = () => {
    const [orders, setOrders] = useState([]);
    const { currency } = useContext(AppContext);

    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data } = await axiosInstance.post(API_PATHS.AUTH.ORDERS);

            console.log("Fetched Orders:", data);

            if (data.success)
                setOrders(data.history);

            else
                console.error("Failed to fetch orders:", data.message);
        } catch (error) {
            console.error("Error fetching orders:", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();

    }, []);

    return (
        <div className='no-scrollbar flex-1 h-[95vh] overflow-y-scroll'>
            <div className="md:p-10 p-4 space-y-4">
                <h2 className="text-lg font-medium">Orders List</h2>
                {!loading && orders.length === 0 && (
                    <p className="text-center text-gray-500">No orders found.</p>
                )}
                {orders.map((order, index) => (
                    <div key={index} className="flex flex-col md:items-center md:flex-row gap-5 justify-between p-5 max-w-4xl rounded-md border border-gray-300">
                        <div className="flex gap-5 max-w-80">
                            <img className="w-12 h-12 object-cover" src={assets.box_icon} alt="boxIcon" />
                            <div>
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex flex-col">
                                        <p className="font-medium">
                                            {item.name}{" "}
                                            <span className='text-primary'>x {item.quantity}</span>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {order.address && (
                            <div className="text-sm md:text-base text-black/60">
                                <p className='text-black/80'>{order.address.firstName} {order.address.lastName}</p>
                                <p>{order.address.street}, {order.address.city}</p>
                                <p>{order.address.state}, {order.address.zipcode}, {order.address.country}</p>
                                <p>{order.address.email}</p>
                                <p>{order.address.phone}</p>
                            </div>
                        )}

                        <p className="font-medium text-lg my-auto">{currency}{order.amount}</p>

                        <div className="flex flex-col text-sm md:text-base text-black/60">
                            <p>Method: {order.paymentType}</p>
                            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                            <p>Payment: {order.isPaid ? "Paid" : "Pending"}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div >
    )
}

export default Order