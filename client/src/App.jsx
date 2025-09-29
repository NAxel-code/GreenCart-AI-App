import React from 'react'
import Navbar from './components/Navbar'
import { Route, Router, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import { Toaster } from 'react-hot-toast'
import Footer from './components/Footer'
import AllProducts from './pages/AllProducts'
import ProductCategory from './pages/ProductCategory'
import ProductDetails from './pages/ProductDetails'
import { useAppContext } from './context/AppContext'
import Login from './pages/Auth/Login'
import AddAddress from './pages/AddAddress'
import Cart from './pages/Cart'
import MyOrders from './pages/MyOrders'
// import SellerLogin from './pages/seller/SellerLogin'
import SellerLayout from './pages/Seller/SellerLayout'
import AddProduct from './pages/Seller/AddProduct'
import ProductList from './pages/Seller/ProductList'
import Order from './pages/Seller/Order'
import Load from './components/Loader/Load'

const App = () => {
  const isSellerPath = useLocation().pathname.includes("seller");
  const { showUserLogin } = useAppContext();

  return (
    <div className='text-default min-h-screen text-gray-700 bg-white'>

      {isSellerPath ? null : <Navbar />}
      {showUserLogin ? <Login /> : null}

      <Toaster />

      <div className={`${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"} `}>
        <Routes>
          {/* DEFAULT ROUTE */}
          <Route path='/' element={<Home />} />

          <Route path='/products' element={<AllProducts />} />
          <Route path='/product/:category' element={<ProductCategory />} />
          <Route path='/products/:category/:id' element={<ProductDetails />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/add-address' element={<AddAddress />} />
          <Route path='/my-orders' element={<MyOrders />} />
          <Route path='/loader' element={<Load />} />
          {/* LATER THIS WILL BE IN THE LOGIN */}

          <Route path='/seller-layout' element={<SellerLayout />}>
            <Route index element={<AddProduct /> }/>
            <Route path='product-list' element={<ProductList />} />
            <Route path='orders' element={<Order />} />
          </Route>
        </Routes>
      </div>
      {!isSellerPath && <Footer />}
    </div>
  )
}

export default App