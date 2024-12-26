import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Form, Select, Button, Row, Spin, Checkbox, Col, notification } from 'antd';
import { useTranslation } from 'react-i18next';
import ScheduleSettingService from 'services/scheduleSettingService';
import { optionPaymentTypes, PAYMENT_TYPE_STATE } from 'constants/setting';
import { EditOutlined } from '@ant-design/icons';

const { Option } = Select;

const LIST_STATUS = {
  delete: "DELETE",
  add: "ADD"
}

const PaymentSetting = () => {
  const { t: translation } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [setting, setSetting] = useState([]);
  const [form] = Form.useForm();
  const [isShowModal, setIsShowModal] = useState(false);
  const [showSettingModal, setShowSettingModal] = useState(null);
  const [selectedPaymentOptions, setSelectedPaymentOptions] = useState([]);

  const paymentOptions = optionPaymentTypes(translation);
  const user = useSelector((state) => state.member);

  const fetchData = async () => {
    setLoading(true);
    const result = await ScheduleSettingService.getDetailById({ id: user.stationsId });
    if (result) {
      setSetting(result);
      let newArr= []
      for(let i=0;i<result.stationPayments.length;i++){
        newArr.push(result.stationPayments[i])
      }
      setSelectedPaymentOptions(newArr || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getChangeType = (newValues, oldValues) => {
    let changes = [];

    oldValues.forEach(value => {
      if (!newValues.includes(value)) {
        changes.push({ type: LIST_STATUS.delete, value });
      }
    });

    newValues.forEach(value => {
      if (!oldValues.includes(value)) {
        changes.push({ type: LIST_STATUS.add, value });
      }
    });

    return changes[0];
  }


  const handlePaymentChange = (checkedValues) => {
    const getType = getChangeType(checkedValues, selectedPaymentOptions);

    const arrDependent = paymentOptions.filter((item) => item.dependent === getType.value).map((i) => i.value);

    if (getType.type === LIST_STATUS.add) {
      const newData = [...checkedValues, ...arrDependent];
      setSelectedPaymentOptions(newData);
      form.setFieldsValue({
        stationPayments: newData
      });
      return;
    }

    const newData = checkedValues.filter((item) => !arrDependent.includes(item));
    setSelectedPaymentOptions(newData);
    form.setFieldsValue({
      stationPayments: newData
    });
  };

  const SCHEDULE_SETTING_ERROR = useMemo(() => {
    return {
      INVALID_STATION: translation("scheduleSetting.scheduleSettingError.invalidStation"),
      WRONG_BOOKING_CONFIG: translation("scheduleSetting.scheduleSettingError.wrongBookingConfig")
    }
  }, []);

  const updateSchedule = (data) => {
    if(data.stationPayments.length<= 0 ){
      notification.error({
        message: "",
        description: translation("scheduleSetting.scheduleSettingError.PaymentRequire")
      });
      return
    }
    ScheduleSettingService.saveScheduleSetting({
      id: user.stationsId,
      data: data
    }).then(result => {
      if (result && result.issSuccess) {
        fetchData();
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

  const handleSettingClick = (paymentMethod) => {
    const selectedOption = optionPaymentTypes(translation, { momoBusiness: selectedPaymentOptions.includes(PAYMENT_TYPE_STATE.MOMO) }).find(
      (option) => option.value === paymentMethod
    );

    if (selectedOption?.modalComponent) {
      setIsShowModal(true)
      setShowSettingModal(selectedOption);
    }
  };

  const onFinish = (values) => {
    updateSchedule({ stationPayments: values.stationPayments });
  };

  if (loading) {
    return <Spin />;
  }

  return (
    <Row>
      <Col span={16} xxl={16} xl={16} lg={12} md={24} sm={24} xs={24}>
        <Form layout="vertical" onFinish={onFinish} form={form} fields={[
          {
            name: ['stationPayments'],
            value: selectedPaymentOptions
          },
        ]}>
          <Row>
            <Col span={24}>
              <Form.Item name="stationPayments" label={translation("setting.payment.title")}>
                <Checkbox.Group onChange={handlePaymentChange} value={selectedPaymentOptions}>
                  <Row>
                    {paymentOptions.map((item, index) => {
                      const option = {
                        label: item.label,
                        value: item.value,
                        disabled: item.disabled,
                      };
                      if (item.modalComponent) {
                        option.icon = (
                          <Button
                            type="link"
                            icon={<EditOutlined />}
                            onClick={() => handleSettingClick(item.value)}
                          />
                        );
                      }
                      return (
                        <Col span={24} lg={12} xl={8} key={index}>
                          {!option.disabled && (
                            <Checkbox key={index} value={option.value} disabled={option.disabled} >
                              {option.label}
                              {option.icon}
                            </Checkbox>
                          )}
                        </Col>
                      );
                    })}
                  </Row>
                </Checkbox.Group>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  {translation("save")}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Col>
      {isShowModal && (
        <showSettingModal.modalComponent
          isOpen={isShowModal}
          setIsOpen={() => setIsShowModal(false)}
        />
      )}
    </Row>
  );
};

export default PaymentSetting;
