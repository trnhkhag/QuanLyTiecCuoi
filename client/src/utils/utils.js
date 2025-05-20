import { notification } from 'antd';

export const showNotification = (type, message, description) => {
  notification[type]({
    message,
    description,
    placement: 'topRight',
  });
};

export const handleError = (error, action = 'thực hiện thao tác') => {
  console.error(`Error ${action}:`, error);
  showNotification(
    'error',
    'Có lỗi xảy ra',
    `Không thể ${action.toLowerCase()}. Vui lòng thử lại sau.`
  );
};