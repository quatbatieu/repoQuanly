import React from "react";
import { formatNumber } from 'helper/common'

const StatisticalItem = ({ title, count, icon, bg, percent, color }) => {
  return (
    <div className="statistical_accreditation" style={{ borderLeft: `10px solid ${color}`, marginBottom: 13 }}>
      <div className='statistical_accreditation-content_up'>
        <div className="icon" style={{ background: bg }}>
          {icon}
        </div>
        <div className='title'>{title}</div>
      </div>
      <div className="statistical_accreditation-content_down">
        <div className='amount' style={{ color: color }}>{count}</div>
        <div className="info">
          <span className={`percent-${percent.type === "GT" ? "up" : percent.type === "LT" ? "down" : ""} flex-center`}>
            {/* {
              (percent.type === "GT") ? (
                <ArrowUpOutlined />
              ) : (
                <></>
              )
            }
            {
              percent.type === "LT" ? (
                <ArrowDownOutlined />
              ) : (
                <></>
              )
            } */}
            {percent.count && (
             `${percent.count}%`
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatisticalItem;