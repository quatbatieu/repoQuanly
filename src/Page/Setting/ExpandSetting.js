import React, { useEffect, useState } from 'react';
import { Tabs, Card, Row, Col, notification, Spin } from 'antd';
import { useHistory } from 'react-router-dom';
import _ from 'lodash';
import "./ExpandSetting.scss";
import ThirdPartyIntegration from 'services/thirdPartyIntegrationService';
import { THIRDPARTY_CATEGORY } from 'constants/app';
import { THIRDPARTY_CODE_IMAGE } from 'constants/app';
import { THIRDPARTY_CODE_ENABLE } from 'constants/app';
import { THIRDPARTY_CODE } from 'constants/app';
import TelegramThirdParty from './TelegramThirdParty';
import { useTranslation } from 'react-i18next';
import TingeeThirdParty from './TingeeThirdParty';
import PaymentThirdParty from './PaymentThirdParty';
import { PAYMENT_TYPE_STATE } from 'constants/setting';
import VMGThirdParty from './VMGThirdParty';
import Smartgit from "./Smartgit";
import VietQr from "./VietQr";

const { TabPane } = Tabs;

const ExpandSettingTabs = () => {
  const { t } = useTranslation();

  const THIRDPARTY_NAME = {
    [THIRDPARTY_CODE.CAPITAL_PAY]: t('expand_setting.capital_pay'),
    [THIRDPARTY_CODE.SUNPAY]: t('expand_setting.sunpay'),
    [THIRDPARTY_CODE.VNPAY_PERSONAL]: t('expand_setting.vnpay_qr'),
    [THIRDPARTY_CODE.TELEGRAM]: t('expand_setting.telegram'),
    [THIRDPARTY_CODE.ZALO]: t('expand_setting.zalo'),
    [THIRDPARTY_CODE.TTDK]: t('expand_setting.ttdk'),
    [THIRDPARTY_CODE.VMG]: t('expand_setting.vmg'),
    [THIRDPARTY_CODE.VIVAS]: t('expand_setting.vivas'),
    [THIRDPARTY_CODE.FPT]: t('expand_setting.fpt'),
    [THIRDPARTY_CODE.VNPT]: t('expand_setting.vnpt'),
    [THIRDPARTY_CODE.VIETTEL]: t('expand_setting.viettel'),
    [THIRDPARTY_CODE.ZALO_ZNS]: t('expand_setting.zalo_zns'),
    [THIRDPARTY_CODE.SMARTGIFT]: t('expand_setting.smartgift'),
    [THIRDPARTY_CODE.SMTP]: t('expand_setting.smtp'),
    [THIRDPARTY_CODE.MAILGUN]: t('expand_setting.mailgun'),
    [THIRDPARTY_CODE.TINGEE]: t('tingee.tingee'),
    [THIRDPARTY_CODE.VNPAY_BUSINESS]: t('expand_setting.VNPAY_BUSINESS'),
    [THIRDPARTY_CODE.MOMO_PERSONAL]: t('expand_setting.MOMO_PERSONAL'),
    [THIRDPARTY_CODE.MOMO_BUSINESS]: t('expand_setting.MOMO_BUSINESS'),
    [THIRDPARTY_CODE.ZALOPAY_PERSONAL]: t('expand_setting.ZALOPAY_PERSONAL'),
    [THIRDPARTY_CODE.ZALOPAY_BUSINESS]: t('expand_setting.ZALOPAY_BUSINESS'),
    [THIRDPARTY_CODE.BANKING_MANUAL]: t('expand_setting.BANKING_MANUAL'),
    [THIRDPARTY_CODE.BANKING_VIETQR]: t('expand_setting.BANKING_VIETQR'),
    [THIRDPARTY_CODE.VIETTELPAY_PERSONAL]: t('expand_setting.VIETTELPAY_PERSONAL'),
    [THIRDPARTY_CODE.VIETTELPAY_BUSINESS]: t('expand_setting.VIETTELPAY_BUSINESS'),
  }
  const toastMessage = t('expand_setting.toast_error_message');
  const EXPAND_SETTING_APP = {
    NOTIFICATION: {
      name: t("Notification"),
      apps:[
        {
          name: "Telegram", // Tên ứng dụng
          isEnabled: THIRDPARTY_CODE_ENABLE[THIRDPARTY_CODE.TELEGRAM] ? true : false,
          icon: THIRDPARTY_CODE_IMAGE[THIRDPARTY_CODE.TELEGRAM],
          partyCode: THIRDPARTY_CODE.TELEGRAM,
          thirdPartyId: ""
        },
        {
          name: "Zalo", // Tên ứng dụng
          isEnabled: THIRDPARTY_CODE_ENABLE[THIRDPARTY_CODE.ZALO] ? true : false,
          icon: THIRDPARTY_CODE_IMAGE[THIRDPARTY_CODE.ZALO],
          partyCode: THIRDPARTY_CODE.ZALO,
          thirdPartyId: ""
        },
      ]
    },
    SMS: {
      name: t('SMS'),
      apps: [
        {
          name: "TTDK", // Tên ứng dụng
          isEnabled: THIRDPARTY_CODE_ENABLE[THIRDPARTY_CODE.TTDK] ? true : false,
          icon: THIRDPARTY_CODE_IMAGE[THIRDPARTY_CODE.TTDK],
          partyCode: THIRDPARTY_CODE.TTDK,
          thirdPartyId: ""
        },
        {
          name: "VMG", // Tên ứng dụng
          isEnabled: THIRDPARTY_CODE_ENABLE[THIRDPARTY_CODE.VMG] ? true : false,
          icon: THIRDPARTY_CODE_IMAGE[THIRDPARTY_CODE.VMG],
          partyCode: THIRDPARTY_CODE.VMG,
          thirdPartyId: ""
        },
        {
          name: "VIVAS", // Tên ứng dụng
          isEnabled: THIRDPARTY_CODE_ENABLE[THIRDPARTY_CODE.VIVAS] ? true : false,
          icon: THIRDPARTY_CODE_IMAGE[THIRDPARTY_CODE.VIVAS],
          partyCode: THIRDPARTY_CODE.VIVAS,
          thirdPartyId: ""
        },
        {
          name: "FPT", // Tên ứng dụng
          isEnabled: THIRDPARTY_CODE_ENABLE[THIRDPARTY_CODE.FPT] ? true : false,
          icon: THIRDPARTY_CODE_IMAGE[THIRDPARTY_CODE.FPT],
          partyCode: THIRDPARTY_CODE.FPT,
          thirdPartyId: ""
        },
        {
          name: "VNPT", // Tên ứng dụng
          isEnabled: THIRDPARTY_CODE_ENABLE[THIRDPARTY_CODE.VNPT] ? true : false,
          icon: THIRDPARTY_CODE_IMAGE[THIRDPARTY_CODE.VNPT],
          partyCode: THIRDPARTY_CODE.VNPT,
          thirdPartyId: ""
        },
        {
          name: "VIETTEL", // Tên ứng dụng
          isEnabled: THIRDPARTY_CODE_ENABLE[THIRDPARTY_CODE.VIETTEL] ? true : false,
          icon: THIRDPARTY_CODE_IMAGE[THIRDPARTY_CODE.VIETTEL],
          partyCode: THIRDPARTY_CODE.VIETTEL,
          thirdPartyId: ""
        },
      ],
    },
    ZALO_MESSAGE: {
      name: t('expand_setting.zalo_message'),
      apps: [
        {
          name: "TTDK", // Tên ứng dụng
          isEnabled: THIRDPARTY_CODE_ENABLE[THIRDPARTY_CODE.TTDK] ? true : false,
          icon: THIRDPARTY_CODE_IMAGE[THIRDPARTY_CODE.TTDK],
          partyCode: THIRDPARTY_CODE.TTDK,
          thirdPartyId: ""
        },
        {
          name: "Smartgift", // Tên ứng dụng
          isEnabled: THIRDPARTY_CODE_ENABLE[THIRDPARTY_CODE.SMARTGIFT] ? true : false,
          icon: THIRDPARTY_CODE_IMAGE[THIRDPARTY_CODE.SMARTGIFT],
          partyCode: THIRDPARTY_CODE.SMARTGIFT,
          thirdPartyId: ""
        },
        {
          name: "Zalo-ZNS", // Tên ứng dụng
          isEnabled: THIRDPARTY_CODE_ENABLE[THIRDPARTY_CODE.ZALO_ZNS] ? true : false,
          icon: THIRDPARTY_CODE_IMAGE[THIRDPARTY_CODE.ZALO_ZNS],
          partyCode: THIRDPARTY_CODE.ZALO_ZNS,
          thirdPartyId: ""
        },
      ],
    },
    EMAIL: {
      name: t('Email'),
      apps: [
        {
          name: "SMTP", // Tên ứng dụng
          isEnabled: THIRDPARTY_CODE_ENABLE[THIRDPARTY_CODE.SMTP] ? true : false,
          icon: THIRDPARTY_CODE_IMAGE[THIRDPARTY_CODE.SMTP],
          partyCode: THIRDPARTY_CODE.SMTP,
          thirdPartyId: ""
        },
        {
          name: "MAILGUN", // Tên ứng dụng
          isEnabled: THIRDPARTY_CODE_ENABLE[THIRDPARTY_CODE.MAILGUN] ? true : false,
          icon: THIRDPARTY_CODE_IMAGE[THIRDPARTY_CODE.MAILGUN],
          partyCode: THIRDPARTY_CODE.MAILGUN,
          thirdPartyId: ""
        },
      ],
    }, 
    PAYMENT: {
      name: t("setting.payment.payment"),
      apps: [
        {
          name: "Tingee", // Tên ứng dụng
          isEnabled: THIRDPARTY_CODE_ENABLE[THIRDPARTY_CODE.TINGEE] ? true : false,
          icon: THIRDPARTY_CODE_IMAGE[THIRDPARTY_CODE.TINGEE],
          partyCode: THIRDPARTY_CODE.TINGEE,
          thirdPartyId: "",
          partyCategory:THIRDPARTY_CATEGORY.PAYMENT
        },
        {
          name: "Chuyển khoản ngân hàng", // Tên ứng dụng
          isEnabled: THIRDPARTY_CODE_ENABLE[THIRDPARTY_CODE.BANKING_MANUAL] ? true : false,
          icon: THIRDPARTY_CODE_IMAGE[THIRDPARTY_CODE.BANKING_MANUAL],
          partyCode: THIRDPARTY_CODE.BANKING_MANUAL,
          thirdPartyId: "",
          partyCategory:THIRDPARTY_CATEGORY.PAYMENT
        },
        {
          name: "Chuyển khoản ngân hàng qua VietQR", // Tên ứng dụng
          isEnabled: THIRDPARTY_CODE_ENABLE[THIRDPARTY_CODE.BANKING_VIETQR] ? true : false,
          icon: THIRDPARTY_CODE_IMAGE[THIRDPARTY_CODE.BANKING_VIETQR],
          partyCode: THIRDPARTY_CODE.BANKING_VIETQR,
          thirdPartyId: "",
          partyCategory:THIRDPARTY_CATEGORY.PAYMENT
        },
        {
          name: "Chuyển tiền qua Momo", // Tên ứng dụng
          isEnabled: THIRDPARTY_CODE_ENABLE[THIRDPARTY_CODE.MOMO_PERSONAL] ? true : false,
          icon: THIRDPARTY_CODE_IMAGE[THIRDPARTY_CODE.MOMO_PERSONAL],
          partyCode: THIRDPARTY_CODE.MOMO_PERSONAL,
          thirdPartyId: "",
          partyCategory:THIRDPARTY_CATEGORY.PAYMENT
        },
        {
          name: "Thanh toán qua Momo", // Tên ứng dụng
          isEnabled: THIRDPARTY_CODE_ENABLE[THIRDPARTY_CODE.MOMO_BUSINESS] ? true : false,
          icon: THIRDPARTY_CODE_IMAGE[THIRDPARTY_CODE.MOMO_BUSINESS],
          partyCode: THIRDPARTY_CODE.MOMO_BUSINESS,
          thirdPartyId: "",
          partyCategory:THIRDPARTY_CATEGORY.PAYMENT
        },
        {
          name: "VNPay QR", // Tên ứng dụng
          isEnabled: THIRDPARTY_CODE_ENABLE[THIRDPARTY_CODE.VNPAY_PERSONAL] ? true : false,
          icon: THIRDPARTY_CODE_IMAGE[THIRDPARTY_CODE.VNPAY_PERSONAL],
          partyCode: THIRDPARTY_CODE.VNPAY_PERSONAL,
          thirdPartyId: "",
          partyCategory:THIRDPARTY_CATEGORY.PAYMENT
        },
        {
          name: "VNPay doanh nghiệp", // Tên ứng dụng
          isEnabled: THIRDPARTY_CODE_ENABLE[THIRDPARTY_CODE.VNPAY_BUSINESS] ? true : false,
          icon: THIRDPARTY_CODE_IMAGE[THIRDPARTY_CODE.VNPAY_BUSINESS],
          partyCode: THIRDPARTY_CODE.VNPAY_BUSINESS,
          thirdPartyId: "",
          partyCategory:THIRDPARTY_CATEGORY.PAYMENT
        },
        {
          name: "ZaloPay cá nhân", // Tên ứng dụng
          isEnabled: THIRDPARTY_CODE_ENABLE[THIRDPARTY_CODE.ZALOPAY_PERSONAL] ? true : false,
          icon: THIRDPARTY_CODE_IMAGE[THIRDPARTY_CODE.ZALOPAY_PERSONAL],
          partyCode: THIRDPARTY_CODE.ZALOPAY_PERSONAL,
          thirdPartyId: "",
          partyCategory:THIRDPARTY_CATEGORY.PAYMENT
        },
        {
          name: "ZaloPay doanh nghiệp", // Tên ứng dụng
          isEnabled: THIRDPARTY_CODE_ENABLE[THIRDPARTY_CODE.ZALOPAY_BUSINESS] ? true : false,
          icon: THIRDPARTY_CODE_IMAGE[THIRDPARTY_CODE.ZALOPAY_BUSINESS],
          partyCode: THIRDPARTY_CODE.ZALOPAY_BUSINESS,
          thirdPartyId: "",
          partyCategory:THIRDPARTY_CATEGORY.PAYMENT
        },
        {
          name: "ViettelPay cá nhân", // Tên ứng dụng
          isEnabled: THIRDPARTY_CODE_ENABLE[THIRDPARTY_CODE.VIETTELPAY_PERSONAL] ? true : false,
          icon: THIRDPARTY_CODE_IMAGE[THIRDPARTY_CODE.VIETTELPAY_PERSONAL],
          partyCode: THIRDPARTY_CODE.VIETTELPAY_PERSONAL,
          thirdPartyId: "",
          partyCategory:THIRDPARTY_CATEGORY.PAYMENT
        },
        {
          name: "ViettelPay doanh nghiệp", // Tên ứng dụng
          isEnabled: THIRDPARTY_CODE_ENABLE[THIRDPARTY_CODE.VIETTELPAY_BUSINESS] ? true : false,
          icon: THIRDPARTY_CODE_IMAGE[THIRDPARTY_CODE.VIETTELPAY_BUSINESS],
          partyCode: THIRDPARTY_CODE.VIETTELPAY_BUSINESS,
          thirdPartyId: "",
          partyCategory:THIRDPARTY_CATEGORY.PAYMENT
        },
        {
          name: "Capital Pay", // Tên ứng dụng
          isEnabled: THIRDPARTY_CODE_ENABLE[THIRDPARTY_CODE.CAPITAL_PAY] ? true : false,
          icon: THIRDPARTY_CODE_IMAGE[THIRDPARTY_CODE.CAPITAL_PAY],
          partyCode: THIRDPARTY_CODE.CAPITAL_PAY,
          thirdPartyId: "",
          partyCategory:THIRDPARTY_CATEGORY.PAYMENT
        },
        {
          name: "Sun Pay", // Tên ứng dụng
          isEnabled: THIRDPARTY_CODE_ENABLE[THIRDPARTY_CODE.SUNPAY] ? true : false,
          icon: THIRDPARTY_CODE_IMAGE[THIRDPARTY_CODE.SUNPAY],
          partyCode: THIRDPARTY_CODE.SUNPAY,
          thirdPartyId: "",
          partyCategory:THIRDPARTY_CATEGORY.PAYMENT
        },
      ],
    },
  };

  const [Loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("NOTIFICATION");
  const [openConent, setOpenContent] = useState("");
  const [id, setId] = useState("");
  const history = useHistory();
  const [contentTab, setContentTab] = useState(EXPAND_SETTING_APP);

  const toggleTab = tab => {
    setActiveTab(tab);
  };

  const handleAppClick = (app) => {
    if (!app.isEnabled) {
      if(app?.partyCategory == THIRDPARTY_CATEGORY.PAYMENT){
        notification['error']({
          message: "",
          description: t('expand_setting.toast_payment_error_message')
        })
      }else{
        notification['error']({
          message: "",
          description: toastMessage
        })
      }
    } else {
      setOpenContent(app?.partyCode)
      setId(app?.thirdPartyId)
    }
  };

  const handleGetConfig = async () => {
    try {
      setLoading(true)
      const res = await ThirdPartyIntegration.getConfigsTelegram();

      // Group by theo partyCategory
      const groupedData = _.groupBy(res?.data, item => {
        for (const [key, value] of Object.entries(THIRDPARTY_CATEGORY)) {
          if (value === item.partyCategory) {
            return key;
          }
        }
      });
      // Map thành dữ liệu theo cấu trúc của EXPAND_SETTING_APP
      for (const [category, apps] of Object.entries(groupedData)) {
        const settingApp = EXPAND_SETTING_APP[category];
        const appContents = [];
        if (settingApp) {
          apps.forEach(app => {
            // THIRDPARTY_CODE_ENABLE[app?.partyCode] = app.partyEnableStatus || 0
            appContents.push({
              name: THIRDPARTY_NAME[app?.partyCode], // Tên ứng dụng
              isEnabled: THIRDPARTY_CODE_ENABLE[app?.partyCode] ? true : false,
              icon: THIRDPARTY_CODE_IMAGE[app?.partyCode],
              partyCode: app?.partyCode,
              isShow: THIRDPARTY_NAME[app?.partyCode]  ? true : false,
              thirdPartyId: app?.thirdPartyId,
              partyCategory:app?.partyCategory
            });
          });
          settingApp.apps = appContents;
        }
      }

      setContentTab({ ...EXPAND_SETTING_APP });
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleGetConfig();
  }, []);

  const renderTabPane = () => {
    return Object.keys(contentTab).map((key) => {
      const tab = contentTab[key];
      return (
        <TabPane tab={tab.name} key={key}>
          {tab.apps.map((app, appIndex) => (
            <Card key={appIndex} onClick={() => handleAppClick(app)} className={` expand-setting_item ${!app.isEnabled ? 'disabled' : ''} ${!app.isShow ? 'hiddenItem':''}`}>
              <div className='expand-setting_content'>
                {app.icon ? <img src={app.icon} alt={app.name} /> : <div className='expand-setting_content-icon'>{app.name}</div>}
                <div className='expand-setting_title'>{app.name}</div>
              </div>
            </Card>
          ))}
        </TabPane>
      );
    });
  };
  if (Loading) {
    return (
      <Spin />
    )
  }

  const renderContent = () => {
    switch (openConent) {
      case THIRDPARTY_CODE.TELEGRAM:
        return <TelegramThirdParty setOpenContent={setOpenContent} id={id} setId={setId}/>
      case THIRDPARTY_CODE.TINGEE:
        return <TingeeThirdParty setOpenContent={setOpenContent} id={id} setId={setId} />
      case THIRDPARTY_CODE.BANKING_MANUAL:
        return <PaymentThirdParty value={PAYMENT_TYPE_STATE.BANK_TRANSFER} setOpenContent={setOpenContent} id={id} setId={setId} />
        case THIRDPARTY_CODE.MOMO_PERSONAL:
          return <PaymentThirdParty value={PAYMENT_TYPE_STATE.MOMO_PERSONAL} setOpenContent={setOpenContent} id={id} setId={setId} />
        case THIRDPARTY_CODE.MOMO_BUSINESS:
          return <PaymentThirdParty value={PAYMENT_TYPE_STATE.MOMO_BUSINESS} setOpenContent={setOpenContent} id={id} setId={setId} />
        case THIRDPARTY_CODE.VNPAY_PERSONAL:
          return <PaymentThirdParty value={PAYMENT_TYPE_STATE.VNPAY_PERSONAL} setOpenContent={setOpenContent} id={id} setId={setId} />
      case THIRDPARTY_CODE.ZALOPAY_PERSONAL:
        return <PaymentThirdParty value={PAYMENT_TYPE_STATE.ZALOPAY_PERSONAL} setOpenContent={setOpenContent} id={id} setId={setId} />
      case THIRDPARTY_CODE.VIETTELPAY_PERSONAL:
        return <PaymentThirdParty value={PAYMENT_TYPE_STATE.VIETTELPAY_PERSONAL} setOpenContent={setOpenContent} id={id} setId={setId} />
      case THIRDPARTY_CODE.VIETQR:
        return <PaymentThirdParty value={PAYMENT_TYPE_STATE.VIETQR} setOpenContent={setOpenContent} id={id} setId={setId} />
      case THIRDPARTY_CODE.VMG:
          return <VMGThirdParty setOpenContent={setOpenContent} id={id} setId={setId} />
      case THIRDPARTY_CODE.SMARTGIFT:
          return <Smartgit setOpenContent={setOpenContent} id={id} setId={setId} />
      case THIRDPARTY_CODE.BANKING_VIETQR:
          return <VietQr setOpenContent={setOpenContent} id={id} setId={setId} />
      default:
        return (
          <div className='expand-setting'>
            <Tabs activeKey={activeTab} onChange={toggleTab}>
              {renderTabPane()}
            </Tabs>
          </div>
        );
    }
  }
  return (
    <div>
      {renderContent()}
    </div>
  )
};

export default ExpandSettingTabs;
