import React, { useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ListSchedule from './listSchedule'
import ScheduleSetting from './scheduleSetting'
import ThoughtCalendar from './thoughtCalendar'
import AddBooking from "../AddBooking"
import LookSchedule from './lookSchedule'
import PendingSchedule from './pendingSchedule'
import { Tabs } from 'antd'
import { useTranslation } from 'react-i18next'
import { USER_ROLES } from 'constants/permission'

const { TabPane } = Tabs

export default function CustomerSchedule() {
  const params = useParams()
  const { t: translation } = useTranslation()
  const { search } = useLocation();
  const user = useSelector(state => state.member)
  const activeParmas = new URLSearchParams(search).get('active');

  const isAddBook = user.permissions.includes("ADD_SCHEDULE");
  const isAdmin = USER_ROLES.ADMIN === user.appUserRoleId;
  console.log(`isAddBookisAddBookisAddBookisAddBook`)
  console.log(isAddBook)
  console.log(isAdmin)
  console.log(`isAdminisAdminisAdmin`)
  return (
    <Tabs defaultActiveKey={activeParmas || "1"} destroyInactiveTabPane={true}>
      <TabPane tab={translation("listSchedules.listSchedules")} key="1">
        <ListSchedule />
      </TabPane>
      {(isAddBook || isAdmin) && (
        <TabPane tab={translation("landing.booking")} key="2">
          <AddBooking />
        </TabPane>
      )}

      {isAdmin && 
        (
          <>
            <TabPane tab={translation("thoughtCalendar.thoughtCalendar")} key="3">
              <ThoughtCalendar />
            </TabPane>
            <TabPane tab={translation("scheduleSetting.scheduleSetting")} key="4">
              <ScheduleSetting />
            </TabPane>
          </>
        )
       }
      {/* <TabPane tab={translation("pendingSchedule.pendingSchedule")} key="5">
        <PendingSchedule />
      </TabPane> */}
      <TabPane tab={translation("lookSchedule.lookSchedule")} key="6">
        <LookSchedule />
      </TabPane>
    </Tabs>
  )

}