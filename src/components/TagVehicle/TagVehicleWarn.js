import React from 'react'
import './TagVehicle.scss';
import { useTranslation } from 'react-i18next';
import { ExceptionOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

const TagVehicleWarn = ({ onClick, children }) => {
  const { t: translation } = useTranslation()

  return (
    <div style={{margin:"5px"}}>
      <div className='d-flex justify-content-around align-items-start'>
        <div className='d-flex flex-column'>
          <span className="accreditation__licenplates" style={{fontWeight:600}}>{children}</span>
          <span className={"text-very-small"} style={{color: 'var(--bs-danger)'}}>{translation('punish.warning')}</span>
        </div>
        <Tooltip title={translation('punish.notification')}>
          <ExceptionOutlined
            style={{
              color: 'var(--bs-danger)',
              cursor: 'pointer',
              marginTop: "5px"
            }}
            className='text-large'
            onClick={()=> onClick && onClick( )}
          />
        </Tooltip>
      </div>
    </div>
  )
};

export default TagVehicleWarn;