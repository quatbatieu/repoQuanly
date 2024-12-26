import React from "react";
import "./index.scss";
import {
  Tabs
} from "antd";
import { useTranslation } from "react-i18next";
import DocumentaryList from "./DocumentaryList";
import File from "Page/File";
import { useSelector } from "react-redux";
const { TabPane } = Tabs;


export default function ListCustomer() {
  const { t: translation } = useTranslation();
  const user = useSelector(state => state.member)
  const permissionValue = 'MANAGE_FILE'
  const isChecked = user.permissions.indexOf(permissionValue) > -1;
  return (
    <Tabs>
      <TabPane tab={translation("documentary.tabs.documentarylist")} key="documentarylist">
        <DocumentaryList />
      </TabPane>
      {isChecked && 
        <TabPane tab={translation("documentary.tabs.file")} key="file">
          <File />
        </TabPane>
      }
    </Tabs>
    
  );
}