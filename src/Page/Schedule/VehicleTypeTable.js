import React from 'react';
import { notification , Switch , Table } from 'antd';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import ThoughtCalendarService from 'services/thoughtCalendarService';

const VehicleTypeTable = ({ data, dataTime, date, fetchListData , mixture }) => {
  const { t: translation } = useTranslation()
  const isAllVehicleType = data.every((item) => item.enable === 1) ? 1 : 0;

  const columns = [
    {
      title: translation('landing.transportation'),
      dataIndex: 'name',
      key: 'name',
      align: "left",
      render: (text) => <p>{text}</p>,
    },
    {
      title: translation("scheduleSetting.enableBooking"),
      dataIndex: 'enable',
      align: "center",
      width: 150,
      key: 'enable',
      render: (enable, values, index) => {
        return (
          <Switch
            checked={enable === 1 ? true : false}
            onChange={() => handleSwitch(index, values)}
            disabled={!!mixture}
          />
        )
      }
    }
  ]

  const handleSwitch = (index , item) => {
    let dataApi = [...data]

    if (item.name === translation('listCustomers.allVehicleType')) {
      dataApi = dataApi.map((item) => ({ ...item, enable: isAllVehicleType === 1 ? 0 : 1 }))
    } else {
      //  Lưu trữ lên state
      index = index - 1;
      dataApi[index] = {
        ...dataApi[index],
        enable: dataApi[index].enable === 1 ? 0 : 1
      }
    }
    ThoughtCalendarService.addDayOffSchedule({
      scheduleDayOff: moment(date).format("DD/MM/YYYY"),
      scheduleTime: dataTime,
      enableSmallCar: dataApi[0].enable,
      enableRoMooc: dataApi[1].enable,
      enableOtherVehicle: dataApi[2].enable,
    }).then(result => {
      if (result && result.isSuccess) {
        notification.success({
          message: "",
          description: translation('listCustomers.success', {
            type: translation('listCustomers.handle')
          })
        })
        fetchListData()
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

  return (
    <div className='thought_calendar__table'>
      <Table showHeader={false} columns={columns} dataSource={
        [
          { name: translation('listCustomers.allVehicleType'), enable: isAllVehicleType },
          ...data
        ]
      } rowKey="index" pagination={false} />
    </div>
  )
}

export default VehicleTypeTable;