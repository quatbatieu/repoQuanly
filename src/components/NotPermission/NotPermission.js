import React from 'react';
import { Button, Result, notification } from 'antd';
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom';
import "./notPermission.scss";
import { handleSignout } from 'actions';

function NotPermission(props) {
  const { t: translation } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();

  return (
    <div className='notNotification'>
      <Result
        status="warning"
        title={translation("permission.messageError")}
        extra={
          <Button type="primary" key="console" onClick={() => {
            dispatch(handleSignout(() => {
              history.push("/login")
            }))
          }}>
            {translation("header.logout")}
          </Button>
        }
      />
    </div>
  );
}

export default NotPermission;