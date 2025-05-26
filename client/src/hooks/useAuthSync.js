import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setToken } from '../redux/slices/auth.slice';
import authService from '../services/authService';

export const useAuthSync = () => {
  const dispatch = useDispatch();
  const reduxUser = useSelector(state => state.auth.user);
  const reduxToken = useSelector(state => state.auth.token);

  useEffect(() => {
    // Sync from localStorage to Redux on mount
    const syncFromStorage = () => {
      const currentUser = authService.getCurrentUser();
      const token = localStorage.getItem('token');

      if (currentUser && currentUser.user && JSON.stringify(currentUser.user) !== JSON.stringify(reduxUser)) {
        console.log('Syncing user from localStorage to Redux');
        dispatch(setUser(currentUser.user));
      }

      if (token && token !== reduxToken) {
        console.log('Syncing token from localStorage to Redux');
        dispatch(setToken(token));
      }
    };

    syncFromStorage();

    // Listen for storage changes (when user updates profile in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'user' && e.newValue) {
        try {
          const userData = JSON.parse(e.newValue);
          if (userData.user) {
            console.log('User data changed in another tab, syncing...');
            dispatch(setUser(userData.user));
          }
        } catch (error) {
          console.error('Error parsing user data from storage:', error);
        }
      }

      if (e.key === 'token' && e.newValue) {
        console.log('Token changed in another tab, syncing...');
        dispatch(setToken(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [dispatch, reduxUser, reduxToken]);

  // Return current auth state
  return {
    user: reduxUser,
    token: reduxToken,
    isAuthenticated: !!reduxToken && !!reduxUser
  };
}; 