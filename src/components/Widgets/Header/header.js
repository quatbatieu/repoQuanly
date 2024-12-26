import React, { useState , useEffect} from 'react'
import { useLocation } from 'react-router-dom';
import {
  Dropdown,
  Space,
  Menu,
  Button,
  Switch,
  Form,
  notification,
  Badge,
  Drawer,
  Modal,
  Input
} from "antd"
import { LogoutOutlined, RadarChartOutlined, SwapOutlined, CaretDownOutlined, MessageOutlined, BellOutlined , MenuOutlined, SettingOutlined,QuestionCircleOutlined,TeamOutlined} from '@ant-design/icons'

import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { renderRoutes } from "constants/permission";
import SettingService from '../../../services/settingService';
import ReactCodeInput from 'react-code-input';
import LoginService from '../../../services/loginService'
import ChatRealTImeEvent from './ChatRealTImeEvent';

import { handleSignout } from "../../../actions";
import { HOST } from '../../../constants/url';
import { routes } from "App"
import { USER_DETAILS_UPDATE } from '../../../constants/member';
import { LIST_PERMISSION } from '../../../constants/permission';
import StationIntroduceService from 'services/stationIntroduceService';
import "./header.scss"
import themeIcons from 'assets/Theme';
import { useModalDirectLinkContext } from 'components/ModalDirectLink';

const HeaderAction = ({ Icon, path, notification, count = 1, link }) => {
  const { setUrlForModalDirectLink } = useModalDirectLinkContext();

  const history = useHistory();
  const handleClick = () =>{
    if(path !== undefined){
      history.push(path)
    } else {
      setUrlForModalDirectLink(link)
    }
  }
  return (
    <div className='header__action__item' onClick={() => handleClick()}>
      {notification ?
        <Badge
          count={
            <div className='header__badge__box'>

            </div>
          }
          offset={[-3, 6]}
          className="header__action__badge"
        >
          <Icon />
        </Badge> :
        <Icon />
      }
    </div>
  )
}

function Header({
  userData, isHeaderTextOnly,
  isAuth
}) {
  const { t: translate } = useTranslation()
  const history = useHistory()
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector(state => state.member)
  const setting = useSelector(state => state.setting);
  const { notification } = useSelector(state => state.chat);
  const path = location.pathname;
  const isShowRealTimeChat = path !== "/chat" && user.isUserLoggedIn;
  const permissionSetting = LIST_PERMISSION.MANAGE_SETTINGS;
  let isCheckedSetting =user?.permissions?.indexOf(permissionSetting) > -1
  const permissionGuide = LIST_PERMISSION.MANAGE_GUIDE;
  let isCheckedGuide =user?.permissions?.indexOf(permissionGuide) > -1 
  const [isOpenModalChangePassword, setIsOpenModalChangePassword] = useState(false)
  const [isOpenModal2FA, setIsOpenModal2FA] = useState(false)
  const [listLinkCSKH, setListLinkCSKH] = useState({});
  const { permissions, appUserRoleId, username } = useSelector(
    (state) => state.member
  );

  const configIntegrated = {
    messages: {
      show: true,
      allowRouter: [routes.sms.path]
    },
    receipt: {
      show: !!setting.enablePaymentGateway,
      allowRouter: [routes.receipt.path]
    }
  };

  const filterRoutes = (originalRoutes, config) => {
    let newRoutes = [...originalRoutes];
  
    Object.keys(config).forEach(key => {
      if (!config[key].show) {
        config[key].allowRouter.forEach(routePath => {
          newRoutes = newRoutes.filter(route => {
            return route.href !== routePath;
          });
        });
      }
    });
  
    return newRoutes;
  };

  let permisstionRoute = renderRoutes(
    translate,
    permissions,
    appUserRoleId,
    username
  );

  permisstionRoute = filterRoutes(permisstionRoute ,configIntegrated)
  const FEATURE = {
    login: [
      {
        name: translate("header.makeAnAppointment"),
        href: routes.bookingSchedule.path,
      },
    ],
    home: permisstionRoute,
  };

  const _onClick = (href) => {
    history.push(href);
  };
  const gitbook = () => {
    window.location =
      "https://ttdk-organization.gitbook.io/huong-dan-quan-ly-trung-tam/";
  };

  const getMenu = (styleWidth) => {
    return (
        <Menu style={{ width: styleWidth || "175px" }}>
          {!isAuth && !username
                ? FEATURE.login.map((item) => (
                    <Menu.Item
                      className="active"
                      onClick={() => _onClick(item.href)}
                      key={Math.random()}
                    >
                      {item.name}
                    </Menu.Item>
                  ))
                : FEATURE.home.map((item) => {
                    if (
                      !permissions.includes(LIST_PERMISSION.MANAGE_NEWS) &&
                      item.href === "/news"
                    ) {
                      return;
                    }

                    if (item) {
                    }
                    return (
                      <>
                        <Menu.Item
                          onClick={
                            item.href === "/question"
                              ? gitbook
                              : () => {
                                  if (!item.isNoHref) {
                                    _onClick(item.href);
                                  }
                                }
                          }
                          key={Math.random()}
                          className='mobies_text'
                        >
                          <div>
                            <span className='mobies_icon'>
                              {item?.icon || <></>}
                            </span>
                            <span className='mobies_text'>
                              {item.name.toUpperCase()}
                            </span>
                          </div>
                        </Menu.Item>
                      </>
                    );
                  })}
          <Menu.Item
            onClick={() => setIsOpenModalChangePassword(true)}
            className='mobies_text'
          >
            <span className='mobies_icon'><SwapOutlined /></span>
            {translate("setting.changePass")}
          </Menu.Item>
          <Menu.Item
            onClick={() => setIsOpenModal2FA(true)}
            className='mobies_text'
          >
            <div className='w-100 d-flex justify-content-between'>
              <div>
                <span className='mobies_icon'><RadarChartOutlined /></span>
                <span className='mobies_text'>2FA OTP</span>
              </div>
              <div>
                <Switch checked={user.twoFAEnable ? true : false} />
              </div>
            </div>
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              dispatch(handleSignout(() => {
                history.push("/login")
              }))
            }}
            className='mobies_text'
          >
            <span className='mobies_icon'><LogoutOutlined /></span>
            {translate("header.logout")}
          </Menu.Item>
        </Menu>
    )
  }

  const getMenuPc = (styleWidth) => {
    return (
        <Menu style={{ width: styleWidth || "175px" }}>
          <Menu.Item
            onClick={() => setIsOpenModalChangePassword(true)}
          >
            {translate("setting.changePass")}
          </Menu.Item>
          <Menu.Item
            onClick={() => setIsOpenModal2FA(true)}
          >
            <div className='w-100 d-flex justify-content-between'>
              <div>
                <span >2FA OTP</span>
              </div>
              <div>
                <Switch checked={user.twoFAEnable ? true : false} />
              </div>
            </div>
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              dispatch(handleSignout(() => {
                history.push("/login")
              }))
            }}
          >
            {translate("header.logout")}
          </Menu.Item>
        </Menu>
    )
  }

  const MenuPc = () => {
    return (
      <Dropdown overlay={getMenuPc()} trigger={['click']}>
        <Space>
          <span className='d-none d-md-block'>{getUserName()}</span>
          <CaretDownOutlined />
        </Space>
      </Dropdown>
    )
  }

  const MenuMobile = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <div onClick={() => setIsOpen(true)}>
          <MenuOutlined  style={{fontSize : 24}}/>
        </div>
        <ModalMobile
          isOpen={isOpen}
          toggleModal={() => setIsOpen(prev => !prev)}
          menu={getMenu("100%")}
        />
      </>
    )
  }

  const getUserName = () => {
    if (
      (userData.firstName)
    ) {
      return userData.firstName
    } else if (userData.email) {
      return userData.email
    } else if (userData.phoneNumber) {
      return userData.phoneNumber
    } else {
      return userData.username
    }
  }

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
          description: translate("accreditation.updateError")
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

  useEffect(() => {
    if(isAuth){
      getLinkCSKH();
    }
  }, []);

  function getLinkCSKH() {
    StationIntroduceService.getLinkCSKH({})
      .then((result) => {
        setListLinkCSKH(result);
      })
      .catch(() => {
        translate("introduce.importFailed");
      });
  }

  return (
    <header className={`header ${isHeaderTextOnly ? "flex-center" : ""}`}>
      {isShowRealTimeChat &&  <ChatRealTImeEvent />}
      <div className='header-left'>
        <a href='/'>
          <p className='d-flex d-md-none mb-0 header-left-title'>{getUserName()}</p>
          <div>{themeIcons.Logo}</div>
        </a>
      </div>
      {
        !isHeaderTextOnly ? (
          <div className='header-right'>
            {
              (isAuth || user?.username) ? (
                <Space>
                  <Space size={20} className="header__box">
                    <HeaderAction Icon={TeamOutlined} path="/phonebook" />
                    {isCheckedSetting && 
                    <HeaderAction Icon={SettingOutlined} path="/setting" />
                    }
                    {isCheckedGuide && 
                    <HeaderAction Icon={QuestionCircleOutlined} link={"https://ttdk-organization.gitbook.io/huong-dan-quan-ly-trung-tam/"} notification={notification} />
                    }
                    <HeaderAction Icon={MessageOutlined} link={listLinkCSKH.chatLinkEmployeeToUser} notification={notification} />
                    <HeaderAction Icon={BellOutlined} path="/notification" />
                  </Space>
                  <>
                    <div className='d-none d-md-block'>{translate("hello")},</div>
                    <div className='d-none d-md-block'>
                      <MenuPc />
                    </div>
                    <div className='d-flex d-md-none'>
                      <MenuMobile />
                    </div>
                  </>
                </Space>
              ) : (
                <Button
                  onClick={() => {
                    history.push("/login")
                  }}
                  type="default"
                  className='my-2'
                >{translate("landing.login")}</Button>
              )
            }
          </div>
        ) : (
          <></>
        )
      }
      <ModalChangePassword
        isOpen={isOpenModalChangePassword}
        toggleModal={() => setIsOpenModalChangePassword(!isOpenModalChangePassword)}
        user={user}
      />
      <Modal2FACode
        isOpen={isOpenModal2FA}
        toggleModal={() => setIsOpenModal2FA(!isOpenModal2FA)}
        onChange2FASecurity={onChange2FASecurity}
        user={user}
      />
    </header>
  )
}

const ModalMobile = ({ isOpen , menu , toggleModal }) => {
  const { username } = useSelector((state) => state.member);
  const { t: translation } = useTranslation()
  return (
    <Drawer
      visible={isOpen}
      title={`${translation("header.hello")}, ${username}`}
      onClose={toggleModal}
      footer={<span className='ant-drawer-title'>version web : </span>}
      width="100%"
      className="drawer"
    >
      {menu}
    </Drawer>
  )
}

const ModalChangePassword = ({ isOpen, toggleModal, user }) => {
  const { t: translation } = useTranslation()
  const [form] = Form.useForm()

  const onFinish = (values) => {
    LoginService.changeUserPassword(values).then(result => {
      if (result && result.isSuccess) {
        notification.success({
          message: "",
          description: translation("listCustomers.success", {
            type: translation('setting.changePass')
          })
        })
        form.resetFields()
        toggleModal()
      } else {
        notification.error({
          message: "",
          description: translation("listCustomers.failed", {
            type: translation('setting.changePass')
          })
        })
      }
    })
  }
  return (
    <Modal
      visible={isOpen}
      title={translation('setting.changePass')}
      onCancel={toggleModal}
      footer={null}
    >
      <Form initialValues={{ username: user?.username || "" }} form={form} onFinish={onFinish}>

        <label>{translation('landing.currentPassword')}</label>
        <Form.Item
          name="password"
          rules={[{
            message: `${translation('isReq')}`,
            required: true
          }]}
        >
          <Input autoFocus placeholder={translation('landing.currentPassword')} type="password" />
        </Form.Item>

        <label>{translation('landing.newPassword')}</label>
        <Form.Item
          name="newPassword"
          rules={[{
            message: `${translation('isReq')}`,
            required: true
          }]}
        >
          <Input placeholder={translation('landing.newPassword')} type="password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {translation('landing.confirm')}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

const Modal2FACode = ({ isOpen, toggleModal, onChange2FASecurity, user }) => {
  const [isValid, setIsValid] = useState(true)
  const { t: translation } = useTranslation()
  const inputStyle = {
    "fontFamily": "monospace",
    "MozAppearance": "textfield",
    "borderRadius": "6px",
    "border": "1px solid",
    "boxShadow": "0px 0px 10px 0px rgba(0,0,0,.10)",
    "margin": "4px",
    "textAlign": "center",
    "width": "40px",
    "height": "40px",
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
    if (code.length === 6) {
      SettingService.verifyingUserCode({
        "otpCode": code,
        "id": user.appUserId
      }).then(result => {
        if (result) {
          onChange2FASecurity(user.twoFAEnable)
          notification.success({
            message: "",
            description: translation('inspectionProcess.updateSuccess')
          })
        } else {
          notification.error({
            message: "",
            description: translation('setting.twoFAError')
          })
          setIsValid(false)
        }
      })
    }
  }

  return (
    <Modal
      visible={isOpen}
      title={translation('landing.twoFATitle')}
      onCancel={toggleModal}
      footer={null}
    >
      <div>
        <i>{translation('landing.twoFANote')}</i>
      </div>
      <div className='d-flex justify-content-center'>
        <img
          src={`${HOST}/AppUsers/get2FACode?id=${user.appUserId}`}
          height='200'
        />
      </div>
      <div className="mb-1 mt-3 text-center">
        <strong>
          {translation('landing.twoFASubTitle')}
        </strong>
      </div>
      <ReactCodeInput
        type='text'
        fields={6}
        inputStyle={inputStyle}
        inputStyleInvalid={inputInvalidStyle}
        isValid={isValid}
        onChange={typeCode}
        autoFocus
      />
    </Modal>
  )
}

export default Header