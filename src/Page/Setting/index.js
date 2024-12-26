import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next'
import './setting.scss'
import { useDispatch } from 'react-redux';
import { SETTING } from './../../constants/setting'
import { useSelector } from 'react-redux'
import InspectionProcessService from "./../../services/inspectionProcessService"
import {
  Tabs
} from 'antd';
import _ from 'lodash';
import SettingGeneral from './general';
import SettingWeb from './web';
import RestSetting from './restSetting';
import PaymentSetting from './PaymentSetting';
import ServiceSetting from './ServiceSetting';
import ExpandSetting from './ExpandSetting';
import MiniApp from './MiniApp';
import Webhooks from './Webhooks';

const SETTING_GENERAL = 'SETTING_GENERAL'
const SETTING_WEB = 'SETTING_WEB'
const SETTING_PAYMENT = 'SETTING_PAYMENT'
const SETTING_SERVICE = "SETTING_SERVICE"
const SETTING_EXPAND = "SETTING_EXPAND"
const SETTING_EXPAND_MINIAPP = "SETTING_EXPAND_MINIAPP"
const SETTING_EXPAND_WEBHOOKS = "SETTING_EXPAND_WEBHOOKS"
const SETTING_REST = "SETTING_REST"
function Setting() {
  const { t: translation } = useTranslation()
  const user = useSelector((state) => state.member)
  const dispatch = useDispatch()
  const hashValue = window.location.hash;
  const [loading, setLoading] = useState(false)
  const [activeKey, setActiveKey] = useState(hashValue.slice(1) || SETTING_GENERAL)

  return (
    <>
      <main
        style={{
          cursor: loading ? 'progress' : 'default'
        }}
      >
        <Tabs
          activeKey={activeKey}
          onChange={key => {
            setActiveKey(key)
            window.location.hash = key
          }}
          destroyInactiveTabPane={true}
        >
          <Tabs.TabPane tab={translation('setting.generalInfo')} key={SETTING_GENERAL}>
            <SettingGeneral />
          </Tabs.TabPane>
          {/* <Tabs.TabPane tab={translation('setting.payment.payment')} key={SETTING_PAYMENT}>
            <PaymentSetting
              setLoading={setLoading}
            />
          </Tabs.TabPane> */}
          <Tabs.TabPane tab={translation('setting.service.service')} key={SETTING_SERVICE}>
            <ServiceSetting
              setLoading={setLoading}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab={translation('setting.service.expand')} key={SETTING_EXPAND}>
            <ExpandSetting
              setLoading={setLoading}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab={translation('setting.service.miniApp')} key={SETTING_EXPAND_MINIAPP}>
            <MiniApp />
          </Tabs.TabPane>
          <Tabs.TabPane tab={translation('setting.service.webhooks')} key={SETTING_EXPAND_WEBHOOKS}>
            <Webhooks />
          </Tabs.TabPane>
          {/* <Tabs.TabPane tab={translation('setting.rest')} key={SETTING_REST}>
            <RestSetting />
          </Tabs.TabPane> */}
        </Tabs>
      </main>
    </>
  )
}
export default Setting;