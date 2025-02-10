import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

// Async thunk for fetching educational details
export const fetchEducationalDetails = createAsyncThunk(
  "educationalDetails/fetchEducationalDetails",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/form/educationalDetails/getForm");
      const data = response.data;
      console.log("data", data);
      
      if (data.length > 0) {
        return {
          dataExist: true,
          formData: {
            LastSchoolName: data[0].LastSchoolName || "",
            Class: data[0].Class || "",
            Percentage: data[0].Percentage || "",
            YearOfPassing: data[0].YearOfPassing || "",
            Board: data[0].Board || "",
          },
        };
      }
      return {
        dataExist: false,
        formData: {
          LastSchoolName: "",
          Class: "",
          Percentage: "",
          YearOfPassing: "",
          Board: "",
        },
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch educational details");
    }
  }
);

// Async thunk for fetching boards
export const fetchBoards = createAsyncThunk(
  "educationalDetails/fetchBoards",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/board");
      console.log("boards response data", response);
      return {
        boards: response.data
      }
      
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch boards");
    }
  }
);

// Async thunk for submitting educational details
// export const submitEducationalDetails = createAsyncThunk(
//   "educationalDetails/submitEducationalDetails",
//   async ({ navigate, checkUrl }, { getState, rejectWithValue }) => {
//     const { formData } = getState().educationalDetails;
//     try {
//       const response = await axios.post("/form/educationalDetails/submitForm", formData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || "Submission error");
//     }
//   }
// );

// Slice definition
const educationalDetailsSlice = createSlice({
  name: "educationalDetails",
  initialState: {
    formData: {
      LastSchoolName: "",
      Class: "",
      Percentage: "",
      YearOfPassing: "",
      Board: "",
    },
    dataExist: false,
    boards: [],
    loading: false,
    error: null,
  },
  reducers: {
    updateEducationalDetails(state, action) {
      state.formData = { ...state.formData, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEducationalDetails.pending, (state) => {
        state.loading = true;
        state.error = {};
      })
      .addCase(fetchEducationalDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.formData = action.payload.formData;
        state.dataExist = action.payload.dataExist;
      })
      .addCase(fetchEducationalDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = { fetchError: action.payload };
      })

      .addCase(fetchBoards.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.loading = false;
        state.boards = action.payload.boards;
      })
      .addCase(fetchBoards.rejected, (state, action) => {
        state.loading = false;
        state.error = { fetchBoardsError: action.payload };
      })

     
  },
});

export const { updateEducationalDetails } = educationalDetailsSlice.actions;
export default educationalDetailsSlice.reducer;
