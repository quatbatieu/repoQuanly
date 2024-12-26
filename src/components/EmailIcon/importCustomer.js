import React, { useState, useEffect } from 'react';
import { Modal, Progress, Space, Alert, notification } from 'antd';
import LogBox from 'components/LogBox/LogBox';
import { useTranslation } from 'react-i18next';
import AccreditationService from 'services/accreditationService';

function ModalProgressCustomer({ dataFilter, visible, setVisible, data, setUpload, toggleUploadModal, setFileSelected, fetchData }) {
  const { t: translation } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [percent, setPercent] = useState(0);
  const [logs, setLogs] = useState([]);
  const [numberError, setNumberError] = useState(0);
  const [numberSuccess, setNumberSuccess] = useState(0);

  useEffect(() => {
    if (visible && data.length > 0) {
      setIsLoading(true);
      setPercent(0);
      setLogs([]);
      setNumberError(0);
      setNumberSuccess(0);
      let processedCount = 0;

      const fetchUrls = data.map(item => {
        delete item[""];
        if(item.customerRecordPlatenumber === undefined || item.customerRecordPlatenumber === ""){
            const logMessage = `Thiếu biển số xe`;
            setLogs(prevLogs => [...prevLogs, { id: Date.now(), message: logMessage, status: 'error' }]);
            setNumberError(prev => prev + 1);
            processedCount++;
            setPercent((processedCount / data.length) * 100);
            return
        }
        if(item.customerRecordPhone === undefined || item.customerRecordPhone === ""){
          const logMessage = `Thiếu số điện thoại`;
          setLogs(prevLogs => [...prevLogs, { id: Date.now(), message: logMessage, status: 'error' }]);
          setNumberError(prev => prev + 1);
          processedCount++;
          setPercent((processedCount / data.length) * 100);
          return
        }
        if(item.customerRecordCheckExpiredDate === undefined || item.customerRecordCheckExpiredDate === ""){
          const logMessage = `Thiếu ngày hết hạn`;
          setLogs(prevLogs => [...prevLogs, { id: Date.now(), message: logMessage, status: 'error' }]);
          setNumberError(prev => prev + 1);
          processedCount++;
          setPercent((processedCount / data.length) * 100);
          return
        }
        return AccreditationService.createNewCustomer(item)
          .then(result => {
            const { statusCode, error } = result;
            if (statusCode === 200) {
              const logMessage = `Thành công ${item.customerRecordPlatenumber}`;
              setLogs(prevLogs => [...prevLogs, { id: Date.now(), message: logMessage, status: 'success' }]);
              setNumberSuccess(prev => prev + 1);
            } else {
              if(error === "DUPLICATED_RECORD_IN_ONE_DAY" || error === "DUPLICATED_RECORD"){
                const logMessage = `Khách hàng đã tồn tại ${item.customerRecordPlatenumber}`;
                setLogs(prevLogs => [...prevLogs, { id: Date.now(), message: logMessage, status: 'error' }]);
                setNumberError(prev => prev + 1);
                return
              }
              const logMessage = `Thất bại ${item.customerRecordPlatenumber}`;
              setLogs(prevLogs => [...prevLogs, { id: Date.now(), message: logMessage, status: 'error' }]);
              setNumberError(prev => prev + 1);
            }
          })
          .catch(error => {
            notification["error"]({
              message: "",
              description: translation("listCustomers.importTypeFailed"),
            });
            const logMessage = `Thất bại ${item.customerRecordPlatenumber}: ${error.message}`;
            setLogs(prevLogs => [...prevLogs, { id: Date.now(), message: logMessage, status: 'error' }]);
            setNumberError(prev => prev + 1);
          })
          .finally(() => {
            processedCount++;
            setPercent((processedCount / data.length) * 100);
          });
      });

      Promise.all(fetchUrls)
        .then(() => {
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }

      setUpload(false);
      toggleUploadModal();
      setFileSelected(undefined);
  }, [visible, data, translation]);

  const handleCancel = () => {
    fetchData(dataFilter)
    setVisible(false);
  };

  return (
    <Modal
      visible={visible}
      onCancel={handleCancel}
      footer={null}
    >
      <div style={{ width: "100%" }} className='mt-4'>
        {isLoading ? (
          <p>{translation("progress.loading")}</p>
        ) : (
          <Space>
            <Alert message={translation("progress.messageNumberError", {
              number: numberError
            })} type={"error"} showIcon />
            <Alert message={translation("progress.messageNumberSuccess", {
              number: numberSuccess
            })} type={"success"} showIcon />
          </Space>
        )}
        <Progress percent={Math.round(percent)} size="default" />
        <div className='mt-3'>
          <LogBox logs={logs} />
        </div>
      </div>
    </Modal>
  );
}

export default ModalProgressCustomer;
