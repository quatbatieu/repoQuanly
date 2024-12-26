import React, { useState, useEffect } from 'react'

import { LineChart } from 'Page/Charts/LineChart'
import { Button, DatePicker } from 'antd'
import { ArrowDownOutlined, ArrowUpOutlined, ExportOutlined } from '@ant-design/icons'

import customerStatisticalService from "../../services/customerStatisticalService";
import "./receipt.scss"
import moment from 'moment'
import _ from 'lodash';
import { useTranslation } from 'react-i18next'
import { formatNumber } from 'helper/common'
import { useSelector } from 'react-redux';
import UnLock from 'components/UnLock/UnLock';

function StatisticalReceipt() {
  const { t: translation } = useTranslation()
  const [statisticalData, setStatisticalData] = useState({})
    const setting = useSelector(state => state.setting)
  const [filter, setFilter] = useState({
    startDate: moment().startOf("year").format("DD/MM/YYYY"),
    endDate: moment().endOf("year").format("DD/MM/YYYY"),
  });

  const onFilterByDate = async () => {
    const { startDate, endDate } = filter
    const result = await customerStatisticalService.report({
      startDate: startDate,
      endDate: endDate
    });

    if (result && !_.isEmpty(result)) {
      setStatisticalData(result);
    }
  };

  useEffect(() => {
    onFilterByDate()
  }, [])

  const yearFormat = (d) => {
    return d.format("YYYY")
  }

  return (
    <>
      {setting.enableInvoiceMenu === 0 ? <UnLock />:(
        <main>
          <div className="row">
            {/* <div className="col-12 col-md-4 col-lg-3">
              <label className="section-title pl-3">
                {translation('Receipt12M')}
              </label>
            </div>
            <div className="col-12 col-md-1 col-lg-3 col-xl-4" /> */}

            <div className="col-md-5 col-lg-4 col-xl-3 mb-3 d-flex align-items-center">
              <span>{translation("select-time")}</span>
              &nbsp;
              &nbsp;
              <DatePicker
                picker="year"
                style={{ flexGrow: 1 }}
                defaultValue={moment(filter.startDate, "DD/MM/YYYY")}
                onChange={(value) => {
                  if (value) {
                    setFilter({
                      startDate: value.startOf("year").format("DD/MM/YYYY"),
                      endDate: value.endOf("year").format("DD/MM/YYYY")
                    })
                  }
                }}
                allowClear={false}
                format={yearFormat}
                monthCellRender={(date, _) => {
                  return translation(date.format("MMMM"))
                }}
              />
            </div>
            <div className="col-md-2 col-lg-2 col-xl-2 style_recipt">
              <Button
                type="primary"
                icon={<ExportOutlined />}
                className="d-flex align-items-center"
                onClick={onFilterByDate}
              >{translation("report")}</Button>
            </div>
          </div>

          <div className='row mt-4'>
            <div className='mb-3'>
              <div className='row'>
                <div className='col-12 col-md-6 col-lg-3'>
                  <StatisticalItem
                    bg={"#FFF1B8"}
                    color={"#D48806"}
                    title={translation('sms.allSms')}
                    icon={"/assets/images/chattext.png"}
                    count={statisticalData.messages?.sms?.total || 0}
                    percent={{
                      type:
                        statisticalData.customer?.total?.lastMonthValueDiff
                          ?.type,
                      count:
                        statisticalData.customer?.total?.lastMonthValueDiff
                          ?.value || 0,
                    }}
                  />
                </div>

                <div className='col-12 col-md-6 col-lg-3'>
                  <StatisticalItem
                    bg={"#E6F7FF"}
                    color={"#1890FF"}
                    title={translation('sms.sentSuccessfully')}
                    icon={"/assets/images/wallet.png"}
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
                </div>

                <div className='col-12 col-md-6 col-lg-3'>
                  <StatisticalItem
                    bg={"#D9F7BE"}
                    color="#52C41A"
                    title={translation('sms.failedToSend')}
                    icon={"/assets/images/export.png"}
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
                </div>

                <div className='col-12 col-md-6 col-lg-3'>
                  <StatisticalItem
                    bg={"#FFF1F0"}
                    color="#CF1322"
                    title={translation('sms.cost')}
                    icon={"/assets/images/prohibit.png"}
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
            <div className='col-12 col-lg-6 custom-chart'>
              <LineChart data={statisticalData.messages} />
            </div>
          </div>
        </main>
      )}
    </>
    
  )
}

const StatisticalItem = ({ title, count, icon, bg, percent, color }) => {
  return (
    <div className="statistical_accreditation" style={{ borderLeft: `10px solid ${color}` }}>
      <div className='statistical_accreditation-content_up'>
        <div className="icon" style={{ background: bg }}>
          <img src={icon} alt={"icon"} />
        </div>
        <div className='title'>{title}</div>
      </div>
      <div className="statistical_accreditation-content_down">
        <div className='amount' style={{ color: color }}>{formatNumber(count)}</div>
        {/* <div className="info">
          <span className="text">So với tháng trước</span>
          <span className={`percent-${percent.type === "GT" ? "up" : percent.type === "LT" ? "down" : ""} flex-center`}>
            {
              (percent.type === "GT") ? (
                <ArrowUpOutlined />
              ) : (
                <></>
              )
            }
            {
              percent.type === "LT" ? (
                <ArrowDownOutlined />
              ) : (
                <></>
              )
            }
            {Math.ceil(percent.count)}%
          </span>
        </div> */}
      </div>
    </div>
  );
};

export default StatisticalReceipt;

