import { Switch } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import {
  ListEditAccreditationKey,
  InspectionProcessKey,
  CreateNewCustomerKey,
  AccreditationNotificationKey,
} from 'constants/accreditationTabs'
import { SETTING } from 'constants/setting'

function RestSetting() {
  const setting = useSelector(state => state.setting)
  const settingAccreditationTabs = setting.settingAccreditationTabs ? setting.settingAccreditationTabs : ""
  const { t: translation } = useTranslation()
  const dispatch = useDispatch()

  return (
    <div className="setting">
      <div className="row">
        {/*  */}
        <div className="col-12 col-md-5 mb-3">
          <label>{translation('setting.hide')}{" "}{translation("accreditation.list")}</label>
        </div>
        <div className="col-12 col-md-7 mb-3">
          <Switch
            checked={settingAccreditationTabs.includes(`;${ListEditAccreditationKey}`) ? true : false}
            onClick={(e) => {
              if (e) {
                let newValue = `${settingAccreditationTabs};${ListEditAccreditationKey}`
                dispatch({ type: SETTING, data: { settingAccreditationTabs: newValue } })
              } else {
                let newValue = settingAccreditationTabs.replace(`;${ListEditAccreditationKey}`, "")
                dispatch({ type: SETTING, data: { settingAccreditationTabs: newValue } })
              }
            }}
          />
        </div>
        {/*  */}
        <div className="col-12 col-md-5 mb-3">
          <label>{translation('setting.hide')}{" "}{translation("header.inspectionProcess")}</label>
        </div>
        <div className="col-12 col-md-7 mb-3">
          <Switch
            checked={settingAccreditationTabs.includes(`;${InspectionProcessKey}`) ? true : false}
            onClick={(e) => {
              if (e) {
                let newValue = `${settingAccreditationTabs};${InspectionProcessKey}`
                dispatch({ type: SETTING, data: { settingAccreditationTabs: newValue } })
              } else {
                let newValue = settingAccreditationTabs.replace(`;${InspectionProcessKey}`, "")
                dispatch({ type: SETTING, data: { settingAccreditationTabs: newValue } })
              }
            }}
          />
        </div>
        {/*  */}
        <div className="col-12 col-md-5 mb-3">
          <label>{translation('setting.hide')}{" "}{translation("accreditation.createNew")}</label>
        </div>
        <div className="col-12 col-md-7 mb-3">
          <Switch
            checked={settingAccreditationTabs.includes(`;${CreateNewCustomerKey}`) ? true : false}
            onClick={(e) => {
              if (e) {
                let newValue = `${settingAccreditationTabs};${CreateNewCustomerKey}`
                dispatch({ type: SETTING, data: { settingAccreditationTabs: newValue } })
              } else {
                let newValue = settingAccreditationTabs.replace(`;${CreateNewCustomerKey}`, "")
                dispatch({ type: SETTING, data: { settingAccreditationTabs: newValue } })
              }
            }}
          />
        </div>
        {/*  */}
        <div className="col-12 col-md-5 mb-3">
          <label>{translation('setting.hide')}{" "}{translation("accreditation.accreditationNotification")}</label>
        </div>
        <div className="col-12 col-md-7 mb-3">
          <Switch
            checked={settingAccreditationTabs.includes(`;${AccreditationNotificationKey}`) ? true : false}
            onClick={(e) => {
              if (e) {
                let newValue = `${settingAccreditationTabs};${AccreditationNotificationKey}`
                dispatch({ type: SETTING, data: { settingAccreditationTabs: newValue } })
              } else {
                let newValue = settingAccreditationTabs.replace(`;${AccreditationNotificationKey}`, "")
                dispatch({ type: SETTING, data: { settingAccreditationTabs: newValue } })
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default RestSetting
