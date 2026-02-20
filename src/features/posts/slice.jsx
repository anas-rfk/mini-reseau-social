import { createSlice } from "@reduxjs/toolkit";

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    items: [],
    hashtagFilter: "",
    authorFilter: "", // id de l’auteur sélectionné
    status: "idle", // idle | loading | succeeded | failed
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
    setAuthorFilter: (state, action) => {
    state.authorFilter = action.payload; // "" ou userId
    
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
  updatePost,
  removePost,
} = postsSlice.actions;

export default postsSlice.reducer;
