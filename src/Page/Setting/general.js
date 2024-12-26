import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./setting.scss";
import { useDispatch } from "react-redux";
import { SETTING } from "./../../constants/setting";
import { useSelector } from "react-redux";
import InspectionProcessService from "./../../services/inspectionProcessService";
import { validateEmail } from "../../helper/common";
import { Input, Form, notification, Button, Space, Upload, Modal, Spin } from "antd";
import { ReloadOutlined, CloseCircleOutlined } from "@ant-design/icons";
import _ from "lodash";
import StationIntroduceService from "services/stationIntroduceService";
import addKeyLocalStorage from "helper/localStorage";
import WorkSchedule from "./WorkSchedule";
import { PlusOutlined } from '@ant-design/icons';
import uploadService from "services/uploadService";
import LogoBanner from "./LogoBanner";

const { TextArea } = Input;
const CALL_API_RESET_TIME = 2000;
const STATUS_UPDATE_TIME = 100;
const STATUS_FIELD = {
  UPDATE: "update",
  ERROR: "error",
  RELOAD: "reload",
  SUCCESS: "success",
  DELETE: "delete"
}

export const StatusInput = ({ fieldStatus, onReload }) => {
  const { t: translation } = useTranslation();

  const convertStatusToText = (status) => {
    if (!status) {
      return "";
    }

    if (status === STATUS_FIELD.UPDATE) {
      return translation("setting.general.status.update")
    }

    if (status === STATUS_FIELD.ERROR) {
      return translation("setting.general.status.error", {
        time: CALL_API_RESET_TIME / 1000
      })
    }

    if (status === STATUS_FIELD.RELOAD) {
      return <ReloadOutlined className="setting__reload" onClick={onReload} />
    }

    if (status === STATUS_FIELD.DELETE) {
      return <CloseCircleOutlined className="setting__delete" />
    }
    return translation("setting.general.status.success")
  }

  return (
    <span
      className={`setting__status ${fieldStatus ? `setting__status--${fieldStatus}` : ""}`}>
      {convertStatusToText(fieldStatus)}
    </span>
  )
}

export default function SettingGeneral() {
  const { t: translation } = useTranslation();
  const setting = useSelector((state) => state.setting);
  const user = useSelector((state) => state.member);
  const [isLoading, setIsLoading] = useState(false);
  const [introData, setIntroData] = useState({});
  const [settingData, setSettingData] = useState({});
  const [listLinkCSKH, setListLinkCSKH] = useState({});
  const [status, setStatus] = useState({});

  const dispatch = useDispatch();

  async function handleUpdateSetting(data,exLink=false) {
    let newdata
    if(exLink){
      newdata=data?.stationSetting
    }else{
      newdata=data
    }
    const statusFilter = Object.values(status).filter(item =>
      item !== STATUS_FIELD.RELOAD && item !== STATUS_FIELD.DELETE
    );

    if (statusFilter.length === 0) {
      setStatus(prev => ({
        ...prev,
        [Object.keys(newdata)[0]]: "update"
      }));
      await InspectionProcessService.updateById({ id: user.stationsId, data }).then(async res => {
        if (!res.issSuccess) {
          notification['error']({
            message: "",
            description: translation('setting.error')
          })
          setStatus(prev => ({
            ...prev,
            [Object.keys(newdata)[0]]: STATUS_FIELD.DELETE
          }))
          return;
        }
        await setTimeout(() => {
          setStatus(prev => ({
            ...prev,
            [Object.keys(newdata)[0]]: STATUS_FIELD.SUCCESS
          }));
        }, [STATUS_UPDATE_TIME])
        await setTimeout(() => {
          setStatus(prev => {
            const newStatus = { ...prev }
            delete newStatus[Object.keys(newdata)[0]];
            return newStatus;
          })
        }, CALL_API_RESET_TIME);
      })
    } else {
      setStatus(prev => ({
        ...prev,
        [Object.keys(newdata)[0]]: STATUS_FIELD.ERROR
      }
      ));
      await setTimeout(() => {
        setStatus(prev => ({
          ...prev,
          [Object.keys(newdata)[0]]: STATUS_FIELD.RELOAD
        }
        ));
      }, CALL_API_RESET_TIME);
    }
  }

  function handleOnChange(data) {
    window.localStorage.removeItem(addKeyLocalStorage("setting"))
    dispatch({ type: SETTING, data: data });
  }

  function onChangeIntro() {
    const newParams = {
      id: user.stationsId,
    };
    StationIntroduceService.findStationById(newParams)
      .then((result) => {
        setIntroData(result);
      })
      .catch(() => {
        translation("introduce.importFailed");
      });
  }
  function getLinkCSKH() {
    StationIntroduceService.getLinkCSKH()
      .then((result) => {
        setListLinkCSKH(result);
      })
      .catch(() => {
        translation("introduce.importFailed");
      });
  }

  const fetchData = async () => {
    setIsLoading(true);
    const result = await InspectionProcessService.getDetailById({ id: user.stationsId });
    if (result) {
      setSettingData(result);
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 300)
  };
  useEffect(() => {
    onChangeIntro();
    fetchData();
    if(user.isUserLoggedIn){
      getLinkCSKH();
    }
  }, []);

  const handleChangeIntro = (name, value) => {
    setIntroData({
      ...introData,
      [name]: value,
    });
  };

  function handleUpdateIntro(data) {
    StationIntroduceService.updateStationById({ id: user.stationsId, data });
  }

  function handleUpdateStation(data) {
    window.localStorage.removeItem(addKeyLocalStorage("setting"))
    StationIntroduceService.updateStationExtraInfoById({ id: user.stationsId, data });
  }

  return (
    <div className="setting">
      <div className="section-title mb-4 title-m">{translation("setting.general.titleCenter")}</div>
      {isLoading ? (
        <div className="row">
          <Spin />
        </div>
      ) : (
        <>
          <div className="row">
            <div className="col-12 col-md-6">
              <label className="setting__label text-small">
                {translation("setting.manager")}
                <StatusInput
                  fieldStatus={status.stationsManager}
                  onReload={() => handleUpdateSetting({ stationsManager: setting.stationsManager })}
                />
              </label>
              <div className="ant-row ant-form-item">
                <Input
                  placeholder={translation("setting.general.placeholder", {
                    field: translation("setting.manager")
                  })}
                  defaultValue={settingData.stationsManager}
                  onBlur={(e) => {
                    const { value } = e.target;
                    handleUpdateSetting({ stationsManager: value });
                  }}
                />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <label className="setting__label text-small">
                {translation("setting.managerHotline")}
                <StatusInput
                  fieldStatus={status.stationsManagerPhone}
                  onReload={() => handleUpdateSetting({ stationsManagerPhone: setting.stationsManagerPhone })}
                />
              </label>
              <div className="ant-row ant-form-item">
                <Input
                  id="stationsManagerPhone"
                  name="stationsManagerPhone"
                  placeholder={translation("setting.general.placeholder", {
                    field: translation("setting.managerHotline")
                  })}
                  defaultValue={settingData.stationsManagerPhone}
                  onBlur={(e) => {
                    const { value } = e.target;
                    handleUpdateSetting({ stationsManagerPhone: value });
                  }}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-md-6">
              <label className="setting__label text-small">
                {translation("setting.name")}
                <StatusInput
                  fieldStatus={status.stationsName}
                  onReload={() => handleUpdateSetting({ stationsName: setting.stationsName })}
                />
              </label>
              <div className="ant-row ant-form-item">
                <Input
                  placeholder={translation("setting.general.placeholder", {
                    field: translation("setting.name")
                  })}
                  defaultValue={settingData.stationsName}
                  onBlur={(e) => {
                    const { value } = e.target;
                    handleUpdateSetting({ stationsName: value });
                  }}
                />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <label className="setting__label text-small">
                {translation("setting.hotline")}
                <StatusInput
                  fieldStatus={status.stationsHotline}
                  onReload={() => handleUpdateSetting({ stationsHotline: setting.stationsHotline })}
                />
              </label>
              <div className="ant-row ant-form-item">
                <Input
                  placeholder={translation("setting.general.placeholder", {
                    field: translation("setting.hotline")
                  })}
                  defaultValue={settingData.stationsHotline}
                  onBlur={(e) => {
                    const { value } = e.target;
                    handleUpdateSetting({ stationsHotline: value });
                  }}
                />
              </div>
            </div>

            <div className="col-12 col-md-6">
              <label className="setting__label text-small">
                {translation("setting.address")}
                <StatusInput
                  fieldStatus={status.stationsAddress}
                  onReload={() => handleUpdateSetting({ stationsAddress: setting.stationsAddress })}
                />
              </label>
              <div className="ant-row ant-form-item">
                <Input
                  placeholder={translation("setting.general.placeholder", {
                    field: translation("setting.address")
                  })}
                  defaultValue={settingData.stationsAddress}
                  onBlur={(e) => {
                    const { value } = e.target;
                    handleUpdateSetting({ stationsAddress: value });
                  }}
                />
              </div>
            </div>

            <div className="col-12 col-md-6">
              <label className="setting__label text-small">
                {translation("setting.email")}
                <StatusInput
                  fieldStatus={status.stationsEmail}
                  onReload={() => handleUpdateSetting({ stationsEmail: setting.stationsEmail })}
                />
              </label>
              <div className="ant-row ant-form-item">
                <Input
                  placeholder={translation("setting.general.placeholder", {
                    field: translation("setting.email")
                  })}
                  defaultValue={settingData.stationsEmail}
                  onBlur={(e) => {
                    const { value } = e.target;
                    if (!validateEmail(value)) {
                      handleOnChange({ stationsEmail: "" });
                    } else {
                      handleUpdateSetting({ stationsEmail: value });
                    }
                  }}
                />
              </div>
            </div>
            <LogoBanner setting={settingData} fetchData={fetchData} />
            <div className="col-12 col-md-6">
              <div className="section-title mb-4 title-m">{translation("setting.externalLink")}</div>
              <div className="col-12 col-md-12">
                <label className="setting__label text-small">
                  {translation("setting.linkForEmployees")}
                  <StatusInput
                    fieldStatus={status.chatLinkEmployeeToUser}
                    onReload={() => handleUpdateSetting({ stationSetting:{chatLinkEmployeeToUser : setting.chatLinkEmployeeToUser }},true)}
                  />
                </label>
                <div className="ant-row ant-form-item">
                  <Input
                    placeholder={translation("setting.general.placeholder", {
                      field: translation("setting.linkForEmployees")
                    })}
                    defaultValue={listLinkCSKH.chatLinkEmployeeToUser}
                    onBlur={(e) => {
                      const { value } = e.target;
                      handleUpdateSetting({ stationSetting:{chatLinkEmployeeToUser: value }},true);
                    }}
                  />
                </div>
              </div>
              <div className="col-12 col-md-12">
                <label className="setting__label text-small">
                  {translation("setting.linkForUser")}
                  <StatusInput
                    fieldStatus={status.chatLinkUserToEmployee}
                    onReload={() => handleUpdateSetting({stationSetting:{chatLinkUserToEmployee : setting.chatLinkUserToEmployee}},true)}
                  />
                </label>
                <div className="ant-row ant-form-item">
                  <Input
                    placeholder={translation("setting.general.placeholder", {
                      field: translation("setting.linkForUser")
                    })}
                    defaultValue={listLinkCSKH.chatLinkUserToEmployee}
                    onBlur={(e) => {
                      const { value } = e.target;
                      handleUpdateSetting({ stationSetting:{chatLinkUserToEmployee: value }},true);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <div className="row mb-3">
        <WorkSchedule />
      </div>
    </div>
  );
}