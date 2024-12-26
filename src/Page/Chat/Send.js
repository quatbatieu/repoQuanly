import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { memo, useRef } from 'react';
import { Input, Form, Button, notification } from 'antd';
import { useSelector } from 'react-redux';

import "./send.scss";

import ChatService from 'services/chatService';


function Send({ appUserConversationId }) {
  const { t: translation } = useTranslation()
  const { client } = useSelector(state => state.mqtt);
  const [form] = Form.useForm();
  const inputRef = useRef(null);
  const [reload, setReload] = useState([])
  
  function handleFinish(values) {
    if (!values.appUserChatLogContent) {
      return;
    }
    ChatService.sendToUser({ ...values, appUserConversationId }).then(result => {
      if (!result.issSuccess) {
        notification['error']({
          message: '',
          description: translation('accreditation.updateError')
        });
      }
    })
    form.resetFields();
    if (inputRef.current) {
      inputRef.current.focus({
        cursor: 'start'
      })
    }
  }
  return (
    <div className='send'>
      <Form
        onFinish={handleFinish}
        form={form}
      >
        <div className='send__action'>
          <div className='send__input'>
            <Form.Item noStyle name="appUserChatLogContent">
              <Input.TextArea
                className='send__text__area'
                placeholder={translation("chat.sendPlaceholder")}
                ref={inputRef}
                onKeyPress={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    form.submit();
                  }
                }}
                disabled={!appUserConversationId || !client}
                autoSize={{
                  minRows: 1,
                  maxRows: 6,
                }}
              />
            </Form.Item>
          </div>
          <Button type="primary" htmlType='submit' className='send__btn'>
            {translation("chat.send")}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default memo(Send);