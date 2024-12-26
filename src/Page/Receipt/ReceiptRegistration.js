import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs } from 'antd';
import ListReceipt from './listReceipt';
import StatisticalReceipt from './statisticalReceipt';

const { TabPane } = Tabs;

const ReceiptRegistration = () => {
  const { t: translation } = useTranslation();
  return (
    <Tabs destroyInactiveTabPane={true}>
      <TabPane tab={translation("receipt.tab.list")} key="list">
        <ListReceipt />
      </TabPane>
      <TabPane tab={translation("receipt.tab.statistical")} key="statistical">
        <StatisticalReceipt />
      </TabPane>
    </Tabs>
  );
};

export default ReceiptRegistration;
