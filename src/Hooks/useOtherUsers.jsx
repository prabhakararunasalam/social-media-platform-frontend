import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getOtherUsers } from "../Redux/authSlice";
import axios from "axios";

const useOtherUsers = (id) => {
  const dispatch = useDispatch();

  
  // console.log(id);
  

  useEffect(() => {
    const fetchOtherUsers = async () => {
      try {
        const res = await axios.get(
          `https://social-media-backend-reon.onrender.com/api/users/suggested/${id}`,
          { withCredentials: true }
        );
        // console.log("Dispatching getOtherUsers with:", res.data);

        const otherUsers = res.data;
        
        dispatch(getOtherUsers(otherUsers));
        // console.log("Other Users:", otherUsers);
        
      } catch (error) {
        console.log(error);
      }
    };

    fetchOtherUsers();
    
  }, [id, dispatch]);
};


export default useOtherUsers;
