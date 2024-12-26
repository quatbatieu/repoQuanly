import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next'
import { Button } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';

const AudioPlayerButton = ({ url }) => {
  const { t: translation } = useTranslation()
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio(url));

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    audioRef.current.onended = () => {
      setIsPlaying(false);
    };

    return () => {
      audioRef.current.pause();
    };
  }, [audioRef]);

  return (
    <Button
      onClick={handlePlayPause}
      style={{ height: "auto", padding: 4 }}
      type="text"
      className="btn btn-secondary d-flex align-items-center justify-content-between"
    >
      {isPlaying ? <PauseCircleOutlined style={{ fontSize: 14 }} /> : <PlayCircleOutlined style={{ fontSize: 14 }} />}
      {translation('inspectionProcess.listen')}
    </Button>
  );
};

export default AudioPlayerButton;
