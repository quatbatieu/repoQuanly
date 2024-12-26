import React, { useEffect, useState, useRef, Fragment } from 'react';
import ReactToPrint from 'react-to-print';
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux';
import './addBooking.scss'
import { DatePicker, Button, Input, Select, notification, Form, Radio, Card, Modal, Typography } from 'antd';
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
import { validatorPhoneAllowEmpty, validatorPhone, validatorEmailAllowEmpty } from 'helper/commonValidator';
// import _verifyCarNumber from 'constants/licenseplates';
import { changeTime } from 'helper/changeTime';

import { PrinterOutlined, PlusOutlined } from '@ant-design/icons';
import CardSchedule from './CardSchedule';
import AuthPunish from 'Page/Punish/authPunish'
import { optionVehicleType } from 'constants/vehicleType';
import { USER_ROLES } from 'constants/permission';
import { geScheduleError } from 'constants/errorMessage';
import UnLock from 'components/UnLock/UnLock';

const { Option } = Select

const INFO_URL = "http://thongtinphatnguoi.com/"

function Booking({ isFetchTime = false }) {
  const { t: translation } = useTranslation()
  const { state } = useLocation()
  const setting = useSelector(state => state.setting)
  const user = useSelector(state => state.member)
  const { enableConfigBookingOnToday , enableConfigAllowBookingOverLimit } = setting;
  const isAdmin = USER_ROLES.ADMIN === user.appUserRoleId;
  const setExceed = (enableConfigBookingOnToday === 1) || isAdmin ? 1 : 0;

  const [isAddBookingSuccess, setIsAddBookingSuccess] = useState(false)
  const [notificationMethod, setNotificationMethod] = useState("SMS")
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const [schedule, setSchedule] = useState({})
  const [listDate, setListDate] = useState([]);
  const [listtime, setListTime] = useState([]);

  const nextMonth = moment().add(1, 'month').subtract(setExceed, 'day').format('DD/MM/YYYY');
  const [vehicleType, setVehicleType] = useState(1);
  const [date, setdate] = useState(null);
  const printRef = useRef(null);

  const SCHEDULE_ERROR = geScheduleError(translation);
  const fetchDataDate = () => {
    stationsService.getDate({
      stationsId: user.stationsId,
      startDate: moment().subtract(setExceed, 'day').format("DD/MM/YYYY"),
      endDate: nextMonth,
      vehicleType
    }).then(result => {
      if (result) {
        setListDate(result);
      }
    })
  }

  const fetchDataTime = () => {
    stationsService.getTime({
      stationsId: user.stationsId,
      date,
      vehicleType
    }).then(result => {
      if (result) {
        setListTime(result)
      }
    })
  }

  const onFinish = (values) => {
    setLoading(true)
    const newDate = {
      notificationMethod,
      scheduleType:1,
      ...values,
    }
    // setSchedule(values);
    // setIsAddBookingSuccess(true);
    AddBookingService.AddBooking({
      ...newDate,
      licensePlates: values.licensePlates.toUpperCase()
    }).then(async (result) => {
      if (result && result.issSuccess) {
        await setSchedule(result.data);
        form.resetFields();
        setIsAddBookingSuccess(true)
      } else {
        if (Object.keys(SCHEDULE_ERROR).includes(result.error)) {
          notification['error']({
            message: '',
            description: SCHEDULE_ERROR[result.error]
          });
          return;
        } else {
          notification['error']({
            message: "",
            description: translation('addBookingSuccess.errorExists')
          })
          return;
        }
      }
    })
    setTimeout(() => {
      setLoading(false)
    }, 2000);
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
    if (date) {
      fetchDataTime();
    }
  }, [date])

  function handleRefresh() {
    form.resetFields()
    setIsAddBookingSuccess(false)
  }

  return (
    <Fragment>
     {setting.enableScheduleMenu === 0 ? <UnLock /> :
      <div className='row mt-4'>
      {!isAddBookingSuccess ?
        <>
          <div className='create_new_customer col-12 col-lg-5'>
            <main className="booking_main">
              <div className="booking-form">
                <>
                  <div className="booking-title">{translation('landing.booking-title')}</div>
                  <Form
                    form={form}
                    name="addBooking"
                    autoComplete="off"
                    onFinish={onFinish}
                    size="small"
                    colon={false}
                    labelAlign="right"
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
                      xl: 7,
                      lg: 24,
                      md : 24,
                      span: 7,
                    }}
                    wrapperCol={{
                      xl: 17,
                      lg: 24,
                      md : 24,
                      span: 17,
                    }}
                  >
                    <div className="row d-flex justify-content-center">
                      <Form.Item
                        name="fullnameSchedule"
                        className="col-12 col-md-12 col-lg-12"
                        label={translation('landing.fullname')}
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: translation('accreditation.isRequire')
                      //   }
                      // ]}
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
                        className="col-12 col-md-12 col-lg-12"
                        label={translation('Email')}
                        rules={[
                          {
                            message: translation('invalidEmail'),
                            pattern: new RegExp(/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/gm)
                          }
                        ]}
                      >
                        <Input
                          type="email"
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
                          disabled={!date}
                        >
                          {
                            listtime.map((item, i) => {
                              item.scheduleTimeStatus = item.scheduleTimeStatus === 99 ? 0 : item.scheduleTimeStatus;
                              const endTime = item.scheduleTime.split("-")[1];
                              const timePresent = moment();
                              const timeItem = moment(changeTime(endTime), "H[h]mm")
                              const isSameDate = timePresent.format("DD/MM/YYYY") === date;
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

                    <div className="row d-flex justify-content-center">
                      <Form.Item shouldUpdate className="col-12">
                        {(values) => {
                          const isError = values.getFieldsError().every(item => item.errors.length === 0);
                          return (
                            <div className='d-flex justify-content-end w-100'>
                              <Button
                                type='primary'
                                data-loading-text={translation('landing.processing')}
                                size="middle"
                                htmlType={isError ? "submit" : "button"}
                                loading={loading}
                              >
                                {translation('landing.send')}
                              </Button>
                            </div>
                          )
                        }}
                      </Form.Item>
                    </div>
                  </Form>
                </>
              </div>
            </main>
          </div>
          <div className='col-12 col-lg-7'>
            <div className='p-3 m-1'>
              <AuthPunish plateNumber={state?.plateNumber || ""} />
            </div>
          </div>
        </>
        : (
          <Modal
            title={translation("booking.modalTitle")}
            visible={isAddBookingSuccess}
            onCancel={() => setIsAddBookingSuccess(false)}
            footer={
              <>
                <Button onClick={() => setIsAddBookingSuccess(false)}>
                  {translation("landing.close")}
                </Button>
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
                <Button
                  key="submit"
                  className='d-inline-flex align-items-center' icon={<PlusOutlined />}
                  onClick={() => setIsAddBookingSuccess(false)}
                >
                  {translation("landing.send")}
                </Button>
              </>
            }
          >
            <div ref={printRef}>
              <CardSchedule schedule={{
                ...schedule , 
                stationsAddress : setting.stationsAddress
              }} />
            </div>
          </Modal>
        )
      }
      </div>
     }
    </Fragment>
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
export default Booking;