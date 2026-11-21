import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import languageService from "../../services/language.service";

export const fetchLanguage = createAsyncThunk(
  "language/fetchLanguage",
  async (_, { rejectWithValue }) => {
    try {
      const data = await languageService.getLanguages();
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch language");
    }
  }
);

export const updateLanguagePreference = createAsyncThunk(
  "language/updateLanguagePreference",
  async (language, { rejectWithValue }) => {
    try {
      const data = await languageService.updateLanguage(language);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to update language");
    }
  }
);

const initialState = {
  currentLanguage: "en",
  loading: false,
  error: null,
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.currentLanguage = action.payload === "hi" ? "hi" : "en";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLanguage.fulfilled, (state, action) => {
        if (action.payload?.currentLanguage) {
          state.currentLanguage =
            action.payload.currentLanguage === "hi" ? "hi" : "en";
        }
      })
      .addCase(updateLanguagePreference.fulfilled, (state, action) => {
        if (action.payload?.language) {
          state.currentLanguage =
            action.payload.language === "hi" ? "hi" : "en";
        }
      });
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
