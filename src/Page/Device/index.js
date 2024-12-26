import React from "react";
import {
  Tabs
} from "antd";
import { useTranslation } from "react-i18next";
import ListDevice from "./ListDevice";
const { TabPane } = Tabs;

export default function ListDevicePay() {
  const { t: translation } = useTranslation();

  return (
    <Tabs>
      <TabPane tab={translation("new.list")} key="listDevice">
        <ListDevice />
      </TabPane>
    </Tabs>
  );
}