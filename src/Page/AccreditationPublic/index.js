import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Table, Modal, Typography } from 'antd';
import InspectionProcessService from "./../../services/inspectionProcessService"
import AccreditationService from "./../../services/accreditationService"
// import { IconCar } from "../../assets/icons"
import './accreditation_public.scss'
import { ModalCrime } from 'Page/ListCustomers/ModalCrime';
import { widthLicensePlate } from 'constants/licenseplates'
import TagVehicle from 'components/TagVehicle/TagVehicle';
import { getIndexTagVehicleFromColor } from 'constants/listSchedule';
import TagVehicleWarn from 'components/TagVehicle/TagVehicleWarn';
import { Howl } from 'howler'

// const DEFAULT_ACTIVE_ROW = { recordId: -1, rowId: -1 }
const SIZE = 400
const DEFAULT_FILTER = {
  filter: {
    // customerRecordCheckStatus  : "New"
  },
  skip: 0,
  limit: SIZE
}

function ListAccreditation() {
  const { t: translation } = useTranslation()
  const [stationCheckingConfig, setStationCheckingConfig] = useState([])
  const [modalShown, setModalShown] = useState(false);
  const [crimePlateNumber, setCrimePlateNumber] = useState('')
  const [dataAccreditation, setDataAccreditation] = useState({
    total: 0,
    data: []
  })
  const [dataFilter, setDataFilter] = useState(DEFAULT_FILTER)
  const user = useSelector((state) => state.member)
   // const setting = useSelector(state => state.setting)
  const startAudio = useRef(null)
  const { message } = useSelector((state) => state.mqtt)
  const topicList = [
    `RECORD_UPDATE_${user.stationsId}`,
    `RECORD_ADD_${user.stationsId}`,
    `RECORD_DELETE_${user.stationsId}`,
  ]

  function handleUpdateNewData(updateData) {
    setDataAccreditation(prevData => {
      const index = prevData.data.findIndex(item => item.customerRecordId === updateData.customerRecordId)
      if (index !== -1) {
        prevData.data[index] = updateData
        return ({
          total: prevData.total,
          data: [
            ...prevData.data
          ]
        })
      }
    })
  }

  function handleAddNewData(addData) {
    setDataAccreditation(prevData => {
      const index = prevData.data.findIndex((item) => item.customerRecordId === addData.customerRecordId)
      if (index === -1) {
        const newData = []
        prevData.data.forEach(item => {
          newData.push({
            ...item,
            isAdd: false
          })
        })
        if (newData.length > SIZE) {
          newData.pop()
        }
        return ({
          total: prevData.total + 1,
          data: [
            {
              ...addData,
              isAdd: true
            },
            ...newData
          ]
        });
      }
    })
  }

  function handleDeleteData(deleteData) {
    setDataAccreditation(prevData => {
      const newData = prevData.data.filter(item => item.customerRecordId !== deleteData.customerRecordId)
      return ({
        total: prevData.total - 1,
        data: newData
      })
    })
  }

  useEffect(() => {
    if (message) {
      switch (message.topic) {
        case topicList[0]:
          if (message.customerRecordCheckStatus === 'Completed') {
            handleDeleteData(message)
          } else {
            handleUpdateNewData(message)
            handleUpdateAudioQueue(message)
          }
          break;
        case topicList[1]:
          handleAddNewData(message)
          break;
        case topicList[2]:
          handleDeleteData(message)
          break;
        default:
          break
      }
    }
  }, [message])

  const [audioQueue, setAudioQueue] = useState([]); // Trạng thái phát âm thanh
  const [isPlaying, setIsPlaying] = useState(false); // Trạng thái phát âm thanh
  useEffect(() => {
    function playAudio(src) {
      return new Promise((resolve) => {
        const sound = new Howl({
          src: [src],
          onend: () => { resolve() },
          onloaderror: () => { resolve() },
          autoplay: true,
          volume: 1,
          onplayerror() {
            sound.once('unlock', () => {
              Modal.info({
                title: translation('notificationSound'),
                onOk() {
                  sound.play()
                  resolve()
                },
              });
            })
          },
        });
        sound.play();
      });
    }
    async function playQueue() {
      if (audioQueue.length > 0 && !isPlaying) {
        setIsPlaying(true);
        const listAudio = audioQueue[0]
        for (const audio of listAudio) {
          await playAudio(audio);
        }

        setAudioQueue(prevItems => prevItems.slice(1));
        await new Promise(resolve => setTimeout(resolve, 2000))
        setIsPlaying(false);
      }
    };

    playQueue();
  }, [audioQueue, isPlaying]);

  function handleUpdateAudioQueue(newData) {
    if (newData?.plateSpeeches.length > 0 && newData?.processSpeech) {
      setAudioQueue(prevItems => [...prevItems, [
        ...newData?.plateSpeeches,
        newData?.processSpeech
      ]]);
    }
  }

  // dividing data
  let lastestData = []
  let processingData = []
  let newData = []
  if (dataAccreditation.data.length > 0) {
    for (let i = 0; i < 4; i++) {
      lastestData.push(dataAccreditation.data[i]);
    }
    if (dataAccreditation.data.length - 4 >= 10) {
      const middleIndex = Math.ceil(dataAccreditation.data.length / 2) + 4;
      let i = 4;
      while (i < dataAccreditation.data.length) {
        if (i < middleIndex) {
          processingData.push(dataAccreditation.data[i]);
        } else {
          newData.push(dataAccreditation.data[i]);
        }
        i++;
      }
    } else {
      processingData = dataAccreditation.data.slice().splice(4);
    }
  }

  useEffect(() => {
    handleFetchAccreditation(DEFAULT_FILTER)
  }, [])

  function handleFetchAccreditation(filter) {
    AccreditationService.getListByDate(filter).then(result => {
      if (result) {
        setDataAccreditation({
          ...result
        })
      }
    })
  }

  useEffect(() => {
    if (modalShown || !startAudio || !startAudio.current) return;

    const audioElement = startAudio.current;
    const playPromise = audioElement.play();

    if (playPromise !== undefined) {
      playPromise.catch(error => {
        if (error.name === 'NotAllowedError') {
          setModalShown(true);
          Modal.info({
            title: translation('notificationSound'),
            onOk() {
              if (audioElement.play) {
                audioElement.play();
              }
              setModalShown(false);
            },
          });
        }
      });
    }
  }, [startAudio, modalShown]);

  useEffect(() => {
    // document.body.style.minWidth = '1600px';
    let container = document.querySelector(".ant-layout .content > div")
    if (container) {
      container.style.backgroundColor = "transparent"
    }
  }, [])

  useEffect(() => {
    InspectionProcessService.getDetailById({ id: user.stationsId }).then(result => {
      if (result && result.stationCheckingConfig) {
        setStationCheckingConfig(result.stationCheckingConfig)
      }
    })
    handleFetchAccreditation(dataFilter)
  }, [])

  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'name',
      width: 70,
      className: '',
      render: (_, __, index) => {
        return (
          <p>{index + 1}</p>
        )
      }
    },
    {
      title: translation("accreditation.licensePlates"),
      dataIndex: 'customerRecordPlatenumber',
      key: 'customerRecordPlatenumber',
      width: widthLicensePlate,
      render: (_, record) => {
        const { customerRecordPlatenumber, hasCrime, customerRecordPlateColor } = record

        if (!hasCrime) {
          return (
            <TagVehicle color={getIndexTagVehicleFromColor(customerRecordPlateColor)}>
              {customerRecordPlatenumber}
            </TagVehicle>
          )
        }
        return (
          <TagVehicleWarn onClick={() => { setCrimePlateNumber(customerRecordPlatenumber) }}>
            {customerRecordPlatenumber}
          </TagVehicleWarn>
        )
      }
    }
  ];

  const columnsV01 = [
    columns[0],
    {
      ...columns[1],
      title: translation("waiting")
    }
  ]

  const columnsV1 = [
    ...columns,
    {
      title: translation("accreditation.inspectionProcess"),
      dataIndex: 'customerRecordState',
      align: "center",
      key: 'customerRecordState',
      render: (_, record) => {
        if (record.customerRecordState) {
          let processingLabel = stationCheckingConfig.find(_process => _process.stepIndex === record.customerRecordState)
          return (
            <div>
              {processingLabel?.stepLabel || ""}
            </div>
          )
        } else {
          return ""
        }
      }
    }
  ]

  // const srcBannerLeft = setting && setting.stationsEnableAd ? setting.stationsCustomAdBannerLeft : ""
  // const srcBannerRight = setting && setting.stationsEnableAd ? setting.stationsCustomAdBannerRight : ""
  return (
    <>
      <div className={`accreditation_public`}> {/* ${setting && setting.stationsEnableAd ? 'banner_on' : ''} */}
        {/* {
        setting && setting.stationsEnableAd ? (
          <div className={`accreditation_public_banner`}>
            <img src={srcBannerLeft}/>
          </div>
        ) : (
          <></>
        )
      } */}

        <div className='row accreditation_lastest'>
          {

            lastestData.map((data, customerRecordId) => {
              let processingLabel = stationCheckingConfig.find(_process => _process.stepIndex === data?.customerRecordState)
              return (
                <LastestItem  {...data} processingLabel={processingLabel} key={customerRecordId} />
              )
            })
          }
        </div>

        <div className="row accreditation_listTable">
          <div className='col-12 col-md-8'>
            <Table
              dataSource={processingData}
              columns={columnsV1}
              rowClassName={(record) => `${record && record.isAdd ? "edited-row__add" : ""}`}
              // scroll={{ x: 1190 }}
              // className={setting && setting.stationsEnableAd ? 'accreditation_public_table_with_banner' : ""}
              pagination={false}
              onChange={({ current, pageSize }) => {
                dataFilter.skip = (current - 1) * pageSize
                setDataFilter({ ...dataFilter })
                handleFetchAccreditation(dataFilter)
              }}
            />
          </div>
          <div className='col-12 col-md-4'>
            <Table
              dataSource={newData}
              columns={columnsV01}
              rowClassName={(record) => `${record && record.isAdd ? "edited-row__add" : ""}`}
              // scroll={{ x: 500 }}
              // className={setting && setting.stationsEnableAd ? 'accreditation_public_table_with_banner' : ""}
              pagination={false}
              onChange={({ current, pageSize }) => {
                dataFilter.skip = (current - 1) * pageSize
                setDataFilter({ ...dataFilter })
                handleFetchAccreditation(dataFilter)
              }}
            />
          </div>
        </div>
        {/* {
      setting && setting.stationsEnableAd ? (
        <div className='accreditation_public_banner'>
          <img src={srcBannerRight}/>
        </div>
      ) : (
        <></>
      )
    } */}
      </div>
      {/* className="displayNone" */}
      <audio ref={startAudio} type="audio">
        <source type='audio/mpeg' src={require('../../assets/mp3/testAudio.mp3')} />
      </audio>

      {!!crimePlateNumber && <ModalCrime plateNumber={crimePlateNumber} onClose={() => setCrimePlateNumber('')} />}
    </>
  )
}

const LastestItem = (props) => {
  const { processingLabel } = props;

  return (
    <div className='col-3'>
      <div className='box'>
        <Typography.Paragraph
          className='license-number'
          ellipsis={true}>
          {props?.customerRecordPlatenumber}
        </Typography.Paragraph>
        <div className='status'>{processingLabel?.stepLabel || ""}</div>
      </div>
    </div>
  )
}
export default ListAccreditation;