import React, { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import  setPosts  from "../Redux/postSlice";

const CommentSection = ({ post }) => {
  const { posts } = useSelector((store) => store.posts);
  const { user } = useSelector((store) => store.auth); // Assuming current user is in auth state
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editedText, setEditedText] = useState("");

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      setLoading(true);
      const res = await axios.post(
        `https://social-media-backend-reon.onrender.com/api/posts/comment/${post._id}`,
        { text },
        { withCredentials: true }
      );
      const updatedPosts = posts.map((p) =>
        p._id === post._id ? { ...p, comments: [res.data.comment, ...p.comments] } : p
      );
      dispatch(setPosts(updatedPosts));
      setText("");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editedText.trim()) return;

    try {
      const res = await axios.put(
        `http://localhost:5000/api/posts/comment/${post._id}/${commentId}`,
        { text: editedText },
        { withCredentials: true }
      );
      const updatedPosts = posts.map((p) =>
        p._id === post._id
          ? {
              ...p,
              comments: p.comments.map((comment) =>
                comment._id === commentId ? { ...comment, text: editedText } : comment
              ),
            }
          : p
      );
      dispatch(setPosts(updatedPosts));
      setEditingComment(null);
      setEditedText("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await axios.delete(
        `https://social-media-backend-reon.onrender.com/api/posts/comment/${post._id}/${commentId}`,
        { withCredentials: true }
      );
      const updatedPosts = posts.map((p) =>
        p._id === post._id
          ? {
              ...p,
              comments: p.comments.filter((comment) => comment._id !== commentId),
            }
          : p
      );
      dispatch(setPosts(updatedPosts));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-bold">Comments</h3>
      <div className="mt-4 flex flex-col gap-4">
        {post.comments.map((comment) => (
          <div key={comment._id} className="flex items-start gap-2">
            <div className="flex-1">
              {editingComment === comment._id ? (
                <>
                  <textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleEditComment(comment._id)}
                      className="bg-green-500 text-white px-4 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingComment(null);
                        setEditedText("");
                      }}
                      className="bg-gray-500 text-white px-4 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p>{comment.text}</p>
                  <div className="text-sm text-gray-500">
                    <span>By: {comment.user?.fullName}</span>
                  </div>
                </>
              )}
            </div>

            {/* Show Edit and Delete buttons only if the current user is the comment author */}
            {user._id === comment.user._id && (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingComment(comment._id);
                    setEditedText(comment.text);
                  }}
                  className="text-blue-500 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a comment..."
        className="w-full mt-4 p-2 border border-gray-300 rounded"
      />
      <button
        onClick={handleCommentSubmit}
        disabled={loading}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Posting..." : "Post"}
      </button>
    </div>
  );
};

export default CommentSection;
