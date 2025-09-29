import { Link, NavLink, Outlet } from "react-router-dom";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import ProfileInfoCard from "../../components/Cards/ProfileInfoCard";
import { useContext } from "react";
import toast from "react-hot-toast";

const SellerLayout = () => {
    const sidebarLinks = [
        { name: "Add Product", path: "/seller-layout", icon: assets.add_icon },
        { name: "Product List", path: "/seller-layout/product-list", icon: assets.product_list_icon },
        { name: "Orders", path: "/seller-layout/orders", icon: assets.order_icon },
    ];

    const { user, clearUser, navigate, setLoginType } = useContext(AppContext);

    const handleLogout = () => {
        localStorage.clear();
        clearUser();

        const isSeller = setLoginType(null);
        if (!isSeller) navigate("/");

        toast.success("Successfully Logged Out!");

    };

    return (
        <>
            <div className="flex items-center justify-end px-4 md:px-8 border-b border-gray-300 py-3 bg-white">
                {/* FOR USER */}
                {user && (
                    <div className="relative group">
                        <ProfileInfoCard />
                        <div className="absolute top-full right-0 mt-2 w-40 bg-white shadow-lg rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
                            <NavLink to="/profile" className="block px-4 py-2 hover:bg-gray-100 cursor-pointer hover:underline">Profile</NavLink>
                            {user.role === "user" && (
                                <NavLink to="/my-orders" className="block px-4 py-2 hover:bg-gray-100 cursor-pointer hover:underline">
                                    My Orders
                                </NavLink>
                            )}

                            {user.role === "seller" && (
                                <NavLink to="product-list" className="block px-4 py-2 hover:bg-gray-100 cursor-pointer hover:underline">
                                    My Products
                                </NavLink>
                            )}
                            <button onClick={handleLogout} className="text-green-500 font-semibold block w-full text-left px-4 py-2 cursor-pointer hover:underline">Logout</button>
                        </div>
                    </div>
                )}

                {/* FOR NO USER */}
                {!user && (
                    <button
                        className="bg-linear-to-r from-[#2cc133] to-[#49c13e] text-sm font-semibold text-white px-7 py-2.5 rounded-full hover:bg-black hover:text-white border border-white transition-colors cursor-pointer"
                        onClick={() => setOpenAuthModal(true)}
                    >
                        Login / Sign Up
                    </button>
                )}
            </div>
            <div className="flex">
                <div className="md:w-64 w-16 border-r h-[95vh] text-base border-gray-300 pt-4 flex flex-col">
                    {sidebarLinks.map((item) => (
                        <NavLink to={item.path} key={item.name} end={item.path === '/seller-layout'}
                            className={({ isActive }) => `flex items-center py-3 px-4 gap-3 
                            ${isActive ? "border-r-4 md:border-r-[6px] bg-primary/10 border-primary text-primary"
                                    : "hover:bg-gray-100/90 border-white"
                                }`
                            }
                        >
                            <img src={item.icon} alt="" className="w-7 h-7" />
                            <p className="md:block hidden text-center">{item.name}</p>
                        </NavLink>
                    ))}
                </div>
                <Outlet />
            </div>

        </>
    );
};

export default SellerLayout;