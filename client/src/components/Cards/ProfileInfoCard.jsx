import React from 'react'
import { useContext } from 'react'
import { AppContext } from '../../context/AppContext';
import { NavLink } from 'react-router-dom';

const ProfileInfoCard = () => {
  const { user } = useContext(AppContext);

  const handleLogout = () => {
        localStorage.clear();
        clearUser();

        toast.success("Successfully Logged Out!");
        navigate("/");
    };

  return (
    user && (
      <div className="flex items-center">
        <img src={user.profileImageUrl}
          alt=""
          className='w-11 h-11 bg-gray-300 rounded-full mr-3'
        />
        <div>
          <div className="text-[15px] font-bold leading-3">
            {user.name || ""}
          </div>
        </div>

      </div>
    )
  );
};

export default ProfileInfoCard