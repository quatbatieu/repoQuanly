import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { notification } from 'antd';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import InspectionProcessService from 'services/inspectionProcessService';
import { handleSignout, handleSignin } from 'actions';
import addKeyLocalStorage from 'helper/localStorage';

function LoginSSO(props) {
  const { t: translation } = useTranslation()
  const { isUserLoggedIn } = useSelector((state) => state.member)
  let { search } = useLocation();
  const query = new URLSearchParams(search);
  const history = useHistory()
  const dispatch = useDispatch();

  const tokenField = query.get('token');
  const appUserIdField = query.get('appUserId');

  const navigationLogin = async () => {
    history.push("/")
    notification['warning']({
      message: '',
      description: translation('LoginSSO.Error')
    })
  }

  useEffect(() => {
    if (tokenField && appUserIdField) {
      InspectionProcessService.getDetailByIdLoginSSO({
        id: appUserIdField,
      }, `Bearer ${tokenField}`).then(async (res) => {
        if (res.isSuccess && res.data?.appUserRoleId > 0) {
          notification['success']({
            message: '',
            description: translation('LoginSSO.Success')
          })
          history.push("/")
          window.localStorage.setItem(addKeyLocalStorage('isSynchronization'), "true")
          dispatch(handleSignin(res.data))
          return;
        } else {
          navigationLogin();
        }
      })
      return;
    }
    navigationLogin();
  }, [tokenField, appUserIdField])

  return (
    <div>
      <h3>{translation("LoginSSO.loading")}</h3>
    </div>
  );
}

export default LoginSSO;