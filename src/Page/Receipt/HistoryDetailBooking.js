import React from 'react';
import { useTranslation } from 'react-i18next';
import { MdAccessTime } from "react-icons/md";
import { getDataChangeHistory } from 'helper/getDataChangeHistory';
import { changeTime } from 'helper/changeTime';
import "./HistoryDetailBooking.scss";

const fakeChangeHistory = [
  {
    id: '1',
    dataFieldName: 'licensePlates',
    dataValueAfter: '30E-123.45',
    dataValueBefore: '30F-678.90',
    dataPICName: 'Nguyễn Văn A',
    createdAt: '2023-07-01T09:30:00'
  },
  {
    id: '2',
    dataFieldName: 'paymentStatus',
    dataValueAfter: '1',
    dataValueBefore: '0',
    dataPICName: 'Nguyễn Văn B',
    createdAt: '2023-07-02T10:30:00'
  },
  {
    id: '3',
    dataFieldName: 'vehicleType',
    dataValueAfter: '2',
    dataValueBefore: '1',
    dataPICName: 'Nguyễn Văn C',
    createdAt: '2023-07-03T11:30:00'
  },
  {
    id: '4',
    dataFieldName: 'licensePlateColor',
    dataValueAfter: '1',
    dataValueBefore: '0',
    dataPICName: 'Nguyễn Văn D',
    createdAt: '2023-07-04T12:30:00'
  }
];

function HistoryDetailBooking({ changeHistory }) {
  const { t: translation } = useTranslation();

  return (
    <>
      <div className='d-flex align-items-center mb-3'>
        <div className='d-flex'>
          <MdAccessTime style={{ height: 21, width: 21 }} />
        </div>
        <p className='mb-0 ms-2 receiptHistory-title'>{translation("DetailSchedules.historyChange")}</p>
      </div>
      <div className='booking-item-listHistory'>
        {fakeChangeHistory?.reverse()?.map((item) => {
          const data = getDataChangeHistory({
            dataFieldName: item.dataFieldName,
            dataValueAfter: item.dataValueAfter,
            dataValueBefore: item.dataValueBefore
          }, translation)

          if(!data.dataFieldName) {
            return null;
          }

          return (
            <div className='receiptHistory-item mb-2' key={item.id}>
              <p className='mb-0'>{translation("DetailSchedules.historyChangeText", {
                createdAt: item.createdAt,
                dataFieldName: data.dataFieldName,
                dataValueAfter: changeTime(data.dataValueAfter),
                dataValueBefore: changeTime(data.dataValueBefore),
                dataPICName: item.dataPICName
              })}</p>
            </div>
          )
        })}
      </div>
    </>
  );
}

export default HistoryDetailBooking;
