import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setProfile } from "../Redux/authSlice";
import axios from "axios";

const GetUserProfile = (id) => {
  const dispatch = useDispatch();
  // console.log(id);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!id) {
          console.error("ID is undefined or null, skipping fetch");
          return;
        }
        const res = await axios.get(
          `https://social-media-backend-reon.onrender.com/api/users/profile/${id}`,
          {
            withCredentials: true,
          }
        );
        dispatch(setProfile(res.data?.user));
      } catch (error) {
        console.error("Error fetching user profile:", error.message);
      }
    };
    fetchUserProfile();
  }, [dispatch, id]);
};

export default GetUserProfile;
