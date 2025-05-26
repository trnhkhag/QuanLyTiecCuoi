# Redux Profile & Wedding History Setup

## Tổng quan

Project đã được cập nhật để sử dụng Redux quản lý profile data và wedding history. Khi đặt tiệc thành công, wedding history sẽ được tự động cập nhật trong Redux store.

## Cấu trúc Redux

### 1. Profile Slice (`client/src/redux/slices/profile.slice.js`)

**State Structure:**
```javascript
{
  profile: null,           // Thông tin profile user
  weddingHistory: [],      // Lịch sử tiệc cưới
  permissions: [],         // Quyền hạn của user
  loading: false,          // Trạng thái loading
  error: null,            // Lỗi
  updateLoading: false,    // Trạng thái update profile
  updateError: null,       // Lỗi update
  passwordChangeLoading: false,
  passwordChangeError: null,
  passwordChangeSuccess: false
}
```

**Actions:**
- `fetchUserProfile` - Lấy thông tin profile
- `updateCustomerProfile` - Cập nhật profile khách hàng
- `changePassword` - Đổi mật khẩu
- `fetchUserPermissions` - Lấy quyền hạn
- `addWeddingToHistory` - Thêm tiệc cưới vào lịch sử
- `updateWeddingInHistory` - Cập nhật tiệc cưới trong lịch sử
- `setWeddingHistory` - Set toàn bộ lịch sử
- `clearProfileError` - Xóa lỗi

### 2. Wedding Slice (`client/src/redux/slices/wedding.slice.js`)

**Cập nhật:**
- `createWedding` action đã được cập nhật để tự động thêm wedding vào profile history khi tạo thành công

### 3. Store Configuration (`client/src/redux/store.js`)

Store đã được cập nhật để bao gồm `profileReducer`.

## Custom Hook

### useProfile (`client/src/hooks/useProfile.js`)

Hook này cung cấp interface dễ sử dụng để tương tác với profile state:

```javascript
const {
  profile,
  weddingHistory,
  permissions,
  loading,
  error,
  updateProfile,
  updatePassword,
  addWedding,
  updateWedding,
  clearErrors
} = useProfile();
```

## Components đã cập nhật

### 1. ProfilePage (`client/src/pages/Profile/ProfilePage.js`)
- Sử dụng `useProfile` hook thay vì local state
- Tự động load profile và permissions
- Hiển thị wedding history từ Redux

### 2. CustomerProfile (`client/src/components/profile/CustomerProfile.js`)
- Sử dụng Redux actions để update profile
- Loading states từ Redux
- Error handling từ Redux

### 3. ChangePasswordForm (`client/src/components/profile/ChangePasswordForm.js`)
- Sử dụng Redux actions để đổi mật khẩu
- Loading và error states từ Redux

### 4. BookingFormPage (`client/src/pages/Booking/BookingFormPage.js`)
- Khi đặt tiệc thành công, tự động thêm vào wedding history trong Redux
- Dispatch `addWeddingToHistory` action

## Luồng hoạt động

### 1. Khi user đăng nhập:
1. Auth slice lưu thông tin user
2. Profile slice tự động load profile data
3. Wedding history được load cùng với profile

### 2. Khi đặt tiệc thành công:
1. BookingFormPage submit booking
2. Nếu thành công, dispatch `addWeddingToHistory`
3. Wedding history trong Redux được cập nhật
4. ProfilePage tự động hiển thị tiệc cưới mới

### 3. Khi cập nhật profile:
1. User chỉnh sửa thông tin trong CustomerProfile
2. Component dispatch `updateCustomerProfile`
3. Redux state được cập nhật
4. UI tự động reflect thay đổi

## Lợi ích

1. **Centralized State**: Tất cả profile data được quản lý tập trung
2. **Real-time Updates**: Wedding history được cập nhật ngay lập tức
3. **Consistent UI**: Tất cả components đều sử dụng cùng một source of truth
4. **Better UX**: Loading states và error handling nhất quán
5. **Maintainable**: Code dễ maintain và debug

## Testing

Để test Redux integration:

1. Đăng nhập vào hệ thống
2. Vào trang Profile để xem profile data được load
3. Đặt một tiệc cưới mới
4. Quay lại trang Profile để xem wedding history đã được cập nhật
5. Thử cập nhật profile và đổi mật khẩu

## Debug

Sử dụng Redux DevTools để monitor state changes:
- Profile loading/success/error states
- Wedding history updates
- Form submissions và responses

## Component ReduxSummary

Đã tạo component `ReduxSummary` để hiển thị tóm tắt Redux state, hữu ích cho debugging:

```jsx
import ReduxSummary from './components/common/ReduxSummary';

// Sử dụng trong component để debug
<ReduxSummary />
``` 