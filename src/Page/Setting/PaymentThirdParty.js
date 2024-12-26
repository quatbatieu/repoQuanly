import React, { useEffect, useMemo, useState } from 'react';
import { LeftOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { Button, Card, Form, Input, Switch, Row, Col, Checkbox, notification, Tag, Select, Spin } from 'antd';
import { useForm } from 'antd/lib/form/Form';

import './TingeeThirdParty.scss';
import { useTranslation } from 'react-i18next';
import ThirdPartyIntegration from 'services/thirdPartyIntegrationService';
import Axios from 'axios';
import { generalStringConversion } from 'helper/stringUtils';
import Paragraph from 'antd/lib/typography/Paragraph';
import { HOST } from 'constants/url';
import { getBanksLocal } from 'services/bankService';
import tingeeBanner from '../../assets/icons/tingeeAdvertisement.png'
import { useSelector } from 'react-redux';
import { optionPaymentTypes } from 'constants/setting';
import { PAYMENT_TYPE_STATE } from 'constants/setting';
import MomoPersonalPopup from './MomoPersonalPopup';
import BankTransferModal from './BankTransferModal';
import MomoBusinessPopup from './MomoBusinessPopup';
import ScheduleSettingService from 'services/scheduleSettingService';

const { Option } = Select;

const BANK_SUPPORT_BY_TINNGE = ["OCB", "MB", "BIDV"]

const PaymentThirdParty = ({ id, setOpenContent, setId,value }) => {
  const { t: translation } = useTranslation();
  const [form] = useForm();
  const history = useHistory();
  const [bankJson, setBankJson] = useState([]);
  const [loading, setLoading] = useState(false)
  const user = useSelector(state => state.member)
  const [selectedPaymentOptions, setSelectedPaymentOptions] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    handleGetBank()
  }, [id]);

  const handleCheckPaymentType = (paymentMethod) => {
    switch (paymentMethod) {
      case PAYMENT_TYPE_STATE.MOMO_PERSONAL:
        return <MomoPersonalPopup/>
      case PAYMENT_TYPE_STATE.BANK_TRANSFER:
        return <BankTransferModal/>
      case PAYMENT_TYPE_STATE.MOMO_BUSINESS:
        return <MomoBusinessPopup/>
      default:
        return <div> </div>
    }

  };

  useEffect(() => {
    handleCheckPaymentType(value)
  }, [value]);

  const handleGetBank = async () => {
    const response = await getBanksLocal()
    setBankJson(response.data?.banksnapas?.filter(bank => BANK_SUPPORT_BY_TINNGE.includes(bank.shortName)));
  }



  const fetchData = async () => {
    setIsLoading(true)
    const result = await ScheduleSettingService.getDetailById({ id: user.stationsId });
    if (result) {
      let newArr= []
      for(let i=0;i<result?.stationPayments?.length;i++){
        newArr.push(result?.stationPayments[i])
      }
      setSelectedPaymentOptions(newArr || []);
      if(newArr.indexOf(value)>=0){
        setIsActive(true)
      }
      setIsLoading(false)
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const SCHEDULE_SETTING_ERROR = useMemo(() => {
    return {
      INVALID_STATION: translation("scheduleSetting.scheduleSettingError.invalidStation"),
      WRONG_BOOKING_CONFIG: translation("scheduleSetting.scheduleSettingError.wrongBookingConfig")
    }
  }, []);
  const updateSchedule = (data) => {
    ScheduleSettingService.saveScheduleSetting({
      id: user.stationsId,
      data: data
    }).then(result => {
      if (result && result.issSuccess) {
        // fetchData();
        notification['success']({
          message: '',
          description: translation('scheduleSetting.saveSuccess')
        });
      } else {
        if (Object.keys(SCHEDULE_SETTING_ERROR).includes(result.message)) {
          notification.error({
            message: "",
            description: SCHEDULE_SETTING_ERROR[result.message]
          });
          return;
        }

        notification.error({
          message: "",
          description: translation("scheduleSetting.scheduleSettingError.error")
        });
      }
    });
  };
  const onActive = (values) => {
    let newArr=selectedPaymentOptions
    if(values){
      newArr.push(value)
      setSelectedPaymentOptions(newArr || []);
      updateSchedule({ stationPayments: newArr });
    }else{
      newArr = newArr.filter((e)=> e!= value)
      setSelectedPaymentOptions(newArr || []);
      updateSchedule({ stationPayments: newArr });
    }
  };

  return (
    <>
      {isLoading ? (
        <Spin />
      ) : (
        <div className='tingee-noti'>
          <Button type="default" icon={<LeftOutlined />} onClick={() => { setOpenContent("") }}>
          </Button>
          <Card loading={loading} className='telegram-noti_content'>
            <div className='section-title mb-2'>{optionPaymentTypes(translation, { momoBusiness: selectedPaymentOptions.includes(PAYMENT_TYPE_STATE.MOMO_PERSONAL) }).find(
              (option) => option.value === value)?.label}</div>
            <div className='mt-2'>
              <Form load form={form} onSubmit={()=>{}} layout="vertical">
                {() => (
                  <div>
                    <Row gutter={[16, 16]}>
                      <Col xs={{order:1,span:24}}  md={{order:2,span:14}} span={14}>
                        {/* <img style={{ width: "100%" }} src={tingeeBanner} alt="Banner" className='banner-image' /> */}
                      </Col>
                      <Col xs={{order:2,span:24}}  md={{order:1,span:10}} span={10}>
                        <Form.Item label={translation('telegram.active')} name="isEnable">
                          <Switch defaultChecked={isActive} onChange={(e)=>{onActive(e)}} />
                        </Form.Item>
                        {handleCheckPaymentType(value)}
                      </Col>
                    </Row>
                  </div>
                )}
              </Form>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default PaymentThirdParty;
