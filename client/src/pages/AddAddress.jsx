import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import axiosInstance from '../utils/axiosInstance'
import { API_PATHS } from '../utils/apiPaths'
import toast from 'react-hot-toast'
import { useEffect } from 'react'

// Input Field Component
const InputField =({type, placeholder, name, handleChange, address})=>(
    <input  className='w-full px-2 py-2.5 border rounded outline-none text-gray-500 
    focus: border-primary transition'
    type={type}
    placeholder={placeholder}
    onChange={handleChange}
    name={name}
    value={address[name]}
    required
    />
)

const AddAddress = () => {

    const { user, navigate } = useContext(AppContext);

    const [address, setAddress] = useState({
        firstName: '' ,
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',    
        zipcode: '',
        country: '',
        phone: '',
    })

    const handleChange = (e) => {
        const {name, value} = e.target;

        setAddress((prevAddress) => ({
            ...prevAddress,
            [name]: value,
        }))
        console.log(address);
    }

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();

            const { data } = await axiosInstance.post(API_PATHS.ADDRESS.ADD_ADDRESS, {
                address,
                userId: user._id
            });

            if(data?.success)
            {
                toast.success(data.message);
                navigate("/cart");
            }

            else toast.error(data?.message || "Failed to add address");

        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
        
    };

    useEffect(() => {
      if(!user) navigate("/cart");


    }, [user]);
    

        return (
            <div className='mt-16 pb-16'>
                <p className='text-2xl md:text-3xl text-gray-500'>Add Shipping <span className=
                'font-semibold text-primary'>Address</span></p>
                <div className='flex flex-col-reverse md:flex-row justify-between mt-10'>
                <div className='flex-1 max-w-md'>
                    <form onSubmit={onSubmitHandler} className='space-y-3 mt-6 text-sm'> 
                        
                        <div className='grid grid-cols-2 gap-4'>
                            <InputField handleChange={handleChange} address={address} name='firstName'
                            type="text" placeholder="First Name"/>
                            <InputField handleChange={handleChange} address={address} name='lastName'
                            type="text" placeholder="Last Name"/>
                        </div>

                        <InputField handleChange={handleChange} address={address} name='email'
                            type="email" placeholder="Email Address"/>
                        <InputField handleChange={handleChange} address={address} name='street'
                            type="text" placeholder="Street Address"/>

                        <div className='grid grid-cols-2 gap-4'>
                            <InputField handleChange={handleChange} address={address} name='city'
                            type="text" placeholder="City"/>
                            <InputField handleChange={handleChange} address={address} name='state'
                            type="text" placeholder="state"/>
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                            <InputField handleChange={handleChange} address={address} name='zipcode'
                            type="number" placeholder="Zipcode"/>
                            <InputField handleChange={handleChange} address={address} name='country'
                            type="text" placeholder="Country"/>
                        </div>

                        <InputField handleChange={handleChange} address={address} name='phone'
                            type="number" placeholder="Phone Number"/>

                            <button className='w-full mt-6 bg-primary text-white py-3 
                            hover:bg-primary-dull transition cursor-pointer uppercase'>
                                Save Address
                            </button>
                    </form>
                </div>
                <img className='md:mr-16 mb-16md:mt-0' src={assets.add_address_iamge}
                alt="Add Address" />
                </div>
            </div>
        )
}

export default AddAddress