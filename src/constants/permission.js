import {DeploymentUnitOutlined , FileTextOutlined , DesktopOutlined , BranchesOutlined , CarOutlined , MoneyCollectOutlined , FileOutlined , ApartmentOutlined, CalendarOutlined, ContainerOutlined, DatabaseOutlined, FileSearchOutlined , WechatOutlined, InsertRowBelowOutlined, MessageOutlined, QrcodeOutlined, SettingOutlined, UserOutlined , QuestionCircleOutlined,TeamOutlined } from "@ant-design/icons"
import { routes , privilegedRouter } from "App"
import React from "react"

import { PRIVILEGED_ACCOUNT_USING_NEWS } from "./account"

export const PERMISSION_CHAT = "MANAGE_CHAT";
export const PERMISSION_NEW = "MANAGE_NEWS";

const privilegedRoutes = (translation) => {
  return {
    news: {
      name: translation('header.new'),
      href: privilegedRouter.news.path,
      isNoHref: false,
      icon: <ContainerOutlined />,
      permissionName: privilegedRouter.news.permissionName,
      routerChildren: []
    }
  }
}

const staticRoutes = (translation) => {
  let listHeader = [
    {
      name: translation("header.accreditation"),
      href: routes.accreditation.path,
      icon: <InsertRowBelowOutlined />,
      permissionName : routes.accreditation.permissionName,
      routerChildren: ["/list-detail-accreditation", "/inspection-process",
        "/create-customer", "/statistical-accreditation" , "/"]
    },
    {
      name: translation('header.customers'),
      href: routes.listCustomer.path,
      icon: <UserOutlined />,
      permissionName : routes.listCustomer.permissionName,
      routerChildren: []
    },
    {
      name: translation("listCustomers.message"),
      href: routes.sms.path,
      icon: <MessageOutlined />,
      permissionName : routes.sms.permissionName,
      routerChildren: []
    },
    {
      name: translation('header.schedule'),
      href: routes.customerSchedule.path,
      icon: <CalendarOutlined />,
      permissionName : routes.customerSchedule.permissionName,
      routerChildren: []
    },
    {
      name: translation('header.receipt'),
      href: routes.receipt.path,
      icon: <FileTextOutlined />,
      permissionName : routes.receipt.permissionName,
      routerChildren: []
    },
    {
      name: translation("header.documentary"),
      href: routes.documentary.path,
      icon: <ContainerOutlined />,
      permissionName : routes.documentary.permissionName,
      routerChildren: []
    },
    {
      name: translation('header.device'),
      href: routes.device.path,
      icon: <DesktopOutlined />,
      permissionName : routes.device.permissionName,
      routerChildren: []
    },
    {
      name: translation('header.management'),
      href: routes.management.path,
      icon: <DatabaseOutlined />,
      permissionName : routes.management.permissionName,
      routerChildren: []
    },
    // {
    //   name: translation('header.establish'),
    //   href: routes.setting.path,
    //   icon: <SettingOutlined />,
    //   permissionName : routes.setting.permissionName,
    //   routerChildren: []
    // },
    // {
    //   name: translation("header.guide"),
    //   href: routes.question.path,
    //   icon: <QuestionCircleOutlined />,
    //   permissionName : routes.question.permissionName,
    //   routerChildren: []
    // },
    // {
    //   name: translation("listCustomers.statistical"),
    //   href: routes.statistical.path,
    //   icon: <BarChartOutlined />,
    //   permissionName : routes.statistical.permissionName,
    //   routerChildren: []
    // },
    // {
    //   name: translation('header.phonebook'),
    //   href: routes.phonebook.path,
    //   icon: <TeamOutlined />,
    //   permissionName : routes.file.permissionName,
    //   routerChildren: []
    // },
    // {
    //   name: translation('header.file'),
    //   href: routes.file.path,
    //   icon: <FileOutlined />,
    //   permissionName : routes.file.permissionName,
    //   routerChildren: []
    // },
    {
      name: translation('header.vehicleRecords'),
      href: routes.vehicleRecords.path,
      icon: <CarOutlined  />,
      permissionName : routes.vehicleRecords.permissionName,
      routerChildren: []
    },
    // {
    //   name: translation('header.integrated'),
    //   href: routes.integrated.path,
    //   icon: <BranchesOutlined />,
    //   permissionName : routes.integrated.permissionName,
    //   routerChildren: []
    // },
    // {
    //   name: translation('header.service'),
    //   href: routes.service.path,
    //   icon: <MoneyCollectOutlined />,
    //   permissionName : routes.service.permissionName,
    //   routerChildren: []
    //  },
    //  {
    //   name: translation('header.permission_employee'),
    //   href: routes.employee.path,
    //   icon: <DeploymentUnitOutlined />,
    //   permissionName : routes.explain.permissionName,
    //   routerChildren: []
    // },
  ]

  // if (parseInt(process.env.REACT_APP_HIDE_PAYMENT) !== 1) {
  //   listHeader.push({
  //     name: translation("receipt.receipt"),
  //     href: routes.receipt.path,
  //     icon: <FileSearchOutlined />,
  //     routerChildren: []
  //   })
  // }
  // listHeader.push({
  //   name: translation("qrCode"),
  //   href: routes.listQR.path,
  //   icon: <QrcodeOutlined />
  // })
  return listHeader
}

export const LIST_PERMISSION = {
  MANAGE_CUSTOMER: "MANAGE_CUSTOMER",
  MANAGE_RECORD: "MANAGE_RECORD",
  MANAGE_APP_USER: "MANAGE_APP_USER",
  MANAGE_SETTINGS: "MANAGE_SETTINGS",
  MANAGE_SCHEDULE: "MANAGE_SCHEDULE",
  MANAGE_NEWS: "MANAGE_NEWS",
  MANAGER_SMS: "MANAGER_SMS",
  MANAGE_DOCMENTARY : "MANAGE_DOCMENTARY" , 
  MANAGE_GUIDE : "MANAGE_GUIDE",
  MANAGE_BILLING : "MANAGE_BILLING",
}

export const renderRoutes = (translation, permission, roleId , username) => {
  const ALL_ROUTES = staticRoutes(translation)
  //.filter(item => permission?.split(",").some(i => i === item.permissionName || item.permissionName == "MASTER"));
  const privilegedroute = [privilegedRoutes(translation).news];

  // admin rights have special rights to news
  if(username !== PRIVILEGED_ACCOUNT_USING_NEWS || roleId === 1) {
    return [...ALL_ROUTES , ...privilegedroute]
  }

  // admin rights
  if (roleId === 1) return ALL_ROUTES;

  // No login
  if (!permission) return []
  // rights other than admin and has special rights to news
  if(username === PRIVILEGED_ACCOUNT_USING_NEWS) {
    return [...ALL_ROUTES.filter(item => permission.split(",").some(i => i === item.permissionName)) , ...privilegedroute];
  }

  return ALL_ROUTES.filter(item => permission.split(",").some(i => i === item.permissionName));
}

export const USER_ROLES = {
  ADMIN : 1,
  VEHICLE_INSPECTOR: 2,
  SENIOR_VEHICLE_INSPECTOR: 3,
  PROFESSIONAL_STAFF : 6
} 