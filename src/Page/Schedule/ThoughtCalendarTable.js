import React from 'react';
import { notification , Switch , Table } from 'antd';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import ThoughtCalendarService from 'services/thoughtCalendarService';
import { changeTime } from 'helper/changeTime';

const ThoughtCalendarTable = ({ data, date, fetchListData }) => {
  const { t: translation } = useTranslation()
  const isAllTime = data.every((item) => item.isWorking === 1) ? 1 : 0;

  const columns = [
    {
      title: translation("scheduleSetting.timeline"),
      dataIndex: 'time',
      key: 'time',
      align: "left",
      render: (text) => <p>{changeTime(text)}</p>,
    },
    {
      title: translation("scheduleSetting.enableBooking"),
      dataIndex: 'isWorking',
      align: "center",
      width: 150,
      key: 'isWorking',
      render: (isWorking, values, index) => {
        return (
          <Switch
            checked={isWorking === 1 ? true : false}
            onChange={() => handleSwitch(index, values)}
          />
        )
      }
    }
  ]

  const handleSwitch = (index, item) => {
    let dataApi = [...data]

    if (item.time === translation('listCustomers.allTime')) {
      dataApi = dataApi.map((item) => ({ ...item, isWorking: isAllTime === 1 ? 0 : 1 }))
    } else {
      index = index - 1;
      dataApi[index] = {
        ...dataApi[index],
        isWorking: dataApi[index].isWorking === 1 ? 0 : 1
      }
    }

    ThoughtCalendarService.addDayOffSchedule({
      scheduleDayOff: moment(date).format("DD/MM/YYYY"),
      scheduleTime: dataApi
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
      <Table showHeader={false} columns={columns} dataSource={[
        { time: translation('listCustomers.allTime'), isWorking: isAllTime },
        ...data
      ]} rowKey="index" pagination={false} />
    </div>
  )
}

export default ThoughtCalendarTable;