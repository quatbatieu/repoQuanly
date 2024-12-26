import React, { useEffect, useRef } from 'react';
import { Modal, notification } from 'antd';
import { useSelector } from 'react-redux';

function DocumentaryRealTimeEvent({ isAdmin }) {
  const { message } = useSelector(state => state.mqtt);
  const startAudio = useRef();
  const [_, contextHolder] = notification.useNotification();

  const newDocumentary = async () => {
    try {
      startAudio.current.play();
    } catch (err) {
      console.log('Service worker registration failed, error:', err);
    }
  };
  
  useEffect(() => {
    const arrKeys = Object.keys(message);
    if (arrKeys.length > 0 && isAdmin && message.topic === "GENERAL_STATION") {
      newDocumentary();
    }
  }, [JSON.stringify(message)]);

  return (
    <div>
      {contextHolder}
      <audio ref={startAudio} type="audio">
        <source type='audio/mpeg' src={require('../../assets/mp3/testAudio.mp3')} />
      </audio>
    </div>
  );
}

export default DocumentaryRealTimeEvent;