import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs } from 'antd';
import EmployeePositionMapping from './EmployeePositionMapping';
import ListUser from './index';
import PermissionEmployee from 'Page/PermissionEmployee';
import CreateAssignmentHistory from './CreateAssignmentHistory';

const { TabPane } = Tabs;

const ManageRegistration = () => {
  const { t: translation } = useTranslation()
  return (
    <Tabs destroyInactiveTabPane={true}>
      <TabPane tab={translation("management.tab.management")} key="management">
        <ListUser />
      </TabPane>
      <TabPane tab={translation("management.tab.assignment")} key="assignment">
        <EmployeePositionMapping />
      </TabPane>
      <TabPane tab={translation("management.tab.authority")} key="authority">
        <PermissionEmployee />
      </TabPane>
      <TabPane tab={translation("management.tab.createAssignmentHistory")} key="createAssignmentHistory">
        <CreateAssignmentHistory />
      </TabPane>
    </Tabs>
  );
};

export default ManageRegistration;
