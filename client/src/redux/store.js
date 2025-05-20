import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth.slice';
import invoiceReducer from './slices/invoice.slice';
import weddingReducer from './slices/wedding.slice';
import reportReducer from './slices/report.slice';
import uiReducer from './slices/ui.slice';

// Configure the Redux store
const store = configureStore({
  reducer: {
    auth: authReducer,
    invoices: invoiceReducer,
    weddings: weddingReducer,
    reports: reportReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store; 