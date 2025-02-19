import { configureStore } from "@reduxjs/toolkit";
import userReducer, { UserState } from "../store/userSlice";
import { RootState } from "../store/store";

// Default State untuk Testing
const defaultState: RootState = {
  users: {
    users: [],
    loading: false,
    error: null,
  },
};

// Fungsi untuk membuat store testing
const createTestStore = (preloadedState: RootState = defaultState) => {
  return configureStore({
    reducer: {
      users: userReducer,
    },
    preloadedState, // Menggunakan preloadedState dengan default value
  });
};

export default createTestStore;
