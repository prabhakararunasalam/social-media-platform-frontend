import React from "react";
import Avatar from "react-avatar";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useOtherUsers from "../Hooks/useOtherUsers";

const RightSidebar = ({ id }) => {
  const dispatch = useDispatch();
  const { otherUsers } = useSelector((state) => state.auth);

  // console.log(id);
  
  // Fetch other users when the component is mounted
  useOtherUsers(id);

  //Filter users: exclude the logged-in user and apply search
  const filteredUsers = otherUsers
    .filter(
      (user) =>
        String(user?._id) !== String(id) // Convert both to strings for comparison
    )
    .slice(0, 5);
    // console.log("Filtered Users:", filteredUsers);
    // console.log(otherUsers);
    
    

  return (
    <div className="ml-4 fixed top-0 mr-40 mt-5 w-full md:w-[30%] bg-white rounded-lg shadow-xl p-4">
      {/* Who to Follow Section */}
      <div className="space-y-4">
        <h1 className="font-semibold text-xl text-black">Who to follow</h1>
        {Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div key={user?._id} className="flex items-center justify-between p-2  bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center space-x-2">
                <Avatar src={user?.profileImg || "/avatars/boy1.png"} size="40" round={true} className=" border-gray-300" />
                <div>
                  <h2 className="font-semibold text-md text-gray-800">{user?.username}</h2>
                  <p className="text-sm md:text-xs text-gray-500">{`@${user?.fullName}`}</p>
                </div>
              </div>
              <div>
                <Link to={`/profile/${user?._id}`}>
                  <button className="px-4 py-2 bg-blue-600 md:px-3 md:py-1 text-white rounded-full hover:bg-blue-700 transition-all">
                    Profile
                  </button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm mt-4">No users match your search.</p>
        )}
      </div>
    </div>
  );
};

export default RightSidebar;