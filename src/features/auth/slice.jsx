import { createSlice } from "@reduxjs/toolkit";

// ✅ 1) Lire l'utilisateur sauvegardé (si existe)
const savedUser = localStorage.getItem("currentUser");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    currentUser: savedUser ? JSON.parse(savedUser) : null,
  },
  reducers: {
    // ✅ 2) Sauvegarder l'utilisateur dans localStorage au login
    setCurrentUser(state, action) {
      state.currentUser = action.payload;
      localStorage.setItem("currentUser", JSON.stringify(action.payload));
    },

    // ✅ 3) Supprimer l'utilisateur du localStorage au logout
    logout(state) {
      state.currentUser = null;
      localStorage.removeItem("currentUser");
    },
  },
});

export const { setCurrentUser, logout } = authSlice.actions;
export default authSlice.reducer;