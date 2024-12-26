import React, {  useEffect } from 'react';
import { useDispatch } from 'react-redux'

function Register(props) {
  const { className } = props
  const dispatch = useDispatch()
 

  function handleLogin(){
    dispatch(({ type: 'USER_LOGIN', data: {
      email: "tests",
      email: "tests",
      wallets: {},
      member: {}
    } }))
    setTimeout(() => {
      props.history.push('/index')
    }, 200)
  }

  return (
    <main className="main">
       <div className="full-page">
        <div className="web-center-block register">
          <div className="enter-frame" style={{textAlign: 'center'}}> <img src="img/nunu/logo.png" alt="logo" className="enter-logo" />
            <h1 style={{color: '#f37022'}}>Thành viên đã đăng ký</h1>
           
            <form action="/ajax/register" className="register_form" method="post">
              <div className="text-block">
                <p style={{marginTop: 0}}> Để bảo vệ quyền lợi của mình, tên / chứng minh nhân dân / tài khoản đã đăng ký phải là cùng một người. Vui lòng sử dụng số điện thoại di động của tôi và nhận tin nhắn văn bản. Không được sử dụng nhiều danh tính để đăng ký tài khoản với số lượng lớn dẫn đến trùng lắp thông tin thành viên hoặc mất điểm, bạn tự chịu rủi ro. </p>
              </div>
              <div className="input-block-area">
                <div className="input-block">
                  <label htmlFor className="title">Tên thật</label>
                  <input type="text" className="input-content" placeholder="Nhập tên thật" name="name" required maxLength={16} /> </div>
                <div className="input-block">
                  <label htmlFor className="title">Số điện thoại di động</label>
                  <input type="text" className="input-content" placeholder="Nhập số có thể nhận SMS" name="phone" required maxLength={11} /> </div>
              </div>
              {/* <div class="input-block-area"> */}
              <div className="input-block">
                <label htmlFor className="title">Tên tài khoản</label>
                <input type="text" className="input-content" placeholder="3 ~ 20 sự kết hợp của các số" autoComplete="off" name="account" required maxLength={20} /> </div>
              {/* </div> */}
              <div className="input-block-area">
                <div className="input-block">
                  <label htmlFor className="title">Mật khẩu</label>
                  <input type="password" className="input-content" placeholder="Nhập mật khẩu" autoComplete="off" name="password" required maxLength={40} /> </div>
                <div className="input-block">
                  <label htmlFor className="title">Nhập lại mật khẩu</label>
                  <input type="password" className="input-content" placeholder="Nhập mật khẩu" autoComplete="off" name="password_confirm" required maxLength={40} /> </div>
              </div>
              <div className="input-block">
                <label htmlFor>Social ID</label>
             
                <div className="input-block communication-software">
                  <input name="contact_type" type="hidden" defaultValue="zalo" />
                  <input name="contact" type="text" placeholder="Nhập zalo ID" maxLength={30} /> </div>
                {/* </div> */}
              </div>
              <div className="input-block">
                <div className="input-verification-code-block">
                  <label htmlFor className="title">Mã xác nhận</label>
                  <div className="verification">
                    <input name="captcha" type="text" className="input-content" placeholder="Nhập mã xác nhận" />
                    {/* <div className="img-block captcha"> 
                    <img alt="Đọc mã xác minh" src="captcha/?rand=0.7819781087904631" />
                      <div className="change" />
                    </div> */}
                  </div>
                </div>
              </div>
              <div className="text-block">
                <input type="checkbox" className="checkbox" defaultChecked />Xác nhận rằng tôi đủ 18 tuổi trở lên và tất cả các hoạt động trên trang web này không vi phạm pháp luật do quốc gia nơi tôi sinh sống. Tôi cũng chấp nhận tất cả các quy tắc và quy định liên quan và tuyên bố về quyền riêng tư trong ứng dụng này. <a href="/policy"> Cam kết bảo mật</a> </div>
              <button onClick={()=>{ handleLogin()}}  className="btn1 login-btn submit" data-loading-text="Chế biến...">Đã đăng ký</button>
              <div className="link-area"> <a href target="_blank">Dịch vụ chăm sóc khách</a> <a href="/login">Đăng nhập</a> </div>
             
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
export default Register;