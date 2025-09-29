import React, { useContext } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import uploadImage from '../../utils/uploadImage';
import { AppContext } from '../../context/AppContext';
import toast from "react-hot-toast";

const SignUp = ({ setCurrentPage }) => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setfullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);

  const { updateUser, setOpenAuthModal, loginType, setLoginType } = useContext(AppContext);

  const navigate = useNavigate();

  //HANDLE SIGN UP FORM SUBMIT
  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";

    if (!fullName) {
      setError("Please enter your Full Name");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Please enter your new password");
      return;
    }

    setError("");

    //USER SIGN UP API CALL
    try {
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl,
        role: loginType
      });

      const { token } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        toast.success("Successfully Signed Up!");
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
      <h3 className="text-lg font-semibold text-black">Create An Account</h3>
      <p className="text-xs text-slate-700 mt-[15px] mb-6">
        Join Us by Entering Your Details Below.
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

      <form onSubmit={handleSignUp}>

        <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

        <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
          <Input
            value={fullName}
            onChange={({ target }) => setfullName(target.value)}
            label="Full Name"
            placeholder="John Dupe"
            type="text"
          />

          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="dupe@gmail.com"
            type="text"
          />

          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="*******"
            type="password"
          />
        </div>

        {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

        <button type='submit' className='btn-primary'>
          SIGN UP
        </button>

        <p className="text-[13px] text-slate-800 mt-3">
          Already Have an Account? {" "}
          <button
            className='font-medium text-primary underline cursor-pointer'
            onClick={() => {
              setCurrentPage("login")
            }}
          >
            Login
          </button>
        </p>

      </form>

    </div>
  )
}

export default SignUp