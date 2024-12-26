import React from 'react';
import { Typography } from 'antd';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { changeTime } from 'helper/changeTime';

import { getListVehicleTypes, LICENSE_PLATE_COLOR } from 'constants/listSchedule';

import './cardSchedule.scss'
const CardSchedule = ({ schedule }) => {
  const { t: translation } = useTranslation()
  const VEHICLE_TYPES = getListVehicleTypes(translation);

  return (
    <div className='cardSchedule'>
      <div className='cardSchedule__box'>
        <Typography.Title level={5} className="mb-1 text-center cardSchedule__box__title">
          {translation("cardSchedule.title")}
        </Typography.Title>
        <Typography.Title level={1} className="text-center mt-2 cardSchedule__box__stt">
          {translation("cardSchedule.stt")} <span>{schedule.scheduleCode}</span>
        </Typography.Title>

        <div className='cardSchedule__info'>
          <div className='row'>
            <div className='col-12 col-md-6'>
              <div className='cardSchedule__item d-flex'>
                <Typography.Paragraph className='cardSchedule__item__lable'>
                  {translation("cardSchedule.licensePlates")}
                </Typography.Paragraph>
                <Typography.Paragraph>{schedule.licensePlates}</Typography.Paragraph>
              </div>
            </div>
            <div className='col-12 col-md-6'>
              <div className='cardSchedule__item d-flex'>
                <Typography.Paragraph className='cardSchedule__item__lable'>
                  {translation("cardSchedule.licensePlateColor")}
                </Typography.Paragraph>
                <Typography.Paragraph>{LICENSE_PLATE_COLOR[schedule.licensePlateColor ? schedule.licensePlateColor - 1 : 1].name}</Typography.Paragraph>
              </div>
            </div>
            <div className='col-12'>
              <div className='cardSchedule__item d-flex'>
                <Typography.Paragraph className='cardSchedule__item__lable'>
                  {translation("cardSchedule.vehicleType")}
                </Typography.Paragraph>
                <Typography.Paragraph>
                  {VEHICLE_TYPES[schedule.vehicleType]}
                </Typography.Paragraph>
              </div>
            </div>
            <div className='col-12 col-md-6'>
              <div className='cardSchedule__item d-flex'>
                <Typography.Paragraph className='cardSchedule__item__lable'>
                  {translation("cardSchedule.date")}
                </Typography.Paragraph>
                <Typography.Paragraph>{schedule.dateSchedule}</Typography.Paragraph>
              </div>
            </div>
            <div className='col-12 col-md-6'>
              <div className='cardSchedule__item d-flex'>
                <Typography.Paragraph className='cardSchedule__item__lable'>
                  {translation("cardSchedule.time")}
                </Typography.Paragraph>
                <Typography.Paragraph>{changeTime(schedule.time)}</Typography.Paragraph>
              </div>
            </div>
            <div className='col-12'>
              <div className='cardSchedule__item d-flex'>
                <Typography.Paragraph className='cardSchedule__item__lable'>
                  {translation("cardSchedule.in")}
                </Typography.Paragraph>
                <Typography.Paragraph>{schedule.stationsAddress}</Typography.Paragraph>
              </div>
            </div>
            <div className='col-12'>
              <div className='cardSchedule__item d-flex'>
                <Typography.Paragraph className='cardSchedule__item__lable'>
                  {translation("cardSchedule.phone")}
                </Typography.Paragraph>
                <Typography.Paragraph>{schedule.phone}</Typography.Paragraph>
              </div>
            </div>
            <div className='col-12'>
              <Typography.Paragraph className='text-center mb-0' italic>
                {translation("cardSchedule.desc")}
              </Typography.Paragraph>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardSchedule;