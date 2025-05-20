import { createSlice } from '@reduxjs/toolkit';

// UI slice for managing general UI state
const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    // Sidebar state
    sidebarCollapsed: false,
    // Toast notifications
    toast: {
      visible: false,
      message: '',
      type: 'info', // 'success', 'info', 'warning', 'error'
    },
    // Modal states
    modals: {
      confirmDelete: {
        visible: false,
        itemId: null,
        itemType: null, // 'invoice', 'wedding', etc.
      },
      createWedding: {
        visible: false,
      },
      createInvoice: {
        visible: false,
      },
    },
    // Loading states for general UI elements
    loading: {
      global: false,
    },
    // Theme preferences
    theme: {
      darkMode: false,
      accentColor: 'primary', // 'primary', 'secondary', etc.
    },
  },
  reducers: {
    // Sidebar actions
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
    },
    
    // Toast notifications
    showToast: (state, action) => {
      state.toast = {
        visible: true,
        message: action.payload.message,
        type: action.payload.type || 'info',
      };
    },
    hideToast: (state) => {
      state.toast.visible = false;
    },
    
    // Modal actions
    showConfirmDeleteModal: (state, action) => {
      state.modals.confirmDelete = {
        visible: true,
        itemId: action.payload.itemId,
        itemType: action.payload.itemType,
      };
    },
    hideConfirmDeleteModal: (state) => {
      state.modals.confirmDelete = {
        visible: false,
        itemId: null,
        itemType: null,
      };
    },
    showCreateWeddingModal: (state) => {
      state.modals.createWedding.visible = true;
    },
    hideCreateWeddingModal: (state) => {
      state.modals.createWedding.visible = false;
    },
    showCreateInvoiceModal: (state) => {
      state.modals.createInvoice.visible = true;
    },
    hideCreateInvoiceModal: (state) => {
      state.modals.createInvoice.visible = false;
    },
    
    // Loading state
    setGlobalLoading: (state, action) => {
      state.loading.global = action.payload;
    },
    
    // Theme preferences
    toggleDarkMode: (state) => {
      state.theme.darkMode = !state.theme.darkMode;
      // Save to localStorage
      localStorage.setItem('darkMode', state.theme.darkMode);
    },
    setAccentColor: (state, action) => {
      state.theme.accentColor = action.payload;
      // Save to localStorage
      localStorage.setItem('accentColor', action.payload);
    },
  },
});

export const {
  toggleSidebar,
  setSidebarCollapsed,
  showToast,
  hideToast,
  showConfirmDeleteModal,
  hideConfirmDeleteModal,
  showCreateWeddingModal,
  hideCreateWeddingModal,
  showCreateInvoiceModal,
  hideCreateInvoiceModal,
  setGlobalLoading,
  toggleDarkMode,
  setAccentColor,
} = uiSlice.actions;

export default uiSlice.reducer; 