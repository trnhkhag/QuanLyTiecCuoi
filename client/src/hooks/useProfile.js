import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
import {
  fetchUserProfile,
  fetchUserPermissions,
  updateCustomerProfile,
  changePassword,
  addWeddingToHistory,
  updateWeddingInHistory,
  clearProfileError,
  clearPasswordChangeSuccess,
} from '../redux/slices/profile.slice';

export const useProfile = () => {
  const dispatch = useDispatch();
  const profileState = useSelector((state) => state.profile);

  // Load profile data on hook initialization
  const loadProfile = useCallback(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  const loadPermissions = useCallback(() => {
    dispatch(fetchUserPermissions());
  }, [dispatch]);

  // Update customer profile
  const updateProfile = useCallback((profileData) => {
    return dispatch(updateCustomerProfile(profileData));
  }, [dispatch]);

  // Change password
  const updatePassword = useCallback((passwordData) => {
    return dispatch(changePassword(passwordData));
  }, [dispatch]);

  // Wedding history management
  const addWedding = useCallback((weddingData) => {
    dispatch(addWeddingToHistory(weddingData));
  }, [dispatch]);

  const updateWedding = useCallback((weddingData) => {
    dispatch(updateWeddingInHistory(weddingData));
  }, [dispatch]);

  // Error management
  const clearErrors = useCallback(() => {
    dispatch(clearProfileError());
  }, [dispatch]);

  const clearPasswordSuccess = useCallback(() => {
    dispatch(clearPasswordChangeSuccess());
  }, [dispatch]);

  // Auto-load profile and permissions when hook is used
  useEffect(() => {
    if (!profileState.profile) {
      loadProfile();
    }
    if (profileState.permissions.length === 0) {
      loadPermissions();
    }
  }, [loadProfile, loadPermissions, profileState.profile, profileState.permissions.length]);

  return {
    // State
    profile: profileState.profile,
    weddingHistory: profileState.weddingHistory,
    permissions: profileState.permissions,
    loading: profileState.loading,
    error: profileState.error,
    updateLoading: profileState.updateLoading,
    updateError: profileState.updateError,
    passwordChangeLoading: profileState.passwordChangeLoading,
    passwordChangeError: profileState.passwordChangeError,
    passwordChangeSuccess: profileState.passwordChangeSuccess,

    // Actions
    loadProfile,
    loadPermissions,
    updateProfile,
    updatePassword,
    addWedding,
    updateWedding,
    clearErrors,
    clearPasswordSuccess,
  };
};

export default useProfile; 