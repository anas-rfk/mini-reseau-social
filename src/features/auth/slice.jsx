import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    currentUser: null
  },
  reducers: {
    setCurrentUser(state, action) {
      state.currentUser = action.payload;
    },
    logout(state){
      state.currentUser=null;
    }
  }
});

export const { setCurrentUser ,logout} = authSlice.actions;
export default authSlice.reducer;
