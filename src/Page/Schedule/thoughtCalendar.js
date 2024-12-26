import React, { useState, useEffect, useMemo, Fragment} from 'react';
import { useTranslation } from 'react-i18next'
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import ScheduleSettingService from 'services/scheduleSettingService';
import {
  Typography,
  DatePicker,
  Row,
  Col,
  Calendar,
  Switch,
  Table,
  Tag,
  Button,
  Space,
  ConfigProvider,
  InputNumber,
  notification
} from 'antd';
import moment from 'moment';
import UnLock from 'components/UnLock/UnLock';
import vi_VN from 'antd/lib/locale-provider/vi_VN';
import vi from "moment/locale/vi";

import "./thoughtCalendarStyle.scss";
import ThoughtCalendarService from 'services/thoughtCalendarService';
import { data } from 'Page/Charts/VerticalBarChart';

import ThoughtCalendarTable from './ThoughtCalendarTable';
import VehicleTypeTable from './VehicleTypeTable';
import { optionVehicleCalendar } from 'constants/vehicleType';
import { changeTime } from 'helper/changeTime';

const dateFormat = '/MM/YYYY';

const convertTime =(value)=> {
  let index=value.indexOf("-")
  let titleTime=value.slice(0, index)
  return(
    <>
      {titleTime}
    </>
  )
}

const customFormat = (value) => {
  const strDate = `${value.format(dateFormat)}`;
  const convertDateToStr = strDate.replace("/", "Tháng ").replace("/", " / ");
  return convertDateToStr;
};

const FilterTime = ({ date, setDate }) => {

  const handlePrevDate = () => {
    setDate(moment(date).add(-1, 'months'))
  }

  const handleNextDate = () => {
    setDate(moment(date).add(1, 'months'))
  }

  return (
    <div className='filter_time'>
      <LeftOutlined className="filter_time_icon" onClick={handlePrevDate} />
      <DatePicker
        onChange={(date, dateString) => dateString && setDate(date)}
        picker="month"
        format={customFormat}
        value={date}
        suffixIcon={false}
        className='filter_time_date'
      />
      <RightOutlined className="filter_time_icon" onClick={handleNextDate} />
    </div>
  )
}

function ThoughtCalendar(props) {
  const user = useSelector((state) => state.member)
  const { t: translation } = useTranslation()
  const defaultVehicleType = optionVehicleCalendar(translation);
  const setting = useSelector((state) => state.setting);
  const [date, setDate] = useState(moment())
  const [mixture, setMixture] = useState(0);
  const [timeSchedule, setTimeSchedule] = useState([]);
  const [dataListCalendar, setDataListCalendar] = useState({
    data: [],
    total: 0
  })
  const findCalendarByDate = (day) => {
    if (dataListCalendar.data.length === 0) {
      return {}
    }
    return dataListCalendar.data.filter(calendar => calendar.scheduleDayOff === day)[0] || {};
  }

  const getScheduleTimeByDate = useMemo(() => {
    return findCalendarByDate(moment(date).format("DD/MM/YYYY")).scheduleTime || timeSchedule;
  }, [date, dataListCalendar])

  const getVehicleTypeByDate = useMemo(() => {

    const { enableOtherVehicle, enableRoMooc, enableSmallCar } = findCalendarByDate(moment(date).format("DD/MM/YYYY"));

    if (enableSmallCar !== null && enableSmallCar !== undefined) {
      defaultVehicleType[0].enable = enableSmallCar;
    }

    if (enableRoMooc !== null && enableRoMooc !== undefined) {
      defaultVehicleType[1].enable = enableRoMooc;
    }

    if (enableOtherVehicle !== null && enableOtherVehicle !== undefined) {
      defaultVehicleType[2].enable = enableOtherVehicle;
    }

    return defaultVehicleType;
  }, [date, dataListCalendar])

  const [dataFilter, setDataFilter] = useState(
    {
      filter: {
        stationsId: user.stationsId
      },
      // DataFilter it will call 3 months.
      // eg: the current date is 12/02/2022 then startDate : 01/01/2022 and endDate : 31/03/2022
      startDate: moment(date).add(-1, 'months').startOf('month').format("DD/MM/YYYY"),
      endDate: moment(date).add(1, 'months').endOf('month').format("DD/MM/YYYY")
    }
  )

  const convertDatetoStr = (date) => {
    date.locale("vi", vi);
    const dddd = date.format('dddd');
    const time = date.format('L');
    return `${dddd.replace(dddd[0], dddd[0].toUpperCase())} , ${time}`
  }

  useEffect(() => {
    ScheduleSettingService.getDetailById({ id: user.stationsId }).then(result => {
      if (result) {
        setMixture(result.enableAcceptAllVehicle || 0);
        for(let i=0;i<result?.stationBookingConfig?.length;i++){
          setTimeSchedule((prev) =>[
            ...prev,
            {
              time:result.stationBookingConfig[i].time,
              isWorking:1
            }
          ])
        }
      }
    })
  }, [])

  const handleChangeQuantityOfExtraHours = (number) => {

  }

  const fetchListData = (filter) => {
    ThoughtCalendarService.getList(filter).then(result => {
      if (result) {
        setDataListCalendar(result)
      }
      else {
        dataListCalendar.data.length > 0 && setDataListCalendar({
          data: [],
          total: 0
        })
      }
    })
  }

  useEffect(() => {
    const newFilter = {
      ...dataFilter,
      startDate: moment(date).add(-1, 'months').startOf('month').format("DD/MM/YYYY"),
      endDate: moment(date).add(1, 'months').endOf('month').format("DD/MM/YYYY")
    }
    // The new filter is the same as the old filter, the api will not be called back
    if (JSON.stringify(dataFilter) !== JSON.stringify(newFilter)) {
      fetchListData(newFilter);
      setDataFilter(newFilter)
    }
  }, [date])

  useEffect(() => {
    fetchListData(dataFilter);
  }, [])

  return (
    <Fragment>
      {setting.enableScheduleMenu === 0 ? <UnLock /> : 
      <ConfigProvider locale={vi_VN}>
      <div className='thought_calendar'>
        <div className='thought_calendar_header'>
          {/* <Typography.Title level={4}>{translation("thoughtCalendar.title")}</Typography.Title> */}
          <div className='thought_calendar_filter'>
            <FilterTime date={date} setDate={setDate} />
          </div>
        </div>
        <div className='thought_calendar_container'>
          <Row gutter={32}>
            <Col
              span={16}
              xl={{ span: 16 }} lg={{ span: 16 }} md={{ span: 24 }} sm={{ span: 24 }} xs={{ span: 24 }}
              className="thought_calendar_item"
            >
              <div className='thought_calendar__wrap'>
                <Calendar
                  headerRender={() => false}
                  value={date}
                  onSelect={(date) => setDate(date)}
                  onPanelChange={(date) => setDate(date)}
                  dateCellRender={(date) => {
                    const listScheduleTime = findCalendarByDate(moment(date).format("DD/MM/YYYY")).scheduleTime
                    const isThink = listScheduleTime?.every(item => item.isWorking === 0);
                    if (isThink) {
                      return (
                        <Tag
                          color="#F5222D"
                          className="thought_calendar_tag thought_calendar_tag-full"
                        >
                          <p className={`thought_calendar_text`}>
                            {translation("thoughtCalendar.leave")}
                          </p>
                        </Tag>
                      )
                    }
                    return (
                      <div className='thought_calendar_Boxtag'>
                        {listScheduleTime?.map(
                          (item, index) => {
                            if (!item.isWorking) {
                              return (
                                <Tag
                                  color={"#F5222D"}
                                  className="thought_calendar_tag"
                                  key={index}
                                >
                                  <p className={`thought_calendar_text`}>
                                    {convertTime(item.time)}
                                  </p>
                                </Tag>
                              )
                            }
                            return (
                              <Tag
                                color={"#52C41A"}
                                className="thought_calendar_tag"
                                key={index}
                              >
                                <p className={`thought_calendar_text`}>
                                  {convertTime(item.time)}
                                </p>
                              </Tag>
                            )
                          }
                        )}
                      </div>
                    )
                  }}
                  locale={{
                    lang: {
                      locale: 'vi',
                      dayFormat: moment.updateLocale('vi', {
                        weekdaysMin: [
                          translation("thoughtCalendar.weekdaysMin.Sun"),
                          translation("thoughtCalendar.weekdaysMin.Mon"),
                          translation("thoughtCalendar.weekdaysMin.Tue"),
                          translation("thoughtCalendar.weekdaysMin.Wed"),
                          translation("thoughtCalendar.weekdaysMin.Thu"),
                          translation("thoughtCalendar.weekdaysMin.Fri"),
                          translation("thoughtCalendar.weekdaysMin.Sat")
                        ]
                      })
                    }
                  }}
                />
              </div>
            </Col>
            <Col
              span={8}
              xl={{ span: 8 }} lg={{ span: 8 }} md={{ span: 24 }} sm={{ span: 24 }} xs={{ span: 24 }}
              className="thought_calendar_item"
            >
              <Typography.Title level={3} className="thought_calendar_title">
                {convertDatetoStr(date)}
              </Typography.Title>
              <Typography.Paragraph className='fw-bolder'>{translation("thoughtCalendar.titleVehicleType")}</Typography.Paragraph>
              <VehicleTypeTable
                data={getVehicleTypeByDate}
                dataTime={getScheduleTimeByDate}
                date={date}
                mixture={mixture}
                fetchListData={() => fetchListData(dataFilter)}
              />
              <Typography.Paragraph className='fw-bolder'>{translation("thoughtCalendar.titleThoughtCalendar")}</Typography.Paragraph>
              <ThoughtCalendarTable
                data={getScheduleTimeByDate} 
                date={date}
                fetchListData={() => fetchListData(dataFilter)}
              />
              {/* <SettingNumberWaitingShedule /> */}
            </Col>
          </Row>
        </div>
      </div>
      </ConfigProvider>
      }
    </Fragment>
  );
}

const SettingNumberWaitingShedule = () => {
  const { t: translation } = useTranslation()
  const [waitingShedule, setWaitingShedule] = useState(0);

  const handleSetWaitingShedule = () => {
    //  Gọi api để set lịch ngoài ở đây.
    console.log("Blur :", waitingShedule);
  }

  const handleChange = (value) => {
    const intValue = Number(value);

    // Kiểm tra nếu giá trị nhập vào là số tự nhiên và không âm và không thập phân
    if (!Number.isNaN(intValue) && Number.isInteger(intValue) && intValue >= 0) {
      setWaitingShedule(intValue);
    } else {
      setWaitingShedule(0);
    }
  };

  return (
    <>
      <Typography.Paragraph className='fw-bolder'>
        {translation("thoughtCalendar.numberExtraHours")}
      </Typography.Paragraph>
      <InputNumber
        name="extraHours"
        placeholder={translation("thoughtCalendar.ph-numberExtraHours")}
        value={waitingShedule || 0}
        onChange={(number) => handleChange(number)}
        onPressEnter={handleSetWaitingShedule}
      />
      <Button
        type="primary"
        className='mt-2'
        onClick={handleSetWaitingShedule}>
        {translation("save")}
      </Button>
    </>
  )
}
export default ThoughtCalendar;