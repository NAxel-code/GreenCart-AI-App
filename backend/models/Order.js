import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true, ref: 'User' },
        items:[{
           product: { type: String, required: true, ref: 'Product' },
           quantity: { type: Number, required: true },
           name: { type: String },
        }],
        amount: { type: Number, required: true },
        address: { type: String, required: true, ref: 'Address' },
        status: { type: String, default: 'Order Placed' },
        paymentType : { type: String, required: true },
        isPaid: { type: Boolean, required: true, default: false },
    },
    { timestamps: true }    
);

const Order = mongoose.models.order || mongoose.model("Order", OrderSchema);

export default Order;