import React, { useEffect, useState , memo} from 'react';
import { MobileOutlined, WechatOutlined, AppstoreOutlined, MailOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import MessageCustomerMarketingService from 'services/MessageCustomerMarketingService';
import StatisticalItem from './StatisticalItem';

const MessageStatistics = () => {
  const { t: translation } = useTranslation();
  const setting = useSelector((state) => state.setting);
  const [data, setData] = useState({});

  useEffect(() => {
    MessageCustomerMarketingService.getMessageMarketingConfig({
      stationsId: setting.stationsId
    }).then((res) => {
      if (res.isSuccess) {
        setData(res.data)
      }
    })
  }, []);

  return (
    <div className='col-12 col-lg-12 mb-3'>
      <div className='row'>
        <div className='col-12 col-md-6 col-lg-6 col-xl-3'>
          <StatisticalItem
            bg={"#1890FF"}
            color={"#1890FF"}
            title={translation('sms.remainingAPNSMessages')}
            icon={<AppstoreOutlined style={{ color: '#1890FF' }} />}
            count={data.remainingQtyMessageAPNS || 0}
            percent={{}} // No percentage required for this item
          />
        </div>
        <div className='col-12 col-md-6 col-lg-6 col-xl-3'>
          <StatisticalItem
            bg={"#52C41A"}
            color={"#52C41A"}
            title={translation('sms.remainingSMSMessages')}
            icon={<MobileOutlined style={{ color: '#52C41A' }} />}
            count={(data.remainingQtyMessageSmsCSKH + data.remainingQtyMessageSmsPromotion) || 0}
            percent={{}}
          />
        </div>
        <div className='col-12 col-md-6 col-lg-6 col-xl-3'>
          <StatisticalItem
            bg={"#d48806"}
            color={"#d48806"}
            title={translation('sms.remainingZaloMessages')}
            icon={<WechatOutlined style={{ color: '#d48806' }} />}
            count={(data.remainingQtyMessageZaloCSKH + data.remainingQtyMessageZaloPromotion) || 0}
            percent={{}}
          />
        </div>
        <div className='col-12 col-md-6 col-lg-6 col-xl-3'>
          <StatisticalItem
            bg={"#CF1322"}
            color={"#CF1322"}
            title={translation('sms.remainingQtyMessageEmail')}
            icon={<MailOutlined style={{ color: '#CF1322' }} />}
            count={data.remainingQtyMessageEmail || 0}
            percent={{}}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(MessageStatistics);