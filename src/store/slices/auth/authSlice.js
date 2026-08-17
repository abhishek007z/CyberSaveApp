import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import authService from "../../../services/auth.service";

export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async (email, { rejectWithValue }) => {
    try {
      const response = await authService.sendOtp(email);

      return response;
    } catch (error) {
      console.log("SEND OTP ERROR:", error);
      console.log("SEND OTP RESPONSE:", error.response?.data);

      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to send OTP"
      );
    }
  }
);
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await authService.verifyOtp(
        email,
        otp
      );

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to verify OTP"
      );
    }
  }
);

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,

  loading: false,
  error: null,

  otpSent: false,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.otpSent = false;
      state.error = null;
    },

    clearAuthError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // SEND OTP
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.otpSent = false;
      })

      .addCase(sendOtp.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
      })

      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.otpSent = false;
      })

      // VERIFY OTP
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;

        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        state.isAuthenticated = true;

        state.otpSent = false;
      })

      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setCredentials,
  logout,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;