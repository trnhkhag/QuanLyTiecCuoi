import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ProfileService from '../../services/ProfileService';

// Async thunks for profile management
export const fetchUserProfile = createAsyncThunk(
  'profile/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ProfileService.getProfile();
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch profile');
    }
  }
);

export const updateCustomerProfile = createAsyncThunk(
  'profile/updateCustomerProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await ProfileService.updateCustomerProfile(profileData);
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update profile');
    }
  }
);

export const changePassword = createAsyncThunk(
  'profile/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await ProfileService.changePassword(passwordData);
      if (response.success) {
        return response.message;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to change password');
    }
  }
);

export const fetchUserPermissions = createAsyncThunk(
  'profile/fetchUserPermissions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ProfileService.getUserPermissions();
      if (response.success) {
        return response.data.permissions;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch permissions');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    profile: null,
    weddingHistory: [],
    permissions: [],
    loading: false,
    error: null,
    updateLoading: false,
    updateError: null,
    passwordChangeLoading: false,
    passwordChangeError: null,
    passwordChangeSuccess: false,
  },
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
      state.updateError = null;
      state.passwordChangeError = null;
    },
    clearPasswordChangeSuccess: (state) => {
      state.passwordChangeSuccess = false;
    },
    addWeddingToHistory: (state, action) => {
      // Thêm wedding mới vào đầu danh sách history
      state.weddingHistory.unshift(action.payload);
    },
    updateWeddingInHistory: (state, action) => {
      // Cập nhật wedding trong history
      const index = state.weddingHistory.findIndex(
        wedding => wedding.ID_TiecCuoi === action.payload.ID_TiecCuoi
      );
      if (index !== -1) {
        state.weddingHistory[index] = { ...state.weddingHistory[index], ...action.payload };
      }
    },
    setWeddingHistory: (state, action) => {
      state.weddingHistory = action.payload;
    },
    updateProfile: (state, action) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        // Cập nhật wedding history nếu có
        if (action.payload.weddingHistory) {
          state.weddingHistory = action.payload.weddingHistory;
        }
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update customer profile
      .addCase(updateCustomerProfile.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateCustomerProfile.fulfilled, (state, action) => {
        state.updateLoading = false;
        if (state.profile) {
          state.profile = { ...state.profile, ...action.payload };
        }
        state.updateError = null;
      })
      .addCase(updateCustomerProfile.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      })
      // Change password
      .addCase(changePassword.pending, (state) => {
        state.passwordChangeLoading = true;
        state.passwordChangeError = null;
        state.passwordChangeSuccess = false;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.passwordChangeLoading = false;
        state.passwordChangeSuccess = true;
        state.passwordChangeError = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.passwordChangeLoading = false;
        state.passwordChangeError = action.payload;
        state.passwordChangeSuccess = false;
      })
      // Fetch user permissions
      .addCase(fetchUserPermissions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.permissions = action.payload;
      })
      .addCase(fetchUserPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearProfileError,
  clearPasswordChangeSuccess,
  addWeddingToHistory,
  updateWeddingInHistory,
  setWeddingHistory,
  updateProfile,
} = profileSlice.actions;

export default profileSlice.reducer; 