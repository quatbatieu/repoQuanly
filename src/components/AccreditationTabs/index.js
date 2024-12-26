import { Tabs } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import {
  AccreditationNotificationKey,
  InspectionProcessKey,
  CreateNewCustomerKey,
  ListEditAccreditationKey,
  ListAccreditationKey,
  AccreditationStatisticalKey,
  ListReportStaistic
} from 'constants/accreditationTabs';
import { routes } from 'App';
import NotPermission from 'components/NotPermission/NotPermission';
const { TabPane } = Tabs

const AccreditationTabs = ({
  onChangeTabs,
  ListAccreditation,
  activeKey,
  ListEditAccreditation,
  InspectionProcess,
  CreateNewCustomer,
  AccreditationNotification,
  AccreditationStatistical,
  ListReportStatistic
}) => {
  const { t: translation } = useTranslation()
  const setting = useSelector(state => state.setting)
  const user = useSelector((state) => state.member)
  const { permissions } = user
  const settingAccreditationTabs = setting.settingAccreditationTabs || ""

  const isShow = permissions.includes(routes.accreditation.permissionName);
  if(!isShow) {
    return <div />
  }

  function isHiddenTabs(value) {
    if (settingAccreditationTabs.includes(value)) {
      return true
    }
    return false
  }

  return (
    <Tabs activeKey={activeKey} onChange={onChangeTabs} >
      <TabPane tab={translation("accreditation.title")} key={ListAccreditationKey}>
        {(ListAccreditation && !isHiddenTabs(ListAccreditationKey)) && <ListAccreditation />}
      </TabPane>
      {
        !isHiddenTabs(ListEditAccreditationKey) &&
        <TabPane tab={translation("accreditation.list")} key={ListEditAccreditationKey}>
          {ListEditAccreditation && <ListEditAccreditation />}
        </TabPane>
      }
      {!isHiddenTabs(InspectionProcessKey) &&
        <TabPane tab={translation('header.inspectionProcess')} key={InspectionProcessKey}>
          {InspectionProcess && <InspectionProcess />}
        </TabPane>
      }
      {!isHiddenTabs(AccreditationNotificationKey) &&
        <TabPane tab={translation("accreditation.accreditationNotification")} key={AccreditationNotificationKey}>
          {
            AccreditationNotification && <AccreditationNotification />
          }
        </TabPane>
      }
      {!isHiddenTabs(AccreditationStatisticalKey) &&
        <TabPane tab={translation("listCustomers.statistical")} key={AccreditationStatisticalKey}>
          {
            AccreditationStatistical && <AccreditationStatistical />
          }
        </TabPane>
      }
      {!isHiddenTabs(ListReportStaistic) &&
        <TabPane tab={translation("accreditation.statistic")} key={ListReportStaistic}>
          {
            ListReportStatistic && <ListReportStatistic />
          }
        </TabPane>
      }
    </Tabs>
  )
}

export default AccreditationTabs
