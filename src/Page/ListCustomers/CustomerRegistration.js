import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs } from 'antd';
import CustomerList from './index';
import StatisticalCustomer from './statisticalCustomer';
import CustomerSettings from './CustomerSettings';

const { TabPane } = Tabs;

const CustomerRegistration = () => {
  const { t: translation } = useTranslation();

  return (
    <Tabs>
      <TabPane tab={translation("listCustomers.tab.list")} key="list">
        <CustomerList />
      </TabPane>
      <TabPane tab={translation("listCustomers.tab.statistics")} key="statistics">
        <StatisticalCustomer />
      </TabPane>
      <TabPane tab={translation("listCustomers.tab.setting")} key="settings">
        <CustomerSettings />
      </TabPane>
    </Tabs>
  );
};

export default CustomerRegistration;
