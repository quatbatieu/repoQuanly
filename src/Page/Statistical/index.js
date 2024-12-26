import React, { useEffect, useState } from "react";
import { Button, DatePicker, Tag, Spin, Space } from "antd";
import { useTranslation } from "react-i18next";
import "./statistical.scss";
import StatisticalService from "../../services/statisticalService";
import moment from "moment";
import _ from "lodash";

import  BarChart  from "Page/Charts/BarChart";
import { DoughnutChart } from "Page/Charts/DoughnutChart";
import UserInfoIcon from "../../assets/icons/user-info.svg";
import UserProfileIcon from "../../assets/icons/user-profile.svg";
import UserNewIcon from "../../assets/icons/new-user.svg";
import PercentUp from "../../assets/icons/percent-up.svg";
import PercentDown from "../../assets/icons/percent-down.svg";
import Sms from "../../assets/icons/sms.svg";
import { formatNumber } from "helper/common";
import { LineChart } from "Page/Charts/LineChart";
import * as sc from "../Charts/Chart.styled";

const { RangePicker } = DatePicker;

const DATE_OPTIONS = [
  {
    value: 'Monday',
    label: 'T2',
  },
  {
    value: 'Tuesday',
    label: 'T3',
  },
  {
    value: 'Wednesday',
    label: 'T4',
  },
  {
    value: 'Thursday',
    label: 'T5',
  },
  {
    value: 'Friday',
    label: 'T6',
  },
  {
    value: 'Saturday',
    label: 'T7',
  },
  {
    value: 'Sunday',
    label: 'CN',
  },
]

const WEEK_OPTIONS = [
  {
    value: 'thisWeek',
    label: 'Tuần này',
  },
  {
    value: 'lastWeek',
    label: 'Tuần trước',
  },
  {
    value: 'lastTwoWeek',
    label: '2 tuần trước',
  },
]

const MONTH_OPTIONS = [
  {
    value: 'thisMonth',
    label: 'Tháng này',
  },
  {
    value: 'lastMonth',
    label: '1 tháng trước',
  },
  {
    value: 'last3Month',
    label: '3 tháng',
  },
  {
    value: 'last6Month',
    label: '6 tháng',
  },
  {
    value: 'last12Month',
    label: '12 tháng',
  },
]

const YEAR_OPTIONS = [
  {
    value: 'thisYear',
    label: 'Năm nay',
  },
  {
    value: 'lastYear',
    label: 'Năm trước',
  },
]
const FILTER_OPTIONS = [
  {
    value: 'dd',
    label: 'Ngày',
    options: DATE_OPTIONS
  },
  {
    value: 'ww',
    label: 'Tuần',
    options: WEEK_OPTIONS
  },
  {
    value: 'mm',
    label: 'Tháng',
    options: MONTH_OPTIONS
  },
  {
    value: 'yy',
    label: 'Năm',
    options: YEAR_OPTIONS
  },
  {
    value: 'opt',
    label: "Tuỳ chọn",
    options: []
  }
]

const getCurrentWeekDate = () => moment().day()


const roundUp2Digits = (num) => Math.round((num + Number.EPSILON) * 100) / 100

const Statistical = (props) => {
  const { t: translation } = useTranslation();
  const [statisticalData, setStatisticalData] = useState({});
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState(FILTER_OPTIONS[0]);
  const [filterOption, setFilterOption] = useState(FILTER_OPTIONS[0].options[getCurrentWeekDate() - 1]);

  const [filter, setFilter] = useState({
    startDate: moment().subtract(12, 'month'),
    endDate: moment(),
  });

  const onFilterByDate = async () => {
    setLoading(true)
    const { startDate, endDate } = filter

    const result = await StatisticalService.getStatistical({
      startDate: startDate ? startDate.startOf("day").format("DD/MM/YYYY") : "",
      endDate: endDate ? endDate.endOf("day").format("DD/MM/YYYY") : "",
    });

    if (result && !_.isEmpty(result)) {
      setStatisticalData(result);
    }
    setLoading(false);
  };


  const handleFilterOptionChanged = (option) => {
    const { value, options } = filterType
    let startDate = moment().startOf('date');
    let endDate = moment().endOf('date')
    let index = options.findIndex(it => it.value === option.value)
    switch (value) {
      case 'dd':
        startDate = startDate.day(index)
        endDate = endDate.day(index)
        break;
      case 'ww':
        startDate = startDate.startOf('week')
        if (index > 0) {
          startDate = startDate.subtract(index, 'week')
        }
        break;
      case 'mm':
        startDate = startDate.startOf('month')
        if (index === 1) {
          startDate = startDate.subtract(index, 'month')
          break;
        }

        if (index > 1) {
          startDate = startDate.subtract((index - 1) * 3, 'month')
        }
        break;
      case 'yy':
        startDate = startDate.startOf('year')

        if (index > 0) {
          startDate = startDate.subtract(index, 'year')
          endDate = endDate.subtract(index, 'year').endOf("year")
        }
        break;

    }

    setFilterOption(option)
    setFilter({
      startDate, endDate
    })
  }

  const handleDateChange = (dates) => {
    setFilter({
      startDate: dates[0],
      endDate: dates[1]
    })
  }

  const handlePrint = () => {
    window.print();
  }

  const handleFilter = () => {
    if (filterType.value === 'opt') {
      onFilterByDate()
    } else {
      handleFilterOptionChanged(filterOption)
    }
  }

  useEffect(() => {
    onFilterByDate()
  }, []);


  useEffect(() => {
    // On reset
    onFilterByDate()
  }, [filter])

  const thisMonthVal = (() => {
    if (!statisticalData.customer) return
    if (!statisticalData.customer.data) return
    if (!statisticalData.customer.data.length === 0) return

    return statisticalData.customer.data[statisticalData.customer.data.length - 1]
  })();

  // const thisMonthSmsVal = (() => {
  //   if(!statisticalData.messages?.sms) return

  //   return statisticalData.messages.sms.data[statisticalData.messages.sms.data.length -1]
  // })();

  if (loading) {
    return (
      <div className="flex-center loading">
        <Spin />
      </div>
    )
  }

  return (
    <main className="statistical">
      <div className="statistical__title">
        {translation("statistical.title")}
      </div>
      <div className="d-flex justify-content-center w-100">
        <div className="statistical__body">
          <div className="statistical__body__filter-ctn mb-4">
            <div className="d-flex align-items-center mb-2">
              <sc.Line />
              <sc.Title>Lọc</sc.Title>
            </div>
            <div className="statistical__body__filter-ctn__date-type mb-2">
              {FILTER_OPTIONS.map(it => (
                <Tag.CheckableTag
                  key={it.value}
                  checked={filterType?.value === it.value}
                  onChange={() => setFilterType(it)}
                  color="default"
                >
                  {it.label}
                </Tag.CheckableTag>
              ))}
            </div>
            <div className="statistical__body__filter-ctn__date-type mb-2">
              {filterType?.options.map(it => (
                <Tag.CheckableTag
                  key={it.value}
                  checked={filterOption?.value === it.value}
                  onChange={() => handleFilterOptionChanged(it)}
                >
                  {it.label}
                </Tag.CheckableTag>
              ))}
              {filterType?.value === 'opt' &&
                <RangePicker
                  format="DD/MM/YYYY"
                  value={[filter.startDate, filter.endDate]}
                  onChange={handleDateChange}
                />
              }
            </div>
            <Space>
              <Button type="primary" onClick={handleFilter}>Lọc</Button>
              <Button type="primary" onClick={handlePrint}>Báo cáo</Button>
            </Space>
          </div>
          <>
            <div className="d-flex align-items-center">
              <sc.Line />
              <sc.Title>KHÁCH HÀNG</sc.Title>
            </div>

            <div className="row mt-5 statistic-user flex-around">
              <StatisticalItem
                bg={"#2E5BFF"}
                title={`Tổng khách hàng`}
                icon={UserInfoIcon}
                count={statisticalData.customer?.total?.value || 0}
                percent={{
                  type:
                    statisticalData.customer?.total?.lastMonthValueDiff
                      ?.type,
                  count:
                    statisticalData.customer?.total?.lastMonthValueDiff
                      ?.value || 0,
                }}
              />
              <StatisticalItem
                bg={"#A23FC3"}
                title={`Khách hàng mới`}
                icon={UserNewIcon}
                count={statisticalData.customer?.new?.value || 0}
                percent={{
                  type:
                    statisticalData.customer?.new?.lastMonthValueDiff?.type ===
                    "GT",
                  count:
                    statisticalData.customer?.new?.lastMonthValueDiff?.value ||
                    0,
                }}
              />
              <StatisticalItem
                bg={"#00877C"}
                title={`KH quay lại lần 2`}
                icon={UserProfileIcon}
                count={thisMonthVal?.returned?.value || 0}
                percent={{
                  type:
                    thisMonthVal?.returned?.lastMonthValueDiff
                      ?.type,
                  count:
                    roundUp2Digits(thisMonthVal?.returned?.lastMonthValueDiff
                      ?.value || 0),
                }}
              />
              <div
                className="statistic-container flex-center"
                style={{ background: "white", flexFlow: "column" }}
              >
                <DoughnutChart
                  percent={{
                    type:
                      thisMonthVal?.returned?.lastMonthValueDiff
                        ?.type,
                    count:
                      roundUp2Digits(thisMonthVal?.returned?.lastMonthValueDiff
                        ?.value) || 0,
                  }}
                />
                <h3 className="statistic-doughnut-des">
                  Tỉ lệ khách quay lại lần 2
                </h3>
              </div>
            </div>
          </>
        </div>
      </div>

      <div className="mt-4">
        <BarChart data={statisticalData.customer?.data || []} />
      </div>

      <div className="d-flex justify-content-center w-100">
        <div className="statistical__body">
          <div className="d-flex align-items-center">
            <sc.Line />
            <sc.Title>Tin nhắn SMS</sc.Title>
          </div>

          <div className="row mt-5 statistic-user flex-around">
            <StatisticalItem
              bg={"#FFB63B"}
              title={`Tổng số SMS`}
              icon={Sms}
              count={statisticalData.messages?.sms?.total?.value || 0}
              percent={{
                type:
                  statisticalData.messages?.sms?.total?.lastMonthValueDiff
                    ?.type,
                count:
                  statisticalData.messages?.sms?.total?.lastMonthValueDiff
                    ?.value || 0,
              }}
            />
            <StatisticalItem
              bg={"#007BFF"}
              title={`Gửi thành công`}
              icon={Sms}
              count={statisticalData.messages?.sms?.sent.value || 0}
              percent={{
                type:
                  statisticalData.messages?.sms?.sent.lastMonthValueDiff
                    ?.type,
                count:
                  statisticalData.messages?.sms?.sent.lastMonthValueDiff
                    ?.value || 0,
              }}
            />
            <StatisticalItem
              bg={"#FF3D58"}
              title={`Gửi thất bại`}
              icon={Sms}
              count={statisticalData.messages?.sms?.failed.value || 0}
              percent={{
                type:
                  statisticalData.messages?.sms?.failed.lastMonthValueDiff
                    ?.type,
                count:
                  statisticalData.messages?.sms?.failed.lastMonthValueDiff
                    ?.value || 0,
              }}
            />
            <StatisticalItem
              bg={"#BD8180"}
              title={`Chi phí`}
              icon={Sms}
              count={statisticalData.messages?.sms?.cost.value || 0}
              percent={{
                type:
                  statisticalData.messages?.sms?.cost.lastMonthValueDiff
                    ?.type,
                count:
                  statisticalData.messages?.sms?.cost.lastMonthValueDiff
                    ?.value || 0,
              }}
            />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <LineChart data={statisticalData.messages} />
      </div>
    </main>
  );
};

const StatisticalItem = ({ title, count, icon, bg, percent }) => {
  return (
    <div className="statistic-container" style={{ background: bg }}>
      <div className="statistic-icon flex-center">
        <img src={icon} alt={"statistic-icon"} />
      </div>
      <div className="statistic-title">
        <span>{title}</span>
      </div>
      <div className="statistic-count">
        <span>{formatNumber(count)}</span>
      </div>
      <div className="statistic-percent d-flex w-100">
        <span className="d-inline-block">So với tháng trước</span>
        <span className={`percent-${percent.type === "GT" ? "up" : percent.type === "LT" ? "down" : ""} flex-center`}>
          <img src={(percent.type === "GT" || percent.type === "EQ") ? PercentUp : PercentDown} alt="percent" />{" "}
          {Math.ceil(percent.count)}%
        </span>
      </div>
    </div>
  );
};

export default Statistical;
