import React, { useState, forwardRef } from 'react';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

const PasswordInput = forwardRef((props, ref) => {
  const { 
    placeholder = "Nhập mật khẩu",
    ...inputProps 
  } = props;
  
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div style={{ 
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
          flex: '5',
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
        onClick={() => setShowPassword(!showPassword)}
        style={{ 
          flex: '1',
          border: 'none',
          borderLeft: '1px solid #ced4da',
          background: '#f8f9fa',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#6c757d',
          fontSize: '14px',
          minWidth: '40px',
          outline: 'none',
          height: '100%',
          boxSizing: 'border-box'
        }}
      >
        {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
      </button>
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput; 