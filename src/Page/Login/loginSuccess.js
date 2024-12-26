import React,{ useEffect } from 'react'
import { Spin } from 'antd'
import { ReactComponent as SuccessIcon } from './../../assets/new-icons/success.svg'
import './login.scss'

function LoginSuccess() {
  useEffect(() => {
    setTimeout(() => {
      window.location.replace('/')
    }, 1000);
  }, [])
  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding:15}}>
      <div className="text-center">
        <SuccessIcon />
        <div className="register-success">
          <h3>Đăng nhập thành công</h3>
        </div>
        <p className='mt-2'>Bạn sẽ được chuyển hướng đến trang chủ trong 1 giây.</p>
      </div>
    </div>
  )
}
export default LoginSuccess;
