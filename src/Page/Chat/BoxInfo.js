import { Typography, Button, notification, Popconfirm, Modal, Input, Tag } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { PlusOutlined } from '@ant-design/icons';
import { SCHEDULE_STATUS } from 'constants/listSchedule'
import { useSelector } from 'react-redux';
import { USER_ROLES } from 'constants/permission';
import AddBookingService from '../../services/addBookingService'
import ListSchedulesService from 'services/listSchedulesService';
import TagVehicle from 'components/TagVehicle/TagVehicle'
import { changeTime } from 'helper/changeTime';

import "./boxInfo.scss";

import User from 'components/User/User';
import ModalAddBooking from 'Page/AddBooking/ModalAddBooking';
import useCommonData from 'hooks/CommonData';

const { TextArea } = Input

const ItemSchedule = (props) => {
  const { t: translation } = useTranslation()
  const { dateSchedule, time, vehicleType, CustomerScheduleStatus, licensePlates, licensePlateColor, onUpdate, onDeleteSchedule } = props;
  const color = licensePlateColor ? licensePlateColor - 1 : 0;
  const user = useSelector(state => state.member)
  const { metaData } = useCommonData()

  const isUnConfimred = CustomerScheduleStatus === 0;
  const isConfirm = CustomerScheduleStatus === 10;

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <div className='chat_itemSchedule mb-2'>
      <div className='chat_itemSchedule_header d-flex w-100 mb-2'>
        <div className='chat_itemSchedule_header_info flex-1'>
          <div className='mb-2'>
            <span className='me-2'>{dateSchedule}</span>
            <span>{changeTime(time)}</span>
          </div>
          <div className='chat_itemSchedule_type'>{Object.values(metaData?.SCHEDULE_TYPE).find(obj => obj?.scheduleType === vehicleType)?.scheduleTypeName || '-'}</div>
        </div>
        <div className='chat_itemSchedule_action d-flex flex-column ml-3' style={{ width: "100px" }}>
          {isUnConfimred && (
            <Popconfirm
              title={translation("box-confirm")}
              onConfirm={onUpdate}
              okText={translation("category.yes")}
              cancelText={translation("category.no")}
            >
              <Button type="primary" className='mb-1'>
                {translation("chat.schedule.btnConfirmed")}
              </Button>
            </Popconfirm>
          )}
          {((isConfirm || isUnConfimred) && USER_ROLES.ADMIN === user.appUserRoleId) && (
            <ModalDeleteCalendar onOk={(message) => {
              onDeleteSchedule(props.customerScheduleId, message)
            }} />
          )}
        </div>
      </div>
      <div className='chat_itemSchedule_footer d-flex'>
        <div className='chat_itemSchedule_footer_left'>
          <TagVehicle color={color}>
            {licensePlates}
          </TagVehicle>
        </div>
        <div className='chat_itemSchedule_footer_status'>
          <Typography.Paragraph style={{ color: SCHEDULE_STATUS[CustomerScheduleStatus]?.color || "" }} className="mb-0">
            {capitalizeFirstLetter(SCHEDULE_STATUS[CustomerScheduleStatus]?.text || "")}
          </Typography.Paragraph>
        </div>
      </div>
    </div>
  )
}

const ChatCard = ({ avatar, name, phone, email }) => {
  const { t: translation } = useTranslation()

  return (
    <div className='chat__info__card'>
      <Typography.Paragraph className='chat__info__card__title'>{translation("chat.card.title")}</Typography.Paragraph>
      <User name={name} url={avatar} imageSize={24} isBold={true} />
      <div className='chat__info__card__list'>
        <div className='chat__info__card__item'>
          <p className='m-0'>{translation("chat.card.phone")}</p>
          <p className='m-0'>{phone}</p>
        </div>
        <div className='chat__info__card__item mb-2'>
          <p className='m-0'>{translation("chat.card.email")}</p>
          <p className='m-0'>{email}</p>
        </div>
      </div>
    </div>
  )
}

function BoxInfo({ client }) {
  const { t: translation } = useTranslation()

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataListSchedules, setDataSchedules] = useState({
    data: [],
    total: 0
  })

  const handleFinish = (values) => {
    return AddBookingService.AddBooking(values).then(result => {
      if (!(result && result.issSuccess)) {
        notification['error']({
          message: '',
          description: translation('landing.sendFailed')
        });
        return;
      }
      fetchListData({
        searchText: client?.user?.phoneNumber
      });
      return result;
    })
  }

  const fetchListData = (filter) => {
    for (let key in filter) {
      if (!filter[key]) {
        delete filter[key]
      }
    }
    ListSchedulesService.searchSchedule(filter).then(result => {
      if (result)
        setDataSchedules(result)
      else
        dataListSchedules.data.length > 0 && setDataSchedules({
          data: [],
          total: 0
        })
    })
  }

  useEffect(() => {
    if (client?.user?.phoneNumber) {
      fetchListData({
        searchText: client?.user?.phoneNumber
      })
    }

  }, [client.user?.phoneNumber]);

  const onDeleteSchedule = (id, message) => {
    ListSchedulesService.deleteSchedule({ customerScheduleId: id, reason: message })
      .then(result => {
        if (result && result.isSuccess) {
          notification['success']({
            message: '',
            description: translation('listSchedules.deleteSuccessfully')
          });
          fetchListData({
            searchText: client?.user?.phoneNumber
          })
        } else {
          notification['error']({
            message: '',
            description: translation('listSchedules.deletefailed')
          });
        }
      })
  }

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
          fetchListData({
            searchText: client?.user?.phoneNumber
          })
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
          fetchListData({
            searchText: client?.user?.phoneNumber
          })
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

  return (
    <div className='chat__info'>
      <div className='chat__info__header'>
        <ChatCard
          name={client.user?.firstName}
          avatar={client.userAvatar}
          phone={client.user?.phoneNumber}
          email={client.user?.email}
        />
      </div>
      <div className='chat__info__book'>
        <div className='chat__info__book__action'>
          <Typography.Paragraph className='chat__info__book__title m-0'>{translation("chat.schedule.title")}</Typography.Paragraph>
          <Button
            type="primary"
            ghost
            icon={<PlusOutlined />}
            className="chat__info__book__btn"
            onClick={() => setIsModalOpen(true)}
          >
            {translation("chat.schedule.add")}
          </Button>
        </div>
        <div className='chat__info__book__list'>
          {dataListSchedules?.data?.length === 0 ? (
            <div className='chat__empty__text'>
              <p className='m-0'>{translation("chat.empty.schedule")}</p>
            </div>
          ) : (
            dataListSchedules?.data?.map((item) => (
              <ItemSchedule key={item} {...item}
                onUpdate={() => handleUpdateState(item)}
                onDeleteSchedule={(id, message) => onDeleteSchedule(id, message)} />
            ))
          )}
        </div>
        {isModalOpen && (
          <ModalAddBooking
            isModalOpen={isModalOpen}
            onModalClose={(bool) => setIsModalOpen(bool)}
            onSubmit={handleFinish}
            isScreenChat={true}
            values={{
              fullnameSchedule: client.user?.firstName,
              licensePlates: client.station?.stationCode,
              phone: client.user?.phoneNumber,
              email: client.user?.email
            }}
          />
        )}
      </div>
    </div>
  );
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
      <Button type="default" danger onClick={() => setIsVisible(true)}>
        {translation("chat.schedule.btnRefuses")}
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


export default BoxInfo;