import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";
import { jwtDecode } from "jwt-decode";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { dispatch, rejectWithValue }) => {
      try {
          const refresh_token = localStorage.getItem(REFRESH_TOKEN);
          // await api.post('/logout/', { refresh_token });
          localStorage.removeItem(ACCESS_TOKEN);
          localStorage.removeItem(REFRESH_TOKEN);
          localStorage.clear();
          dispatch(clearAuth());
      } catch (error) {
          console.error('Error logging out:', error);
          return rejectWithValue('Logout failed');
      }
  }
);

export const refreshToken = createAsyncThunk("auth/refreshToken", async (_, { rejectWithValue }) => {
    const refresh = localStorage.getItem(REFRESH_TOKEN);

    try {
        const res = await api.post("/api/token/refresh/", { refresh });
        if (res.status === 200) {
            localStorage.setItem(ACCESS_TOKEN, res.data.access);
            return res.data.access;
        }
        return rejectWithValue("Failed to refresh token");
    } catch (error) {
        return rejectWithValue(error.response?.data || "An error occurred");
    }
});

export const authcheck = createAsyncThunk("auth/authcheck", async (_, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem(ACCESS_TOKEN);

    if (!token) {
        return rejectWithValue("No token found");
    }
    const decode = jwtDecode(token);
    const tokenExpiration = decode.exp;
    const now = Date.now() / 1000;

    if (tokenExpiration < now) {
        return dispatch(refreshToken());
    }
    return token;
});

const initialState = {
    isAuthorized: localStorage.getItem('isAuthorized') === 'true',
    error: null,
    username: '',
    email: '',
    name: '',
    isAdmin: localStorage.getItem('isAdmin') === 'true',
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUsername(state, action) {
            state.username = action.payload;
        },
        setEmail(state, action) {
            state.email = action.payload;
        },
        setName(state, action) {
            state.name = action.payload;
        },
        clearAuth(state) {
            state.username = '';
            state.email = '';
            state.name = '';
            state.error = null;
        },
        setError(state, action) {
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(refreshToken.fulfilled, (state) => {
                localStorage.setItem("isAuthorized", "true");
            })
            .addCase(refreshToken.rejected, (state, action) => {
                state.error = action.payload;
                localStorage.setItem("isAuthorized", "false");
            })
            .addCase(authcheck.fulfilled, (state) => {
                localStorage.setItem('isAdmin', 'true');
                localStorage.setItem("isAuthorized", "true");
            })
            .addCase(authcheck.rejected, (state, action) => {
                state.error = action.payload;
                localStorage.setItem('isAdmin', 'false');
                localStorage.setItem("isAuthorized", "false");
            })
            .addCase(logoutUser.fulfilled, (state) => {
                localStorage.clear();
            });
    },
});

export const { setUsername, setEmail, setName, clearAuth, setError } = authSlice.actions;
export default authSlice.reducer;
