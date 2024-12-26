import React, { useEffect, useState , useRef } from 'react';
import ReactToPrint from 'react-to-print';
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux';
import './addBooking.scss'
import { DatePicker, Button, Input, Select, Typography , Form, Radio, Card, Modal } from 'antd';
import { validateEmail } from '../../helper/common';
import AddBookingService from '../../services/addBookingService'
import AddBookingSuccessImage from "./../../assets/icons/addBookingSuccess.png"
import moment from 'moment';
import LoginService from '../../services/loginService';
import ScheduleSettingService from 'services/scheduleSettingService';
import stationsService from 'services/stationsService';
import { IconCar } from "../../assets/icons"
import _ from 'lodash';
import { validatorPlateNumber } from 'helper/licensePlateValidator';
import { validatorPhoneAllowEmpty, validatorPhone, validatorEmailAllowEmpty} from 'helper/commonValidator';
import { PrinterOutlined } from '@ant-design/icons';
// import _verifyCarNumber from 'constants/licenseplates';
import { optionVehicleType } from 'constants/vehicleType';
import { changeTime } from 'helper/changeTime';
import { USER_ROLES } from 'constants/permission';
import { QRCodeCanvas } from 'qrcode.react';

import CardSchedule from './CardSchedule';

const { Option } = Select

const INFO_URL = "http://thongtinphatnguoi.com/"

function ModalAddBooking({ onModalClose, isModalOpen , isScreenChat = false , values, onSubmit, isEdit = false }) {
  const { t: translation } = useTranslation()
  const [isAddBookingSuccess, setIsAddBookingSuccess] = useState(false)
  const [dataCaptcha, setDataCaptcha] = useState({})
  const [notificationMethod, setNotificationMethod] = useState("SMS")
  const [form] = Form.useForm()
  const [schedule, setSchedule] = useState({})
  const [listDate, setListDate] = useState([]);
  const [listtime, setListTime] = useState([]);

  const [vehicleType, setVehicleType] = useState(1);
  const [date, setdate] = useState(null);
  const setting = useSelector(state => state.setting)
  const user = useSelector(state => state.member)
  const { enableConfigBookingOnToday , enableConfigAllowBookingOverLimit } = setting;
  const isAdmin = USER_ROLES.ADMIN === user.appUserRoleId;
  const setExceed = (enableConfigBookingOnToday === 1) || isAdmin ? 1 : 0;

  const nextMonth = moment().add(setExceed, 'month').subtract(2, 'day').format('DD/MM/YYYY');
  const printRef = useRef(null);

  const fetchDataDate = () => {
    stationsService.getDate({
      stationsId: user.stationsId,
      startDate: moment().subtract(setExceed, 'day').format("DD/MM/YYYY"),
      endDate: nextMonth,
      vehicleType
    }).then(result => {
      setListDate(result || []);
    })
  }

  const fetchDataTime = () => {
    stationsService.getTime({
      stationsId: user.stationsId,
      date : date || values.dateSchedule,
      vehicleType
    }).then(result => {
      setListTime(result || [])
    })
  }

  const onFinish = async (values) => {

    const newDate = {
      notificationMethod,
      ...values,
    }
    const data = await onSubmit({
      ...newDate,
      licensePlates: values.licensePlates.toUpperCase(),
      dateSchedule: values.dateSchedule
    })
    if (data?.data && !isEdit) {
      await setSchedule(data.data);
      setIsAddBookingSuccess(true)
      setDataCaptcha({})

    }
  }

  const optionsColor = [
    {
      value: 1,
      lable: <div className="accreditation__parent">
        {translation("accreditation.white")}

        <IconCar className=" accreditation__circle-white" />
      </div>
    },
    {
      value: 2,
      lable: <div className="accreditation__parent">
        {translation("accreditation.blue")}

        <IconCar className=" accreditation__circle-blue" />

      </div>
    },
    {
      value: 3,
      lable: <div className="accreditation__parent">
        {translation("accreditation.yellow")}

        <IconCar className=" accreditation__circle-yellow" />

      </div>
    }
  ]

  const listVehicleType = optionVehicleType(translation);

  useEffect(() => {
    fetchDataDate();
  }, [vehicleType])

  useEffect(() => {
    if (date || values.dateSchedule) {
      fetchDataTime();
    }
  }, [date , values.dateSchedule])

  useEffect(() => {
    if (form) {
      form.setFieldsValue({ ...values });
    }
  }, [values])

  function handleRefresh() {
    form.resetFields()
    setIsAddBookingSuccess(false)
    onModalClose(false)
  }

  return (
    <Modal
      title={<p className='m-0'>{!isEdit ? translation("booking.titleAdd") : translation("booking.titleEdit") } </p>}
      visible={isModalOpen}
      onCancel={() => onModalClose(false)}
      footer={
        <>
          <Button type="link" onClick={() => onModalClose(false)}>
            {translation("booking.cancel")}
          </Button>
          {(!isEdit && isAddBookingSuccess) &&
            <ReactToPrint
              trigger={() => (
                <Button
                  className='d-inline-flex align-items-center'
                  type="primary" icon={<PrinterOutlined />}
                >
                  {translation("landing.print")}
                </Button>
              )}
              content={() => printRef.current}
            >
            </ReactToPrint>
          }
          <Button key="submit" type="primary" onClick={() => {
            if(!isAddBookingSuccess) {
              form.submit();
              return;
            }
            setIsAddBookingSuccess(false);
            form.resetFields();
          }}>
            {!isEdit ? translation("booking.btnAdd") : translation("booking.btnEdit")}
          </Button>
        </>
      }
    >
      <main className="booking_main">
        <div className="booking-form">
          {!isAddBookingSuccess ? <>
            <Form
              form={form}
              name="addBooking"
              autoComplete="off"
              onFinish={onFinish}
              size="small"
              colon={false}
              initialValues={{
                vehicleType: 1,
                licensePlateColor: 1
              }}
              onValuesChange={(values) => {
                if (values.licensePlates) {
                  form.setFieldsValue({
                    licensePlates: values.licensePlates.toUpperCase()
                  })
                }

                if (values.vehicleType) {
                  setVehicleType(values.vehicleType);
                }
                if (values.dateSchedule) {
                  setdate(values.dateSchedule)
                }
              }}
              labelCol={{
                span: 6,
              }}
              wrapperCol={{
                span: 18,
              }}
            >
              <div className="row d-flex justify-content-center">
                <Form.Item
                  name="fullnameSchedule"
                  className="col-12 col-md-12 col-lg-12"
                  label={translation('landing.fullname')}
                >
                  <Input
                    type="text"
                    size="middle"
                    placeholder="Nguyễn văn A"
                    autoFocus
                  />
                </Form.Item>
              </div>

              <div className="row d-flex justify-content-center">
                <Form.Item
                  name="phone"
                  rules={notificationMethod === "SMS" ? [
                    {
                      required: true,
                      validator(_, value) {
                        return validatorPhone(value, translation);
                      }
                    }
                  ] : [
                    {
                      required: false,
                      validator(_, value) {
                        return validatorPhoneAllowEmpty(value, translation);
                      }
                    }
                  ]}
                  label={translation('landing.phoneNumber')}
                  className="col-12 col-md-12 col-lg-12"
                >
                  <Input
                    type="text"
                    size="middle"
                    placeholder="0348928492"
                  />
                </Form.Item>
              </div>

              <div className="row d-flex justify-content-center">
                <Form.Item
                  name="email"
                  rules={[
                    {
                      message: translation('invalidEmail'),
                      pattern: new RegExp(/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/gm)
                    }
                  ]}
                  className="col-12 col-md-12 col-lg-12"
                  label={translation('Email')}
                >
                  <Input
                    type="text"
                    size="middle"
                    placeholder="ttdk@gmail.com"
                  />
                </Form.Item>
              </div>

              <div className="row d-flex justify-content-center">
                <Form.Item
                  name="licensePlates"
                  rules={[
                    {
                      required: true,
                      validator(_, value) {
                        return validatorPlateNumber(value, translation);
                      }
                    }
                  ]}
                  label={translation('landing.license-plates')}
                  className="col-12 col-md-12 col-lg-12"
                >
                  <Input
                    type="text"
                    size="middle"
                    placeholder="30A48393"
                  />
                </Form.Item>
              </div>

              <div className="row d-flex justify-content-center">
                <Form.Item
                  name="licensePlateColor"
                  rules={[
                    {
                      required: true,
                      message: translation('accreditation.isRequire')
                    }
                  ]}
                  className="col-12"
                  label={translation('accreditation.licensePlateColorLabel')}
                >
                  <Radio.Group className='licensePlateColor'>
                    {
                      optionsColor.map((color, _) => {
                        return (
                          <Radio key={color.value} value={color.value}>{color.lable}</Radio>
                        )
                      })
                    }
                  </Radio.Group>
                </Form.Item>
              </div>

              <div className="row d-flex justify-content-center">
                <Form.Item
                  name="vehicleType"
                  rules={[
                    {
                      required: true,
                      message: translation('accreditation.isRequire')
                    }
                  ]}
                  className="col-12"
                  label={translation('landing.vehicleType')}
                >
                  <Select
                    size='middle'
                    placeholder={translation('landing.select-vehicleType')}
                    options={listVehicleType}
                  >
                  </Select>
                </Form.Item>
              </div>

              <div className="row d-flex justify-content-center">
                <Form.Item
                  name="dateSchedule"
                  className="col-12 col-md-12 col-lg-12"
                  rules={[
                    {
                      required: true,
                      message: translation('accreditation.isRequire')
                    }
                  ]}
                  label={translation('landing.date')}
                >
                  <Select
                    placeholder={translation('landing.select-date')}
                    size="middle"
                    disabled={!vehicleType}
                  >
                    {
                      listDate.map((item) => {
                        item.scheduleDateStatus = item.scheduleDateStatus === 99 ? 0 : item.scheduleDateStatus;
                        const isFull = item.scheduleDateStatus === 0 && item.totalBookingSchedule > 0 && item.totalSchedule > 0;

                        const isLimit = enableConfigAllowBookingOverLimit === 1;
                        const notSetMore = !isLimit && isFull && !isAdmin;

                        if(isFull) {
                          item.scheduleDateStatus = 99;
                        }

                        return (
                          <Option disabled={item.scheduleDateStatus === 0 || notSetMore} value={item.scheduleDate} key={item.scheduleDate}>
                            <OptionSelect
                              value={item.scheduleDate}
                              status={item.scheduleDateStatus}
                              total={item.totalSchedule}
                              totalBooking={item.totalBookingSchedule}
                            />
                          </Option>
                        )
                      })}
                  </Select>
                </Form.Item>
              </div>

              <div className="row d-flex justify-content-center">
                <Form.Item
                  name="time"
                  className="col-12 col-md-12 col-lg-12"
                  rules={[
                    {
                      required: true,
                      message: translation('accreditation.isRequire')
                    }
                  ]}
                  label={translation('landing.time')}
                >
                  <Select
                    size='middle'
                    placeholder={translation('landing.select-time')}
                    disabled={!date && !values.dateSchedule}
                  >
                    {
                      listtime.map((item, i) => {
                        item.scheduleTimeStatus = item.scheduleTimeStatus === 99 ? 0 : item.scheduleTimeStatus;
                        const endTime = item.scheduleTime.split("-")[1];
                        const timePresent = moment();
                        const timeItem = moment(changeTime(endTime) , "H[h]mm")
                        const isSameDate = timePresent.format("DD/MM/YYYY") ===  (date || values.dateSchedule);
                        const isPastTime = timePresent.isAfter(timeItem) && isSameDate;
                        const isFull = item.scheduleTimeStatus === 0 && item.totalBookingSchedule > 0 && item.totalSchedule > 0;
                        const isDisabled = (item.scheduleTimeStatus === 0) && !isFull;
                        
                        const isLimit = enableConfigAllowBookingOverLimit === 1;
                        const notSetMore = !isLimit && isFull && !isAdmin;
                        
                        if(isDisabled) {
                          return <></>
                        }

                        if(isFull) {
                          item.scheduleTimeStatus = 99;
                        }
                        
                        if (isPastTime) {
                          item.scheduleTimeStatus = 2;
                        }
                        return (
                          <Option disabled={isDisabled || isPastTime || notSetMore} value={item.scheduleTime} key={item.scheduleTime}>
                            <OptionSelect
                              value={changeTime(item.scheduleTime)}
                              status={item.scheduleTimeStatus}
                              total={item.totalSchedule}
                              totalBooking={item.totalBookingSchedule}
                            />
                          </Option>
                        )
                      })}
                  </Select>
                </Form.Item>
              </div>

              <div hidden className="ant-col ant-form-item-control">
                <Radio.Group onChange={(e) => {
                  const value = e.target.value
                  setNotificationMethod(value)
                }} value={notificationMethod}>
                  <Radio value="SMS">SMS</Radio>
                  <Radio value="Email">EMAIL</Radio>
                </Radio.Group>
                <div className="ant-form-item-explain ant-form-item-explain-error" />
              </div>
            </Form>
          </> : (
            <div ref={printRef}>
              <CardSchedule schedule={schedule} />
            </div>
          )
          }
        </div>
      </main>
    </Modal>
  )
}

const OptionSelect = ({ value, status, total, totalBooking }) => {
  let className = "";
  const isDisabled = status === 0;
  const isPastTime = status === 2;
  const isFull = status === 99;

  if(isDisabled) {
    className = "disabled";
  }

  if(isPastTime) {
    className = "pastTime";
  }

  if(isFull) {
    className = "full";
  }
  
  return (
    <div className={`booking__option ${className}`}>
      <div>
        {value}
      </div>
      <div className={`booking__right  ${className}`}>
        {!isDisabled && `${totalBooking}/${total}`}
      </div>
    </div>
  )
}

export default ModalAddBooking;

