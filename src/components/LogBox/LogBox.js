import React, { useState } from 'react';
import { List, Alert } from 'antd';
import "./logBox.scss";

const LogItem = ({ message, status }) => {
  return (
    <List.Item className='w-100'>
      <Alert message={message} type={status} showIcon className='w-100' />
    </List.Item>
  );
};

const LogBox = ({ logs }) => {
  return (
    <div className='w-100 logBox'>
      <List
        style={{ height: "400px", overflowY: "auto" }}
        dataSource={logs}
        bordered
        renderItem={(log) => (
          <LogItem key={log.id} message={log.message} status={log.status} />
        )}
      />
    </div>
  );
};

export default LogBox;
