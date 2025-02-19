import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  configureStore,
} from "@reduxjs/toolkit";
import axios from "axios";

// Define User Type
interface User {
  id: number;
  name: string;
  email: string;
  company: { name: string };
}

// Define State Type
export interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

// Fetch Users from API
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await axios.get<User[]>(
    "https://jsonplaceholder.typicode.com/users"
  );
  return response.data;
});

// Update User in API
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (updatedUser: User) => {
    await axios.put(
      `https://jsonplaceholder.typicode.com/users/${updatedUser.id}`,
      updatedUser
    );
    return updatedUser;
  }
);

// Delete User in API
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userId: number) => {
    await axios.delete(`https://jsonplaceholder.typicode.com/users/${userId}`);
    return userId;
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Something went wrong";
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload);
      });
  },
});

export default userSlice.reducer;

// Configure Store
export const store = configureStore({
  reducer: {
    users: userSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
