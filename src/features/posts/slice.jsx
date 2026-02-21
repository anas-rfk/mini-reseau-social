import { createSlice } from "@reduxjs/toolkit";

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    items: [],
    hashtagFilter: "",
    authorFilter: "",
    sortBy: "new", // ✅ NEW: "new" | "popular"
    status: "idle",
    error: null,
  },
  reducers: {
    setPosts: (state, action) => {
      state.items = action.payload;
      state.status = "succeeded";
      state.error = null;
    },

    setHashtagFilter: (state, action) => {
      state.hashtagFilter = action.payload;
    },

    setAuthorFilter: (state, action) => {
      state.authorFilter = action.payload;
    },

    setSortBy: (state, action) => {
      state.sortBy = action.payload; // "new" ou "popular"
    },

    updatePost: (state, action) => {
      const updated = action.payload;
      state.items = state.items.map((p) =>
        String(p.id) === String(updated.id) ? updated : p
      );
    },

    removePost: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((p) => String(p.id) !== String(id));
    },

    setPostsLoading: (state) => {
      state.status = "loading";
      state.error = null;
    },

    setPostsError: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
  },
});

export const {
  setPostsLoading,
  setPosts,
  setPostsError,
  setHashtagFilter,
  setAuthorFilter,
  setSortBy, // ✅ NEW
  updatePost,
  removePost,
} = postsSlice.actions;

export default postsSlice.reducer;