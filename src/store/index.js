import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/slice";
import usersReducer from "../features/users/slice";
import postsReducer from "../features/posts/slice";
import commentsReducer from "../features/comments/slice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    posts: postsReducer,
    comments: commentsReducer
  }
});
