
import React, { useCallback, useMemo, useState, useEffect } from 'react'
import { connect } from "react-redux"
import { Layout } from 'antd';
import './layout.scss'
import { Footer, Header, Menu } from "../Widgets"
import { useSelector } from 'react-redux'
import { USER_ROLES } from 'constants/permission';
import { PERMISSION_CHAT , PERMISSION_NEW } from 'constants/permission';
import NotPermission from 'components/NotPermission/NotPermission';
import ModalDirectLink from 'components/ModalDirectLink';
import { ModalDirectLinkContextProvider } from 'components/ModalDirectLink';
import useAddPermissionToUrl from 'hooks/AddPermissionToUrl';

const WrapComponent = (props) => {
  const { Component, permissions } = props;
  useAddPermissionToUrl(permissions);
  const setting = useSelector(state => state.setting);
  return <Component {...props} setting={setting} />
}

function LayoutPage(props) {
  const [hasPermission, setHasPermission] = useState(true);

  const {
    Component,
    isShowHeader,
    isShowFooter,
    isShowMenu,
    isHeaderTextOnly,
    isAuth,
    member = {},
  } = props
  const HeaderComponent = useCallback(() => {
    return (
      isShowHeader ? (
        <Header userData={member} isHeaderTextOnly={isHeaderTextOnly} isAuth={isAuth} />
      ) : (
        <></>
      )
    )
  }, [member, isHeaderTextOnly, isAuth]);

  const MenuComponent = useMemo(() => {
    return (
      isShowMenu ? (
        <Menu isAuth={isAuth} pathName={props.location.pathname} />
      ) : (
        <></>
      )
    )
  }, [])
  
  useEffect(() => {
    if (member.token) {
      setHasPermission(!!member.permissions)
    }
  }, [member]);

  if (!hasPermission) {
    return <NotPermission />
  }

  return (
    <ModalDirectLinkContextProvider>
      <Layout>
        {HeaderComponent()}
        {MenuComponent}
        <div className="content">
          <div>
            <WrapComponent {...props} />
          </div>
        </div>
        {
          isShowFooter ? (
            <Footer />
          ) : (
            <></>
          )
        }
      </Layout>
    </ModalDirectLinkContextProvider>
  );

}

const mapStateToProps = state => ({
  member: state.member || {},
  introduction: state.introduction || {}
});

const mapDispatchToProps = dispatch => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LayoutPage)
