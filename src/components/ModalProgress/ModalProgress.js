import React from 'react';
import { Modal, Progress, Space, Alert } from 'antd';
import LogBox from 'components/LogBox/LogBox';
import { useTranslation } from 'react-i18next';

function ModalProgress({ visible, setVisible, isImport, percent, logs, isLoading, numberError, numberSuccess }) {
  const { t: translation } = useTranslation()
  const handleCancel = () => {
    setVisible(false);
  };

  // Modal Export

  if (!isImport) {
    return (
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
      >
        <div style={{ width: "80%" }}>
          <Progress percent={Math.round(percent)} size="default" />
        </div>
      </Modal>
    )
  }

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

export default ModalProgress;