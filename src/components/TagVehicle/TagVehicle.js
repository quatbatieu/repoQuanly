import React from 'react'
import { LICENSE_PLATE_COLOR } from 'constants/listSchedule';
import './TagVehicle.scss';

const TagVehicle = ({ color, children }) => {
  return (
    <div
      className='tagVehicle'
      style={LICENSE_PLATE_COLOR[color].style}
    >
      <div style={LICENSE_PLATE_COLOR[color].styleChildren} className="tagVehicle_box">
        {children}
      </div>
    </div>
  )
};

export default TagVehicle;