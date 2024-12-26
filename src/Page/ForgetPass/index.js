import React, { useState } from 'react';


function ForgetPass(props) {
  const [data, setData] = useState({ username: '' })

  return (
    <section className="login-outer pad-tp">
      <div className="login-innr">
        <div className="login-inner">
          <div className="login-left">
            <img src="assets/images/login-left-img.png" alt="" />
          </div>
          <div className="login-right">
            <h1>Forgot Password</h1>
            <p>We will send you an email to Reset Your Password!</p>
            <div className="forgot-outer">
              <form>
                <div className="name-fields">
                  <input onChange={(e) => {
                    e.preventDefault()
                    const { name, value } = e.target
                    setData({
                      ...data,
                      [name]: value
                    })
                  }} name="username" type="text" placeholder="Username" className="textfield" />
                  <input onClick={(e) => {
                 
                  }} type="submit" className="get-button" defaultValue="submit" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* {isVisible ? <Loader /> : null} */}
    </section>
  )
}
export default ForgetPass;