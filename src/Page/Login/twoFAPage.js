import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next'
import './login.scss'
import { handleSignin } from '../../actions'
import { useDispatch } from 'react-redux';
import { Card, notification } from 'antd'
import { useLocation } from 'react-router';
import ReactCodeInput from 'react-code-input'
import SettingService from '../../services/settingService';
import './landing.scss'
import { updateUserWithFirebaseToken } from 'firebase/messaging_init_in_sw';

function TwoFAPage(props) {
	const { t: translation } = useTranslation()
	const { history } = props
  const { state } = useLocation()
	const dispatch = useDispatch()
  const [isValid, setIsValid] = useState(true)

  useEffect(() => {
    if(!state || Object.keys(state).length === 0) {
      window.localStorage.clear()
      window.location.href = '/login'
    }
  },[state])

	const onFinish = (data) => {
    SettingService.verifyingUserCode(data).then(async result => {
      if(result) {
        const token = await updateUserWithFirebaseToken(result , translation);
        dispatch(handleSignin({
          ...result , 
          firebaseToken : token
        }))
        notification.success({
          message: "",
          description: translation('landing.loginSuccess', {name: `${result.firstName} ${result.lastName}`})
        })
        setTimeout(() => {
          history.push('/')
        },1500)
      } else {
        setIsValid(false)
      }
    })
	}

  const inputStyle = {
    "fontFamily": "monospace",
    "MozAppearance": "textfield",
    "borderRadius": "6px",
    "border": "1px solid",
    "boxShadow": "0px 0px 10px 0px rgba(0,0,0,.10)",
    "margin": "4px",
    "textAlign":"center",
    "width": "55px",
    "height": "55px",
    "fontSize": "32px",
    "boxSizing": "border-box",
    "color": "black",
    "backgroundColor": "white",
    "borderColor": "lightgrey"
  }

  const inputInvalidStyle = {
    ...inputStyle,
    "border": "1px solid rgb(238, 211, 215)",
    "boxShadow": "rgb(0 0 0 / 10%) 0px 0px 10px 0px",
    "color": "rgb(185, 74, 72)",
    "backgroundColor": "rgb(242, 222, 222)"
  }

  const typeCode = (code) => {
    if(code.length === 6)
      onFinish({
        "otpCode": code,
        "id": state.appUserId
      })
  }

	return (
		<main  className="row d-flex justify-content-center mt-3">
      <div className="col-12 col-md-5">
        <Card
          title={translation('landing.twoFATitle')}
        >
          <div className="mb-1 mt-3"><strong>{translation('landing.twoFASubTitle')}</strong></div>
          <ReactCodeInput 
            type='text' 
            fields={6} 
            inputStyle={inputStyle}
            inputStyleInvalid={inputInvalidStyle}
            isValid={isValid}
            onChange={typeCode}  
          />
        </Card>
      </div>
		</main>
	)
}
export default TwoFAPage;