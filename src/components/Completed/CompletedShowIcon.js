import React from "react";
import { Space, Popconfirm } from 'antd';
import { useTranslation } from 'react-i18next'
import { DeleteOutlined, CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';

import "./completed.scss";

const CompletedShowIcon = ({ status, onClick, confirm = false }) => {
  const { t: translation } = useTranslation()

  const LIST_STATUS = {
    Completed: "Completed",
    Failed: "Failed",
    Canceled: "Canceled",
    New: "New"
  }

  switch (status) {
    case LIST_STATUS.Completed:
      return <CheckCircleOutlined style={{ color: "#389E0D", fontSize: 20 }} />;
    case LIST_STATUS.Failed:
      return <CloseCircleOutlined style={{ color: "#F5222D", fontSize: 20 }} />;
    case LIST_STATUS.Canceled:
      return <DeleteOutlined style={{ color: "#8C8C8C", fontSize: 20 }} />;
    default:
      return <div />;
  }
}

export default CompletedShowIcon;