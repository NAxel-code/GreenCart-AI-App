export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
    AUTH: {
        REGISTER: "/api/auth/register",
        LOGIN: "/api/auth/login",
        GET_PROFILE: "/api/auth/profile",
    },

    IMAGE: {
        UPLOAD_IMAGE: "/api/auth/upload-image",
    },

    AI: {
        GENERATE_RECIPES: "/api/ai/generate-recipe",
        GENERATE_EXPLANATION: "/api/ai/generate-explanation",
    },

    SELLER: {
        REGISTER: "/api/seller/register",
        LOGIN: "/api/seller/login",
        GET_PROFILE: "/api/seller/profile",
    },

    CART: {
        UPDATE_CART: "/api/cart/update",
    },

    PRODUCT: {
        ADD_PRODUCT: "/api/product/add",
        PRODUCT_LIST: "/api/product/list",
        PRODUCT_BY_ID: "/api/product/id",
        CHANGE_STOCK: "/api/product/stock",
    },

    ORDER: {
        ORDER_COD: "/api/order/cod",
        ORDER_ONLINE: "/api/order/stripe",
        GET_USER_ORDERS: "/api/order/user",
        GET_ALL_ORDERS: "/api/order/seller",
    },

    ADDRESS: {
        ADD_ADDRESS: "/api/address/add",
        GET_ADDRESS: "/api/address/get-address",
    },
    
    RECIPES: {
        // ADD_TO_SESSION: "/api/questions/add",
        PIN: (id) => `/api/questions/${id}/pin`,
        UPDATE_NOTE: (id) => `/api/questions/${id}/note`,
    },
    
    // SESSION: {
    //     CREATE: "/api/sessions/create",
    //     GET_ALL: "/api/sessions/my-sessions",
    //     GET_ONE: (id) => `/api/sessions/${id}`,
    //     DELETE: (id) => `/api/sessions/${id}`,
    // },

};
