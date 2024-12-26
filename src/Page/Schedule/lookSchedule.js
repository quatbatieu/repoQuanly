import React, { useState, useEffect, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment'
import { Input, Space, Typography, Form, Button, Table , Grid } from 'antd';
import { widthLicensePlate } from 'constants/licenseplates';
import { PrinterOutlined } from '@ant-design/icons';
import TagVehicle from 'components/TagVehicle/TagVehicle';
import ListSchedulesService from 'services/listSchedulesService';
import { SCHEDULE_STATUS, getListVehicleTypes , getVehicleSubTypes, getVehicleSubCategories } from 'constants/listSchedule';
import { optionVehicleType } from 'constants/vehicleType';
import { SCHEDULE_STATES } from 'constants/scheduleStatus';
import { changeTime } from 'helper/changeTime';
import { ModalPrint } from './listSchedule';
import { hidePhoneNumber } from 'helper/phone';
import { routes } from 'App';
import { useHistory } from 'react-router-dom';
import UnLock from 'components/UnLock/UnLock';
import { useSelector } from 'react-redux'
import BasicTablePaging from 'components/BasicTablePaging/BasicTablePaging';

const { useBreakpoint } = Grid;
const FILTER = {
  filter: {
  },
  skip: 0, limit: 4, searchText: undefined
}
function LookSchedule(props) {
  const screens = useBreakpoint();
  const { t: translation } = useTranslation()
  const setting = useSelector((state) => state.setting);
  const [dataFilterConfirmed, setDataFilterConfirmed] = useState({
    ...FILTER,
    filter : {
      CustomerScheduleStatus : SCHEDULE_STATES.confirmed
    }
  })

  const [dataFilterUnConfimred, setDataFilterUnConfimred] = useState({
    ...FILTER,
    filter : {
      CustomerScheduleStatus : SCHEDULE_STATES.unconfimred
    }
  })

  const [dataFilterCancelled, setDataFilterCancelled] = useState({
    ...FILTER,
    filter : {
      CustomerScheduleStatus : SCHEDULE_STATES.cancelled
    }
  })

  const [dataFilterClosed, setDataFilterClosed] = useState({
    ...FILTER,
    filter : {
      CustomerScheduleStatus : SCHEDULE_STATES.done
    }
  })
  
  const onSearchSchedule = (val) => {
    setDataFilterConfirmed((prev) => ({ ...prev, searchText: val || undefined , skip : 0 }))
    setDataFilterUnConfimred((prev) => ({ ...prev, searchText: val || undefined , skip : 0 }))
    setDataFilterCancelled((prev) => ({ ...prev, searchText: val || undefined , skip : 0 }))
    setDataFilterClosed((prev) => ({ ...prev, searchText: val || undefined , skip : 0 }))
  }

  const LIST_TABLE = [
    {
      title: translation("lookSchedule.listConfirmed"),
      dataFilter : dataFilterConfirmed,
      setDataFilter : setDataFilterConfirmed,
      isShowPrint : true
    },
    {
      title: translation("lookSchedule.listUnConfimred"),
      dataFilter : dataFilterUnConfimred,
      setDataFilter : setDataFilterUnConfimred,
      isShowPrint : true
    },
    {
      title: translation("lookSchedule.listCancelled"),
      dataFilter : dataFilterCancelled,
      setDataFilter : setDataFilterCancelled,
      isShowPrint : false
    },
    {
      title: translation("lookSchedule.listClosed"),
      dataFilter : dataFilterClosed,
      setDataFilter : setDataFilterClosed,
      isShowPrint : false
    }
  ]

  return (
    <Fragment>
     {setting.enableScheduleMenu === 0 ? <UnLock /> :
      <main className="list_schedules">
      <Space direction={screens.md ? "horizontal" : "vertical"} className="look_schedule_customSpace mb-3" style={{ width: '100%', justifyContent: 'flex-start' }}>
        <div className='section-title'>
          {translation('lookSchedule.lookSchedule')}
        </div>
        <div>
          <Input.Search
            autoFocus
            onSearch={onSearchSchedule}
            placeholder={translation("listSchedules.searchText")}
            className='look_schedule_search'
            style={{ minWidth: screens.md ? 250 : "100%" }}
          />
        </div>
      </Space>
      {LIST_TABLE.map((item) => (
        <TableSchedule
          dataFilter={item.dataFilter}
          setDataFilter={item.setDataFilter}
          title={item.title}
          isShowPrint={item.isShowPrint}
        />
      ))}
      </main>
     }
    </Fragment>
  )
}

const TableSchedule = ({ dataFilter : filter, setDataFilter , title , isShowPrint }) => {
  const dataFilter = {...filter};
  const { t: translation } = useTranslation()
  const [schedule, setSchedule] = useState(null);
  const history = useHistory()
  const [isOpenPrint, setIsOpenPrint] = useState(false);
  const [dataListSchedules, setDataSchedules] = useState({
    data: [],
    total: 0
  })

  const listVehicleType = optionVehicleType(translation);
  const VEHICLE_TYPES = getListVehicleTypes(translation);
  const VEHICLE_SUB_TYPES = getVehicleSubTypes(translation);
  const VEHICLE_SUB_CATEGORY = getVehicleSubCategories(translation);


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
    fetchListData(dataFilter)
  }, [JSON.stringify(dataFilter)])

  const columns = [
    {
      title: translation('listSchedules.index'),
      dataIndex: 'scheduleCode',
      key: 'scheduleCode',
      width: 200,
      render: (value, scheduleItem) => {
        return <span
          onClick={() => history.push(`${routes.customerSchedule.path}/${scheduleItem.customerScheduleId}`)}
        >
          {value}
        </span>
      }
    },
    {
      title: translation('listSchedules.licensePlates'),
      dataIndex: 'licensePlates',
      key: 'licensePlates',
      width: widthLicensePlate,
      render: (value, values) => {
        const color = values.licensePlateColor ? values.licensePlateColor - 1 : 0;
        return (
          <TagVehicle color={color}>
            {value}
          </TagVehicle>
        )
      }
    },
    {
      title: translation('listSchedules.vehicleType'),
      dataIndex: 'vehicleType',
      key: 'vehicleType',
      width: 160,
      render: (value , record) => {
        return (
          <div>
            <div>{VEHICLE_SUB_TYPES?.[record.vehicleSubType] || "---"}</div>
            <div>{VEHICLE_SUB_CATEGORY?.[record.vehicleSubCategory] || "---"}</div>
          </div>
        )
      }
    },
    {
      title: translation('listSchedules.customer'),
      key: 'fullnameSchedule',
      dataIndex: 'fullnameSchedule',
      width: 160,
      render: (_, record) => {
        return (
          <div>
            <div>{record.fullnameSchedule}</div>
            <div style={{ color: '#40E0D0', fontSize: 'smaller' }}>{record?.companyName}</div>
            <span className="blue-text"
              onClick={() => history.push(`${routes.customerSchedule.path}/${record.customerScheduleId}`)}
            >
              {hidePhoneNumber(record.phone)}
            </span>
          </div>
        )
      }
    },
    {
      title: translation('listSchedules.creator'),
      dataIndex: 'username',
      key: 'username',
      width: 120,
      render: (value , scheduleItem) => {
        
        const {phone , username } = scheduleItem;
        if(phone !== username) {
          return username
        }

        return <span
          onClick={() => history.push(`${routes.customerSchedule.path}/${scheduleItem.customerScheduleId}`)}
          className="blue-text"
        >{hidePhoneNumber(value)}</span>
      }
    },
    {
      title: translation('listSchedules.service'),
      dataIndex: 'stationServices',
      key: 'stationServices',
      width: 250,
      render: (value) => {
        return (
          <div>
            {value.map((service, index) => (
              <div key={index}>- {service.serviceName}</div>
            ))}
          </div>
        );
      }
    },
    {
      title: translation('listSchedules.time'),
      key: 'time',
      dataIndex: 'time',
      width: 120,
      render: (value, scheduleItem) => {
        return (
          <div>
            <div>{changeTime(scheduleItem.time)}</div>
            <div>{scheduleItem.dateSchedule}</div>
          </div>
        )
      }
    },
    {
      title: translation('listSchedules.expirationDate'),
      dataIndex: 'vehicleExpiryDate',
      key: 'vehicleExpiryDate',
      width: 120
    },
    {
      title: translation('listSchedules.status'),
      dataIndex: 'CustomerScheduleStatus',
      key: 'CustomerScheduleStatus',
      width: 120,
      render: (value) => {
        return (<Typography.Paragraph style={{ color: SCHEDULE_STATUS[value]?.color || "" }} className="mb-0">
          {SCHEDULE_STATUS[value]?.text || ""}
        </Typography.Paragraph>)
      }
    },
    {
      title: translation("listCustomers.act"),
      align: "center",
      key: 'action',
      // width: 135,
      render: (record, scheduleItem) => {
        return (
          <div className="d-inline-flex align-items-center">
            <Button
              type="primary"
              className='d-inline-flex align-items-center mx-1'
              onClick={async () => {
                await setSchedule(scheduleItem)
                setIsOpenPrint(true);
              }}
            >
              <PrinterOutlined />
            </Button>
          </div>
        )
      },
    }
  ].filter((item) => !(item.key === "action" && !isShowPrint));

  const handleChangePage = (pageNum) => {
    const newFilter = {
      ...dataFilter,
      skip : (pageNum -1) * dataFilter.limit
    }
    setDataFilter(newFilter)
    fetchListData(newFilter)
  }
  
  return (
    <div className="list_schedules__body row">
      <h3 className='section-title mb-3'>{title}</h3>
      <Table
        dataSource={dataListSchedules.data}
        rowClassName={(record) => `${record && record.CustomerScheduleStatus ? 'handled_customer' : ''}`}
        columns={columns}
        scroll={{ x: 1700 }}
        pagination={false}
      />
        <BasicTablePaging handlePaginations={handleChangePage} skip={dataFilter.skip} count={dataListSchedules?.data?.length < dataFilter.limit}></BasicTablePaging>

      <ModalPrint isOpen={isOpenPrint} setIsOpen={setIsOpenPrint} schedule={schedule} />
    </div>
  )
}

export default LookSchedule;