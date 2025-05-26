import React, { useState } from 'react';
import { Progress } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { forwardRef } from 'react';

// Component riêng cho strength indicator
const PasswordStrengthIndicator = ({ password }) => {
  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, text: '', color: '' };
    
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password)
    };

    score = Object.values(checks).filter(Boolean).length;

    const strengthLevels = {
      0: { text: '', color: '#d9d9d9' },
      1: { text: 'Rất yếu', color: '#ff4d4f' },
      2: { text: 'Yếu', color: '#ff7a45' },
      3: { text: 'Trung bình', color: '#ffa940' },
      4: { text: 'Mạnh', color: '#1890ff' },
      5: { text: 'Rất mạnh', color: '#52c41a' }
    };

    return { score, ...strengthLevels[score], checks };
  };

  const strength = getPasswordStrength(password);

  if (!password) return null;

  return (
    <div className="password-strength" style={{ marginTop: '8px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '4px' 
      }}>
        <span style={{ fontSize: '12px', color: '#666' }}>Độ mạnh mật khẩu:</span>
        <span style={{ 
          fontSize: '12px', 
          color: strength.color, 
          fontWeight: 'bold' 
        }}>
          {strength.text}
        </span>
      </div>
      
      <Progress
        percent={(strength.score / 5) * 100}
        strokeColor={strength.color}
        showInfo={false}
        size="small"
        style={{ marginBottom: '8px' }}
      />

      <div className="password-requirements">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
          <div style={{ fontSize: '12px', color: strength.checks?.length ? '#52c41a' : '#999' }}>
            {strength.checks?.length ? <CheckOutlined /> : <CloseOutlined />}
            <span style={{ marginLeft: '4px' }}>Ít nhất 8 ký tự</span>
          </div>
          <div style={{ fontSize: '12px', color: strength.checks?.lowercase ? '#52c41a' : '#999' }}>
            {strength.checks?.lowercase ? <CheckOutlined /> : <CloseOutlined />}
            <span style={{ marginLeft: '4px' }}>Chữ thường</span>
          </div>
          <div style={{ fontSize: '12px', color: strength.checks?.uppercase ? '#52c41a' : '#999' }}>
            {strength.checks?.uppercase ? <CheckOutlined /> : <CloseOutlined />}
            <span style={{ marginLeft: '4px' }}>Chữ hoa</span>
          </div>
          <div style={{ fontSize: '12px', color: strength.checks?.number ? '#52c41a' : '#999' }}>
            {strength.checks?.number ? <CheckOutlined /> : <CloseOutlined />}
            <span style={{ marginLeft: '4px' }}>Số</span>
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: strength.checks?.special ? '#52c41a' : '#999',
            gridColumn: '1 / -1'
          }}>
            {strength.checks?.special ? <CheckOutlined /> : <CloseOutlined />}
            <span style={{ marginLeft: '4px' }}>Ký tự đặc biệt (@$!%*?&)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const PasswordInput = forwardRef((props, ref) => {
  const { 
    showStrengthIndicator = false,
    watchValue,
    placeholder = "Nhập mật khẩu",
    ...inputProps 
  } = props;
  
  const [showPassword, setShowPassword] = useState(false);
  
  // Debug log
  console.log('PasswordInput received props:', {
    name: inputProps.name,
    hasOnChange: !!inputProps.onChange,
    hasOnBlur: !!inputProps.onBlur,
    hasValue: inputProps.value !== undefined,
    showStrengthIndicator,
    watchValue
  });
  
  return (
    <div className="password-input-container">
      <div style={{ display: 'flex', position: 'relative' }}>
        <input
          ref={ref}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          style={{
            flex: 1,
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6c757d',
            fontSize: '16px'
          }}
        >
          {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
        </button>
      </div>

      {showStrengthIndicator && (
        <PasswordStrengthIndicator password={watchValue} />
      )}
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput; 