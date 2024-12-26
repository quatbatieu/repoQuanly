import React, { useState, useEffect, Fragment } from 'react'

import { LineChart } from 'Page/Charts/LineChart'
import { Button, DatePicker, Modal, Spin, Typography } from 'antd'
import { ArrowDownOutlined, ArrowUpOutlined, ExportOutlined, AppleOutlined, MobileOutlined, WechatOutlined, MailOutlined, MessageOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'

import StatisticalService from "../../services/statisticalService";
import UnLock from 'components/UnLock/UnLock';
import moment from 'moment'
import _ from 'lodash';
import { useTranslation } from 'react-i18next'
import MessageStatistics from './MessageStatistics';
import MessagingPlatformStatistics from './MessagingPlatformStatistics';
import MessageStatisticsChart from './MessageStatisticsChart';
import MessageStatisticsLineChart from './MessageStatisticsLineChart';
import MessageService from 'services/messageService';
import { useSelector } from 'react-redux'

const { RangePicker } = DatePicker;
const { Title } = Typography;

const convertDataForChart = (reportOutput,translation) => {
  const labels = reportOutput.summaryMessageByType?.map(item => {
    let year = '';
    let month = '';
    if (item.month && item.month?.toString()?.length >= 6) {
      year = item.month.toString().slice(0, 4);
      month = item.month.toString().slice(4);
    }
    return  "Tháng " + month + "- " + year;
  }) || [];
  const totalMessageSMS = reportOutput.summaryMessageByType?.map(item => item?.totalMessageSMS || 0) || [];
  const totalMessageAPNS = reportOutput.summaryMessageByType?.map(item => item?.totalMessageAPNS || 0) || [];
  const totalMessageZNS = reportOutput.summaryMessageByType?.map(item => item?.totalMessageZNS || 0) || [];
  const totalMessageEmail = reportOutput.summaryMessageByType?.map(item => item?.totalMessageEmail || 0) || [];

  const chart = {
    labels,
    datasets: [
      {
        label: translation('sms.allSMS'),
        data: totalMessageSMS,
        backgroundColor: "#52C41A",
        barThickness: 50,
        stack: 'Stack 0',
      },
      {
        label: translation('sms.allAPNS'),
        data: totalMessageAPNS,
        backgroundColor: "#1890FF",
        barThickness: 50,
        stack: 'Stack 0',
      },
      {
        label: translation('sms.allZNS'),
        data: totalMessageZNS,
        backgroundColor: "#d48806",
        barThickness: 50,
        stack: 'Stack 0',
      },
      {
        label: translation('sms.allEmail'),
        data: totalMessageEmail,
        backgroundColor: "#CF1322",
        barThickness: 50,
        stack: 'Stack 0',
      },
    ],
  };

  const messages = {
    total: reportOutput?.totalMessage, // Tổng số tin nhắn của tất cả các nền tảng
    sms: {
      total: reportOutput?.totalMessageSMS, // Tổng số tin nhắn SMS
    },
    zns: {
      total: reportOutput?.totalMessageZNS, // Tổng số tin nhắn ZNS
    },
    apns: {
      total: reportOutput?.totalMessageAPNS, // Tổng số tin nhắn APNS
    },
    email: {
      total: reportOutput?.totalMessageEmail, // Tổng số tin nhắn Email
    },
  };

  return { chart, messages };
};

const convertDataForChartAndMessages = (reportOutput,translation) => {
  const labels = reportOutput.summaryMessageByStatus?.map(item => {
    let year = '';
    let month = '';
    if (item.month && item.month?.toString()?.length >= 6) {
      year = item.month.toString().slice(0, 4);
      month = item.month.toString().slice(4);
    }
    return  "Tháng " + month + "- " + year;
  }) || [];;
  const datasetSuccess = reportOutput.summaryMessageByStatus?.map(item => item.totalMessageSuccess || 0) || [];;
  const datasetInProgress = reportOutput.summaryMessageByStatus?.map(item => item.totalMessageInprogress || 0) || [];;
  const datasetFailed = reportOutput.summaryMessageByStatus?.map(item => item.totalMessageFailed || 0) || [];;

  const chart = {
    labels,
    datasets: [
      {
        label: translation('sms.sentSuccessfully'),
        data: datasetSuccess,
        backgroundColor: "#52C41A",
        barThickness: 50,
      },
      {
        label: translation('sms.sending'),
        data: datasetInProgress,
        backgroundColor: "#d48806",
        barThickness: 50,
      },
      {
        label: translation('sms.failedToSend'),
        data: datasetFailed,
        backgroundColor: "#CF1322",
        barThickness: 50,
      },
    ],
  }

  const messages = {
    sms: {
      total: reportOutput?.totalMessage, // Tổng số tin nhắn
      sent: {
        value: reportOutput?.totalMessageSuccess, // Tổng số tin nhắn đã gửi thành công
        lastMonthValueDiff: {
          type: "increase", // Giả sử rằng số lượng tin nhắn đã gửi tăng so với tháng trước
        },
      },
      pending: {
        value: reportOutput?.totalMessageInprogress, // Tổng số tin nhắn đang chờ gửi
        lastMonthValueDiff: {
          type: "decrease", // Giả sử rằng số lượng tin nhắn đang chờ giảm so với tháng trước
        },
      },
      failed: {
        value: reportOutput?.totalMessageFailed, // Tổng số tin nhắn gửi thất bại
        lastMonthValueDiff: {
          type: "increase", // Giả sử rằng số lượng tin nhắn thất bại tăng so với tháng trước
        },
      },
    },
  };

  return { chart, messages };
}

function StatisticalSMS() {
  const setting = useSelector((state) => state.setting);
  const { t: translation } = useTranslation()
  const [statisticalData, setStatisticalData] = useState({})
  const [isLoading , setIsLoading] = useState(false); 
  const [filter, setFilter] = useState({
    startDate: moment().set('month', moment().month()-5).startOf('month').format('DD/MM/YYYY'),
    endDate: moment().endOf("month").format("DD/MM/YYYY"),
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const messageStatistics = convertDataForChartAndMessages(statisticalData,translation);
  const messagingPlatformStatistics  = convertDataForChart(statisticalData,translation);

  const onFilterByDate = async () => {
    const { startDate, endDate } = filter
    setIsLoading(true);
    const result = await MessageService.getReportList({
      startDate: startDate,
      endDate: endDate
    }).then((result) => {
      if(result){
        setStatisticalData(result.data);
      }
      setIsLoading(false);
    });
  };

  useEffect(() => {
    onFilterByDate()
  }, [])

  const yearFormat = (d) => {
    return d.format("YYYY")
  }

  if(isLoading){
    return <Spin />
  }

  return (
    <Fragment>
      {setting.enableMarketingMessages === 0 ? <UnLock /> :
        <main>
      <div className="row">
        {/* <div className="col-12 col-md-4 col-lg-3">
          <label className="section-title pl-3">
            {translation('sms.messageStatistics')}
          </label>
        </div>
        <div className="col-12 col-md-2 col-lg-3 col-xl-5" /> */}

        <div className="col-md-4 col-lg-4 col-xl-3 mb-3 d-flex align-items-center">
          <RangePicker
            style={{ flexGrow: 1 }}
            picker='month'
            defaultValue={[
              moment(filter.startDate, "DD/MM/YYYY"),
              moment(filter.endDate, "DD/MM/YYYY")
            ]}
            allowClear={false}
            onChange={(dates, dateStrings) => {
              
              if (dates && dates[0] && dates[1]) {
                let endMonth = moment(dates[1], "DD/MM/YYYY").endOf('month');
                let startMonth = moment(dates[0], "DD/MM/YYYY").startOf('month');
                let totalMonthsInRange = endMonth.diff(startMonth, 'months') + 1;
                if (totalMonthsInRange > 6) {
                  showModal()
                }else{
                  let start = moment(dates[0]).startOf('month').format("DD/MM/YYYY")
                  let end = moment(dates[1]).endOf('month').format("DD/MM/YYYY")
                  setFilter({
                    ...filter,
                    startDate: start,
                    endDate:  end
                  });
                }
              }
            }}
            format="DD/MM/YYYY"
          />

        </div>
        <div className="col-6 col-md-2 col-lg-2 col-xl-1 mb-3">
          <Button
            type="primary"
            icon={<ExportOutlined />}
            className="d-flex align-items-center flex-center w-100"
            onClick={onFilterByDate}
          >{translation("report")}</Button>
        </div>
      </div>
      <div>
        <Title level={3} className='title-normal mt-2 mb-0'>
          {translation('sms.numberOfMessagesInUse')}
        </Title>
        <div className='row mt-4'>
          <MessageStatistics />
        </div>

        <Title level={3} className='title-normal mt-2 mb-0'>
          {translation('sms.messageStatisticsByStatus')}
        </Title>
        <div className='row'>
          <div className='col-12 col-lg-12'>
            <MessageStatisticsLineChart chartData={messageStatistics.chart} />
          </div>
        </div>

        <Title level={3} className='title-normal mt-2 mb-0'>
          {translation('sms.statisticsOfSentMessages')}
        </Title>
        <div className='row mt-4'>
          <MessagingPlatformStatistics statisticalData={messagingPlatformStatistics} />
        </div>

        <Title level={3} className='title-normal mt-2 mb-0'>
          {translation('sms.statisticsOfSentMessagesByType')}
        </Title>
        <div className='row'>
          <div className='col-12 col-lg-12'>
            <MessageStatisticsChart chartData={messagingPlatformStatistics.chart} />
          </div>
        </div>
      </div>
      <>
    <Modal
      title={translation("sms.getData")}
      visible={isModalOpen}
      footer={[
        <Button key="back" onClick={handleOk}>
            OK
        </Button>
      ]}
      >
        <p>{translation("sms.onlyGetData6Month")}</p>
    </Modal>
          </>
        </main>
      }
    </Fragment>
  )
}

export default StatisticalSMS 