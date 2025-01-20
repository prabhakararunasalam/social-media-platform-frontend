import React from "react";
import LeftSideBar from "./LeftSideBar";
import { useSelector } from "react-redux";
import RightSideBar from "./RightSideBar";
import Posts from "./Posts";
import CreatePost from "./CreatePost";

const Home = () => {
  const { otherUsers } = useSelector((store) => store.auth);
  const { id } = useSelector((store) => store.auth.user);

  return (
    <div className="flex sm:flex-row min-h-screen">
      {/* Left Sidebar */}
      <div className="w-full sm:w-1/5 min-h-screen">
        <LeftSideBar />
      </div>
      {/* Main Content */}
      <div className="bg-gray-600 p-4 w-full max-w-4xl mt-5 mx-auto min-h-screen rounded-xl">
        <div className="flex flex-col gap-4 space-y-4">
          {/* Divider for separation */}
          <div className="divider" />
          {/* Posts Component */}
          <Posts />
        </div>
      </div>
      {/* Right Sidebar */}
      <div className="w-full sm:w-4/6 hidden md:block">
        <RightSideBar otherUsers={otherUsers} id={id} />
      </div>
    </div>
  );
};

export default Home;
