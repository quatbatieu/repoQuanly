import React from 'react';
import { Space, Typography, Select } from 'antd';
import "./MessageFilter.scss";
import { useTranslation } from 'react-i18next';
import { getListMessageTypesFilter } from 'constants/sms';

const { Option } = Select;
const { Text } = Typography;

const MessageFilter = ({ selectedItem, onFilter }) => {
  const { t: translation } = useTranslation();
  const filterOptions = getListMessageTypesFilter(translation);

  return (
    <div className='message-filter'>
      <Text strong>{translation('listCustomers.sendMessageModal.filterBy')}</Text>
      <Select
        value={selectedItem || ""}
        style={{ width: 250 }}
        onChange={value => onFilter(value)}
      >
        {filterOptions.map(item => (
          <Option key={item.label} value={item.value}>
            {item.label}
          </Option>
        ))}
      </Select>
    </div>
  );
}

export default MessageFilter;
