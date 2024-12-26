import React from 'react';
import { Button, DatePicker, Form, Input, Modal, Spin, Select } from 'antd';
import { convertStingToDate } from "helper/date";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import StationDevicesService from "../../services/StationDevicesService";
import moment from 'moment';
import { getMomentFromYear, getYearFromMoment, getDateStringFromMoment, getMomentFromDateString } from 'constants/dateFormats';
import { getStatusOptionsWithoutAll } from 'constants/device';
import dayjs from 'dayjs';
import { DATE_DISPLAY_FORMAT } from 'constants/dateFormats';

const { Option } = Select;
const ModalEditDocumentary = (props) => {
  const { isEditing, toggleEditModal, onUpdateCustomer, id, form } = props
  const currentDate = moment();
  const [ckeditor, setCkeditor] = useState()
  const [isLoading, setIsLoading] = useState(false);
  const [ckeditorWordCount, setWordcount] = useState(0)
  const inputRef = useRef()
  const { t: translation } = useTranslation()

  const statusOptions = getStatusOptionsWithoutAll(translation);
  const handleUpdate = (values) => {
    setIsLoading(true)

    Object.keys(values).forEach(k => {
      if (!values[k]) {
        delete values[k]
      }
    })

    onUpdateCustomer({
      id,
      data: {
        ...values,
        deviceTestedDate: getDateStringFromMoment(values.deviceTestedDate),
        deviceExpiredTestedDate: getDateStringFromMoment(values.deviceExpiredTestedDate),
        deviceManufactureYear: getYearFromMoment(values.deviceManufactureYear)
      }
    }, () => {
      setIsLoading(false);
    })
  }
  const disabledDate = (current) => {
    return current && current >= dayjs().endOf('day');
  };

  const fetchDeviceById = (id) => {
    StationDevicesService.getId({
      id,
    }).then((result) => {
      if (result) {
        form.setFieldsValue({
          ...result,
          deviceTestedDate: getMomentFromDateString(result.deviceTestedDate),
          deviceExpiredTestedDate: getMomentFromDateString(result.deviceExpiredTestedDate),
          deviceManufactureYear: getMomentFromYear(result.deviceManufactureYear)
        })
      }
    });
  };

  useEffect(() => {
    if (id) {
      fetchDeviceById(id)
    }
    return () => form.resetFields()
  }, [id])

  const validateTestedDate = (_, value) => {
    if(!value) {
      return Promise.reject(translation('isReq'));
    }

    let _deviceExpiredTestedDate = form.getFieldValue('deviceExpiredTestedDate');
  
    if (value && _deviceExpiredTestedDate) {
      _deviceExpiredTestedDate = _deviceExpiredTestedDate.startOf('day')
      value = value.startOf('day')
      if (value.isAfter(_deviceExpiredTestedDate, 'day')) {
        return Promise.reject(translation('device.incorrectTestedDate'));
      }
    }
    return Promise.resolve();
  };

  const validateExpiredTestedDate = (_, value) => {
    if(!value) {
      return Promise.reject(translation('isReq'));
    }
    let _deviceTestedDate = form.getFieldValue('deviceTestedDate');
    
    if (value && _deviceTestedDate) {
      _deviceTestedDate = _deviceTestedDate.startOf('day')
      value = value.startOf('day')
      if (value.isBefore(_deviceTestedDate, 'day')) {
        return Promise.reject(translation('device.incorrectExpiredDate'));
      }
    }
    return Promise.resolve();
  };

  const handleTestedDateChange = (value) => {
    form.validateFields(['deviceExpiredTestedDate']);
  };

  const requiredRule = {
    required: true,
    message: translation('isReq')
  };

  return (
    <Modal
      visible={isEditing}
      title={translation('device.titleEdit')}
      onCancel={toggleEditModal}
      width={800}
      footer={
        <>
          <Button
            onClick={toggleEditModal}
          >
            {translation("category.no")}
          </Button>
          <Button
            type="primary"
            onClick={() => {
              form.submit()
            }}
          >
            {translation('listSchedules.save')}
          </Button>
        </>
      }
    >
      {isLoading ? (
        <Spin />
      )
        : (
          <Form
            form={form}
            onFinish={handleUpdate}
            layout="vertical"
          >
            <div className="row">
              <div className="col-12 col-md-6">
                <Form.Item
                  name="deviceName"
                  label={translation('device.name')}
                  rules={[requiredRule, { pattern: new RegExp(/^\S/), message: translation('device.isReqName') }]}
                >
                  <Input placeholder={translation('device.name')} autoFocus />
                </Form.Item>
              </div>
              <div className="col-12 col-md-6">
                <Form.Item
                  name="deviceType"
                  label={translation('device.type')}
                  rules={[requiredRule, { pattern: new RegExp(/^\d/), message: translation('device.isReqType') }]}
                >
                  <Input placeholder={translation('device.type')} />
                </Form.Item>
              </div>
              <div className="col-12 col-md-6">
                <Form.Item
                  name="deviceSeri"
                  label={translation('device.serialNumber')}
                  rules={[requiredRule, { pattern: new RegExp(/^\S/), message: translation('device.isReqSeriNum') }]}
                >
                  <Input placeholder={translation('device.serialNumber')} />
                </Form.Item>
              </div>
              <div className="col-12 col-md-6">
                <Form.Item
                  name="deviceBrand"
                  label={translation('device.brand')}
                  rules={[requiredRule, { pattern: new RegExp(/^\S/), message: translation('device.isReqBrand') }]}
                >
                  <Input placeholder={translation('device.brand')} />
                </Form.Item>
              </div>
              <div className="col-12 col-md-6">
                <Form.Item
                  name="deviceManufactureYear"
                  label={translation('device.manufactureYear')}
                  rules={[requiredRule]}
                >
                  <DatePicker
                    className="w-100"
                    format="YYYY"
                    placeholder={translation('device.manufactureYear')}
                    picker="year"
                  />
                </Form.Item>
              </div>
              <div className="col-12 col-md-6">
                <Form.Item
                  name="deviceStatus"
                  label={translation('device.statusOption')}
                  rules={[requiredRule]}
                >
                  <Select placeholder={translation('device.statusOption')}>
                    {statusOptions.map((option) => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="col-12 col-md-6">
                <Form.Item
                  name="deviceTestedDate"
                  label={translation('device.testedDate')}
                  rules={[{ validator: validateTestedDate, required: true }]}
                >
                  <DatePicker placeholder={translation('device.testedDate')} format={DATE_DISPLAY_FORMAT} className='w-100' onChange={handleTestedDateChange} />
                </Form.Item>
              </div>
              <div className="col-12 col-md-6">
                <Form.Item
                  name="deviceExpiredTestedDate"
                  label={translation('device.expiredTestedDate')}
                  rules={[{ validator: validateExpiredTestedDate, required: true }]}
                >
                  <DatePicker placeholder={translation('device.expiredTestedDate')} format={DATE_DISPLAY_FORMAT} className='w-100' />
                </Form.Item>
              </div>
            </div>
          </Form>
        )}
    </Modal>
  )
}

export default ModalEditDocumentary;