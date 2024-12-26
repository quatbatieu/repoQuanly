import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ConversationService from 'services/conversationService';
import { handleChangeChat } from 'actions/chatAction';

const TIME_UPDATE = 30000;
const SIZE = 100;
const CONVERSATION_ID = "APP_USER_CONVERSATION_ID";
const DEFAULT_FILTER = { filter: {}, skip: 0, limit: SIZE }

function ChatRealTImeEvent(props) {
  const dispatch = useDispatch();

  const { message } = useSelector(state => state.mqtt);

  const handleMessage = (message) => {
    if (message.topic.startsWith(CONVERSATION_ID)) {
      handleFetchConversation(DEFAULT_FILTER);
    }
  }

  function handleFetchConversation(filter) {
    ConversationService.getListConversation(filter).then(result => {
      if (result) {
        const isNotification = result.data?.some((item) => item.receiverReadMessage === 0);
        dispatch(handleChangeChat(isNotification));
      }
    })
  }

  useEffect(() => {
    const arrKeys = Object.keys(message);
    if (arrKeys.length > 0) {
      handleMessage(message);
    }
  }, [JSON.stringify(message)]);

  useEffect(() => {
    handleFetchConversation(DEFAULT_FILTER);
  }, [])
  
  return (
    <></>
  );
}

export default ChatRealTImeEvent;