import React from 'react';
import { useTranslation } from 'react-i18next'
import './setting.scss'
import { useDispatch } from 'react-redux';
import { USER_DETAILS_UPDATE } from '../../constants/member';
import { useSelector } from 'react-redux'
import {
  Button,
  notification,
  Switch
} from 'antd';
import _ from 'lodash';
import SettingService from '../../services/settingService';

export default function SettingSecurity({
  setIsOpenModal2FA,
  setIsOpenModal,
  isOpenModal,
  inputRef
}) {
  const { t: translation } = useTranslation()
  const user = useSelector((state) => state.member)
  const dispatch = useDispatch()

  const onChange2FASecurity = (isOn) => {
    SettingService.UpdateUser({
      id: user.appUserId,
      data: {
        twoFAEnable: isOn ? 0 : 1
      }
    }).then(result => {
      if (!result) {
        notification.error({
          message: "",
          description: translation("accreditation.updateError")
        })
      } else {
        dispatch({
          type: USER_DETAILS_UPDATE,
          data: {
            ...user,
            twoFAEnable: isOn ? 0 : 1
          }
        })
      }
    })
  }

  return (
    <div className="setting">
      <div className="row">
        <div className="col-12 col-md-4 mb-3">
          <label>2FA OTP</label>
        </div>
        <div className="col-12 col-md-8 mb-3">
          <Switch
            checked={user.twoFAEnable === 1 ? true : false}
            onClick={() => {
              if (user.twoFAEnable === 1) {
                onChange2FASecurity(true)
              } else {
                setIsOpenModal2FA(true)
              }
            }}
          />
        </div>
        <div className="col-12 col-md-4">
          <label>{translation('setting.changePass')}</label>
        </div>
        <div className="col-12 col-md-8">
          <Button type="primary" onClick={() => {
              setIsOpenModal(!isOpenModal)
              if (inputRef && inputRef.current) {
                setTimeout(() => {
                  inputRef.current.focus()
                }, 0)
              }
            }}>
              {translation('setting.changePass')}
            </Button>
        </div>
        {/* <div className="col-12 col-md-4 my-2">
        <Button type="primary" onClick={() => {
          history.push('/edit-landing-page')
        }}>
          {translation('setting.editLanding')}
        </Button>
      </div>
      <div className="col-12 col-md-8" /> */}
        {/* <div className="col-12 col-md-4 mt-2">
      <label><b>SMS OTP</b></label>
    </div>
    <div className="col-12 col-md-8 mt-2">
    <Switch />
    </div> */}
      </div>
    </div>
  )
}