import React , { memo, useEffect , useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { getDataChangeHistory } from 'helper/getDataChangeHistory';
import { changeTime } from 'helper/changeTime';

function HistoryDetailBooking({ changeHistory }) {
  const { t: translation } = useTranslation();

  return (
    <>
      <div className='d-flex align-items-center mb-3'>
        <div className='d-flex'>
          <img src={process.env.PUBLIC_URL + '/assets/images/icon-Cache.png'} style={{ height: 21 }} />
        </div>
        <p className='booking-item-title mb-0 ms-2'>{translation("DetailSchedules.historyChange")}</p>
      </div>
      <div className='booking-item-listHistory'>
        {changeHistory?.reverse()?.map((item) => {
          const data = getDataChangeHistory({
            dataFieldName: item.dataFieldName,
            dataValueAfter: item.dataValueAfter,
            dataValueBefore: item.dataValueBefore
          }, translation)

          if(!data.dataFieldName) {
           return (<></>)
          }
          
          return (
            <div className='booking-item-itemHistory mb-2'>
              <p className='mb-0'>{translation("DetailSchedules.historyChangeText", {
                createdAt: item.createdAt,
                dataFieldName: data.dataFieldName,
                dataValueAfter: changeTime(data.dataValueAfter),
                dataValueBefore: changeTime(data.dataValueBefore),
                dataPICName: item.dataPICName
              })}</p>
            </div>
          )
        }
        )}
      </div>
    </>
  );
}

export default memo(HistoryDetailBooking);