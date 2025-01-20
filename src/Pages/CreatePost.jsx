import React, { useRef, useState } from 'react';
import { IoClose } from "react-icons/io5";
import { CiImageOn } from "react-icons/ci";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import LoadingSpinner from "../Components/LoadingSpinner";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, setPosts } from '../Redux/postSlice';
import { Link } from 'react-router-dom';

const CreatePost = () => {
    const [text, setText] = useState("");
    const [media, setMedia] = useState(null); // This will store either image or video
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const mediaRef = useRef(null);

    const dispatch = useDispatch();
    const { posts } = useSelector((store) => store.posts);
    const { user } = useSelector((store) => store.auth);

    const handleMediaChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const fileType = selectedFile.type.split("/")[0];
            if (fileType === "image" || fileType === "video") {
                const reader = new FileReader();
                reader.onload = () => {
                    setMedia(reader.result);
                    setFile(selectedFile);
                };
                reader.readAsDataURL(selectedFile);
            } else {
                toast.error("Please upload an image or video.");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!text.trim()) {
            return toast.error("Post cannot be empty");
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("text", text.trim());

            if (file) {
                formData.append("media", file);
                const mediaType = file.type.startsWith("image") ? "image" : "video";
                formData.append("mediaType", mediaType);
            }else{
                formData.append("mediaType", "none");
            }

            const res = await axios.post("https://social-media-backend-reon.onrender.com/api/posts/create", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });
            toast.success(res.data.message);
            dispatch(fetchPosts("foryou"));

            //reset form
            setText("");
            setMedia(null);
            setFile(null);
            if (mediaRef.current) mediaRef.current.value = null;
        } catch (error) {
            console.error("Error creating post:", error);
            toast.error(error.response?.data?.console.error || "Failed to create post.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 max-w-4xl mx-auto bg-white rounded-xl shadow-md dark:bg-gray-800">
            <Link to={`/profile/${user?._id}`}>
                <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                        <img
                            src={user?.profileImg || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                            alt="Avatar"
                            className="object-cover w-full h-full"
                        />
                    </div>
                    <h2 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                        {user?.fullName || "User"}
                    </h2>
                </div>
            </Link>

            <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="What's happening?"
                    className="w-full p-3 border rounded-lg resize-none border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                ></textarea>

                {/* Preview media (image or video) */}
                {media && (
                    <div className="relative">
                        <IoClose
                            className="absolute top-2 right-2 text-gray-500 cursor-pointer hover:text-gray-800 dark:hover:text-gray-300"
                            size={24}
                            onClick={() => {
                                setMedia(null);
                                setFile(null);
                                mediaRef.current.value = null;
                            }}
                        />
                        {file?.type.startsWith("image") ? (
                            <img
                                src={media}
                                alt="Preview"
                                className="w-full rounded-lg object-cover"
                            />
                        ) : file?.type.startsWith("video") ? (
                            <video controls className="w-full rounded-lg">
                                <source src={media} type={file?.type} />
                                Your browser does not support the video tag.
                            </video>
                        ) : null}
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        className="flex items-center space-x-2 text-blue-500 hover:text-blue-700"
                        onClick={() => mediaRef.current.click()} // Opens the file input dialog
                    >
                        <CiImageOn size={24} />
                        <span>Add Image/Video</span>
                    </button>
                    <input
                        type="file"
                        accept="image/*, video/*" // Accept both image and video files
                        hidden
                        ref={mediaRef}
                        onChange={handleMediaChange}
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    >
                        {loading ? <LoadingSpinner /> : "Post"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;
