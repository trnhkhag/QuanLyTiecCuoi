import React, { useState, forwardRef } from 'react';
// import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

const PasswordInput = forwardRef((props, ref) => {
  const { 
    placeholder = "Nhập mật khẩu",
    className = "",
    ...inputProps 
  } = props;
  
  const [showPassword, setShowPassword] = useState(false);
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <div 
      className={className}
      style={{ 
        display: 'flex', 
        width: '100%',
        height: '38px',
        border: '1px solid #ced4da',
        borderRadius: '0.375rem',
        overflow: 'hidden'
      }}>
      <input
        ref={ref}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        style={{
          flex: '1',
          padding: '0.375rem 0.75rem',
          border: 'none',
          fontSize: '1rem',
          lineHeight: '1.5',
          outline: 'none',
          height: '100%',
          boxSizing: 'border-box'
        }}
        {...inputProps}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        style={{
          width: '40px',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#6c757d',
          fontSize: '16px'
        }}
        tabIndex={-1}
      >
        {showPassword ? (
          <i className="fas fa-eye-slash" title="Ẩn mật khẩu"></i>
        ) : (
          <i className="fas fa-eye" title="Hiện mật khẩu"></i>
        )}
      </button>
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput; 