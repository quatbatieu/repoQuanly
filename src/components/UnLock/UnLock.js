import React from 'react'
import { useTranslation } from 'react-i18next'
import  Center from "../../assets/new-icons/center.jpg";
const UnLock = () => {
  const { t: translation } = useTranslation()
  return (
    <div class="text-center">
      <img src={Center} style={{ maxWidth : '50%'}}class="img-fluid mb-3" alt="Responsive image"></img>
      <div style={{ color : '#1890ff' }} className='h5'>{translation("error_admin")}</div>
      <div className='h5'><a href="mailto:info@ttdk.com.vn" target='_blank'>Email : info@ttdk.com.vn</a></div>
      <div style={{ color : '#1890ff' }} className='h5'><a href="https://zalo.me/3485707806416347108" target="_blank">Zalo: TTDK - Đặt lịch đăng kiểm</a></div>
    </div>
  )
}

export default UnLock