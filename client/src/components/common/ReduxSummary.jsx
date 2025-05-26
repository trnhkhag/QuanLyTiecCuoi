import React from 'react';
import { useSelector } from 'react-redux';

const ReduxSummary = () => {
  const profile = useSelector((state) => state.profile);
  const auth = useSelector((state) => state.auth);

  return (
    <div style={{ 
      padding: '1rem', 
      backgroundColor: '#f8f9fa', 
      borderRadius: '8px', 
      margin: '1rem 0',
      fontSize: '0.9rem'
    }}>
      <h4 style={{ marginBottom: '0.5rem', color: '#495057' }}>Redux State Summary</h4>
      
      <div style={{ marginBottom: '0.5rem' }}>
        <strong>Auth:</strong> {auth.isAuthenticated ? 'Đã đăng nhập' : 'Chưa đăng nhập'}
        {auth.user && ` - ${auth.user.name || auth.user.username}`}
      </div>
      
      <div style={{ marginBottom: '0.5rem' }}>
        <strong>Profile:</strong> {profile.profile ? 'Đã tải' : 'Chưa tải'}
        {profile.loading && ' (Đang tải...)'}
      </div>
      
      <div style={{ marginBottom: '0.5rem' }}>
        <strong>Wedding History:</strong> {profile.weddingHistory?.length || 0} tiệc cưới
      </div>
      
      <div>
        <strong>Permissions:</strong> {profile.permissions?.length || 0} quyền
      </div>
      
      {profile.error && (
        <div style={{ color: '#dc3545', marginTop: '0.5rem' }}>
          <strong>Lỗi:</strong> {profile.error}
        </div>
      )}
    </div>
  );
};

export default ReduxSummary; 