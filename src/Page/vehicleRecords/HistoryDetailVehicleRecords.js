import React, { memo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { getDataChangeHistory } from 'helper/getDataChangeHistory';
import { changeTime } from 'helper/changeTime';

const fakeData = [
  {
    createdAt: "09/06/2023",
    customerScheduleId: 826,
    dataFieldName: "CustomerScheduleStatus",
    dataPICId: "224",
    dataPICName: "7801Sadmin",
    dataPICTable: "AppUser",
    dataValueAfter: "10",
    dataValueBefore: "0",
    isDeleted: 0,
    isHidden: 0,
    systemAppLogChangeScheduleId: 259,
    updatedAt: "2023-06-09T03:40:38.000Z"
  }
]
function HistoryDetailVehicleRecords({ changeHistory }) {
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
        {fakeData?.reverse()?.map((item) => {
          const data = getDataChangeHistory({
            dataFieldName: item.dataFieldName,
            dataValueAfter: item.dataValueAfter,
            dataValueBefore: item.dataValueBefore
          }, translation)

          if (!data.dataFieldName) {
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

export default memo(HistoryDetailVehicleRecords);