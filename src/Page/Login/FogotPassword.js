import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom';
import './login.scss'
import { handleSignin } from '../../actions'
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button, Typography, notification } from 'antd';
import { useLocation } from 'react-router-dom';
import LoginService from '../../services/loginService';

import { validatorEmail, validatorPassword } from 'helper/commonValidator';
import { ReloadOutlined } from '@ant-design/icons';

const NewPassword = (props) => {
  const { t: translation } = useTranslation()

  const { history } = props
  const user = useSelector((state) => state.member)
  const { isUserLoggedIn, permissions, appUserRoleId } = user

  let { search } = useLocation();
  const query = new URLSearchParams(search);

  const tokenField = query.get('token');

  useEffect(() => {
    if (user && isUserLoggedIn) {
      history.push("/");
    }
  }, [])

  const onFinish = (values) => {
    LoginService.resetPasswordUserByToken({ password: values.password, token: tokenField }).then((result) => {
      if (!result.isSuccess) {
        notification['error']({
          message: '',
          description: translation('landing.updateError')
        })
        return
      }
      props.onChangeStep("notificationPassword");
    })
  }

  return (
    <main className="login">
      <div className="login_form__title">{translation("landing.newPasswordTitle")}</div>
      <Form
        name="login"
        autoComplete="off"
        onFinish={onFinish}
      >
        <div className="row d-flex justify-content-center">
          <Form.Item
            name="password"
            rules={[
              {
                required: false,
                validator(_, value) {
                  return validatorPassword(value , translation);
                }
              }
            ]}
            className="col-12 col-md-6 col-lg-4"
          >
            <Input.Password
              placeholder={"***************"}
              type="text"
              size="large"
            />
          </Form.Item>
        </div>

        <div className="row d-flex justify-content-center">
          <Form.Item
            name="confirmPassword"
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(translation("landing.invalidConfirmPassword")));
                },
              }),
            ]}
            className="col-12 col-md-6 col-lg-4"
          >
            <Input.Password
              placeholder={translation("landing.confirmPassword-input")}
              type="password"
              size="large"
            />
          </Form.Item>
        </div>

        <div className="row d-flex justify-content-center">
          <Form.Item>
            <div className='login_form__wrap col-12 col-md-6 col-lg-4'>
              <Button
                className="login-btn"
                block
                htmlType='submit'
              >
                {translation("landing.newPasswordBtn")}
              </Button>
            </div>
          </Form.Item>
        </div>
      </Form>
    </main>
  )
}
const EnterInformation = (props) => {
  const { t: translation } = useTranslation()
  const { history } = props
  const user = useSelector((state) => state.member)
  const [loading , setLoading] = useState(false);
  const { isUserLoggedIn, permissions, appUserRoleId } = user

  useEffect(() => {
    if (user && isUserLoggedIn) {
      history.push("/");
    }
  }, [])

  const onFinish = (values) => {
    setLoading(true)
    LoginService.resetPasswordByEmail(values).then((result) => {
      setLoading(false);
      props.onChangeStep("notification")
    })
  }

  return (
    <main className="login">
      <div className="login_form__title pb-3">{translation("landing.fogotPasswordTitle")}</div>
      <div className='d-flex justify-content-center'>
        <p className='login_form__desc'>{translation("landing.fogotPasswordDesc")}
          <a href='https://trungtamdangkiem-web-dev.kiemdinhoto.vn/care' className='login_form__href' target='_blank'
          >{translation("landing.cskh")}</a>
          {translation("landing.fogotPasswordDesc2")}
        </p>
      </div>
      <Form
        name="login"
        autoComplete="off"
        onFinish={onFinish}
      >
        <div className="row d-flex justify-content-center">
          <Form.Item
            name="email"
            rules={[
              {
                validator(_, value) {
                  return validatorEmail(value, translation)
                }
              }
            ]}
            className="col-12 col-md-6 col-lg-4"
          >
            <Input
              placeholder={translation("landing.email-input")}
              type="text"
              size="large"
            />
          </Form.Item>
        </div>

        <div className="row d-flex justify-content-center">
          <Form.Item>
            <div className='login_form__wrap col-12 col-md-6 col-lg-4'>
              <div className='d-flex justify-content-between align-items-center theme-color-text'>
                <Typography.Link
                  onClick={() => history.push("/login")}
                >
                  {translation("landing.Canceled")}
                </Typography.Link>
                <Button
                  className="login-btn blue_button"
                  data-loading-text={translation('landing.processing')}
                  htmlType="submit"
                  size="large"
                  disabled={loading}
                  loading={loading}
                >
                  {loading ? <div></div> :
                    translation("landing.newPasswordBtn")
                  }
                </Button>
              </div>
            </div>
          </Form.Item>
        </div>
      </Form>
    </main>
  )
}

const Notification = ({ onChangeStep }) => {
  const { t: translation } = useTranslation()

  return (
    <main className="login">
      <div className="login_form__title pb-3">{translation("landing.fPNotificationTitle")}</div>
      <div className='d-flex justify-content-center'>
        <p className='login_form__desc'>
          {translation("landing.fPNotificationDesc")}
        </p>
      </div>
      <div className="row d-flex justify-content-center">
        <div className='login_form__wrap col-12 col-md-6 col-lg-4'>
          <Button
            className="login-btn"
            data-loading-text={translation('landing.processing')}
            block
            onClick={() => onChangeStep("enterInformation")}
          >
            {translation("landing.close")}
          </Button>
        </div>
      </div>
    </main>
  )
}

const NotificationPassword = ({ onChangeStep, ...props }) => {
  const { t: translation } = useTranslation()
  const { history } = props

  return (
    <main className="login">
      <div className="login_form__title pb-3">{translation("landing.fPNotificationPasswordTitle")}</div>
      <div className='d-flex justify-content-center'>
        <p className='login_form__desc'>
          {translation("landing.fPNotificationPasswordDesc")}
        </p>
      </div>
      <div className="row d-flex justify-content-center">
        <div className='login_form__wrap col-12 col-md-6 col-lg-4'>
          <Button
            className="login-btn"
            data-loading-text={translation('landing.processing')}
            block
            onClick={() => history.push("/login")}
          >
            {translation("landing.login")}
          </Button>
        </div>
      </div>
    </main>
  )
}
function FogotPassword(props) {

  let { search } = useLocation();
  const query = new URLSearchParams(search);

  const tokenField = query.get('token');

  const [key, setKey] = useState(tokenField ? "newPassword" : "enterInformation");
  const step = {
    enterInformation: <EnterInformation {...props} onChangeStep={(key) => setKey(key)} />,
    notification: <Notification {...props} onChangeStep={(key) => setKey(key)} />,
    newPassword: <NewPassword {...props} onChangeStep={(key) => setKey(key)} />,
    notificationPassword: <NotificationPassword {...props} onChangeStep={(key) => setKey(key)} />
  }
  return step[key]
}
export default FogotPassword;