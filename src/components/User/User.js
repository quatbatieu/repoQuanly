import React from 'react';
import AvatarChat from 'components/User/Avatar';

import "./user.scss";

function User({ name, isBold, imageSize, url }) {
  return (
    <div className='user'>
      <AvatarChat url={url} name={name} size={imageSize} />
      <p className={`user__name ${isBold ? "user__name-blod" : ""}`}>{name}</p>
    </div>
  );
}

export default User;