import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingSpinner from "../Components/LoadingSpinner";
import RightSideBar from "./RightSideBar";
import LeftSidebar from "./LeftSideBar";
import { Link } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]); // State to store notifications
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to store errors
  const { user, userProfile, otherUsers } = useSelector((store) => store.auth);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          "https://social-media-backend-reon.onrender.com/api/users/notifications",
          { withCredentials: true }
        );
        setNotifications(res.data.notifications);
      } catch (error) {
        console.error("Error fetching notifications:", error.message);
        setError("Failed to fetch notifications. please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Function to render notification type
  const renderNotificationType = (type) => {
    switch (type) {
      case "follow":
        return "started following you";
      case "like":
        return "liked your post";
      case "comment":
        return "commented on your post";
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen ">
      
      {/* Left Sidebar */}
      <div className="w-full hidden md:w-1/4 md:block shadow-lg p-4">
        <LeftSidebar />
      </div>
      <div className="divider divider-horizontal divider-start" />

      {/* Main Content */}
      <div className="w-full md:w-1/4 p-6">
      <Link to={`/home`} className="p-2 rounded-full block md:hidden  hover:bg-white-100 cursor-pointer">
              <IoMdArrowBack size="24px" className="text-gray-200" />
            </Link>
        <h2 className="text-2xl font-bold mb-6 text-gray-200">
          Your Notifications
        </h2>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <ul className="space-y-4">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <li
                  key={notification._id}
                  className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <img
                      className="w-12 h-12 rounded-full"
                      src={notification?.from.profileImg}
                      alt="profile"
                    />
                    <div className="ml-4">
                      <strong className="text-gray-800">
                        {notification.from?.username}
                      </strong>
                      <p className="text-sm text-gray-600">
                        {renderNotificationType(notification.type)}
                      </p>
                    </div>
                  </div>
                  <small className="text-gray-500">
                    {new Date(notification.createdAt).toLocaleString()}
                  </small>
                </li>
              ))
            ) : (
              <p className="text-gray-600">No notifications yet.</p>
            )}
          </ul>
        )}
      </div>
      <div className="divider divider-horizontal divider-start" />
      {/* Right Sidebar */}
      <div className="w-full hidden md:block shadow-lg p-4">
        <RightSideBar otherUsers={otherUsers} />
      </div>
    </div>
  );
};

export default Notifications;
