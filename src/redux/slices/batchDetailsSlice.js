import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

// Async thunk for fetching batch-related details
export const fetchBatchDetails = createAsyncThunk(
  "batchDetails/fetchBatchDetails",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/form/batchRelatedDetails/getForm");
      const data = response.data;
      console.log("BatchDetails Form Data", data[0]);
      if (data.length > 0) {
        return {
          dataExist: true,
          formData: {
            preferredBatch: data[0]?.preferredBatch ,
            subjectCombination: data[0]?.subjectCombination || "",
            classForAdmission: data[0]?.classForAdmission || "",
          },
        };
      }
      return {
        dataExist: false,
        formData: {
          preferredBatch: "",
          subjectCombination: "",
          classForAdmission: "",
        },
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch data");
    }
  }
);

// Slice definition
const batchDetailsSlice = createSlice({
  name: "batchDetails",
  initialState: {
    formData: {
      classForAdmission: "",
      preferredBatch: "",
      subjectCombination: "",
    },
    dataExist: false, // Flag to check if data exists in the database
    loading: false,
    error: null,
  },
  reducers: {
    updateBatchDetails(state, action) {
      state.formData = { ...state.formData, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBatchDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBatchDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.formData = action.payload.formData;
        state.dataExist = action.payload.dataExist;
      })
      .addCase(fetchBatchDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateBatchDetails } = batchDetailsSlice.actions;
export default batchDetailsSlice.reducer;
