import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Typography, Input, Space } from 'antd';
import { useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import User from 'components/User/User';
import BoxChat from './BoxChat';
import BoxChatMobile from './BoxChatMobile';

import ConversationService from 'services/conversationService';

import TimeAgo from "timeago-react";
import * as timeago from "timeago.js";
import vi from "timeago.js/lib/lang/vi";

import { handleChangeChat } from 'actions/chatAction';

import "./chat.scss";
import { useSelector, useDispatch } from 'react-redux';

timeago.register("vi", vi);

const SIZE = 6;
const DEFAULT_FILTER = { filter: {}, skip: 0, limit: SIZE }
const TIME_UPDATE = 30000;
const MODE = {
  add: "ADD",
  refresh: "REFRESH"
}
const CONVERSATION_ID = "APP_USER_CONVERSATION_ID";


const ItemChat = ({ avatar, name, message, date, id, seen = false, isActive, onClick, onFetch }) => {

  return (
    <div className={`chat__item ${isActive ? "active" : ""}`} onClick={onClick}>
      <div className='chat__item__wrap'>
        <div className='chat__item__top'>
          <User name={name} url={avatar} imageSize={24} isBold={!seen} />
        </div>
        <div className='chat__item__bottom'>
          <div className='chat__item__date'>
            <p>
              <TimeAgo datetime={date} locale="vi" live={false} />
            </p>
          </div>
          {!seen && <div className='chat__item__send'></div>}
        </div>
      </div>
      <div className='chat__item__message'>
        <p className='m-0'>{message}</p>
      </div>
    </div>
  )
}

function Chat(props) {
  const { t: translation } = useTranslation()
  const location = useLocation();
  const history = useHistory();
  const { notification } = useSelector(state => state.chat);
  const { client, message } = useSelector(state => state.mqtt);
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [active, setActive] = useState(-1);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [appUserConversation, setAppUserConversation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataListConversation, setDataConversation] = useState({
    data: [],
    total: 0
  })

  const reloadRef = useRef(null);
  const [dataFilter, setDataFilter] = useState(DEFAULT_FILTER)
  const appUserConversationId = location.state?.appUserConversationId;


  const handleMessage = (message) => {
    dataListConversation.data.forEach(async (item) => {
      if (`${CONVERSATION_ID}_${item.appUserConversationId}` === message.topic) {
        const numberTopic = message.topic.replace(/^\D+/g, '');
        if (+numberTopic === appUserConversation?.appUserConversationId) {
          await reloadRef.current();
        }
        await handleFetchConversation(dataFilter, MODE.refresh);
      }
    })
  }

  useEffect(() => {
    if (appUserConversationId) {
      setAppUserConversation({
        appUserConversationId: appUserConversationId
      })
    } else {
      setAppUserConversation(null)
    }
  }, [appUserConversationId])

  useEffect(() => {
    if (dataListConversation.data) {
      const isNotification = dataListConversation.data.some((item) => item.receiverReadMessage === 0);
      dispatch(handleChangeChat(isNotification));
    }
  }, [dataListConversation.data])

  useEffect(() => {
    const arrKeys = Object.keys(message);
    if (arrKeys.length > 0) {
      handleMessage(message);
    }
  }, [JSON.stringify(message)]);

  function handleFetchConversation(filter, dataMode) {
    setLoading(true)
    ConversationService.getListConversation(filter).then(result => {
      if (result) {
        if (dataMode === MODE.add) {
          setDataConversation(prev => ({
            data: [...prev.data, ...result.data],
            total: result.total
          }));
        } else {
          setDataConversation(result);
          setPage(1);
        }
        setLoading(false)
      }
    })
  }

  function handleChangePage() {
    const newFilter = {
      ...dataFilter,
      skip: (page) * dataFilter.limit
    }
    handleFetchConversation(newFilter, MODE.add);
    setPage(prev => prev + 1)
  }

  function handleSearch(value) {
    const newFilter = { ...dataFilter };
    if (!value) {
      delete newFilter.searchText
    } else {
      newFilter.searchText = value
    }
    setDataFilter(newFilter)
    handleFetchConversation(newFilter, MODE.refresh)
  }

  const isShowMore = dataListConversation.total > (page * dataFilter.limit);
  
  useEffect(() => {
    handleFetchConversation(dataFilter, MODE.add);
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 1140);
    };

    // Gọi handleResize khi kích thước cửa sổ trình duyệt thay đổi
    window.addEventListener('resize', handleResize);

    // Kiểm tra kích thước ban đầu khi component được mount
    handleResize();

    // Xóa event listener khi component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const More = useCallback(() => {
    if (!loading && isShowMore) {
      return (
        <div className='chat__more' onClick={handleChangePage}>
          {translation("chat.more")}
        </div>
      )
    }
    return (
      <div className='chat__more__empty'>
      </div>
    )
  }, [loading, isShowMore])

  return (
    <div className='chat'>
      <Row className='chat__wrap'>
        <Col
          className="chat__col"
          xxl={{ span: 5 }}
          xl={{ span: 5 }}
          lg={{ span: 24 }}
          md={{ span: 24 }}
          sm={{ span: 24 }}
          xs={{ span: 24 }}
        >
          <div className="chat__box">
            <div className='px-3 chat__title pt-2'>
              <Typography.Title level={4}>
                {translation("chat.title")}
              </Typography.Title>
              <Input.Search
                placeholder={translation("chat.searchPlaceholder")}
                style={{
                  width: "100%",
                }}
                onSearch={handleSearch}
                className="mb-2 pb-1"
              />
            </div>
            <div className='chat__list'>
              {dataListConversation.data.length !== 0 ?
                (
                  <>
                    {dataListConversation.data.map((item, index) =>
                      <ItemChat
                        key={index}
                        name={item.firstName}
                        isActive={appUserConversation?.appUserConversationId === item.appUserConversationId}
                        message={item.newestMessage?.appUserChatLogContent}
                        seen={item.receiverReadMessage === 1}
                        onClick={() => {
                          history.push("/chat", {
                            appUserConversationId: item.appUserConversationId
                          })
                        }}
                        date={item.newestMessage?.createdAt}
                      />
                    )}
                    {More()}
                  </>
                )
                : <div className='chat__empty__text px-3'>
                  <p className='m-0 text-center'> {translation("chat.empty.conversation")}</p>
                </div>
              }
            </div>
          </div>
        </Col>
        {isSmallScreen ? (
          <BoxChatMobile
            appUserConversation={appUserConversation}
            reloadRef={reloadRef}
            onBack={() => {
              history.push("/chat", {})
            }}
            seen={appUserConversation?.receiverReadMessage === 1}
            onFetchData={() => handleFetchConversation(dataFilter, MODE.refresh)}
          />
        ) : (
          <BoxChat
            appUserConversation={appUserConversation}
            reloadRef={reloadRef}
            seen={appUserConversation?.receiverReadMessage === 1}
            onFetchData={() => handleFetchConversation(dataFilter, MODE.refresh)}
          />
        )}
      </Row>
    </div>
  );
}

export default Chat;