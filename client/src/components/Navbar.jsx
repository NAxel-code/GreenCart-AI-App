import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import ProfileInfoCard from './Cards/ProfileInfoCard';
import Modal from './Modal/Modal';
import Login from '../pages/Auth/Login';
import SignUp from '../pages/Auth/SignUp';
import toast from 'react-hot-toast';

const Navbar = () => {

    const [open, setOpen] = useState(false);
    const {
        user, navigate, searchQuery, setSearchQuery,
        openAuthModal, setOpenAuthModal,
        clearUser,
        getCartCount,

    } = useAppContext();

    const [currentPage, setCurrentPage] = useState("login");

    const handleLogout = () => {
        localStorage.clear();
        clearUser();

        toast.success("Successfully Logged Out!");
        navigate("/");
    };

    useEffect(() => {
        if (searchQuery.length > 0) navigate("/products");

    }, [searchQuery]);


    return (
        <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">

            <NavLink to='/' onClick={() => setOpen(false)}>
                <img src={assets.logo} alt="logo"
                    className='h-9'
                />
            </NavLink>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-8">

                <NavLink to='/'>Home</NavLink>
                <NavLink to='/products'>All Products</NavLink>
                <NavLink to='/'>Contact</NavLink>

                <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
                    <input onChange={(e) => setSearchQuery(e.target.value)} className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500" type="text" placeholder="Search products" />
                    <img src={assets.search_icon} alt="Search"
                        className='w-4 h-4'
                    />
                </div>

                <div onClick={() => navigate("/cart")} className="relative cursor-pointer">
                    <img src={assets.nav_cart_icon} alt="cart"
                        className='w-6 opacity-80'
                    />
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
                </div>

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
                                <NavLink to="/product-list" className="block px-4 py-2 hover:bg-gray-100 cursor-pointer hover:underline">
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

            <Modal
                isOpen={openAuthModal}
                onClose={() => {
                    setOpenAuthModal(false);
                }}

                hideHeader
            >
                <div>
                    {currentPage === "login" && (
                        <Login setCurrentPage={setCurrentPage} />
                    )}
                    {currentPage === "signup" && (
                        <SignUp setCurrentPage={setCurrentPage} />
                    )}
                </div>
            </Modal>

        </nav>

    )
}

export default Navbar