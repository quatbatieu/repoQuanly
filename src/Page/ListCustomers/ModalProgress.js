import React from 'react';
import { Modal, Progress, Space, Alert } from 'antd';
import { useTranslation } from 'react-i18next';

function ModalProgress({ visible, setVisible, isImport, percent, logs, isLoading, numberError, numberSuccess , onCancel }) {
  const { t: translation } = useTranslation()
  const handleCancel = () => {
    if(onCancel) {
      onCancel();
    }
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
      <Progress percent={Math.round(percent)} size="default" />
    </Modal >
  );
}

export default ModalProgress;