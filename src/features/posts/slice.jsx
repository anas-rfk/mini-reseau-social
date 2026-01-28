import { createSlice } from "@reduxjs/toolkit";

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    items: [],
    hashtagFilter: "",
  },
  reducers: {
    setPosts: (state, action) => {
      state.items = action.payload;
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
  },
});

export const { setPosts, setHashtagFilter, updatePost, removePost } =
  postsSlice.actions;

export default postsSlice.reducer;
