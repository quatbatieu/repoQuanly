import React from "react";
import { Space, Popconfirm } from 'antd';
import { useTranslation } from 'react-i18next'
import { DeleteOutlined, CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';

import "./completed.scss";

const Completed = ({ status, onClick, confirm = false }) => {
  const { t: translation } = useTranslation()

  const LIST_STATUS = {
    Completed: translation("accreditation.statusText.completed"),
    Failed: translation("accreditation.statusText.failed"),
    Canceled: translation("accreditation.statusText.canceled"),
    New: "New"
  }

  if (status === LIST_STATUS.New && confirm) {
    return (
      <Space size={16}>
        <Popconfirm
          title={translation("accreditation.popConfirm" , {
            status : translation("accreditation.statusText.canceled").toLowerCase()
          })}
          onConfirm={() => onClick("Canceled")}
          okText={translation("accreditation.yes")}
          cancelText={translation("accreditation.no")}
        >
          <div className='completed__icon'>
            <DeleteOutlined style={{ color: "#8C8C8C" }} />
          </div>
        </Popconfirm>
        <Popconfirm
          title={translation("accreditation.popConfirm" , {
            status : translation("accreditation.statusText.failed").toLowerCase()
          })}
          onConfirm={() => onClick("Failed")}
          okText={translation("accreditation.yes")}
          cancelText={translation("accreditation.no")}
        >
          <div className='completed__icon' >
            <CloseCircleOutlined style={{ color: "#F5222D" }} />
          </div>
        </Popconfirm>
        <Popconfirm
          title={translation("accreditation.popConfirm" , {
            status : translation("accreditation.statusText.completed").toLowerCase()
          })}
          onConfirm={() => onClick("Completed")}
          okText={translation("accreditation.yes")}
          cancelText={translation("accreditation.no")}
        >
          <div className='completed__icon' >
            <CheckCircleOutlined style={{ color: "#389E0D" }} />
          </div>
        </Popconfirm>
      </Space>
    )
  }

  if (status === LIST_STATUS.New) {
    return (
      <Space size={16}>
        <div className='completed__icon' onClick={() => onClick("Canceled")}>
          <DeleteOutlined style={{ color: "#8C8C8C" }} />
        </div>
        <div className='completed__icon' onClick={() => onClick("Failed")}>
          <CloseCircleOutlined style={{ color: "#F5222D" }} />
        </div>
        <div className='completed__icon' onClick={() => onClick("Completed")}>
          <CheckCircleOutlined style={{ color: "#389E0D" }} />
        </div>
      </Space>
    )
  }
  return (
    <div className={`completed__text--${status ? status : ""}`}>
      {LIST_STATUS[status]}
    </div>
  )
}

export default Completed;