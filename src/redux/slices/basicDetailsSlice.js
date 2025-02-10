import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

// Thunk to fetch basic details
export const fetchBasicDetails = createAsyncThunk(
  'basicDetails/fetchBasicDetails',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/form/basicDetails/getForm');
      const data = response.data;
      if (data.length !== 0) {
        return {
          dataExist: true, // Indicate data exists
          formData: {
            dob: data[0]?.dob.split('T')[0] || '',
            gender: data[0]?.gender || '',
            examName: data[0]?.examName || '',
            examDate: data[0]?.examDate.split('T')[0] || '',
          },
        };
      } else {
        return {
          dataExist: false, // Indicate no data exists
          formData: {}, // Default empty data
        }; 
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch data');
    }
  }
);

// Slice
const basicDetailsSlice = createSlice({
  name: 'basicDetails',
  initialState: {
    data: {},
    loading: false,
    error: null,
    dataExist: false, // New flag to indicate if data exists in the database

  },
  reducers: {
    updateBasicDetails(state, action) {
      state.data = { ...state.data, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBasicDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBasicDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.formData;
        state.dataExist = action.payload.dataExist; // Update `dataExist`

      })
      .addCase(fetchBasicDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateBasicDetails } = basicDetailsSlice.actions;
export default basicDetailsSlice.reducer;
