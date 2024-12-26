import React, { useState, useEffect, Fragment } from 'react';
import { Typography, Space, Checkbox, Input, Select, Button, Spin, notification, InputNumber } from 'antd';
import moment from 'moment';
import MessageService from 'services/messageService';
import Handlebars from 'handlebars';
import { xoa_dau } from 'helper/common';
import StationMessageConfigsService from 'services/StationMessageConfigsService';
import { useTranslation } from 'react-i18next';
import "./customerSettings.scss";
import { useSelector } from "react-redux";
import UnLock from 'components/UnLock/UnLock';

const { Title } = Typography;
const { Option } = Select;
const SETTING_STATUS = {
  ENABLE: 1,
  DISABLE: 0,
};

const CustomerSettings = () => {
  const { t: translation } = useTranslation()
  const [settings, setSettings] = useState({
    enableAutoSentNotiBefore30Days: SETTING_STATUS.DISABLE,
    enableAutoSentNotiBefore15Days: SETTING_STATUS.DISABLE,
    enableAutoSentNotiBefore7Days: SETTING_STATUS.DISABLE,
    enableAutoSentNotiBefore3Days: SETTING_STATUS.DISABLE,
    enableAutoSentNotiBefore1Days: SETTING_STATUS.DISABLE,
    enableAutoSentNotiBeforeOtherDays: 0,
    enableNotiByAPNS: SETTING_STATUS.DISABLE,
    enableNotiBySmsCSKH: SETTING_STATUS.DISABLE,
    enableNotiByZaloCSKH: SETTING_STATUS.DISABLE,
    enableNotiBySMSRetry: SETTING_STATUS.DISABLE,
    enableNotiByAutoCall: SETTING_STATUS.DISABLE,
    messageTemplateAPNS: null,
    messageTemplateSmsCSKH: null,
    messageTemplateZaloCSKH: null,
    messageTemplateSMSRetry: null,
    messageTemplateAutoCall: null
  });

  const [filter, setFilter] = useState({
    limit: 100
  });
  const [temps, setTemps] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const days = [settings.enableAutoSentNotiBefore30Days, settings.enableAutoSentNotiBefore15Days, settings.enableAutoSentNotiBefore7Days, settings.enableAutoSentNotiBefore3Days, settings.enableAutoSentNotiBefore1Days, settings.enableAutoSentNotiBeforeOtherDays];
  const setting = useSelector((state) => state.setting);
  const handleCheckboxChange = (field) => {
    if (field === "enableNotiByZaloCSKH") {
      setSettings((prevSettings) => ({
        ...prevSettings,
        enableNotiBySMSRetry: prevSettings[field] === SETTING_STATUS.ENABLE ? SETTING_STATUS.DISABLE : SETTING_STATUS.ENABLE,
        [field]: prevSettings[field] === SETTING_STATUS.ENABLE ? SETTING_STATUS.DISABLE : SETTING_STATUS.ENABLE,
      }));
      return;
    }

    setSettings((prevSettings) => ({
      ...prevSettings,
      [field]: prevSettings[field] === SETTING_STATUS.ENABLE ? SETTING_STATUS.DISABLE : SETTING_STATUS.ENABLE,
    }));
  };

  useEffect(() => {
    setLoading(true);
    MessageService.getMessageSMSTemplate(filter).then((result) => {
      if (result && result?.templates?.length > 0) {
        setTemps(result.templates);
        return;
      }
      setLoading(false);
      setTemps([]);
    });
    fetchData()
  }, []);

  const fetchData = () => {
    setLoading(true);
    StationMessageConfigsService.getStationMessageConfigs({}).then((res) => {
      if (!res.isSuccess) {
        setLoading(false);
        notification['error']({
          message: "",
          description: translation("customerSettings.fetchDataError")
        })
        return;
      }
      setLoading(false);
      setSettings({
        enableAutoSentNotiBefore30Days: res.enableAutoSentNotiBefore30Days,
        enableAutoSentNotiBefore15Days: res.enableAutoSentNotiBefore15Days,
        enableAutoSentNotiBefore7Days: res.enableAutoSentNotiBefore7Days,
        enableAutoSentNotiBefore3Days: res.enableAutoSentNotiBefore3Days,
        enableAutoSentNotiBefore1Days: res.enableAutoSentNotiBefore1Days,
        enableAutoSentNotiBeforeOtherDays: res.enableAutoSentNotiBeforeOtherDays,
        enableNotiByAPNS: res.enableNotiByAPNS,
        enableNotiBySmsCSKH: res.enableNotiBySmsCSKH,
        enableNotiByZaloCSKH: res.enableNotiByZaloCSKH,
        enableNotiBySMSRetry: res.enableNotiBySMSRetry,
        enableNotiByAutoCall: res.enableNotiByAutoCall,
        messageTemplateAPNS: res.messageTemplateAPNS,
        messageTemplateSmsCSKH: res.messageTemplateSmsCSKH === null ? undefined : res.messageTemplateSmsCSKH,
        messageTemplateZaloCSKH: res.messageTemplateZaloCSKH === null ? undefined : res.messageTemplateZaloCSKH,
        messageTemplateSMSRetry: res.messageTemplateSMSRetry === null ? undefined : res.messageTemplateSMSRetry,
        messageTemplateAutoCall: res.messageTemplateAutoCall
      });
    })
  };

  const handleChangeTemplate = (value, type) => {
    setSettings(prev => ({
      ...prev,
      [type]: value
    }))
  };

  const saveSettings = () => {
    setLoading(true);
    StationMessageConfigsService.updateStationMessageConfigs({
      data: settings
    }).then((res) => {
      if (!res.isSuccess) {
        setLoading(false);
        notification['error']({
          message: "",
          description: translation("customerSettings.updateSettingsError")
        })
        return;
      }
      notification['success']({
        message: "",
        description: translation("customerSettings.updateSettingsSuccess")
      })
      setLoading(false);
      fetchData();
    })
  };

  const handleDaysInputChange = (value) => {
    setSettings(prev => ({
      ...prev,
      enableAutoSentNotiBeforeOtherDays: value
    }))
  };

  const data = [
    { time: 'timeBefore30Days', notification: 'notificationApp', settingField: 'enableAutoSentNotiBefore30Days', notiField: 'enableNotiByAPNS', type: "messageTemplateAPNS", messageTemplateType: "APNS" },
    { time: 'timeBefore15Days', notification: 'notificationSMS', settingField: 'enableAutoSentNotiBefore15Days', notiField: 'enableNotiBySmsCSKH', type: "messageTemplateSmsCSKH", messageTemplateType: "SMS_CSKH" },
    { time: 'timeBefore7Days', notification: 'notificationZalo', settingField: 'enableAutoSentNotiBefore7Days', notiField: 'enableNotiByZaloCSKH', type: "messageTemplateZaloCSKH", messageTemplateType: "ZALO_CSKH" },
    { time: 'timeBefore3Days', notification: 'notificationSMSIfNoZalo', settingField: 'enableAutoSentNotiBefore3Days', notiField: 'enableNotiBySMSRetry', type: "messageTemplateSMSRetry", messageTemplateType: "SMS_CSKH" },
    { time: 'timeBefore1Day', notification: 'autoCall', settingField: 'enableAutoSentNotiBefore1Days', notiField: 'enableNotiByAutoCall', type: "messageTemplateAutoCall", messageTemplateType: "CALL" },
  ]

  return (
    <Fragment>
      {setting.enableCustomerMenu === 0 ? <UnLock /> : 
       <div>
      <Title level={3} className='section-title'>{translation('customerSettings.autoSendNotificationTitle')}</Title>
      {isLoading ? (
        <Spin />
      ) : (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div className='row'>
            <div className="d-md-flex d-none col-md-4 col-0">
              {translation('customerSettings.sendTime')}
            </div>
            <div className="d-md-flex d-none col-md-4 col-0">
              {translation('customerSettings.notificationType')}
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 col-12">
              <div className="d-md-none col-12 d-flex mb-2">
                {translation('customerSettings.sendTime')}
              </div>
              {data.map((item, index) => (
                <div className="row" key={index}>
                  <div className="col-12 mb-4" style={{ height: 32 }}>
                    <Checkbox
                      checked={settings[item.settingField] === SETTING_STATUS.ENABLE}
                      onChange={() => handleCheckboxChange(item.settingField)}
                    >
                      {translation("customerSettings." + item.time)}
                    </Checkbox>
                  </div>
                </div>
              ))}
              <div className="row">
                <div className="col-12">
                  <Checkbox
                    checked={!!settings.enableAutoSentNotiBeforeOtherDays}
                    onChange={() => {
                      if (!!settings.enableAutoSentNotiBeforeOtherDays) {
                        handleDaysInputChange(0);
                      } else {
                        handleDaysInputChange(1);
                      }
                    }}
                  >
                    {translation('customerSettings.other')}
                  </Checkbox>
                  <div className="d-flex align-items-center mt-2 mb-4">
                    <div style={{ width: 100, marginRight: 10 }}>
                      <InputNumber
                        value={settings.enableAutoSentNotiBeforeOtherDays}
                        min={0}
                        precision={0}
                        onChange={handleDaysInputChange}
                        placeholder={translation('customerSettings.inputDays')}
                        className="customerSettings-dayInput"
                      />
                    </div>
                    <div className="customerSettings-day">
                      {translation('customerSettings.date')} : {moment().add(settings.enableAutoSentNotiBeforeOtherDays, 'days').format('DD/MM/YYYY')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-8 col-12">
              <div className="d-md-none col-12 d-flex mb-2">
                {translation('customerSettings.notificationType')}
              </div>
              {data.map((item, index) => {
                return (
                <div className='row'>
                  <div className='col-md-6 col-12'>
                    <div className="row" key={index}>
                      {item.notiField === "enableNotiBySMSRetry" ? (
                        <div className="col-12 mb-0 mb-md-0" style={{ minHeight: 32 }}>
                          <Checkbox
                            checked={settings[item.notiField] === SETTING_STATUS.ENABLE}
                            disabled={!settings.enableNotiByZaloCSKH}
                            onChange={() => handleCheckboxChange(item.notiField)}
                          >
                            {translation("customerSettings." + item.notification)}
                          </Checkbox>
                        </div>
                      ) : (
                        <div className="col-12 mb-0 mb-md-0" style={{ minHeight: 32 }}>
                          <Checkbox
                            checked={settings[item.notiField] === SETTING_STATUS.ENABLE}
                            disabled={days.every((item) => !item)}
                            onChange={() => handleCheckboxChange(item.notiField)}
                          >
                            {translation("customerSettings." + item.notification)}
                          </Checkbox>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className='col-md-6 col-12'>
                    <div className="row" key={index}>
                      <div className="col-12 mb-4" style={{ height: 32 }}>
                        <Select 
                        placeholder={translation('customerSettings.chooseTemplateMessage')} 
                        style={{ width: '100%' }} 
                        value={!settings[item.notiField] ? undefined :settings[item.type]}
                        onChange={(value) => handleChangeTemplate(value, item.type)} 
                        disabled={days.every((item) => !item) || !settings[item.notiField]}
                        >
                          {temps?.filter((i) => i.messageTemplateType === item.messageTemplateType)?.map((item) => (
                            <Option value={item.messageTemplateId}>{item.messageTemplateName}</Option>
                          ))}
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
                )})}
            </div>
            {/* <div className="col-md-4 col-12">
              {data.map((item, index) => (
              ))}
            </div> */}
          </div>
          <div className='d-flex justify-content-end'>
            <Button type="primary" onClick={saveSettings} loading={isLoading}>
              {translation('customerSettings.save')}
            </Button>
          </div>
        </Space>
      )}
       </div >
      }
    </Fragment>
  );
};

export default CustomerSettings;
