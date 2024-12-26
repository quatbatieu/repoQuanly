import React, { useEffect, useState } from 'react'
import ListSMS from './listSMS'
import StatisticalSMS from './statisticalSMS'
import { Tabs } from 'antd'
import { useTranslation } from 'react-i18next'

const { TabPane } = Tabs

const LIST_SMS_KEY = "#list"
const STATISTICAL = "#statistical"

const SMS = () => {
  const [activeKey, setActiveKey] = useState(LIST_SMS_KEY)
  const { t: translation } = useTranslation()

  useEffect(() => {
    if (window.location.hash) {
      if (window.location.hash !== activeKey) {
        setActiveKey(window.location.hash)
      }
    } else {
      if (activeKey !== LIST_SMS_KEY) {
        setActiveKey(LIST_SMS_KEY)
      }
    }
  }, [window.location.hash])

  return (
    <Tabs
      activeKey={activeKey}
      onChange={(key) => {
        setActiveKey(key)
        window.location.hash = key
      }}
    >
      <TabPane tab={translation("sms.tab.list")} key={LIST_SMS_KEY}>
        <ListSMS />
      </TabPane>
      <TabPane tab={translation("listCustomers.statistical")} key={STATISTICAL}>
        <StatisticalSMS />
      </TabPane>
    </Tabs>
  )
}

export default SMS
