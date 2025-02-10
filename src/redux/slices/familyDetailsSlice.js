// src/redux/slices/familyDetailsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

const initialState = {
  formData: {
    FatherName: "",
    FatherContactNumber: "",
    FatherOccupation: "",
    MotherName: "",
    MotherContactNumber: "",
    MotherOccupation: "",
    FamilyIncome: "",
  },
  dataExist: false,
  loading: false,
  error: null,
  submitMessage: "",
};

// Async thunk for fetching family details
export const fetchFamilyDetails = createAsyncThunk(
  "familyDetails/fetchFamilyDetails",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/form/familyDetails/getForm");
      if (data.length > 0) {
        return {
          dataExist: true,
          formData: data[0],
        };
      }
      return {
        dataExist: false,
        formData: {
          FatherName: "",
          FatherContactNumber: "",
          FatherOccupation: "",
          MotherName: "",
          MotherContactNumber: "",
          MotherOccupation: "",
          FamilyIncome: "",
        },
      };
    } catch (error) {
      return rejectWithValue("Error fetching family details.");
    }
  }
);

// Async thunk for submitting family details
export const submitFamilyDetails = createAsyncThunk(
  "familyDetails/submitFamilyDetails",
  async ({ familyFormData, familyDataExist, setFamilyFormSubmit }, { rejectWithValue }) => {
    try {

      console.log("formData", familyFormData);
      console.log("familyDataExist", familyDataExist);
      console.log("setFamilyFormSubmit", setFamilyFormSubmit);
      const endpoint = familyDataExist
        ? "/form/familyDetails/updateForm"
        : "/form/familyDetails/addForm";
      const method = familyDataExist ? axios.patch : axios.post;
      const response = await method(endpoint, familyFormData);

      setFamilyFormSubmit(true); // Execute the callback to indicate submission status
      return familyDataExist
        ? "Form updated successfully!"
        : "Form submitted successfully!";
    } catch (error) {
      return rejectWithValue("Submission error. Please try again.");
    }
  }
);

const familyDetailsSlice = createSlice({
  name: "familyDetails",
  initialState,
  reducers: {
    updateFamilyDetails(state, action) {
      state.formData = { ...state.formData, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch family details
      .addCase(fetchFamilyDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFamilyDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.formData = action.payload.formData;
        state.dataExist = action.payload.dataExist;
        state.isDataFetched = true;
      })
      .addCase(fetchFamilyDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Submit family details
      .addCase(submitFamilyDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitFamilyDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.submitMessage = action.payload;
      })
      .addCase(submitFamilyDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.submitMessage = action.payload;
      });
  },
});

export const { updateFamilyDetails } = familyDetailsSlice.actions;

export default familyDetailsSlice.reducer;
