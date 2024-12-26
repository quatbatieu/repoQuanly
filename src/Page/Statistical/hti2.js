


import React, { useEffect, useState } from 'react'
import { DatePicker } from 'antd'
import { useTranslation } from 'react-i18next'
import './statistical.scss'
import { IconCustomer, IconCustomerReturn, IconSMS, IconMoney, EmailSendIcon } from '../../assets/icons'
import StatisticalService from '../../services/statisticalService'
import moment from 'moment'
import _ from 'lodash'
import EmailIcon from 'components/EmailIcon'

import { BarChart } from 'Page/Charts/BarChart'
import { LineChart } from 'Page/Charts/LineChart'
import { DoughnutChart } from 'Page/Charts/DoughnutChart'
import UserInfoIcon from '../../assets/icons/user-info.svg';
import UserProfileIcon from '../../assets/icons/user-profile.svg';
import UserNewIcon from '../../assets/icons/new-user.svg';
import PercentUp from '../../assets/icons/percent-up.svg';
import PercentDown from '../../assets/icons/percent-down.svg';
import { formatNumber } from 'helper/common'

const { RangePicker } = DatePicker

const Statistical = () => {
  const { t: translation } = useTranslation()
  const [statisticalData, setStatisticalData] = useState({})
  const [filter, setFilter] = useState({
    startDate: moment().startOf('month'),
    endDate: moment().endOf('month')
  })

  const onFilterByDate = (date, dateString) => {
    if (dateString && dateString[0] && dateString[0].length > 0) {
      filter.startDate = date[0]
      filter.endDate = date[1]
    } else {
      filter.startDate = moment().startOf('month')
      filter.endDate = moment().endOf('month')
    }
    setFilter({ ...filter })
    StatisticalService.getStatistical(filter).then(result => {
      if (result && !_.isEmpty(result)) {
        setStatisticalData(result)
      }
    })
  }

  useEffect(() => {
    onFilterByDate()
  }, [])

  function formatPrice(number = 0) {
    const num = number.toString()
    if (num.length > 3) {
      let count = 0
      let arr = []
      for (let i = num.length - 1; i >= 0; i--) {
        count++
        if (count === 3) {
          const str = num[i] + num[i + 1] + num[i + 2]
          arr.push(str)
          count = 0;
        }
        if (i === 0) {
          if (count === 2) {
            const str = num[i] + num[i + 1]
            arr.push(str)
          } else if (count === 1) {
            const str = num[i]
            arr.push(str)
          } else {
            break;
          }
        }
      }
      return arr.reverse().join(',')
    } else {
      return num;
    }
  }

  return (
    <main className="statistical">
      <div className="statistical__title">
        {translation('listCustomers.statistical')}
      </div>
      <div className="d-flex justify-content-center w-100">
        <div className="statistical__body">
          <div className="w-100 d-flex justify-content-center">
            <RangePicker
              format="DD/MM/YYYY"
              onChange={onFilterByDate}
              value={[filter.startDate, filter.endDate]}
              placeholder={[translation('listCustomers.startDate'), translation('listCustomers.endDate')]}
            />
          </div>

          {statisticalData && !_.isEmpty(statisticalData) ?
            <>
              <div className="row mt-5 statistic-user flex-between">
                <StatisticalItem bg={"#2E5BFF"} title={`Tổng khách hàng`} icon={UserInfoIcon} count={999000000} percent={{ isUp: true, count: 2.4 }} />
                <StatisticalItem bg={"#A23FC3"} title={`Khách hàng mới`} icon={UserNewIcon} count={10000000} percent={{ isUp: true, count: 2.4 }} />
                <StatisticalItem bg={"#00877C"} title={`KH quay lại lần 2`} icon={UserProfileIcon} count={7500000} percent={{ isUp: true, count: 2.4 }} />
                <div className='statistic-container flex-center' style={{ background: "white", flexFlow: "column" }}>
                  <DoughnutChart />
                  <h3 className='statistic-doughnut-des'>Tỉ lệ khách quay lại lần 2</h3>
                </div>
              </div>
            </> : <></>
          }
        </div>
      </div>

      <div className='mt-4'>
        <BarChart />
        {/* <LineChart /> */}
      </div>
    </main>
  )
}

const StatisticalItem = ({ title, count, icon, bg, percent }) => {
  return (
    <div className='statistic-container' style={{ background: bg }}>
      <div className='statistic-icon flex-center'>
        <img src={icon} alt={"statistic-icon"} />
      </div>
      <div className='statistic-title'>
        <span>{title}</span>
      </div>
      <div className='statistic-count'>
        <span>{formatNumber(count)}</span>
      </div>
      <div className='statistic-percent d-flex w-100'>
        <span className='d-inline-block'>So với tháng trước</span>
        <span className={`percent-${percent.isUp ? "up" : "down"} flex-center`}><img src={percent.isUp ? PercentUp : PercentDown} alt="percent" />{" "}2.4%</span>
      </div>
    </div>
  )
}

export default Statistical;