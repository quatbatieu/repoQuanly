import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Image } from 'antd';
import "./avatar.scss";

const RATIO_TEXT = 2;
const RATIO_ICON = 1.8;
function AvatarComponent({ url, name, size, ...props }) {
  if (!url && !name) {
    return (
      <div className='avatar__chat'>
        <Avatar icon={<UserOutlined style={{ fontSize: size / RATIO_ICON }} />} size={size} />
      </div>
    )
  }
  if (!url) {
    return (
      <Avatar
        style={{
          backgroundColor: '#fde3cf',
          color: '#f56a00',
        }}
        size={size}
      >
        <p style={{ fontSize: size / RATIO_TEXT }} >{name[0].toUpperCase()}</p>
      </Avatar>
    )
  }
  return (
    <Avatar src={<img src={url} alt="avatar" className='avatar__chat__image' />} size={size} />
  );
}

export default AvatarComponent;