import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, setFilterType } from "../Redux/postSlice";

import LoadingSpinner from "../Components/LoadingSpinner";
import Post from "./Post";
import CreatePost from "./CreatePost";

const Posts = () => {
  const dispatch = useDispatch();
  const { posts, loading, error, filterType } = useSelector(
    (store) => store.posts
  );

  // Fetch posts whenever the component is mounted
  useEffect(() => {
    dispatch(fetchPosts(filterType));
  }, [dispatch, filterType]);

  // console.log(posts);

  // Handle, tab changes and update filterType in the Redux store
  const handleTabChange = (type) => {
    dispatch(setFilterType(type));
  };

  if (error) {
    return <div className="text-red-500 text-center mt-4">Error: {error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white">
      {/* Tabs Section */}
      <div className="flex justify-center gap-8 mb-6">
        {/* //!"For You" Tab */}
        <button
          onClick={() => handleTabChange("foryou")}
          className={`px-6 py-2 text-lg font-medium relative transition-all duration-500 ease-out ${
            filterType === "foryou"
              ? "text-blue-900 border-b-2 border-blue-600"
              : "text-gray-800 hover:text-blue-400"
          }`}
        >
          For You
        </button>

        {/* //!"Following" Tab */}
        <button
          onClick={() => handleTabChange("following")}
          className={`px-6 py-2 text-lg font-medium relative transition-all duration-500 ease-out ${
            filterType === "following"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-800 hover:text-blue-400"
          }`}
        >
          Following
        </button>
      </div>
      {/* Posts Section */}
      <div className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="mb-4">
          <CreatePost />
        </div>

        {loading ? (
          <div className="col-span-full flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            {posts.map((post) => (
              <Post key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-gray-400 text-center">No posts found.</div>
        )}
      </div>
    </div>
  );
};

export default Posts;
