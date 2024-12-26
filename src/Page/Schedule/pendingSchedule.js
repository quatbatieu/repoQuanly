import React from 'react';
import { PlusCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { routes } from 'App';
import { Button, DatePicker, Input, Select, Space, Table } from 'antd';
import TagVehicle from 'components/TagVehicle/TagVehicle';
import { geScheduleError } from 'constants/errorMessage';
import { getListVehicleTypes } from 'constants/listSchedule';
import { BUTTON_LOADING_TIME } from "constants/time";
import { optionVehicleType } from 'constants/vehicleType';
import { changeTime } from 'helper/changeTime';
import { hidePhoneNumber } from 'helper/phone';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ScheduleSettingService from 'services/scheduleSettingService';
import ListSchedulesService from '../../services/listSchedulesService';
import './listSchedulesStyle.scss';
import ModalAddBooking from 'Page/AddBooking/ModalAddBooking';
import useCommonData from 'hooks/CommonData';

const { Option } = Select

const PendingSchedule = () => {
  const { t: translation } = useTranslation()
  const history = useHistory()
  const SCHEDULE_ERROR = geScheduleError(translation);
  const [dataListSchedules, setDataSchedules] = useState({
    data: [],
    total: 0
  })
  const [dataFilter, setDataFilter] = useState({
    filter: {
      CustomerScheduleStatus: 10
    },
    startDate: moment().format('DD/MM/YYYY'),
    endDate: moment().add(1, 'day').format('DD/MM/YYYY'),
    skip: 0, limit: 20, searchText: undefined
  })

  const [visible, setVisible] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState({})
  const [loading, setLoading] = useState(false);
  const [stationBookingConfig, setStationBookingConfig] = useState([]);
  const [schedule, setSchedule] = useState(null);

  const user = useSelector(state => state.member)

  const listVehicleType = optionVehicleType(translation);
  const VEHICLE_TYPES = getListVehicleTypes(translation);
  const { metaData } = useCommonData()

  const toggleVisible = () => {
    setVisible(prev => !prev);
  };

  const onOpenModal = (data) => {
    toggleVisible()
    setSelectedSchedule(data)
  }

  const columns = [
    {
      title: translation('pendingSchedule.index'),
      dataIndex: 'scheduleCode',
      key: 'scheduleCode',
      width: 160,
      render: (value, scheduleItem) => {
        return (
          <span onClick={() => history.push(`${routes.customerSchedule.path}/${scheduleItem.customerScheduleId}`)}>
            {value}
          </span>
        );
      }
    },
    {
      title: translation('pendingSchedule.licensePlates'),
      dataIndex: 'licensePlates',
      key: 'licensePlates',
      width: 200,
      render: (value, values) => {
        const color = values.licensePlateColor ? values.licensePlateColor - 1 : 0;
        return <TagVehicle color={color}>{value}</TagVehicle>;
      }
    },
    {
      title: translation('pendingSchedule.vehicleType'),
      dataIndex: 'vehicleType',
      key: 'vehicleType',
      width: 180,
      render: (value) => {
        return <div>{VEHICLE_TYPES?.[value] || ''}</div>;
      }
    },
    {
      title: translation('pendingSchedule.fullName'),
      key: 'fullnameSchedule',
      dataIndex: 'fullnameSchedule',
      width: 260,
      render: (_, record) => {
        return (
          <div>
            <div>{record.fullnameSchedule}</div>
            <div style={{ color: '#40E0D0', fontSize: 'smaller' }}>{record?.companyName}</div>
          </div>
        );
      }
    },
    {
      title: translation('pendingSchedule.phoneNumber'),
      dataIndex: 'phone',
      key: 'phone',
      width: 160,
      render: (value, scheduleItem) => {
        return (
          <span className="blue-text" onClick={() => history.push(`${routes.customerSchedule.path}/${scheduleItem.customerScheduleId}`)}>
            {hidePhoneNumber(value)}
          </span>
        );
      }
    },
    {
      title: translation('pendingSchedule.expirationDate'),
      dataIndex: 'vehicleExpiryDate',
      key: 'vehicleExpiryDate',
      width: 160
    },
    {
      title: translation('pendingSchedule.act'),
      align: 'center',
      key: 'action',
      width: 100,
      render: (record, scheduleItem) => {
        return (
          <Button
            type="primary"
            className="d-inline-flex align-items-center mx-1"
            onClick={() => onOpenModal(record)}
          >
            <PlusCircleOutlined />
          </Button>
        );
      }
    }
  ];

  useEffect(() => {
    fetchListData(dataFilter)
  }, [])

  const onFilterByTime = async (time) => {
    translation('listSchedules.allTimeline')
    if (time === translation('listSchedules.allTimeline')) {
      dataFilter.filter.time = undefined
    } else {
      dataFilter.filter.time = time.split(" - ").join("-")
    }
    dataFilter.skip = 0
    setDataFilter({ ...dataFilter })
    fetchListData(dataFilter)
  }
  const onFilterScheduleType = async (scheduleType) => {
    if (!scheduleType) {
      dataFilter.filter.scheduleType = undefined
    } else {
      dataFilter.filter.scheduleType = scheduleType
    }
    dataFilter.skip = 0
    setDataFilter({ ...dataFilter })
    fetchListData(dataFilter)
  }
  const onFilterByVehicleType = (value) => {
    if (!value) {
      dataFilter.filter.vehicleType = undefined
    } else {
      dataFilter.filter.vehicleType = value
    }
    dataFilter.skip = 0
    setDataFilter({ ...dataFilter })
    fetchListData(dataFilter)
  }

  const fetchDataTime = () => {
    ScheduleSettingService.getDetailById({ id: user.stationsId }).then(result => {
      if (result && result.stationBookingConfig && result.stationBookingConfig.length > 0) {
        let data = [{
          time: translation('listSchedules.allTimeline'),
          enableBooking: 0
        }, ...result.stationBookingConfig]
        setStationBookingConfig(data)
      }
    })
  }
  const fetchListData = (filter) => {
    for (let key in filter) {
      if (!filter[key]) {
        delete filter[key]
      }
    }
    ListSchedulesService.getList(filter).then(result => {
      if (result)
        setDataSchedules(result)
      else
        dataListSchedules.data.length > 0 && setDataSchedules({
          data: [],
          total: 0
        })
    })
  }

  const onChooseDate = (dates, dateStrings) => {
    const isDateStrings = dateStrings && dateStrings.length === 2;
    const filter = {
      ...dataFilter,
      filter: { ...dataFilter.filter },
      startDate: isDateStrings ? dateStrings[0] : '',
      endDate: isDateStrings ? dateStrings[1] : '',
      skip: 0,
    };

    setDataFilter(filter);
    fetchListData(filter);
  };

  const onSearchSchedule = (val) => {
    dataFilter.searchText = val || undefined
    dataFilter.skip = 0
    setDataFilter({ ...dataFilter, searchText: val })
    fetchListData(dataFilter)
  }

  const reasonableCalendarSwitching = (date) => {
    let dateFormat = moment(date, "DD/MM/YYYY").format("DD/MM/YYYY");
    return dateFormat === "Invalid date" ? "" : dateFormat;
  }

  const convertStrToDate = (str) => {
    let dateFormat = moment(str, "DD/MM/YYYY");
    return !reasonableCalendarSwitching(dateFormat) ||
      reasonableCalendarSwitching(dateFormat) === "Invalid date" ? "" : dateFormat;
  }

  const onChangeSearchText = (e) => {
    e.preventDefault()
    setDataFilter({ ...dataFilter, searchText: e.target.value ? e.target.value : undefined })
  }

  const onInsertSchedule = () => {
    //  Gọi api đặt lịch từ lịch chớ sang lịch hẹn
  }

  useEffect(() => {
    fetchDataTime()
  }, [])

  return (
    <main className="list_schedules">
      <div className='row d-flex justify-content-between'>
        <div className='section-title col-12 col-lg-3'> {translation('pendingSchedule.pendingSchedule')}</div>

        <div className='col-12 col-lg-9 mb-3'>
          <Space size={16} className='list_schedules__box' wrap={true}>
            <div>
              <Input.Search
                autoFocus
                onSearch={onSearchSchedule}
                onChange={onChangeSearchText}
                placeholder={translation("pendingSchedule.searchText")}
                className="w-100"
              />
            </div>

            <div>
              <DatePicker.RangePicker
                className="w-100"
                format="DD/MM/YYYY"
                placeholder={[translation("startDate"), translation("endDate")]}
                onChange={onChooseDate}
                defaultValue={[moment(dataFilter.startDate, 'DD/MM/YYYY'), moment(dataFilter.endDate, 'DD/MM/YYYY')]}
              />
            </div>

            <div>
              <Select
                className="w-100"
                placeholder={translation('pendingSchedule.filterByScheduleType')}
                style={{
                  minWidth: 200
                }}
                onChange={onFilterScheduleType}
              >
                <Option value={""} key={9999}>{translation('all')}</Option>
                {
                  Object.values(metaData?.SCHEDULE_TYPE).map(item => {
                    return (
                      <Option value={item.scheduleType} key={item.scheduleType}>{item.scheduleTypeName}</Option>
                    )
                  })
                }
              </Select>
            </div>

            <div>
              <Select
                className="w-100"
                placeholder={translation('pendingSchedule.filterByTime')}
                style={{
                  minWidth: 160
                }}
                onChange={onFilterByTime}
              >
                {
                  stationBookingConfig.map(item => {
                    return (
                      <Option value={item.time} key={item.time}>{changeTime(item.time)}</Option>
                    )
                  })
                }
              </Select>
            </div>

            <div>
              <Select
                className="w-100"
                placeholder={translation('pendingSchedule.filterByVehicleType')}
                style={{
                  minWidth: 160
                }}
                onChange={onFilterByVehicleType}
              >
                <Option value={""} key={9999}>{translation('all')}</Option>
                {
                  listVehicleType.map(item => {
                    return (
                      <Option value={item.value} key={item.value}>{item.label}</Option>
                    )
                  })
                }
              </Select>
            </div>
            <div>
              <Space size={16}>
                <Button
                  loading={loading}
                  disabled={loading}
                  className='d-flex justify-content-center align-items-center'
                  onClick={() => {
                    setLoading(true);
                    setTimeout(() => {
                      fetchListData(dataFilter)
                      setLoading(false)
                    }, BUTTON_LOADING_TIME);
                  }}
                >
                  {!loading && <ReloadOutlined />}
                </Button>
              </Space>
            </div>
          </Space>
        </div>
      </div>

      <div className="list_schedules__body row">
        <Table
          dataSource={dataListSchedules.data}
          rowClassName={(record) => `${record && record.CustomerScheduleStatus ? 'handled_customer' : ''}`}
          columns={columns}
          scroll={{ x: 1400 }}
          pagination={{
            position: ["bottomRight"],
            total: dataListSchedules.total,
            pageSize: dataFilter.limit,
            simple:true,
            current: dataFilter.skip ? (dataFilter.skip / dataFilter.limit) + 1 : 1
          }}
          onChange={({ current, pageSize }) => {
            dataFilter.skip = (current - 1) * pageSize
            setDataFilter({ ...dataFilter })
            fetchListData(dataFilter)
          }}
        />
      </div>

      {visible &&
        <ModalAddBooking
          isModalOpen={visible}
          onModalClose={(bool) => setVisible(bool)}
          onSubmit={onInsertSchedule}
          values={{
            ...selectedSchedule,
            dateSchedule: selectedSchedule.dateSchedule
          }}
          isEdit={false}
        />
      }

    </main >
  )
}

const MAX_LENGTH = 200;

export default PendingSchedule
