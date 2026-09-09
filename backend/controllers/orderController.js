import Order from "../models/Order.js";
import Product from "../models/Product.js"
import User from "../models/User.js";
import Stripe from "stripe";

//PLACE ORDER COD: /api/order/cod
export const placeOrderCOD = async (req, res) => {
    try {
        const { userId, items, address } = req.body;

        if (!address || items.length === 0) return res.status(404).json({ success: false, message: "Invalid Data" });

        //CALCULATE AMOUNT USING THE CORRESPONDING ITEMS
        let amount = 0;
        const enrichedItems = await Promise.all(items.map(async (item) => {
            const product = await Product.findById(item.product);
            amount += product.offerPrice * item.quantity;
            return {
                product: item.product,
                quantity: item.quantity,
                name: product.name,
                price: product.offerPrice,
            };
        }));

        console.log(enrichedItems);

        await Order.create({
            userId,
            items: enrichedItems, // now contains full item info
            //ADD TAX CHARGE (2% or whatever)
            amount: amount + Math.floor(amount * 0.02),
            address,
            paymentType: "COD",
        });

        return res.json({ success: true, message: "Order Placed Successfully!" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

//PLACE ORDER ONLINE: /api/order/stripe
export const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, address } = req.body;

        const { origin } = req.headers;

        if (!address || items.length === 0) return res.status(404).json({ success: false, message: "Invalid Data" });

        let productData = [];

        //CALCULATE AMOUNT USING THE CORRESPONDING ITEMS
        let amount = 0;
        const enrichedItems = await Promise.all(items.map(async (item) => {
            const product = await Product.findById(item.product);
            amount += product.offerPrice * item.quantity;

            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity,
            });

            return {
                product: item.product,
                quantity: item.quantity,
                name: product.name,
                price: product.offerPrice,
            };
        }));

        const order = await Order.create({
            userId,
            items: enrichedItems, // now contains full item info
            //ADD TAX CHARGE (2% or whatever)
            amount: amount + Math.floor(amount * 0.02),
            address,
            paymentType: "Online",
        });

        //STRIPE GETAWAY INITIALIZE
        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

        //CREATE LINE ITEMS FOR STRIPE
        const line_items = productData.map((item) => {
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.name,
                    },

                    unit_amount: Math.round(item.price * 1.02 * 100)
                },

                quantity: item.quantity,
            }
        })

        //CREATE SESSION
        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${origin}/loader?next=my-orders`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: order._id.toString(),
                userId,
            }
        })

        return res.json({ success: true, url: session.url });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

//STRIPE WEBHOOK TO VERIFY PAYMENTS ACTION -> /stripe
export const stripeWebHooks = async (req, res) => {
    //STRIPE GETAWAY INITIALIZE  
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        res.status(400).json({ message: `Webhook Error: ${error.message}` });
    }

    //HANDLE EVENT
    switch (event.type) {
        case "payment_intent.succeeded": {
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;
            
            //GETTING SESSION METADATA
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });

            const { orderId, userId } = session.data[0].metadata;

            //MARK PAYMENT AS PAID
            await Order.findByIdAndUpdate(orderId, { isPaid: true });

            //CLEAR USER'S CART
            await User.findByIdAndUpdate(userId, { cartItems: {} });

            break;
        }

        case "payment_intent.payment_failed":{
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;
            
            //GETTING SESSION METADATA
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });

            const { orderId } = session.data[0].metadata;

            await Order.findByIdAndDelete(orderId);

            break;
        }
    
        default:
            console.error(`Unhandled Event Type: ${event.type}`);
            break;
    }

    res.json({ received: true });
};

//GET ORDERS BY USER ID -> /api/order/user
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user?._id || req.query.userId || req.body?.userId;
        const orders = await Order.find({
            userId,
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        }).populate("items.product address").sort({ createdAt: -1 });

        res.json({ success: true, orders });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

//GET ALL ORDERS -> /api/order/seller
export const getAllOrders = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "seller") {
            return res.status(403).json({ success: false, message: "Access denied: Seller role required" });
        }
        const orders = await Order.find({
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        }).populate("items.product address").sort({ createdAt: -1 });

        res.json({ success: true, orders });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};