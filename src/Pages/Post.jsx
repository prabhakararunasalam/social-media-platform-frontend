import axios from "axios";
import React, { useState } from "react";
import {
  FaRegComment,
  FaRegHeart,
  FaRegBookmark,
  FaTrash,
} from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../Redux/postSlice";
import Modal from "../Components/Modal";
import CommentSection from "../Components/CommentSection";
import { Link } from "react-router-dom";

const Post = ({ post }) => {
  const { posts } = useSelector((store) => store.posts);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  // console.log(post.user?._id, user?.id);

  const [liked, setLiked] = useState(post?.likes?.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post?.likes?.length || 0);
  const [modalOpen, setModalOpen] = useState(false);
  const [liking, setLiking] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Function to handle post deletion
  const deletePost = async () => {
    try {
      setDeleting(true);
      const res = await axios.delete(
        `https://social-media-backend-reon.onrender.com/api/posts/delete/${post?._id}`,
        {
          withCredentials: true,
        }
      );
      const updatedPosts = posts.filter((p) => p._id !== post._id);
      dispatch(setPosts(updatedPosts));
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete post");
    } finally {
      setDeleting(false);
    }
  };

  // Function to handle like/unlike actions
  const likeUnlikePost = async () => {
    try {
      setLiking(true);
      await axios.post(
        `https://social-media-backend-reon.onrender.com/api/posts/like/${post._id}`,
        {},
        { withCredentials: true }
      );
      setPostLike(liked ? postLike - 1 : postLike + 1);
      setLiked(!liked);

      const updatedPosts = posts.map((p) =>
        p._id === post._id
          ? {
              ...p,
              likes: liked
                ? p.likes.filter((uid) => uid !== user._id)
                : [...p.likes, user._id],
            }
          : p
      );
      dispatch(setPosts(updatedPosts));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update like");
    } finally {
      setLiking(false);
    }
  };

  return (
    <div className="flex gap-4 items-start p-4 border-b border-gray-700">
      <div className="avatar">
        <Link
          to={`/profile/${post.user?._id}`}
          className="w-8 rounded-full overflow-hidden"
        >
          <img src={post.user?.profileImg || "/avatars/boy1.png"} />
        </Link>
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex gap-2 items-center">
          <Link to={`/profile/${post.user?._id}`} className="font-bold">
            {post.user?.fullName}
          </Link>
          <span className="text-gray-700 flex gap-1 text-sm">
            <Link to={`/profile/${post.user?._id}`}>
              @{post.user?.username}
            </Link>
            <span>·</span>
            <span>{new Date(post.createdAt).toLocaleString()}</span>
          </span>

          <span className="flex justify-end flex-1">
            {deleting ? (
              <span>Deleting...</span>
            ) : (
              // Display the delete button if the user is the post owner
              user.id === post.user._id && (
                <FaTrash
                  className="cursor-pointer hover:text-red-500"
                  onClick={deletePost}
                />
              )
            )}
          </span>
        </div>
        <div className="flex flex-col gap-3 overflow-hidden">
          
          <div className="mb-4">
            {post?.text && <p>{post.text}</p>}
            {post?.mediaType === "video" ? (
              <video
                src={post?.media}
                controls
                className="w-full h-auto rounded-lg shadow-md"
              />
            ) : post?.mediaType === "image" ? (
              <img
                src={post?.media}
                alt="Post content"
                className="w-full h-auto rounded-lg shadow-md"
              />
            ) : null}
          </div>
        </div>
        <div className="flex items-center gap-4 mt-3">
          <div
            onClick={likeUnlikePost}
            className="cursor-pointer flex items-center gap-1"
          >
            {liked ? <FaRegHeart className="text-red-500" /> : <FaRegHeart />}
            <span>{postLike}</span>
          </div>

          <FaRegComment
            className="cursor-pointer"
            onClick={() => setModalOpen(true)}
          />
          <BiRepost />
          <FaRegBookmark />
        </div>
      </div>

      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <CommentSection post={post} />
        </Modal>
      )}
    </div>
  );
};

export default Post;
