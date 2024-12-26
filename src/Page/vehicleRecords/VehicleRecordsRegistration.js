import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs } from 'antd';
import VehicleList from './index';
import VehicleSearch from './VehicleSearch';

const { TabPane } = Tabs;

const VehicleRecordsRegistration = () => {
  const { t: translation } = useTranslation();

  return (
    <Tabs>
      <TabPane tab={translation("vehicleRecords.tabs.list")} key="list">
        <VehicleList />
      </TabPane>
      <TabPane tab={translation("vehicleRecords.tabs.search")} key="search">
        <VehicleSearch />
      </TabPane>
    </Tabs>
  );
};

export default VehicleRecordsRegistration;
