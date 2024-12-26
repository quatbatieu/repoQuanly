
/** IMPORT COMPONENT */
import React, { useEffect , useState } from "react"
import { useSelector } from 'react-redux'
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom"
import { notification , Spin } from "antd";
import { useDispatch } from 'react-redux';

/** IMPORT PAGE */
import Layout from './components/Layout'
import Login from "./../src/Page/Login"
import LoginSuccess from "./../src/Page/Login/loginSuccess"
import FogotPassword from "Page/Login/FogotPassword";
import ForgetPass from "./../src/Page/ForgetPass"
import AddBooking from "./Page/AddBooking"
import CustomerSchedule from "./Page/Schedule"
import Documentary from './Page/Documentary'
import Accreditation from "./../src/Page/Accreditation/listAccreditation"
import AccreditationPublic from "./../src/Page/AccreditationPublic"
import ListEditAccreditation from '../src/Page/Accreditation/listEditAccreditation'
import ListReportStaistic from '../src/Page/Accreditation/listReportStatistic'
import Setting from "./../src/Page/Setting"
import InspectionProcessService from "./services/inspectionProcessService"
import LoginService from "../src/services/loginService";
import Statistical from "./Page/Statistical";
import New from "../src/Page/New"
import SMS from "./Page/SMS"
import CreateNewCustomer from "Page/Accreditation/createNewCustomer";
import TwoFAPage from "Page/Login/twoFAPage";
import SettingLandingPage from "Page/Setting/settingLandingPage";
import InspectionProcess from "Page/InspectionProcess";
import ManageRegistration from "Page/Management/ManageRegistration";
import EditBanner from "Page/Setting/editBanner";
import PublicPunish from "Page/Punish/publicPunish";
import AuthPunish from "Page/Punish/authPunish";
import ListReceipt from "Page/Receipt/listReceipt";
import CreateReceipt from "Page/Receipt/createReceipt";
import VerifyReceipt from "Page/Receipt/verifyReceipt";
import ResultReceipt from "Page/Receipt/resultReceipt";
import StatisticalAccreditation from "Page/Accreditation/StatisticalAccreditation";
import File from "Page/File";
import PhoneBook from "Page/PhoneBook";
import Question from "Page/Question/Question";
import Chat from "Page/Chat";
import LoginSSO from "Page/Login/LoginSSO";
import { USER_ROLES } from "constants/permission";
import Explaintation from "Page/ExplainPower";
import Service from 'Page/Service';
import PermissionEmployee from "Page/PermissionEmployee";
import VehicleRecordsRegistration from "Page/vehicleRecords/VehicleRecordsRegistration";
import ModalDetailVehicleRecords from "Page/vehicleRecords/ModalDetailVehicleRecords";
import CustomerRegistration from "Page/ListCustomers/CustomerRegistration";
import ReceiptRegistration from "Page/Receipt/ReceiptRegistration";
import DocumentaryList from "Page/Documentary/DocumentaryList";
import Device from "Page/Device";
import SendSMS from "Page/SMS/SendSMS";

/** IMPORT CONSTANT */
import { INIT } from "constants/introduction";
import { SETTING } from './constants/setting'

/** IMPORT STYLE */
import 'antd/dist/antd.css';
import "./assets/scss/index.scss";
import EditReceipt from "Page/Receipt/editReceipt";
import addKeyLocalStorage from "helper/localStorage";
import { PRIVILEGED_ACCOUNT_USING_NEWS } from "constants/account";
import DocumentaryRealTimeEvent from "components/DocumentaryRealTimeEvent/DocumentaryRealTimeEvent";
import MqttConnection from "components/mqttConnection/mqttConnection";
import ModalDetailBooking from "Page/AddBooking/ModalDetailBooking";
import { setMetaData } from "actions";
import ListSchedulesService from "services/listSchedulesService";
import { MOBILE_APP_PERMISSION_TYPE } from "constants/app";
// import { onMessage , getMessaging , isSupported } from "firebase/messaging";
// import { firebaseConfig } from "firebase/messaging_init_in_sw";
// import { initializeApp } from "firebase/app";

export const privilegedRouter = {
  news: {
    path: "/news",
    component: New,
    permissionName: "MANAGE_NEWS",
    isAuth: true,
    props: {
      isShowHeader: true,
      isShowFooter: false,
      isShowMenu: true,
      isHeaderTextOnly: false // chỉ hiển thị logo ở center
    }
  }
}
export const routes = {
  login: {
    path: "/login",
    component: Login,
    isAuth: false,
    permissionName: "MASTER",
    props: {
      isShowHeader: true,
      isShowFooter: false,
      isShowMenu: false,
      isHeaderTextOnly: true // chỉ hiển thị logo ở center
    }
  },
  loginSuccess: {
    path: "/login-success",
    component: LoginSuccess,
    isAuth: false,
    permissionName: "MASTER",
    props: {
      isShowHeader: true,
      isShowFooter: false,
      isShowMenu: false,
      isHeaderTextOnly: true // chỉ hiển thị logo ở center
    }
  },
  fogotPassword: {
    path: "/fogot-password",
    component: FogotPassword,
    isAuth: false,
    permissionName: "MASTER",
    props: {
      isShowHeader: true,
      isShowFooter: false,
      isShowMenu: false,
      isHeaderTextOnly: true // chỉ hiển thị logo ở center
    }
  },
  LoginSSO: {
    path: "/loginSSO",
    component: LoginSSO,
    isAuth: false,
    permissionName: "MASTER",
    props: {
      isShowHeader: true,
      isShowFooter: false,
      isShowMenu: true,
      isHeaderTextOnly: false // chỉ hiển thị logo ở center
    }
  },
  twoFAPage: {
    path: "/verifying-user",
    component: TwoFAPage,
    permissionName: "MASTER",
    isAuth: false,
    props: {
      isShowHeader: true,
      isShowFooter: true,
      isShowMenu: true,
      isHeaderTextOnly: false // chỉ hiển thị logo ở center
    }
  },
  forgotPass: {
    path: "/forgot-password",
    component: ForgetPass,
    permissionName: "MASTER",
    isAuth: false,
    props: {
      isShowHeader: true,
      isShowFooter: true,
      isShowMenu: true,
      isHeaderTextOnly: false // chỉ hiển thị logo ở center
    }
  },
  bookingSchedule: {
    path: "/booking-schedule",
    component: AddBooking,
    permissionName: "MASTER",
    isAuth: true,
    props: {
      isShowHeader: true,
      isShowFooter: true,
      isShowMenu: true,
      isHeaderTextOnly: false // chỉ hiển thị logo ở center
    }
  },
  customerScheduleItem: {
    path: '/schedules/:id',
    component: ModalDetailBooking,
    permissionName: "MANAGE_SCHEDULE",
    isAuth: true,
    props: {
      isShowHeader: true,
      isShowFooter: false,
      isShowMenu: true,
      isHeaderTextOnly: false // chỉ hiển thị logo ở center
    }
  },
  customerSchedule: {
    path: '/schedules',
    component: CustomerSchedule,
    permissionName: "MANAGE_SCHEDULE",
    isAuth: true,
    props: {
      isShowHeader: true,
      isShowFooter: false,
      isShowMenu: true,
      isHeaderTextOnly: false // chỉ hiển thị logo ở center
    }
  },
  service: {
    path: '/service',
    component: Service,
    permissionName: "MANAGE_SERVICE",
    isAuth: true,
    props: {
      isShowHeader: true,
      isShowFooter: false,
      isShowMenu: true,
      isHeaderTextOnly: false // chỉ hiển thị logo ở center
    }
  },
  listCustomer: {
    path: '/list-customers',
    component: CustomerRegistration,
    permissionName: "MANAGE_CUSTOMER",
    isAuth: true,
    props: {
      isShowHeader: true,
      isShowFooter: false,
      isShowMenu: true,
      isHeaderTextOnly: false // chỉ hiển thị logo ở center
    }
  },
  question: {
    path: '/question',
    component: Question,
    permissionName: "MANAGE_GUIDE",
    isAuth: true,
    props: {
      isShowHeader: true,
      isShowFooter: false,
      isShowMenu: true,
      isHeaderTextOnly: false // chỉ hiển thị logo ở center
    }
  },
  listDetailAccreditation: {
    path: "/list-detail-accreditation",
    component: ListEditAccreditation,
    permissionName: "MANAGE_RECORD",
    isAuth: true,
    props: {
      isShowHeader: true,
      isShowFooter: false,
      isShowMenu: true,
      isHeaderTextOnly: false // chỉ hiển thị logo ở center
    }
  },
  listReportlAccreditation: {
    path: "/list-report-accreditation",
    component: ListReportStaistic,
    permissionName: "MANAGE_RECORD",
    isAuth: true,
    props: {
      isShowHeader: true,
      isShowFooter: false,
      isShowMenu: true,
      isHeaderTextOnly: false // chỉ hiển thị logo ở center
    }
  },
  accreditation: {
    path: "/accreditation",
    component: Accreditation,
    permissionName: "MANAGE_RECORD",
    isAuth: true,
    props: {
      isShowHeader: true,
      isShowFooter: false,
      isShowMenu: true,
      isHeaderTextOnly: false // chỉ hiển thị logo ở center
    }
  },
  setting: {
    path: "/setting",
    component: Setting,
    permissionName: "MANAGE_SETTINGS",
    isAuth: true,
    props: {
      isShowHeader: true,
      isShowFooter: false,
      isShowMenu: true,
      isHeaderTextOnly: false, // chỉ hiển thị logo ở center,
      permissions:[MOBILE_APP_PERMISSION_TYPE.CAMERA] // Yêu cầu quyền truy cập camera ở mobile khi vào trang

    }
  },
  statistical: {
    path: "/statistical",
    permissionName: "MANAGE_STATISTICAL",
    isAuth: true,
    component: Statistical,
    props: {
      isShowHeader: true,
      isShowFooter: false,
      isShowMenu: true,
      isHeaderTextOnly: false // chỉ hiển thị logo ở center
    }
  },
  documentary: {
    path: "/documentary",
    permissionName: "MANAGE_DOCMENTARY",
    isAuth: true,
    component: Documentary,
    props: {
      isShowHeader: true,
      isShowFooter: false,
      isShowMenu: true,
      isHeaderTextOnly: false, // chỉ hiển thị logo ở center
      permissions:[MOBILE_APP_PERMISSION_TYPE.CAMERA] // Yêu cầu quyền truy cập camera ở mobile khi vào trang
    }
  },
  file: {
    path: "/file",
    permissionName: "MANAGE_FILE",
    isAuth: true,
    component: File,
    props: {
      isShowHeader: true,
      isShowFooter: false,
      isShowMenu: true,
      isHeaderTextOnly: false // chỉ hiển thị logo ở center
    }
  },
  phonebook: {
    path: "/phonebook",
    permissionName: "MANAGE_PHONEBOOK",
    isAuth: true,
    component: PhoneBook,
    props: {
      isShowHeader: true,
      isShowFooter: false,
      isShowMenu: true,
      isHeaderTextOnly: false // chỉ hiển thị logo ở center
    }
  },
  vehicleRecordsDetail: {
    path: "/vehicleRecords/:id",
    permissionName: "MANAGE_VEHICLE_RECORD",
    isAuth: true,
    component: ModalDetailVehicleRecords,
    props: {
      isShowHeader: true,
      isShowFooter: false,
      isShowMenu: true,
      isHeaderTextOnly: false // chỉ hiển thị logo ở center
    }
  },
  vehicleRecords: {
    path: "/vehicleRecords",
    permissionName: "MANAGE_VEHICLE_RECORD",
    isAuth: true,
    component: VehicleRecordsRegistration,
    props: {
      isShowHeader: true,
      isShowFooter: false,
      isShowMenu: true,
      isHeaderTextOnly: false, // chỉ hiển thị logo ở center
      permissions:[MOBILE_APP_PERMISSION_TYPE.CAMERA] // Yêu cầu quyền truy cập camera ở mobile khi vào trang
    }
  },
  explain: {
    path: "/explain-power",
    permissionName: "MASTER",
    isAuth: true,
    component: Explaintation,
    props: {
      isShowHeader: true,
      isShowFooter: false,
      isShowMenu: true,
      isHeaderTextOnly: false // chỉ hiển thị logo ở center
    }
  },
  // employee: {
  //   path: "/permission-employee",
  //   permissionName: "MASTER",
  //   isAuth: true,
  //   component: PermissionEmployee,
  //   props: {
  //     isShowHeader: true,
  //     isShowFooter: false,
  //     isShowMenu: true,
  //     isHeaderTextOnly: false // chỉ hiển thị logo ở center
  //   }
  // },
  createCustomer: {
    path: "/create-customer",
    permissionName: "MANAGE_RECORD",
    isAuth: true,
    component: CreateNewCustomer,
    props: {
      isShowHeader: true,
      isShowFooter: false,
      isShowMenu: true,
      isHeaderTextOnly: false // chỉ hiển thị logo ở center
    }
  },
  inspectionProcess: {
    path: "/inspection-process",
    permissionName: "MANAGE_RECORD",
    isAuth: true,
    component: InspectionProcess,
    props: {
      isShowHeader: true,
      isShowFooter: false,
      isShowMenu: true,
      isHeaderTextOnly: false // chỉ hiển thị logo ở center
    }
  },
  management: {
    path: "/management",
    permissionName: "MANAGE_APP_USER",
    isAuth: true,
    component: ManageRegistration,
    props: {
      isShowHeader: true,
      isShowFooter: false,
      isShowMenu: true,
      isHeaderTextOnly: false // chỉ hiển thị logo ở center
    }
  },
  punishPublic: {
    path: '/public-punish',
    permissionName: "MASTER",
    isAuth: false,
    component: PublicPunish,
    props: {
      isShowHeader: true,
      isShowFooter: true,
      isShowMenu: true,
      isHeaderTextOnly: true // chỉ hiển thị logo ở center
    }
  },
  punishAuth: {
    path: "/auth-punish",
    permissionName: "MANAGE_RECORD",
    isAuth: true,
    component: AuthPunish,
    props: {
      isShowHeader: true,
      isShowFooter: false,
      isShowMenu: true,
      isHeaderTextOnly: false // chỉ hiển thị logo ở center
    }
  }, 
  sendSMS: {
    path: "/sms/sendSMS",
    permissionName: "MANAGE_SMS",
    isAuth: true,
    component: SendSMS,
    props: {
      isShowHeader: true,
      isShowFooter: false,
      isShowMenu: true,
      isHeaderTextOnly: false // chỉ hiển thị logo ở center
    }
  },
  sms: {
    path: "/sms",
    permissionName: "MANAGE_SMS",
    isAuth: true,
    component: SMS,
    props: {
      isShowHeader: true,
      isShowFooter: false,
      isShowMenu: true,
      isHeaderTextOnly: false // chỉ hiển thị logo ở center
    }
  },
  chat: {
    path: "/chat",
    permissionName: "MANAGE_CHAT",
    isAuth: true,
    component: Chat,
    props: {
      isShowHeader: true,
      isShowFooter: false,
      isShowMenu: true,
      isHeaderTextOnly: false // chỉ hiển thị logo ở center
    }
  },
  statisticalAccreditation: {
    path: "/statistical-accreditation",
    permissionName: "MANAGE_RECORD",
    isAuth: true,
    props: {
      isShowHeader: true,
      isShowFooter: false,
      isShowMenu: true,
      isHeaderTextOnly: false
    },
    component: StatisticalAccreditation
  },
  receipt: {
    path: "/receipt",
    permissionName: "MANAGE_BILLING",
    isAuth: true,
    component: ReceiptRegistration,
    props: {
      isShowHeader: true,
      isShowFooter: false,
      isShowMenu: true,
      isHeaderTextOnly: false // chỉ hiển thị logo ở center
    }
  },
  device: {
    path: "/device",
    permissionName: "MASTER",
    isAuth: true,
    component: Device,
    props: {
      isShowHeader: true,
      isShowFooter: false,
      isShowMenu: true,
      isHeaderTextOnly: false // chỉ hiển thị logo ở center
    }
  },
  verifyReceipt: {
    path: "/verify-receipt",
    permissionName: "MASTER",
    isAuth: true,
    props: {
      isShowHeader: true,
      isShowFooter: true,
      isShowMenu: false,
      isHeaderTextOnly: true
    },
    component: VerifyReceipt
  },
  resultReceipt: {
    path: "/result-receipt",
    permissionName: "MASTER",
    isAuth: true,
    props: {
      isShowHeader: true,
      isShowFooter: true,
      isShowMenu: false,
      isHeaderTextOnly: true
    },
    component: ResultReceipt
  },
  // landingPage: {
  //   path: "/",
  //   isAuth: false,
  //   props: {
  //     isShowHeader: true,
  //     isShowFooter: true,
  //     isShowMenu: true,
  //     isHeaderTextOnly: false
  //   },
  //   component: LandingPage
  // },
  editBanner: {
    path: "/edit-banner",
    permissionName: "MASTER",
    isAuth: true,
    props: {
      isShowHeader: false,
      isShowFooter: false,
      isShowMenu: false,
      isHeaderTextOnly: false
    },
    component: EditBanner
  },
  accreditationPublic: {
    path: "/accreditation-public",
    permissionName: "MASTER",
    isAuth: false,
    props: {
      isShowHeader: true,
      isShowFooter: false,
      isShowMenu: false,
      isHeaderTextOnly: true
    },
    component: AccreditationPublic
  },
  editLandingPage: {
    path: "/edit-landing-page",
    permissionName: "MASTER",
    isAuth: false,
    props: {
      isShowHeader: false,
      isShowFooter: false,
      isShowMenu: false,
      isHeaderTextOnly: false
    },
    component: SettingLandingPage
  }
}

function renderRoutes(permission, roleId, username) {
  const routerNoLogin = {
    fogotPassword: routes.fogotPassword,
    login: routes.login,
    twoFAPage: routes.twoFAPage,
    LoginSSO : routes.LoginSSO
  }
  const routePublic = {
    accreditationPublic: routes.accreditationPublic,
    LoginSSO : routes.LoginSSO
  }

  const routePrivileged = { news: privilegedRouter.news };

  let render = {
    login: routes.login,
    twoFAPage: routes.twoFAPage,
    punishPublic: routes.punishPublic,
    bookingSchedule: routes.bookingSchedule,
    statistical: routes.statistical,
    landingPage: routes.landingPage,
  }

  // gộp chung 2 router với nhau
  if (username !== PRIVILEGED_ACCOUNT_USING_NEWS || roleId === 1) {
    return {
      ...routes,
      ...routePrivileged,
      home: routes.accreditation
    }
  }

  // admin rights
  if (roleId === 1) return {
    ...routes,
    home: routes.accreditation
  }

  // No login
  if (!permission && !username) {
    localStorage.removeItem(addKeyLocalStorage("isUserLoggedIn"))
    localStorage.removeItem(addKeyLocalStorage("data"))
    return routerNoLogin;
  }

  render = { ...routePublic }

  // rights other than admin and has special rights to news
  if (username === PRIVILEGED_ACCOUNT_USING_NEWS) {
    render = { ...render, ...routePrivileged }
  }

  render.home = undefined
  Object.entries(routes).forEach(([key, value]) => {
    if (permission.includes(value.permissionName)) {
      render[key] = routes[key]
      render.home = routes[key]
    }
  })
  render.home = render.accreditation || render.home;
  return render;
}

const filterRoutes = (originalRoutes, config) => {
  const newRoutes = { ...originalRoutes }; // Sao chép đối tượng để không làm thay đổi đối tượng ban đầu

  Object.keys(config).forEach(key => {
    if (!config[key].show) {
      config[key].allowRouter.forEach(routePath => {
        Object.keys(newRoutes).forEach(routeKey => {
          if (newRoutes[routeKey].path === routePath) {
            delete newRoutes[routeKey]; // Loại bỏ router khỏi đối tượng
          }
        });
      });
    }
  });

  return newRoutes;
};

function App() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.member)
  const setting = useSelector((state) => state.setting);
  const [isLoading , setIsLoading] = useState(true);
  const { isUserLoggedIn, permissions, appUserRoleId, username } = user
  const stationsColorset = useSelector((state) => state.setting ? state.setting.stationsColorset : "")
  const configIntegrated = {
    messages: {
      // show: !!setting.enableMarketingMessages,
      show: true,
      allowRouter: [routes.sms.path]
    },
    receipt: {
      show: !!setting.enableInvoiceMenu,
      allowRouter: [routes.receipt.path , routes.verifyReceipt.path , routes.resultReceipt.path]
    }
  };

  let mainRoutes = renderRoutes(permissions, appUserRoleId, user.username);
  mainRoutes = filterRoutes(mainRoutes, configIntegrated);
  const themeApp=process.env.REACT_APP_THEME_NAME
  const setThemeApp=()=>{
    document.querySelector('body').setAttribute('data-theme',themeApp)
  }
  useEffect(() => {
    setThemeApp()
    console.log("version web", process.env.REACT_APP_BUILD_VERSION)
  }, [])
  useEffect(() => {
    const DOMAIN = window.origin.split('://')[1]
    setIsLoading(true);
    if (user.stationsId) {
      InspectionProcessService.getDetailById({ id: user.stationsId }).then(result => {
        if (result) {
          dispatch({ type: SETTING, data: result })
        }
        setIsLoading(false);
      })
    } else {
      const DOMAIN = window.origin.split('://')[1]
      setIsLoading(false);
    }
  }, [user.stationsId])

  notification.config({
    closeIcon: () => { },
    duration: 5
  })

  const handleEventFireBaseMessage =  async () => {
    // Kiểm tra trình duyệt hỗ trợ FireBase Message
    const hasFirebaseMessagingSupport = false //await isSupported();
    if (hasFirebaseMessagingSupport) { 
      const app = {} // initializeApp(firebaseConfig);
      const messaging =  {} // getMessaging(app);

      // onMessage(messaging, (payload) => {
      //   if ('serviceWorker' in navigator) {
      //     navigator.serviceWorker.register('../firebase-messaging-sw.js')
      //       .then(function (registration) {
      //         const notificationTitle = payload.notification.title;
      //         const notificationOptions = {
      //           body: payload.notification.body,
      //           icon: payload.notification.image,
      //         };

      //         registration.showNotification(notificationTitle, notificationOptions);
      //       }).catch(function (err) {
      //         console.log('Service worker registration failed, error:', err);
      //       });
      //   }

      // });
    }
  }
  useEffect(() => {
    handleEventFireBaseMessage();
    fetchListMetaData()
  }, [])

  if(isLoading) {
    return <Spin />
  }

  function fetchListMetaData() {
    ListSchedulesService.getMetaData({}).then(result => {
      if (result)
      dispatch(setMetaData(result))
    })
  }
  
  return (
    <div className={stationsColorset}>
      <DocumentaryRealTimeEvent isAdmin={appUserRoleId === USER_ROLES.ADMIN} />
      <MqttConnection />
      <Router>
        <Switch>

          {Object.keys(mainRoutes).map((key, index) => {
            return <Route key={index} extract path={mainRoutes[key].path} component={(props) => <Layout  {...mainRoutes[key].props} {...props} Component={mainRoutes[key].component} isAuth={mainRoutes[key].isAuth} />} />
          })}

          {(!user || !isUserLoggedIn) ? (
            <Route path="*" component={props => (
              <Redirect to="/login" />
            )}
            />
          ) : (
            <Route path='/' exact component={(props) => <Layout  {...props} {...mainRoutes.home.props} Component={mainRoutes.home.component} isAuth={true} />} />
          )}

          <Route path="*" component={props => (
            <Redirect to="/" />
          )}
          />
        </Switch>
      </Router>

    </div>
  );
}

export default App