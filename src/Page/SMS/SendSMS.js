import React from 'react';
import { useHistory } from 'react-router-dom'
import ImportListDrawer from './ImportListDrawer';
import { useLocation } from 'react-router-dom';

function SendSMS(props) {
  const location = useLocation()
  const history = useHistory()
  const data = location.state?.data;

  return (
    <div>
      <ImportListDrawer
        isSendMessageDrawer={true}
        dataCustomerToSendMessage={data.customerList}
        template={{
          ...data.template,
          messageTemplateContent: data.template.customerMessageContent,
          messageTemplateType: data.template.customerMessageCategories,
          messageTemplateId: data.template.customerMessageTemplateId,
          messageZNSTemplateId: data.template.customermessageZNSTemplateId
        }}
        onBackClick={() => history.goBack()}
        fetchMessage={() => false}
        isSendSMS={true}
      />
    </div>
  );
}

export default SendSMS;