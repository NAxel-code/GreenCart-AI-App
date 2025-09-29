import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

    const currency = import.meta.env.VITE_CURRENCY;

    const [loginType, setLoginType] = useState("user");

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [showUserLogin, setShowUserLogin] = useState(false);
    const [products, setProducts] = useState([]);

    const [cartItems, setCartItems] = useState({});
    const [searchQuery, setSearchQuery] = useState({});

    const [openAuthModal, setOpenAuthModal] = useState(false);

    //LOGIN
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setOpenAuthModal(false);
            return;
        }

        const accessToken = localStorage.getItem("token");

        if (!accessToken) {
            setLoading(false);
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
                setUser(response.data);

            } catch (error) {
                console.error("User not authenticated", error);
                clearUser();
            } finally {
                setLoading(false);
            }
        };

        fetchUser();

    }, [user]);

    //FUNCTION TO UPLOAD USER DATA
    const updateUser = async (userData) => {
        localStorage.setItem("token", userData.token);
        try {
            const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
            setUser(response.data);
        } catch (err) {
            console.error("Failed to fetch profile after login", err);
        } finally {
            setLoading(false);
        }
    };

    //FUNCTION TO CLEAR USER DATA (e.g., on logout)
    const clearUser = () => {
        setUser(null);
        localStorage.removeItem("token");
    };


    //FETCH ALL PRODUCTS
    const fetchProducts = async () => {
        try {
            const { data } = await axiosInstance.get(API_PATHS.PRODUCT.PRODUCT_LIST);

            if (data.success) setProducts(data.products);
            else toast.error(data.message);

        } catch (error) {
            toast.error(error.message);
        }
    };

    //ADD PRODUCT TO CART
    const addToCart = (itemId) => {
        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) cartData[itemId] += 1;
        else cartData[itemId] = 1;

        setCartItems(cartData);
        toast.success("Product is Added To Cart");
    };

    //UPDATE CART ITEM'S QUANTITY
    // LATER, MODIFY THIS SO THAT IT'LL GET THE ITEM'S NAME FOR FURTHER AI FUNCTIONS
    const updateCartItem = (itemId, quantity) => {
        let cartData = structuredClone(cartItems);

        cartData[itemId] = quantity;
        setCartItems(cartData);

        toast.success("Cart Updated");
    };

    //REMOVE PRODUCT FROM CART
    const removeFromCart = (itemId) => {
        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            cartData[itemId] -= 1;

            if (cartData[itemId] === 0) delete cartData[itemId];
        }

        toast.success("Product removed from Cart");
        setCartItems(cartData);
    };

    //GET CART COUNT
    const getCartCount = () => {
        let totalCount = 0;
        for (const item in cartItems) {
            totalCount += cartItems[item];
        }
        return totalCount;
    };

    //GET TOTAL AMOUNT IN CART
    const getCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            let itemInfo = products.find(product => product._id === item);
            if (cartItems[item] > 0) {
                totalAmount += itemInfo.price * cartItems[item];
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    };

    useEffect(() => {
        fetchProducts();

    }, []);

    useEffect(() => {
        const updateCart = async () => {
            try {
                // console.log("Cart update:", { userId: user?._id, cartItems });
                const { data } = await axiosInstance.post(API_PATHS.CART.UPDATE_CART, {
                    userId: user._id,
                    cartItems
                });

                if(!data.success) toast.error("Failed to update cart");

            } catch (error) {
                toast.error(error.message);
            }

        }

        if(user) updateCart();

    }, [cartItems, user]);


    const value = {
        navigate, user, setUser,
        showUserLogin, setShowUserLogin, products, currency, addToCart, updateCartItem,
        removeFromCart, cartItems, searchQuery, setSearchQuery,
        clearUser, updateUser,
        openAuthModal, setOpenAuthModal,
        loading,
        loginType, setLoginType,
        getCartAmount, getCartCount, setCartItems,
        fetchProducts,

    };
    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}

export const useAppContext = () => {
    return useContext(AppContext);
}