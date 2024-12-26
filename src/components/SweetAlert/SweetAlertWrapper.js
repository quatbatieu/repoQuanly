import React from 'react';
import { Space } from 'antd';

// Styles
import "./sweetAlertWrapper.scss";
import swal from 'sweetalert';

export const SweetAlertWrapperConfirm = ({
  title = "Thông báo",
  text = "",
  confirmText = "Đồng ý",
  cancelText = "Hủy",
  onConfirm,
  iconComponent = "warning",
  children
}) => {
  const handleShowConfirmDialog = () => {
     swal({
      title: title,
      text: text,
      icon: iconComponent,
      buttons: [cancelText, confirmText],
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        onConfirm && onConfirm()
      }
    });
  };

  return (
    <Space onClick={handleShowConfirmDialog}>
      {children}
    </Space>
  );
};

