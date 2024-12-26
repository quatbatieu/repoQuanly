import React from 'react';
import { routes } from 'App';
import { ModalPrint } from 'Page/Schedule/listSchedule';
import { Button, Drawer, Input, Modal, Popconfirm, Select, Spin, Typography, Tag, notification } from 'antd';
import { getListVehicleTypes } from 'constants/listSchedule';
import { USER_ROLES } from 'constants/permission';
import { changeTime } from 'helper/changeTime';
import { QRCodeCanvas } from 'qrcode.react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { ReactComponent as Circle } from '../../assets/icons/Circle.svg';
import AccreditationService from '../../services/accreditationService';
import createNewConverstationUser from '../../services/createNewConverstionUser';
import ListSchedulesService from '../../services/listSchedulesService';
import ModalAddBooking from './ModalAddBooking';
import './addBooking.scss';
import HistoryDetailBooking from './HistoryDetailBooking';
import { SCHEDULE_STATUS } from 'constants/listSchedule';
import { getPaymentStatusList, PAYMENT_STATE } from 'constants/receipt'
import { InfoCircleTwoTone, PayCircleFilled } from '@ant-design/icons';
import moment from 'moment';
import { DATE_DISPLAY_FORMAT_HOURS } from 'constants/dateFormats';
import { PopupHeaderContainer } from 'components/PopupHeader/PopupHeader';
import useCommonData from 'hooks/CommonData';
const { TextArea } = Input;
const INFO_URL = "http://thongtinphatnguoi.com/"

function ModalDetailBooking() {
  const { t: translation } = useTranslation()
  const history = useHistory();
  const [isOpenPrint, setIsOpenPrint] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState({})
  const [visible, setVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [schedule, setSchedule] = useState({});
  const [value, setValue] = useState("");
  const user = useSelector(state => state.member)
  const { metaData } = useCommonData()
  const PAYMENT_LIST = getPaymentStatusList(translation);
  const { id } = useParams();
  const receiverId = schedule?.appUserId
  const isUnConfimred = schedule.CustomerScheduleStatus === 0;
  const isConfirm = schedule.CustomerScheduleStatus === 10;
  const isCustomerRecord = schedule.customerRecordId > 0;
  const isScheduleStation = schedule.station?.stationCode === user.stationCode;

  const BindPlate = ({ type, number }) => {
    const colors = {
      1: '#fffff',
      2: '#0050B3',
      3: '#FFC53D',
      4: '#FF4D4F'
    }

    const style = {
      width: "100%",
      height: 41,
      borderRadius: 8,
      padding: "0px 20px",
      fontWeight: 500
    }

    return (
      <Tag
        className="plate-tag white d-flex align-items-center justify-content-center"
        color={colors[type]}
        style={colors[type] === colors[2] ? { color: '#fff', ...style } : { ...style }}
      >
        {number}
      </Tag>
    )
  }

  const fetchData = async () => {
    setIsLoading(true);
    await ListSchedulesService.findId(id).then((result) => {
      if (result) {
        setSchedule(result);
      } else {
        notification['error']({
          message: "",
          description: translation("listSchedules.errorInfo")
        })
      }
      setIsLoading(false);
    })
  }

  const onOpenModal = (data) => {
    toggleVisible()
    setSchedule(data)
  }

  const toggleVisible = () => {
    setVisible(prev => !prev);
  };

  function handleUpdateState(record) {
    if (record && record.CustomerScheduleStatus === 0) {
      ListSchedulesService.updateSchedule({
        customerScheduleId: record.customerScheduleId,
        data: { CustomerScheduleStatus: 10 }
      }).then(result => {
        if (result && result.isSuccess) {
          notification.success({
            message: "",
            description: translation('listCustomers.success', {
              type: translation('listCustomers.handle')
            })
          })
          fetchData()
        } else {
          notification.error({
            message: "",
            description: translation('listCustomers.failed', {
              type: translation('listCustomers.handle')
            })
          })
        }
      })
    } else {
      ListSchedulesService.updateSchedule({
        customerScheduleId: record.customerScheduleId,
        data: { CustomerScheduleStatus: 0 }
      }).then(result => {
        if (result && result.isSuccess) {
          notification.success({
            message: "",
            description: translation('listCustomers.success', {
              type: translation('listCustomers.handle')
            })
          })
          fetchData()
        } else {
          notification.error({
            message: "",
            description: translation('listCustomers.failed', {
              type: translation('listCustomers.handle')
            })
          })
        }
      })
    }
  }

  const onDeleteSchedule = (id, message) => {
    ListSchedulesService.deleteSchedule({ customerScheduleId: id, reason: message })
      .then(result => {
        if (result && result.isSuccess) {
          notification['success']({
            message: '',
            description: translation('listSchedules.deleteSuccessfully')
          });
          fetchData()
        } else {
          notification['error']({
            message: '',
            description: translation('listSchedules.deletefailed')
          });
        }
      })
  }

  const createNewChatUserHandler = (receiverId) => {
    createNewConverstationUser.createNewChatUser({
      receiverId: receiverId,
      appUserChatLogContent: "Chào bạn"
    }).then(result => {
      if (result.statusCode === 200) {
        notification.success({
          message: "",
          description: translation('category.updateSuccess', {
            type: translation('category.updateSuccess')
          })
        })
        history.push("/chat")

      } else {
        notification.error({
          message: "",
          description: translation('category.updateFailed', {
            type: translation('category.updateFailed')
          })
        })
      }
    })
  }

  function handleCreateNewCustomer(values) {
    AccreditationService.registerFromSchedule({
      customerScheduleId: values.customerScheduleId,
    }).then(result => {
      if (result.isSuccess) {
        notification['success']({
          message: "",
          description: translation('accreditation.addSuccess')
        })
        fetchData();
      }
      else {
        if (
          result.error === "DUPLICATED_RECORD_IN_ONE_DAY" ||
          result.error === "DUPLICATE_LINKED_BOOKING_SCHEDULE"
        ) {
          notification['error']({
            message: "",
            description: translation('listSchedules.errorExists')
          })
          return;
        }
        notification['error']({
          message: "",
          description: translation('accreditation.addFailed')
        })
      }
    })
  }

  const onUpdateSchedule = (values) => {
    Object.keys(values).map(key => {
      if (!values[key])
        delete values[key]
    })

    ListSchedulesService.updateSchedule({
      "customerScheduleId": id,
      "data": {
        ...values,
        "dateSchedule": values.dateSchedule
      }
    }).then(result => {
      if (result && result.isSuccess) {
        toggleVisible()
        fetchData()
        notification['success']({
          message: '',
          description: translation('listSchedules.updateSuccessfully')
        });
      } else {
        notification['error']({
          message: '',
          description: translation('listSchedules.updateFailed')
        });
      }
    })
  }

  const onUpdateScheduleNote = (data) => {
    Object.keys(data).map(key => {
      if (!data[key])
        delete data[key]
    })
    ListSchedulesService.updateSchedule({
      "customerScheduleId": id,
      "data": data
    }).then(result => {
      if (result && result.isSuccess) {
        fetchData()
        notification['success']({
          message: '',
          description: translation('listSchedules.updateSuccessfully')
        });
      } else {
        notification['error']({
          message: '',
          description: translation('listSchedules.updateFailed')
        });
      }
    })
  }
  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id])

  return (
    <Drawer
      title={
        <PopupHeaderContainer
          screenHeaderTitle={translation('DetailSchedules.title')}
          onCloseButtonClick={() => history.push(routes.customerSchedule.path)}
        />
      }
      placement="right"
      className="drawerSchedule"
      visible={true}
      closable={false}
      footer={
        <div className="d-flex align-items-center justify-content-center modalDetailBooking-action flex-wrap">
          {((isConfirm || isUnConfimred) && USER_ROLES.ADMIN === user.appUserRoleId && isScheduleStation) &&
            <>
              <ModalDeleteCalendar onOk={(message) => {
                onDeleteSchedule(schedule && schedule.customerScheduleId, message)
              }} />
            </>
          }
          {(isUnConfimred && isScheduleStation) &&
            <Popconfirm
              title={translation("box-confirm")}
              onConfirm={() => {
                handleUpdateState(schedule)
              }}
              okText={translation("category.yes")}
              cancelText={translation("category.no")}
            >
              <Button
                type="primary"
                style={{ borderRadius: 5, margin: "10px 0px" }}
              >
                {translation("DetailSchedules.btn.confirm")}
              </Button>
            </Popconfirm>
          }
          {schedule?.paymentStatus === PAYMENT_STATE.SUCCESS && (
            <Button
              type="primary"
              className='d-inline-flex align-items-center mx-1'
              style={{ background: '#5F00FA', borderColor: '#5F00FA', color: 'white', borderRadius: 5, margin: "10px 0px" }}
              onClick={() => {
                history.push(`/receipt`, {
                  customerReceiptId: schedule.customerReceiptId
                })
              }}
            >
              {translation("DetailSchedules.btn.printInvoice")}
            </Button>
          )}
          <Button
            type="primary"
            className='d-inline-flex align-items-center mx-1'
            style={{ background: '#5F00FA', borderColor: '#5F00FA', color: 'white', borderRadius: 5, margin: "10px 0px" }}
            onClick={async () => {
              await setSchedule(schedule)
              setIsOpenPrint(true);
            }}
          >
            {translation("DetailSchedules.btn.print")}
          </Button>
          <Button
            type="primary"
            className='d-inline-flex align-items-center mx-1'
            style={{ background: '#ACACAC', borderColor: '#ACACAC', color: '#fff', borderRadius: 5, margin: "10px 0px" }}
            onClick={async () => {
              history.push(routes.customerSchedule.path)
            }}
          >
            {translation("DetailSchedules.btn.back")}
          </Button>
          {((isConfirm || isUnConfimred) && USER_ROLES.ADMIN === user.appUserRoleId && isScheduleStation) && (
            <Button
              type="primary"
              onClick={() => onOpenModal(schedule)}
              className='d-inline-flex align-items-center mx-1'
              ghost
              style={{ borderColor: '#ACACAC', color: '#ACACAC', borderRadius: 5, margin: "10px 0px" }}
            >
              {translation("DetailSchedules.btn.edit")}
            </Button>
          )}
        </div>
      }
      width="100vw"
    >
      {isLoading ?
        <Spin />
        : (
          <main className="booking_main">
            <div className='row'>
              <div className='col-12 col-md-12 col-lg-4 col-xl-4 booking-item px-lg-2 px-0'>
                <p className='booking-item-title mb-12'>{translation("DetailSchedules.placeBooking")}</p>
                <div className='row'>
                  <div className='d-flex align-items-start col-12'>
                    <div className='flex-1 me-1'>
                      <div style={{ height: 23, width: 25 }} className='d-flex align-items-center justify-content-center'>
                        <Circle />
                      </div>
                    </div>
                    <div className='booking-value'>{schedule.station?.stationsName}</div>
                  </div>
                  <div style={{ marginTop: 12 }} className='col-12'>
                    <div className='d-flex align-items-start'>
                      <div className='flex-1 d-flex align-items-center justify-content-center' style={{ height: 23, width: 25 }}>
                        <img src={process.env.PUBLIC_URL + '/assets/images/icon-Service.png'} style={{ height: 15 }} />
                      </div>
                      <div className='ms-1'>
                        <div className='booking-text mb-3'>{translation("DetailSchedules.service")}</div>
                        <p className="booking-value mb-0">
                          <div>
                            {schedule.stationServices?.length === 0 ? (
                              Object.values(metaData?.SCHEDULE_TYPE).find(obj => obj?.scheduleType === schedule.scheduleType)?.scheduleTypeName || '---'
                            ) : (
                              <div>
                                {schedule.stationServices?.map((service, index) => (
                                  <div key={index}>- {service.serviceName}</div>
                                ))}
                              </div>
                            )}
                          </div>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: 12 }} className='col-6'>
                    <div className='d-flex align-items-start'>
                      <div className='flex-1 d-flex align-items-center justify-content-center' style={{ height: 23, width: 25 }}>
                        <img src={process.env.PUBLIC_URL + '/assets/images/icon-User.png'} style={{ height: 15 }} />
                      </div>
                      <div className='ms-1'>
                        <div className='booking-text mb-3'>{translation("DetailSchedules.lastName")}</div>
                        <p className="booking-value mb-0">{schedule.fullnameSchedule}</p>
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: 12 }} className='col-6'>
                    <div className='d-flex align-items-start'>
                      <div className='flex-1 d-flex align-items-center justify-content-center' style={{ height: 23, width: 25 }}>
                        <img src={process.env.PUBLIC_URL + '/assets/images/icon-Call.png'} style={{ height: 15 }} />
                      </div>
                      <div className='ms-1'>
                        <div className='booking-text mb-3'>{translation("DetailSchedules.phone")}</div>
                        <p className="booking-value mb-0">{schedule.phone}</p>
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: 12 }} className='col-6'>
                    <div className='d-flex align-items-start me-1'>
                      <div className='flex-1 d-flex align-items-center justify-content-center' style={{ height: 23, width: 25 }}>
                        <img src={process.env.PUBLIC_URL + '/assets/images/icon-LicensePlates.png'} style={{ height: 15 }} />
                      </div>
                      <div>
                        <div className='booking-text mb-3'>{translation("DetailSchedules.licensePlates")}</div>
                        <p className="booking-value mb-0">
                          <div>
                            <BindPlate
                              type={schedule.licensePlateColor}
                              number={schedule.licensePlates}
                            />
                          </div>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: 12 }} className='col-6'>
                    <div className='d-flex align-items-start'>
                      <div className='flex-1 d-flex align-items-center justify-content-center' style={{ height: 23, width: 25 }}>
                        <img src={process.env.PUBLIC_URL + '/assets/images/icon-TypeVehicle.png'} style={{ height: 15 }} />
                      </div>
                      <div className='ms-1'>
                        <div className='booking-text mb-3'>{translation("DetailSchedules.typeVehicle")}</div>
                        <p className="booking-value mb-0">
                          {getListVehicleTypes(translation)[schedule.vehicleType] || translation('unknowCar')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: 12 }} className='col-6'>
                    <div className='d-flex align-items-start'>
                      <div className='flex-1 d-flex align-items-center justify-content-center' style={{ height: 23, width: 25 }}>
                        <img src={process.env.PUBLIC_URL + '/assets/images/icon-Calendar.png'} style={{ height: 15 }} />
                      </div>
                      <div className='ms-1'>
                        <div className='booking-text mb-3'>{translation("DetailSchedules.date")}</div>
                        <p className="booking-value mb-0">{schedule.dateSchedule}</p>
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: 12 }} className='col-6'>
                    <div className='d-flex align-items-start'>
                      <div className='flex-1 d-flex align-items-center justify-content-center' style={{ height: 23, width: 25 }}>
                        <img src={process.env.PUBLIC_URL + '/assets/images/icon-Clock.png'} style={{ height: 15 }} />
                      </div>
                      <div className='ms-1'>
                        <div className='booking-text mb-3'>{translation("DetailSchedules.hour")}</div>
                        <p className="booking-value mb-0">{changeTime(schedule.time)}</p>
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: 12 }} className='col-12'>
                    <div className='d-flex align-items-start'>
                      <div className='flex-1 d-flex align-items-center justify-content-center' style={{ height: 23, width: 25 }}>
                        <img src={process.env.PUBLIC_URL + '/assets/images/icon-Code.png'} style={{ height: 15 }} />
                      </div>
                      <div className='ms-1'>
                        <div className='booking-text mb-3'>{translation("DetailSchedules.BookingCode")}</div>
                        <p className="booking-value mb-0">{schedule.scheduleCode}</p>
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: 12 }} className='col-12'>
                    <div className='d-flex align-items-start'>
                      <div className='flex-1 d-flex align-items-center justify-content-center' style={{ height: 23, width: 25 }}>
                        <InfoCircleTwoTone style={{ height: 15 }} />
                      </div>
                      <div className='ms-1'>
                        <div className='booking-text mb-3'>{translation("DetailSchedules.status")}</div>
                        <p className="booking-value mb-0">
                          <Typography.Paragraph style={{ color: SCHEDULE_STATUS[schedule.CustomerScheduleStatus]?.color || "" }} className="mb-0">
                            {SCHEDULE_STATUS[schedule.CustomerScheduleStatus]?.text || ""}
                          </Typography.Paragraph>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: 12 }} className='col-12'>
                    <div className='d-flex align-items-start'>
                      <div className='flex-1 d-flex align-items-center justify-content-center' style={{ height: 23, width: 25 }}>
                        <PayCircleFilled style={{ height: 15, color: "rgb(24, 144, 255)" }} />
                      </div>
                      <div className='ms-1'>
                        <div className='booking-text mb-3'>{translation("listSchedules.payment.title")}</div>
                        {schedule?.paymentStatus === PAYMENT_STATE.SUCCESS ? (
                          <div>
                            <div>{PAYMENT_LIST[schedule?.paymentStatus] || "-"}</div>
                            <div>{schedule?.approveDate ? moment(schedule.approveDate).format(DATE_DISPLAY_FORMAT_HOURS) : "-"}</div>
                          </div>
                        ) : (
                          <div>{PAYMENT_LIST[schedule?.paymentStatus] || "-"}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* <div style={{ marginTop: 12 }} className='col-12'>
								<div className='d-flex align-items-start'>
									<div className='flex-1 d-flex align-items-center justify-content-center' style={{ height: 23, width: 25 }}>
										<img src={process.env.PUBLIC_URL + '/assets/images/icon-Money.png'} style={{ height: 15 }} />
									</div>
									<div className='ms-1'>
										<div className='booking-text mb-3'>{translation("DetailSchedules.expectedCost")}<span>{`(?)`}</span></div>
										<p className="booking-value mb-0">5.999.999 VND</p>
									</div>
								</div>
							</div> */}
                </div>
              </div>
              <div className='col-12 col-md-12 col-lg-4 col-xl-4 booking-item px-lg-4 px-0'>
                {/* <div className='d-flex align-items-center mb-3'>
                  <div className='d-flex'>
                    <img src={process.env.PUBLIC_URL + '/assets/images/icon-Image.png'} style={{ height: 28 }} />
                  </div>
                  <p className='booking-item-title mb-0 ms-2'>{translation("DetailSchedules.attachedImage")}</p>
                </div> */}
                {/* <UploadDetailBooking /> */}
                <HistoryDetailBooking changeHistory={schedule.changeHistory} />
              </div>
              <div className='col-12 col-md-12 col-lg-4 col-xl-4 booking-item px-lg-4 px-0'>
                <div className='d-flex align-items-center mb-3'>
                  <div className='d-flex'>
                    <img src={process.env.PUBLIC_URL + '/assets/images/icon-Service.png'} style={{ height: 17 }} />
                  </div>
                  <p className='booking-item-title mb-0 ms-2'>{translation("DetailSchedules.note")}</p>
                </div>
                <TextArea
                  autoSize={{
                    minRows: 6,
                  }}
                  showCount
                  maxLength={150}
                  value={value}
                  onBlur={(e) => {
                    const trimmedValue = e.target.value.trim();
                    if (trimmedValue) {
                      onUpdateScheduleNote({ scheduleNote: e.target.value })
                    }
                    setValue("");
                  }}
                  onChange={(e) => setValue(e.target.value)}
                />
                <div className='d-flex align-items-center mb-3 mt-5'>
                  <div className='d-flex'>
                    <img src={process.env.PUBLIC_URL + '/assets/images/icon-Cache.png'} style={{ height: 17 }} />
                  </div>
                  <p className='booking-item-title mb-0 ms-2'>{translation("DetailSchedules.note")}</p>
                </div>
                <p className='booking-item-note'>
                  <pre className='text-i notes-code'>{schedule?.scheduleNote}</pre>
                </p>
              </div>
            </div>
            {
              visible &&
              <ModalAddBooking
                isModalOpen={visible}
                onModalClose={(bool) => setVisible(bool)}
                onSubmit={onUpdateSchedule}
                values={{
                  ...schedule,
                  dateSchedule: schedule.dateSchedule
                }}
                isEdit={true}
              />
            }

            <ModalPrint isOpen={isOpenPrint} setIsOpen={setIsOpenPrint} schedule={{
              ...schedule,
              stationsAddress: schedule.station?.stationsName
            }} />
          </main >
        )
      }
    </Drawer >
  )
}

const ModalDeleteCalendar = ({ onOk, values }) => {
  const { t: translation } = useTranslation();
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const inputRef = useRef();
  const listQuickResponse = [
    {
      value: translation("listSchedules.instantMessage.message1"),
    },
    {
      value: translation("listSchedules.instantMessage.message2"),
    },
    {
      value: translation("listSchedules.instantMessage.message3"),
    }
  ]

  useEffect(() => {
    setError(false);
  }, [value]);

  useEffect(() => {

    if (!isVisible) {
      setValue("")
    }

  }, [isVisible])
  return (
    <>
      <Button
        type="primary"
        onClick={() => setIsVisible(true)}
        className='d-inline-flex align-items-center mx-1'
        style={{ background: '#EC0000', borderColor: '#EC0000', color: '#fff', borderRadius: 5 }}
        danger
      >
        {translation("DetailSchedules.btn.cancel")}
      </Button>
      {isVisible &&
        <Modal
          title={translation("listSchedules.cancellationReason")}
          visible={isVisible}
          okText={translation("listSchedules.send")}
          cancelText={translation("cancel")}
          onOk={() => {
            if (!value) {
              setError(true);
              return;
            }

            setIsVisible(false)
            onOk(value)
          }}
          onCancel={() => setIsVisible(false)}
          bodyStyle={{
            maxWidth: 443,
            borderRadius: 2
          }}
          centered
          autoFocusButton={null}
        >
          <TextArea
            autoSize={{ minRows: 3 }}
            autoFocus
            value={value}
            ref={inputRef}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            showCount
          />
          {error && <div style={{ color: "#ff4d4f" }}>{translation("isReq")}</div>}
          <div className='mt-2'>
            {listQuickResponse.map(item => {
              return (
                <Tag
                  key={item.value}
                  onClick={() => {
                    setValue(prev => {
                      if ((prev + item.value).length > 200) {
                        return (prev + item.value).substring(0, 200);
                      }

                      return prev + item.value;
                    });
                    inputRef.current.focus();
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {item.value}
                </Tag>
              )
            })}
          </div>
        </Modal >
      }
    </>
  )
}

export default ModalDetailBooking;

