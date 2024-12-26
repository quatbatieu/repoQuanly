import React from 'react';
import { Button, DatePicker, Form, Input, Modal, Spin, Select } from 'antd';
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getYearFromMoment } from 'constants/dateFormats';
import { getStatusOptionsWithoutAll } from 'constants/device';
import { DATE_DISPLAY_FORMAT } from 'constants/dateFormats';
import moment from 'moment';
import dayjs from 'dayjs';
const { Option } = Select;
const ModalAddDocumentary = (props) => {
  const { isAdd, toggleAddModal, onCrateNew, form, inputRef } = props
  const currentDate = moment();
  const [ckeditor, setCkeditor] = useState()
  const [isLoading, setIsLoading] = useState(false);
  const [previewTitle, setPreviewTitle] = useState('');
  const [indexEditModalName, setIndexEditModalName] = useState(null);
  const [openEditModalName, setOpenEditModalName] = useState(false);
  const { t: translation } = useTranslation();

  const statusOptions = getStatusOptionsWithoutAll(translation);
  async function handleCreateNew(values) {
    setIsLoading(true);
    const deviceTestedDate = values.deviceTestedDate ? values.deviceTestedDate.format(DATE_DISPLAY_FORMAT) : "";
    const deviceExpiredTestedDate = values.deviceExpiredTestedDate ? values.deviceExpiredTestedDate.format(DATE_DISPLAY_FORMAT) : "";

    Object.keys(values).forEach(k => {
      if (!values[k]) {
        delete values[k]
      }
    })
    const newData = {
      ...values,
      deviceTestedDate: deviceTestedDate,
      deviceExpiredTestedDate: deviceExpiredTestedDate,
      deviceManufactureYear: getYearFromMoment(values.deviceManufactureYear)
    }

    onCrateNew(newData, () => {
      setIsLoading(false);
    });
  }
  const disabledDate = (current) => {
    return current && current >= dayjs().endOf('day');
  };

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
      visible={isAdd}
      title={translation('device.titleAdd')}
      onCancel={toggleAddModal}
      width={800}
      footer={
        <>
          <Button
            onClick={toggleAddModal}
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
      <Form
        form={form}
        onFinish={handleCreateNew}
        layout="vertical"
        onValuesChange={(values) => {
          if (values.customerRecordPlatenumber) {
            form.setFieldsValue({
              customerRecordPlatenumber: values.customerRecordPlatenumber.toUpperCase()
            })
          }
        }}
      >
        {isLoading ? (
          <Spin />
        ) : (
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
        )}
      </Form>
    </Modal>
  )
}

export default ModalAddDocumentary;