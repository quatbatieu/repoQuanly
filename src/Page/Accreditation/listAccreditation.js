import React, { useEffect, useState, Fragment } from 'react';
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Table, notification, Button, Tooltip, Typography, Space } from 'antd';
import { IconCar } from "../../assets/icons"
import InspectionProcessService from "./../../services/inspectionProcessService"
import AccreditationService from "./../../services/accreditationService"
import AccreditationTabs from '../../components/AccreditationTabs';
import {
  AccreditationNotificationKey,
  InspectionProcessKey,
  CreateNewCustomerKey,
  ListEditAccreditationKey,
  ListAccreditationKey,
  AccreditationStatisticalKey,
  ListReportStaistic
} from 'constants/accreditationTabs';
import { useHistory } from 'react-router-dom';
import { ModalCrime } from 'Page/ListCustomers/ModalCrime';
import { ExceptionOutlined, ReloadOutlined } from '@ant-design/icons';
import { BUTTON_LOADING_TIME } from 'constants/time';
import { widthLicensePlate } from 'constants/licenseplates'
import TagVehicle from 'components/TagVehicle/TagVehicle';
import { getIndexTagVehicleFromColor } from 'constants/listSchedule';
import Completed from 'components/Completed/Completed';
import UnLock from 'components/UnLock/UnLock';
import TagVehicleWarn from 'components/TagVehicle/TagVehicleWarn';
import BasicTablePaging from 'components/BasicTablePaging/BasicTablePaging';
import { useModalDirectLinkContext } from 'components/ModalDirectLink';
import { NORMAL_COLUMN_WIDTH } from 'constants/app';
import { VERY_BIG_COLUMN_WIDTH } from 'constants/app';
import { BIG_COLUMN_WIDTH } from 'constants/app';

const SIZE = 20
const DEFAULT_FILTER = { filter: {}, skip: 0, limit: SIZE}

function ListAccreditation() {
  // const { addData, updateData, deleteData } = props
  const { t: translation } = useTranslation()
  const [stationCheckingConfig, setStationCheckingConfig] = useState([])
  const [dataAccreditation, setDataAccreditation] = useState({
    total: 0,
    data: []
  })
  const [crimePlateNumber, setCrimePlateNumber] = useState('')
  const [loading, setLoading] = useState(false);
  const history = useHistory()
  const setting = useSelector((state) => state.setting);
  const [dataFilter, setDataFilter] = useState(DEFAULT_FILTER)
  const user = useSelector((state) => state.member)
  const { message } = useSelector((state) => state.mqtt)
  const topicList = [
    `RECORD_UPDATE_${user.stationsId}`,
    `RECORD_ADD_${user.stationsId}`,
    `RECORD_DELETE_${user.stationsId}`,
  ]
  const { setUrlForModalDirectLink } = useModalDirectLinkContext();


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
          handleUpdateNewData(message)
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

  function handleFetchAccreditation(filter) {
    AccreditationService.getListByDate(filter).then(result => {
      if (result) {
        setDataAccreditation({
          ...result
        })
      }
    })
  }

  async function handleUpdateStatus(record , status) {
    await AccreditationService.updateById({
      id: record.customerRecordId,
      data: {
        customerRecordCheckStatus: status
      }
    })
    handleFetchAccreditation(dataFilter)
  }
  function handleUpdateById(data) {
    AccreditationService.updateById(data).then(result => {
      if (result && !result.issSuccess) {
        notification['error']({
          message: '',
          description: translation('accreditation.updateError')
        });
      }
      handleFetchAccreditation(dataFilter)
    })
  }

  useEffect(() => {
    InspectionProcessService.getDetailById({ id: user.stationsId }).then(result => {
      if (result && result.stationCheckingConfig) {
        setStationCheckingConfig(result.stationCheckingConfig)
      }
    })
    isMobileDevice(window.outerWidth)
    handleFetchAccreditation(dataFilter)
  }, [])

  const handleChangePage = (pageNum) => {
    const newFilter = {
      ...dataFilter,
      skip : (pageNum -1) * dataFilter.limit
    }
    setDataFilter(newFilter)
    handleFetchAccreditation(newFilter)
  }

  const columns = [
    {
      title: <Typography.Paragraph className='accreditation__title'>{translation("listDocumentary.index")}</Typography.Paragraph>,
      dataIndex: 'stt',
      key: 'name',
      width: NORMAL_COLUMN_WIDTH,
      render: (_, __, index) => {
        return dataFilter.skip ? dataAccreditation.total - (dataFilter.skip + index) : dataAccreditation.total - (index)
      }
    },
    {
      title: <Typography.Paragraph className='accreditation__title'>{translation("accreditation.licensePlates")}</Typography.Paragraph>,
      dataIndex: 'customerRecordPlatenumber',
      key: 'customerRecordPlatenumber',
      width: BIG_COLUMN_WIDTH,
      render: (_, record) => {
        const { customerRecordPlatenumber, hasCrime , customerRecordPlateColor} = record
        if (!hasCrime) {
          return(
            <TagVehicle color={getIndexTagVehicleFromColor(customerRecordPlateColor)}>
							{customerRecordPlatenumber}
						</TagVehicle>
          )
        }
        return (
          <TagVehicleWarn onClick={()=>{setCrimePlateNumber(customerRecordPlatenumber)}}>
						{customerRecordPlatenumber}
					</TagVehicleWarn>
        )
      }
    }
  ];

  const columnsV1 = [
    ...columns,
  ]
  stationCheckingConfig.forEach(item => {
    columnsV1.push({
      title: <Typography.Paragraph className='accreditation__title'>{item.stepLabel}</Typography.Paragraph>,
      dataIndex: item.stepIndex,
      key: item.stepLabel,
      width : 220,
      align: "center",
      render: (_, accreditationItem) => {
        const { customerRecordId, customerRecordCheckStatus, customerRecordState } = accreditationItem
        const isActive = item.stepIndex === customerRecordState && customerRecordCheckStatus === "New";

        return <div
          onClick={() => {
            handleUpdateById({
              id: customerRecordId,
              data: {
                customerRecordState: item.stepIndex ,
                customerRecordCheckStatus : "New"
              }
            })
          }}
        >
          {isActive ? <> <IconCar height="30px" width="30px" className="accreditation__circle-active"></IconCar></> : <div className={`accreditation__circle`}></div>}

        </div>
      }
    })
  })

  const columnsEnd = columnsV1.concat([
    {
      title:  <Typography.Paragraph className='accreditation__title'>{translation("accreditation.completed")}</Typography.Paragraph> ,
      dataIndex: "customerRecordCheckStatus",
      key: "customerRecordCheckStatus",
      // width:189,
      align: "center",
      render: (record, accreditationItem) => {
        const isActive = 
        record === "Completed" || 
        record === "Canceled" || 
        record === "Failed";
        return (
          <Completed status={record} onClick={(status) => handleUpdateStatus(accreditationItem , status)} />
        )
      }
    }
  ]);

  const isMobileDevice = (value) =>{
    if(value < 768 ){
      dataFilter.limit = 10
    }
  }

  return (
    <Fragment>
          <AccreditationTabs
            ListAccreditation={() => (
              <div>
                {setting.enableOperateMenu === 0 ? <UnLock /> : 
                <div>
                  <div className='list_accreditation_header mb-3'>
                    {/* <div className="section-title">{translation("accreditation.title")}</div> */}
                    <Button
                      className='d-flex justify-content-center align-items-center'
                      loading={loading}
                      disabled={loading}
                      onClick={() => {
                        setLoading(true);
                        setTimeout(() => {
                          handleFetchAccreditation(dataFilter)
                          setLoading(false)
                        }, BUTTON_LOADING_TIME);
                      }}
                    >
                      {!loading && <ReloadOutlined />}
                    </Button>
                  </div>
                  <Table
                    className='noselect'
                    dataSource={dataAccreditation.data}
                    rowClassName={(record, index) => `${record && record.isAdd ? "edited-row__add" : ""}`}
                    columns={columnsEnd}
                    scroll={{ x: 1600 }}
                    pagination={false}
                   /> 
                   <BasicTablePaging handlePaginations={handleChangePage} count={dataAccreditation?.data?.length < dataFilter.limit} skip={dataFilter.skip}></BasicTablePaging>
                </div>
                }
              </div>
            )}
            onChangeTabs={(key) => {
              if (key === AccreditationNotificationKey) {
                if(setting.enableOperateMenu === 0){
                  return null
                }
                setUrlForModalDirectLink("/accreditation-public")
              } else if (key === CreateNewCustomerKey) {
                history.push("/schedules?active=2")
              } else if (key === ListEditAccreditationKey) {
                history.push('/list-detail-accreditation')
              } else if (key === InspectionProcessKey) {
                history.push("/inspection-process")
              } else if (key === AccreditationStatisticalKey) {
                history.push("/statistical-accreditation")
              }
              else if (key === ListReportStaistic) {
                history.push("/list-report-accreditation")
              }
            }}
            activeKey={ListAccreditationKey}
            ListEditAccreditation={null}
            InspectionProcess={null}
            CreateNewCustomer={null}
            AccreditationNotification={null}
          />
          {!!crimePlateNumber && <ModalCrime plateNumber={crimePlateNumber} onClose={() => setCrimePlateNumber('')} />}
    </Fragment>
  )
}
export default ListAccreditation;