import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import { useContext } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { AppContext } from '../../context/AppContext';
import toast from "react-hot-toast";

const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { updateUser, setOpenAuthModal, loginType, setLoginType } = useContext(AppContext);
  const navigate = useNavigate();

  // HANDLE LOGIN FORM SUBMIT
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setError("");

    //LOGIN API CALL
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
        role: loginType
      });

      const { token, role } = response.data;

      if (token) {
        if (role !== loginType) {
          setError(`You are registered as a ${role}, not a ${loginType}.`);
          toast.error(`Login failed: Role mismatch.`);
          return;
        }

        localStorage.setItem("token", token);
        updateUser(response.data);

        toast.success("Successfully Logged In!");
        setOpenAuthModal(false);

        navigate(loginType === "seller" ? "/seller-layout" : "/");
      }

    } catch (error) {
      if (error.response && error.response.data.message) setError(error.response.data.message);
      else setError("Something went wrong. Please try again.");

    }

  };

  return (
    <div className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center">
      <h3 className="text-lg font-semibold text-black">Welcome Back</h3>
      <p className="text-xs text-slate-700 mt-[5px] mb-6">
        Please enter your details to log in
      </p>

      <div className="flex justify-center gap-4 mb-6">
        <button
          className={`btn-login ${loginType === "user" ? "bg-primary text-white" : "bg-black text-white"
            }`}
          onClick={() => setLoginType("user")}
          type="button"
        >
          Login as User
        </button>

        <button
          className={`btn-login ${loginType === "seller" ? "bg-primary text-white" : "bg-black text-white"
            }`}
          onClick={() => setLoginType("seller")}
          type="button"
        >
          Login as Seller
        </button>
      </div>

      <form onSubmit={handleLogin}>

        <Input
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          label="Email Address"
          placeholder="doe@gmail.com"
          type="text"
        />

        <Input
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          label="Password"
          placeholder="*******"
          type="password"
        />

        {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

        <button type='submit' className='btn-primary'>
          LOGIN
        </button>

        <p className="text-[13px] text-slate-800 mt-3">
          Don't have an account?{" "}

          <button
            className='font-medium text-primary underline cursor-pointer'
            onClick={() => {
              setCurrentPage("signup");
            }}
          >
            SignUp
          </button>
        </p>
      </form>
    </div>
  )
}

export default Login