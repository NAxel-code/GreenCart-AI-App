import { useContext } from 'react'
import { AppContext } from '../../context/AppContext';

const ProfileInfoCard = () => {
  const { user } = useContext(AppContext);

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