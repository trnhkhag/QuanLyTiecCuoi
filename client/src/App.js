//Main App component
import React from 'react';
import AppRoutes from './routes';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  return (
    <div className="App">
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
