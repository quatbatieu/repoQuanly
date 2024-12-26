import React, { useState } from 'react';
import { Upload, Button, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import "./uploadDetailBooking.scss";

const UploadDetailBooking = () => {
  const [images, setImages] = useState([]);

  // Hàm xử lý sự kiện tải lên hình ảnh
  const handleUpload = (file) => {
    // Xử lý logic tải lên hình ảnh ở đây và cập nhật danh sách hình ảnh
    // Sau khi tải lên thành công, bạn có thể sử dụng setState để cập nhật `images`
  };

  // Hàm xử lý sự kiện xóa hình ảnh
  const handleDelete = (file) => {
    // Xử lý logic xóa hình ảnh ở đây và cập nhật danh sách hình ảnh
    // Sau khi xóa thành công, bạn có thể sử dụng setState để cập nhật `images`
  };

  return (
    <div className='booking-item-list row g-1 mb-4 uploadDetailBooking'>
      {Array.from(new Array(6)).map((item, index) => (
        <div className='col-4'>
          <Upload
            showUploadList={false}
            onRemove={handleDelete}
            action=""
          >
            <div className="uploadDetailBooking-container">
              <img src={process.env.PUBLIC_URL + '/assets/images/upload-image.png'} style={{ width: "100%" }} />
            </div>
          </Upload>
        </div>
      ))}
    </div>
  )
}

export default UploadDetailBooking;
