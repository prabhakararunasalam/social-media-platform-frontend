import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUser } from "../Redux/authSlice";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../Components/LoadingSpinner";
import RightSidebar from "./RightSideBar";
import LeftSidebar from "./LeftSideBar";

const UpdateProfile = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    currentPassword: "",
    newPassword: "",
    bio: "",
    link: "",
    profileImg: null, // Store the image file for profile
    coverImg: null,   // Store the image file for cover
  });

  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        fullName: user.fullName || "",
        email: user.email || "",
        username: user.username || "",
        bio: user.bio || "",
        link: user.link || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImgChange = (e, imgType) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.type.split("/")[0];
      // Check if the file is an image (not a video)
      if (fileType === "image") {
        const reader = new FileReader();
        reader.onload = () => {
          setFormData({
            ...formData,
            [imgType]: selectedFile, // Store the actual image file in formData
          });
        };
        reader.readAsDataURL(selectedFile);
      } else {
        toast.error("Please upload a valid image file.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields before submitting
    if (!formData.fullName || !formData.email || !formData.username) {
      toast.error("Please fill out all required fields");
      return;
    }

    if (
      (formData.currentPassword && !formData.newPassword) ||
      (!formData.currentPassword && formData.newPassword)
    ) {
      toast.error("Both current and new passwords must be provided.");
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      for (let key in formData) {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      }

      setImageLoading(true);  // Start loading state for image upload
      const res = await axios.post(
        "https://social-media-backend-reon.onrender.com/api/users/update",
        formDataToSend,
        {
          withCredentials: true,
        }
      );
      dispatch(setUser(res.data.updatedUser));
      toast.success(res.data?.message);
      setTimeout(() => {
        navigate(-1);
      }, 1000);
    } catch (error) {
      console.log("Error updating profile:", error.message);
      toast.error("Error updating profile");
    } finally {
      setLoading(false);
      setImageLoading(false);  // Reset loading state after submission
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left Sidebar */}
      <div className="hidden lg:block lg:w-[20%]">
        <LeftSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-grow bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-center text-pink-500 mb-6">
            Edit Profile
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {[ 
                { label: "Full Name", name: "fullName", type: "text" },
                { label: "Email", name: "email", type: "email" },
                { label: "Username", name: "username", type: "text" },
                { label: "Bio", name: "bio", type: "textarea" },
                { label: "Link", name: "link", type: "text" },
                { label: "Current Password", name: "currentPassword", type: "password" },
                { label: "New Password", name: "newPassword", type: "password" },
              ].map(({ label, name, type }) => (
                <div key={name}>
                  <label className="block text-sm font-medium">{label}</label>
                  {type === "textarea" ? (
                    <textarea
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      className="mt-2 w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-pink-500"
                    ></textarea>
                  ) : (
                    <input
                      type={type}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      className="mt-2 w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-pink-500"
                    />
                  )}
                </div>
              ))}

              {/* Profile Image */}
              <div>
                <label className="block text-sm font-medium">Profile Image</label>
                <input
                  type="file"
                  onChange={(e) => handleImgChange(e, "profileImg")}
                  className="mt-2 w-full bg-gray-700 text-white rounded-md"
                />
                {formData.profileImg && (
                  <img
                    src={URL.createObjectURL(formData.profileImg)}
                    alt="Profile Preview"
                    className="mt-2 w-32 h-32 object-cover rounded-full"
                  />
                )}
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium">Cover Image</label>
                <input
                  type="file"
                  onChange={(e) => handleImgChange(e, "coverImg")}
                  className="mt-2 w-full bg-gray-700 text-white rounded-md"
                />
                {formData.coverImg && (
                  <img
                    src={URL.createObjectURL(formData.coverImg)}
                    alt="Cover Preview"
                    className="mt-2 w-full h-48 object-cover rounded-md"
                  />
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-pink-600 text-white py-3 rounded-md hover:bg-pink-700 transition duration-300"
              >
                {loading ? <LoadingSpinner /> : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="hidden lg:block w-2/6">
        <RightSidebar />
      </div>
      <ToastContainer />
    </div>
  );
};

export default UpdateProfile;
