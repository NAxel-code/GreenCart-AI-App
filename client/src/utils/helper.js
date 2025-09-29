

export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

//GETTING INTIALS
export const getInitials = (title) => {
    if (!title) return "";

    const words = title.split(" ");
    let initials = "";

    for (let i = 0; i < Math.min(words.length, 2); i++)
        initials += words[i][0];

    return initials;
};

//FOR FORMATTING THE CART ITEMS ACCORDING TO THE TYPE: OBJECT IN THE PRODUCT SCHEMA FOR THE USER'S CARTITEMS
export const formatCartItem = (product) => {
    const name = product.name; // e.g., "Coca-Cola 1.5L"
    const sizeMatch = name.match(/\d+(\.\d+)?[ ]?L/i); // matches "1.5L", "2L", etc.

    const size = sizeMatch ? sizeMatch[0] : "Unknown Size";
    const brand = name.replace(size, "").replace(/[-]/g, " ").trim(); // "Coca Cola"

    return {
        [brand]: size
    };
}