import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (filterType,{ getState, rejectWithValue }) => {
    const { user } = getState().auth;// getstate is used to get the state of the store

    try {
      const res = await axios.get("https://social-media-backend-reon.onrender.com/api/posts/all", {
        params: {
          userId: user._id,
          filterType
        },
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      // console.log(res.data.posts);
      
      return res.data.posts;// return the posts
      
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch posts");
    }
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    loading: false,
    error: null,
    filterType: "foryou",
  },
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    setFilterType: (state, action) => {
      state.filterType = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        // console.log("Posts fetched successfully:", action.payload);
        state.loading = false;
        state.posts = action.payload || [];
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set the error message
      });
  },
});

export const { setPosts, setFilterType } = postSlice.actions;
export default postSlice.reducer;
