import React, { useState, useEffect } from 'react';
import { Modal, Button, Upload, Input, Spin, Alert, Progress, Collapse, message, Space } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { UploadOutlined } from '@ant-design/icons';
import { validatorPlateNumber } from 'helper/licensePlateValidator';
import { LIST_CONVERT_COLOR_VEHICLE } from 'constants/vehicleType';
import uploadService from 'services/uploadService';
import vehicleProfileService from 'services/vehicleProfileService';
import { VEHICLE_FILE_TYPE } from "constants/vehicleType";
import LogBox from 'components/LogBox/LogBox';
import { LIST_STATUS } from 'constants/logBox';
import { getVehicleProfile } from 'constants/errorMessage';
import { useCallback } from 'react';

const { Panel } = Collapse;
const listStep = {
  SYNCHRONIZE: "synchronize",
  DONE: "done"
}

const ModalSyncComputer = ({ visible, setVisible , fetchData }) => {
  const { t: translation } = useTranslation();
  const [activeKey, setActiveKey] = useState('1');
  const [syncing, setSyncing] = useState(false);
  const [logs, setLogs] = useState([]);
  const [step, setStep] = useState(listStep.SYNCHRONIZE);
  const [syncPath, setSyncPath] = useState('');
  const [files, setFiles] = useState([]);
  const [syncedProfiles, setSyncedProfiles] = useState(0);
  const [failedProfiles, setFailedProfiles] = useState(0);
  const [syncStatus, setSyncStatus] = useState('');
  const [isStop, setIsStop] = useState(false);
  const [percent, setPercent] = useState(0);
  const VEHICLE_PROFILE = getVehicleProfile(translation);
  const [isProcessing, setIsProcessing] = useState(false);

  async function handleUploadApi(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file)
      reader.onload = async function () {
        let baseString = reader.result
        const params = {
          imageData: baseString.replace('data:' + file.type + ';base64,', ''),
          imageFormat: file.name.split('.').pop()
        }
        const res = await uploadService.uploadImage(params);

        if (res.issSuccess) {
          resolve(res.data);
        } else {
          resolve(null);
        }
      }
    })
  }

  function isImageFile(fileName) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif']; // Danh sách đuôi tập tin hình ảnh phổ biến

    const fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
    return imageExtensions.includes(fileExtension);
  }

  const handleCollapseChange = (key) => {
    setActiveKey(key);
  };

  const getColorLicensePlates = (nameFolder) => {
    let subFolderNameNew = nameFolder.slice(0, -1);
    let subFolderNameLastChar = nameFolder.slice(-1);
    const subFolderNameConvertColor = LIST_CONVERT_COLOR_VEHICLE[subFolderNameLastChar];

    if (Object.keys(LIST_CONVERT_COLOR_VEHICLE).some((item) => item === subFolderNameLastChar)) {
      return ({
        licensePlates: subFolderNameNew,
        color: subFolderNameConvertColor,
      })
    } else {
      return ({
        licensePlates: nameFolder,
        color: LIST_CONVERT_COLOR_VEHICLE["T"],
      })
    }

  }

  const handleSync = () => {
    let isCancelled = false;

    const onCrateNew = async (data) => {
      let documentFileUrlList = await Promise.all(
        data.data.map(async (item) => {
          return {
            vehicleFileName: item.name,
            vehicleFileUrl: await handleUploadApi(item),
            vehicleFileType: isImageFile(item.name) ? VEHICLE_FILE_TYPE.IMAGE : VEHICLE_FILE_TYPE.DOCUMENT
          }
        })
      )

      return await vehicleProfileService.insert({
        vehiclePlateNumber: data.licensePlates,
        vehiclePlateColor: data.color,
        fileList: documentFileUrlList
      }).then(async result => {
        setIsStop((prev) => {
          if (!prev) {
            if (result && result.isSuccess) {
              setLogs(prev => [
                ...prev,
                {
                  id: Math.random(),
                  message: `BSX : ${data.licensePlates} : ${translation("syncComputer.successMessage")}`,
                  status: LIST_STATUS.success
                }
              ])
              setSyncedProfiles(prev => prev + 1);
            } else {
              if (Object.keys(VEHICLE_PROFILE).includes(result.error)) {
                setLogs(prev => [
                  ...prev,
                  {
                    id: Math.random(),
                    message: `BSX : ${data.licensePlates} : ${VEHICLE_PROFILE[result.error]}`,
                    status: LIST_STATUS.error
                  }
                ])

              } else {
                setLogs(prev => [
                  ...prev,
                  {
                    id: Math.random(),
                    message: `BSX : ${data.licensePlates} : ${translation("syncComputer.errorMessage")}`,
                    status: LIST_STATUS.error
                  }
                ])
              }
              setFailedProfiles(prev => prev + 1);
            }

            setPercent(prev => prev + (100 / files.length))
          }
        })
      })
    }

    async function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    const getIsCancelled = () => {
      return isCancelled;
    }

    const start = async () => {
      setSyncing(true);
      setSyncStatus(translation('syncComputer.searchingStatus'));
      setSyncedProfiles(0);
      setFailedProfiles(0);
      await sleep(1000);

      async function fetchData(file) {
        const subFolderName = file.name;
        const vehicle = getColorLicensePlates(subFolderName);

        setSyncStatus(translation("syncComputer.messageFind", {
          ["license-plates"]: vehicle.licensePlates
        }))
        await sleep(5000);
        setSyncStatus(translation("syncComputer.messageSync", {
          ["license-plates"]: vehicle.licensePlates
        }))

        await sleep(1000);
        if (isCancelled) {
          return;
        }

        await onCrateNew({
          licensePlates: vehicle.licensePlates,
          color: vehicle.color,
          data: file.data
        })
      }

      for (let i = 0; i < files.length; i++) {
        await fetchData(files[i]);
      }

      setStep(listStep.DONE)
      setSyncing(false);
      setSyncStatus("");
    };

    const stop = () => {
      isCancelled = true;
      setIsStop(true);
      setStep(listStep.DONE)
      setSyncing(false);
      setSyncStatus("");
    };

    return {
      stop, start
    }
  }

  const Sync = useCallback(() => {
    return handleSync();
  }, [files]);

  const { start, stop } = Sync();

  const handleSyncClick = async () => {
    if (syncPath === '') {
      message.error(translation('syncComputer.validationErrorMessage'));
      return;
    }

    if (!syncing) {
      await start();
    } else {
      stopSyncProcess();
    }
  };

  const getBoolCheckFolderName = async (folderName, translation) => {
    try {
      await validatorPlateNumber(folderName, translation);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleUpload = async (event) => {
    const files = event.target.files;
    let resultArray = [];

    for (let i = 0; i < files.length; i++) {
      const element = files[i];

      const subFolderName = element.webkitRelativePath.split('/')[1];
      const vehicle = getColorLicensePlates(subFolderName);
      const isCheckFolderName = await getBoolCheckFolderName(vehicle.licensePlates, translation);
      const index = resultArray.findIndex((item) => item.name === vehicle.licensePlates);

      if (isCheckFolderName) {
        if (index !== -1) {
          resultArray[index].data = [...resultArray[index].data, element];
        } else {
          resultArray = [...resultArray, {
            name: subFolderName,
            data: [element]
          }]
        }
      }
    };

    setSyncPath(files[0]?.webkitRelativePath.split('/')[0]);
    setFiles(resultArray);
  };

  const stopSyncProcess = () => {
    setSyncing(false);
    setSyncStatus('');
    stop();
  };

  if (step === listStep.DONE) {
    return (
      <div>
        <Modal
          title={translation('syncComputer.modalTitle')}
          visible={visible}
          onCancel={() => {
            fetchData();
            setVisible(false)
          }}
          footer={[
            <Button key="sync" onClick={() => {
              fetchData();
              setVisible(false)
            }} disabled={!syncPath}>
              {translation('syncComputer.endButton')}
            </Button>
          ]}
        >
          <>
            <Space direction="vertical" className='w-100'>
              <Alert className='w-100' message={translation("syncComputer.messageNumberError", {
                number: failedProfiles
              })} type={"error"} showIcon />
              <Alert className='w-100' message={translation("syncComputer.messageNumberSuccess", {
                number: syncedProfiles
              })} type={"success"} showIcon />
            </Space>
            <Collapse activeKey={activeKey} onChange={handleCollapseChange} className='mt-2'>
              <Panel header={translation("syncComputer.detail")} key="1">
                <LogBox logs={logs} />
              </Panel>
            </Collapse>
          </>
        </Modal>
      </div>
    )
  }

  return (
    <div>
      <Modal
        title={translation('syncComputer.modalTitle')}
        visible={visible}
        onCancel={() => {
          fetchData();
          setVisible(false)
        }}
        footer={[
          <Button key="sync" onClick={handleSyncClick} disabled={!syncPath || syncing}>
            {syncing ? translation('syncComputer.stopButton') : translation('syncComputer.syncButton')}
          </Button>
        ]}
      >
        <div className="mb-1">
          {translation("syncComputer.select-Folder")}
        </div>
        <label htmlFor="folderInput" className='d-block'>
          <Input value={syncPath} addonAfter={
            <UploadOutlined />
          } />
        </label>
        <input type="file" webkitdirectory="true" style={{ display: "none" }} onChange={handleUpload} id="folderInput" />
        {(syncing && step === listStep.SYNCHRONIZE) && (
          <div>
            <Progress percent={Math.round(percent)} size="default" />
            <div>{syncStatus}</div>
            <LogBox logs={logs} />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ModalSyncComputer;

