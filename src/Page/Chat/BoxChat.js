import React, { useRef, memo, useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import moment from 'moment'
import { useTranslation } from 'react-i18next';

import Send from './Send';

import User from 'components/User/User';
import BoxInfo from './BoxInfo';

import ChatService from 'services/chatService';
import ConversationService from 'services/conversationService';

import TimeAgo from "timeago-react";
import * as timeago from "timeago.js";
import vi from "timeago.js/lib/lang/vi";

import { useSelector } from 'react-redux';
import "./boxChat.scss";
import { useImperativeHandle } from 'react';
const TIME_UPDATE = 1000;
const SIZE = 10;
const DEFAULT_FILTER = { filter: {}, skip: 0, limit: SIZE }
const MODE = {
  add: "ADD",
  refresh: "REFRESH"
}
const CONVERSATION_ID = "APP_USER_CONVERSATION_ID";

const TimeChat = ({ date }) => {
  return (
    <div className='box__chat__time'>
      <p className='m-0'>
        {moment(date).format("DD/MM/YYYY")}
      </p>
    </div>
  )
}

const ItemChat = ({ avatar, name, message, date, isActive, isTime }) => {
  if (isTime) {
    return <TimeChat date={date} />
  }
  return (
    <div className={`box__chat__item ${isActive ? "active" : ""}`}>
      <div className='box__chat__item__top'>
        <User name={name} url={avatar} isBold={true} imageSize={32} />
        <div className='box__chat__item__message'>
          <p className='m-0'>
            {message}
          </p>
        </div>
      </div>
      <div className='box__chat__item__bottom'>
        <div className='box__chat__item__date'>
          <p className='m-0'>
            <TimeAgo datetime={date} locale="vi" live={false} />
          </p>
        </div>
      </div>
    </div>
  )
}

function BoxChat({ appUserConversation, reloadRef , seen , onFetchData , handleFetchConversation }) {
  const { t: translation } = useTranslation()

  const listChatElemt = useRef(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [firstFetchApi, setFirstFetchApi] = useState(false);
  const [dataFilter, setDataFilter] = useState(DEFAULT_FILTER)
  const [dataListChat, setDataChat] = useState({
    data: [],
    total: 0
  });

  const [customer, setCustomer] = useState({})

  const user = useSelector(state => state.member);

  function handleFetchUser(id) {
    ConversationService.getUser({ id }).then(result => {
      if (result) {
        setCustomer(result);
      }
    })
  }
  
  useImperativeHandle(reloadRef , () => {
    return () => {
      if (appUserConversation?.appUserConversationId) {
        handleFetchChat(dataFilter, MODE.refresh);
        handleRead(appUserConversation.appUserConversationId)
      }
    }
  })

  function CreateATimeline(dataChat) {
    const data = [...dataChat];
    if (data.length === 0) {
      return [];
    }
    data.sort(function (a, b) {
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

    let time = "";
    const newData = [];
    data.forEach(element => {
      const date = moment().format("DD/MM/YYYY");
      const dateElemt = moment(element.createdAt).format("DD/MM/YYYY");
      if (dateElemt !== time && dateElemt !== date) {
        newData.push({
          ...element,
          isTime: true
        })
        time = dateElemt;
      }
      newData.push(element);
    });
    return newData;
  }

  function handleRead(id) {
    ConversationService.read({
      id ,
      data: {
        receiverReadMessage: 1
      }
    })
  }
  function handleScrollPosition(position) {
    // the position can be a string or a number . 
    // If it is a number, ListChatElemt will scroll to the number position.
    if (position === "End") {
      listChatElemt.current.scrollTop = 50;
      return;
    }

    if (position === "Start") {
      listChatElemt.current.scrollTop = listChatElemt.current.scrollHeight;
      return;
    }

    listChatElemt.current.scrollTop = position;
  }

  function handleFetchChat(filter, dataMode, callback) {
    setLoading(true)
    ChatService.getListChatLog(filter).then(result => {
      if (result) {
        if (dataMode === MODE.add) {
          setDataChat(prev => ({
            data: [...prev.data, ...result.data],
            total: result.total
          }));
        } else {
          setDataChat(result);
          setPage(1);
        }
        setLoading(false);
        setFirstFetchApi(true);
        if (callback) {
          callback()
        }
      }
    })
  }

  function handleResetFetchChat() {
    setDataChat({
      data: [],
      total: 0
    });
    setPage(1);
    setDataFilter(DEFAULT_FILTER);
    setFirstFetchApi(false);
  }

  useEffect(() => {
    if (appUserConversation?.appUserConversationId) {
      handleFetchUser(appUserConversation.appUserConversationId)
    }
  }, [appUserConversation])
  useEffect(() => {
    if (listChatElemt.current && firstFetchApi) {
      handleScrollPosition("Start")
    }
  }, [listChatElemt, firstFetchApi])

  useEffect(() => {
    if (appUserConversation?.appUserConversationId) {
      handleResetFetchChat();
      dataFilter.filter.appUserConversationId = appUserConversation.appUserConversationId;
      handleFetchChat(dataFilter, MODE.refresh);
      handleRead(appUserConversation.appUserConversationId)
      if(!seen){
        onFetchData();
      }
    }
  }, [appUserConversation])
  if (!appUserConversation) {
    return (
      <Col
        xxl={{ span: 19 }}
        xl={{ span: 19 }}
        lg={{ span: 24 }}
        md={{ span: 24 }}
        sm={{ span: 24 }}
        xs={{ span: 24 }}
      >
        <div className='box__chat box__chat__empty'>
          <div className='chat__empty__text px-3'>
            <p className='m-0 text-center'>{translation("chat.empty.listChat")}</p>
          </div>
        </div>
      </Col>
    )
  }

  const handleScroll = async (e) => {
    const scrollTop = listChatElemt.current.scrollTop;
    if (scrollTop === 0 && !loading && dataListChat.total > (page * dataFilter.limit)) {
      const newFilter = {
        ...dataFilter,
        skip: (page) * dataFilter.limit
      }
      await handleFetchChat(newFilter, MODE.add);
      setPage(prev => prev + 1)
      handleScrollPosition("End")
    }
  }

  return (
    <Col
      xxl={{ span: 19 }}
      xl={{ span: 19 }}
      lg={{ span: 24 }}
      md={{ span: 24 }}
      sm={{ span: 24 }}
      xs={{ span: 24 }}
    >
      <div className='box__chat'>
        <Row>
          <Col
            className="box__chat__box"
            xxl={{ span: 17 }}
            xl={{ span: 17 }}
            lg={{ span: 24 }}
            md={{ span: 24 }}
            sm={{ span: 24 }}
            xs={{ span: 24 }}
          >
            <div className='box__chat__wrap'>
              <div className='box__chat__header px-3 pt-2'>
                <User
                  name={customer.firstName}
                  url={customer.userAvatar}
                  imageSize={24}
                  isBold={true}
                />
              </div>
              <div
                className='box__chat__list'
                ref={listChatElemt}
                onScroll={handleScroll}
              >
                {loading && <div className='box__chat__loading'>{translation("chat.loading")}</div>}
                {CreateATimeline([...dataListChat.data].reverse()).map((item, index) => {
                  const isActive = item.senderToReceiver === 0;
                  return (
                    <ItemChat
                      key={index}
                      name={isActive ? user.username : customer.firstName}
                      avatar={isActive ? user.userAvatar : customer.userAvatar}
                      message={item.appUserChatLogContent}
                      date={item.createdAt}
                      station={user}
                      client={customer}
                      isTime={item.isTime}
                    />
                  )
                }
                )}
              </div>
              <Send
                appUserConversationId={appUserConversation?.appUserConversationId} 
                />
            </div>
          </Col>
          <Col
            xxl={{ span: 7 }}
            xl={{ span: 7 }}
            lg={{ span: 24 }}
            md={{ span: 24 }}
            sm={{ span: 24 }}
            xs={{ span: 24 }}
          >
            <BoxInfo client={customer} />
          </Col>
        </Row>
      </div>
    </Col>
  );
}

export default memo(BoxChat);