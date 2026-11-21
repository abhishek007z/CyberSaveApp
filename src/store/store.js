import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/auth/authSlice";
import homeReducer from "./slices/home/homeSlice";
import walletReducer from "./slices/wallet/walletSlice";
import profileReducer from "./slices/profile/profileSlice";
import serviceReducer from "./slices/services/serviceSlice";
import languageReducer from "./slices/languageSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    home: homeReducer,
    wallet: walletReducer,
    profile: profileReducer,
    services: serviceReducer,
    language: languageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});

export default store;