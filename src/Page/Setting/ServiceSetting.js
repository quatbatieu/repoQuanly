import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Form, Select, Button, Spin, Col, Row , Checkbox , notification } from 'antd';
import { useTranslation } from 'react-i18next';
import { optionServiceType } from 'constants/setting';
import { optionPaymentTypes, PAYMENT_TYPE_STATE } from 'constants/setting';
import stationServicesServices from 'services/stationServicesServices';
import { EditOutlined } from '@ant-design/icons';
const { Option } = Select;

const LIST_STATUS = {
  delete: "DELETE",
  add: "ADD"
}

const ServiceSetting = () => {
  const [Loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const { t: translation } = useTranslation();
  const [form] = Form.useForm();
  const [isShowModal, setIsShowModal] = useState(false);
  const [showSettingModal, setShowSettingModal] = useState(null);
  const [selectedPaymentOptions, setSelectedPaymentOptions] = useState([]);
  const user = useSelector((state) => state.member)

  const paymentOptions = optionPaymentTypes(translation);
  const listServiceType = optionServiceType(translation);

  async function removeServer(data) {
    const obj = services.find((item) => item.serviceType === data);
    return await stationServicesServices.delete({ id: obj.stationServicesId });
  }

  async function addServer(data) {
    const obj = listServiceType.find((item) => item.value === data);
    const objNew = {
      serviceType: obj.value,
      servicePrice: obj.servicePrice,
      serviceName: obj.label
    }
    return await stationServicesServices.insert(objNew);
  }

  const handleSettingClick = (paymentMethod) => {
    const selectedOption = optionServiceType(translation, { momoBusiness: selectedPaymentOptions.includes(PAYMENT_TYPE_STATE.MOMO) }).find(
      (option) => option.value === paymentMethod
    );

    if (selectedOption?.modalComponent) {
      setIsShowModal(true)
      setShowSettingModal(selectedOption);
    }
  };

  const handlePaymentChange = (checkedValues) => {
    const getType = getChangeType(checkedValues, selectedPaymentOptions);
    const arrDependent = listServiceType.filter((item) => item.dependent === getType.value).map((i) => i.value);
    if (getType.type === LIST_STATUS.add) {
      const newData = [...checkedValues, ...arrDependent];
      form.setFieldsValue({
        serviceOptions: newData
      });
      return;
    }

    const newData = checkedValues.filter((item) => !arrDependent.includes(item));
    form.setFieldsValue({
      serviceOptions: newData
    });

  };
  
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
    return changes[0] || {};
  }

  const onFinish = async (values) => {
    setLoading(true);
    let error = false;
    const result = processDynamicArray(services.map((item) => item.serviceType), values.serviceOptions);

    for (let i = 0; i < result.removedElements.length; i++) {
      if (error) {
        break;
      }
      const item = result.removedElements[i];

      const res = await removeServer(item);
      if (!res.issSuccess) {
        error = true;
      }
    }

    for (let i = 0; i < result.addedElements.length; i++) {
      if (error) {
        break;
      }

      const item = result.addedElements[i];
      const res = await addServer(item);
      if (!res.issSuccess) {
        error = true;
      }
    }

    if (!error) {
      notification['success']({
        message: '',
        description: translation('scheduleSetting.saveSuccess')
      });
    }else {
      notification.error({
        message: "",
        description: translation('scheduleSetting.saveError')
      })
    }
    fetchData();
  };

  function processDynamicArray(originalArray, updatedArray) {
    const addedElements = updatedArray.filter((element) => !originalArray.includes(element));
    const removedElements = originalArray.filter((element) => !updatedArray.includes(element));

    const newArray = originalArray.concat(addedElements).filter((element) => !removedElements.includes(element));

    return {
      newArray,
      addedElements,
      removedElements,
    };
  }


  const fetchData = () => {
    setLoading(true)
    stationServicesServices.getList().then(result => {
      if (result) {
        setServices(result)
      }
      setLoading(false)
    })
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (Loading) {
    return (
      <Spin />
    )
  }

  return (
    <Row>
      <Col span={16} xxl={16} xl={16} lg={12} md={24} sm={24} xs={24}>
        <Form layout="vertical" onFinish={onFinish} form={form} fields={[
          {
            name: ['serviceOptions'],
            value: services.map((item) => item.serviceType)
          },
        ]}>
          <Row>
            <Col span={24}>
              <Form.Item name="serviceOptions" label={translation("setting.service.description")}>
                <Checkbox.Group onChange={handlePaymentChange}>
                  <Row>
                    {listServiceType.map((item, index) => {
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

export default ServiceSetting;