import React from 'react';
import { MobileOutlined, WechatOutlined, AppstoreOutlined, MailOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import StatisticalItem from './StatisticalItem';

const MessagingPlatformStatistics = ({ statisticalData }) => {
  const { t: translation } = useTranslation();

  const calculatePercentage = (value, total) => {
    let percentage = ((value / total) * 100) || 0;
    return Number(percentage.toFixed(2));
  }

  return (
    <div className='col-12 col-lg-12 mb-3'>
      <div className='row'>
        <div className='col-12 col-md-6 col-lg-6 col-xl-3'>
          <StatisticalItem
            bg={"#1890FF"}
            color={"#1890FF"}
            title={translation('sms.apns')}
            icon={<AppstoreOutlined style={{ color: '#1890FF' }} />}
            count={statisticalData.messages?.apns?.total}
            percent={{
              count: calculatePercentage(statisticalData.messages?.apns?.total, statisticalData.messages?.total)
            }}
          />
        </div>
        <div className='col-12 col-md-6 col-lg-6 col-xl-3'>
          <StatisticalItem
            bg={"#52C41A"}
            color={"#52C41A"}
            title={translation('sms.sms')}
            icon={<MobileOutlined style={{ color: '#52C41A' }} />}
            count={statisticalData.messages?.sms?.total}
            percent={{
              count: calculatePercentage(statisticalData.messages?.sms?.total, statisticalData.messages?.total)
            }}
          />
        </div>
        <div className='col-12 col-md-6 col-lg-6 col-xl-3'>
          <StatisticalItem
            bg={"#d48806"}
            color={"#d48806"}
            title={translation('sms.zns')}
            icon={<WechatOutlined style={{ color: '#d48806' }} />}
            count={statisticalData.messages?.zns?.total}
            percent={{
              count: calculatePercentage(statisticalData.messages?.zns?.total, statisticalData.messages?.total)
            }}
          />
        </div>
        <div className='col-12 col-md-6 col-lg-6 col-xl-3'>
          <StatisticalItem
            bg={"#CF1322"}
            color={"#CF1322"}
            title={translation('sms.email')}
            icon={<MailOutlined style={{ color: '#CF1322' }} />}
            count={statisticalData.messages?.email?.total}
            percent={{
              count: calculatePercentage(statisticalData.messages?.email?.total, statisticalData.messages?.total)
            }}
          />
        </div>
      </div>
    </div>

  );
};

export default MessagingPlatformStatistics;
