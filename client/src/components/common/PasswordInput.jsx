import React, { useState, forwardRef } from 'react';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

const PasswordInput = forwardRef((props, ref) => {
  const { 
    placeholder = "Nhập mật khẩu",
    ...inputProps 
  } = props;
  
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div style={{ position: 'relative' }}>
      <input
        ref={ref}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '0.375rem 2.5rem 0.375rem 0.75rem',
          border: '1px solid #ced4da',
          borderRadius: '0.375rem',
          fontSize: '1rem',
          lineHeight: '1.5'
        }}
        {...inputProps}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        style={{ 
          position: 'absolute',
          right: '8px',
          top: '50%',
          transform: 'translateY(-50%)',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          padding: '4px',
          color: '#6c757d',
          fontSize: '16px'
        }}
      >
        {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
      </button>
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput; 