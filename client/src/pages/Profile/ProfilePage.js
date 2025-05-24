import React, { useState, useEffect } from 'react';
import ProfileService from '../../services/ProfileService';
import CustomerProfile from '../../components/Profile/CustomerProfile';
import EmployeeProfile from '../../components/Profile/EmployeeProfile';
import ChangePasswordForm from '../../components/Profile/ChangePasswordForm';
import WeddingHistory from '../../components/Profile/WeddingHistory';
import './ProfilePage.css';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    loadProfile();
    loadPermissions();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const response = await ProfileService.getProfile();
      if (response.success) {
        setProfile(response.data);
        setError('');
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError('Lỗi khi tải thông tin profile');
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPermissions = async () => {
    try {
      const response = await ProfileService.getUserPermissions();
      if (response.success) {
        setPermissions(response.data.permissions || []);
      }
    } catch (error) {
      console.error('Error loading permissions:', error);
    }
  };

  const handleProfileUpdate = (updatedData) => {
    setProfile(prev => ({ ...prev, ...updatedData }));
  };

  const handlePasswordChange = () => {
    // Password changed successfully
    alert('Mật khẩu đã được thay đổi thành công!');
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Đang tải thông tin profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <div className="error-message">
          <h3>Có lỗi xảy ra</h3>
          <p>{error}</p>
          <button onClick={loadProfile} className="retry-btn">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-placeholder">
              {profile?.fullName?.charAt(0) || profile?.username?.charAt(0) || 'U'}
            </div>
          </div>
          <div className="profile-info">
            <h1>{profile?.fullName || profile?.username}</h1>
            <p className="role-badge">{profile?.role}</p>
            <p className="user-type">{profile?.userType === 'customer' ? 'Khách hàng' : 'Nhân viên'}</p>
          </div>
        </div>

        <div className="profile-tabs">
          <button
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <i className="fas fa-user"></i>
            Thông tin cá nhân
          </button>
          
          <button
            className={`tab-btn ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            <i className="fas fa-key"></i>
            Đổi mật khẩu
          </button>

          {profile?.userType === 'customer' && profile?.weddingHistory?.length > 0 && (
            <button
              className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              <i className="fas fa-history"></i>
              Lịch sử tiệc cưới
            </button>
          )}

          {permissions.length > 0 && (
            <button
              className={`tab-btn ${activeTab === 'permissions' ? 'active' : ''}`}
              onClick={() => setActiveTab('permissions')}
            >
              <i className="fas fa-shield-alt"></i>
              Quyền hạn
            </button>
          )}
        </div>

        <div className="profile-content">
          {activeTab === 'profile' && (
            <div className="tab-content">
              {profile?.userType === 'customer' ? (
                <CustomerProfile
                  profile={profile}
                  onUpdate={handleProfileUpdate}
                />
              ) : (
                <EmployeeProfile
                  profile={profile}
                  onUpdate={handleProfileUpdate}
                />
              )}
            </div>
          )}

          {activeTab === 'password' && (
            <div className="tab-content">
              <ChangePasswordForm onSuccess={handlePasswordChange} />
            </div>
          )}

          {activeTab === 'history' && profile?.weddingHistory && (
            <div className="tab-content">
              <WeddingHistory history={profile.weddingHistory} />
            </div>
          )}

          {activeTab === 'permissions' && (
            <div className="tab-content">
              <div className="permissions-section">
                <h3>Quyền hạn của bạn</h3>
                <div className="permissions-grid">
                  {permissions.map((permission, index) => (
                    <div key={index} className="permission-card">
                      <div className="permission-name">{permission.Ten_Quyen}</div>
                      <div className="permission-desc">{permission.MoTa}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 