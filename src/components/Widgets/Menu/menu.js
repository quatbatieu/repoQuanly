import React, { useEffect, memo } from "react";
import { useTranslation } from "react-i18next";
import { Button, Menu } from "antd";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { routes } from "../../../App";

import IconLogo from "./../../../assets/icons/logo-without-text.png";

import { renderRoutes } from "constants/permission";
import { LIST_PERMISSION } from "constants/permission";

import "./menu.scss";
import { createGlobalStyle } from "styled-components";

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

function MenuComponent(props) {
  const { t: translation } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();

  const { isAuth, pathName } = props;
  const setting = useSelector((state) => state.setting);
  const { permissions, appUserRoleId, username } = useSelector(
    (state) => state.member
  );

  const configIntegrated = {
    messages: {
      // show: !!setting.enableMarketingMessages,
      show: true,
      allowRouter: [routes.sms.path]
    },
    receipt: {
      show: !!setting.enableInvoiceMenu,
      allowRouter: [routes.receipt.path]
    }
  };

  let permisstionRoute = renderRoutes(
    translation,
    permissions,
    appUserRoleId,
    username
  );

  permisstionRoute = filterRoutes(permisstionRoute ,configIntegrated)
  const FEATURE = {
    login: [
      {
        name: translation("header.makeAnAppointment"),
        href: routes.bookingSchedule.path,
      },
      // {
      //   name: translation('header.punish'),
      //   href: routes.punishPublic.path,
      // }
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

  return (
    <div className="menu-container-mobie">
      <div className="header-container">
        <Menu
          mode="horizontal"
          defaultSelectedKeys={pathName}
        >
          <div>
            <div className="d-flex w-100 justify-content-center menu-container">
              {!isAuth && !username
                ? FEATURE.login.map((item) => (
                    <Menu.Item
                      className={pathName === item.href ? "active" : ""}
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
                          className={`menu-item ${
                            (item && item.href && pathName === item.href) ||
                            item.routerChildren.includes(pathName)
                              ? "active"
                              : ""
                          }`}
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
                        >
                          <div>
                            {item?.icon || <></>}
                            {item.name.toUpperCase()}
                          </div>
                        </Menu.Item>
                      </>
                    );
                  })}
            </div>
          </div>
        </Menu>
      </div>
    </div>
  );
}

export default memo(MenuComponent);
