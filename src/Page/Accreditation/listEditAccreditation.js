// @ts-nocheck
import React, { useEffect, useMemo, useRef, useState, Fragment } from 'react';
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import {
  Table, Form, notification,
  Input, Button, Modal,
  DatePicker, InputNumber, Select,
  Tabs, Popconfirm, Space, Tooltip, Row, Col, Typography
} from 'antd';
import EditableCell from "../../components/EditableCell"
import EditableRow from "../../components/EditableRow"
import AccreditationService from "./../../services/accreditationService"
import { convertStrToDate } from 'helper/common';
import {
  DeleteOutlined, PlusOutlined,
  ReloadOutlined, ExclamationCircleOutlined, ExceptionOutlined
} from '@ant-design/icons';
import { IconCar } from "../../assets/icons"
import "./accreditation.scss"
import moment from 'moment';
// import VerifyLicenPlates from '../../constants/licenseplates';
import _ from 'lodash';
import { useHistory } from 'react-router';
import {
  ListAccreditationKey,
  ListEditAccreditationKey,
  CreateNewCustomerKey,
  AccreditationNotificationKey,
  InspectionProcessKey,
  AccreditationStatisticalKey,
  ListReportStaistic
} from '../../constants/accreditationTabs';
import { ModalCrime } from 'Page/ListCustomers/ModalCrime';
import { BUTTON_LOADING_TIME } from 'constants/time';
import { widthLicensePlate } from 'constants/licenseplates'
import TagVehicle from 'components/TagVehicle/TagVehicle';
import { getIndexTagVehicleFromColor } from 'constants/listSchedule';
import CompletedShowIcon from 'components/Completed/CompletedShowIcon';
import UnLock from 'components/UnLock/UnLock';
import { validatorPlateNumber } from 'helper/licensePlateValidator';
import { validatorPhone } from 'helper/commonValidator';
import TagVehicleWarn from 'components/TagVehicle/TagVehicleWarn';
import BasicTablePaging from 'components/BasicTablePaging/BasicTablePaging';
import { useModalDirectLinkContext } from 'components/ModalDirectLink';
import { NORMAL_COLUMN_WIDTH } from 'constants/app';
import { VERY_BIG_COLUMN_WIDTH } from 'constants/app';
import { BIG_COLUMN_WIDTH } from 'constants/app';
import { EXTRA_BIG_COLUMND_WITDTH } from 'constants/app';

const { TabPane } = Tabs

//Để show hết toàn bộ xe trong ngày ==> size = 400
const SIZE = 400

const DEFAULT_FILTER = { filter: {}, skip: 0, limit: SIZE }

function ListEditAccreditation() {
  const { t: translation } = useTranslation()
  const [form] = Form.useForm();
  const [formModal] = Form.useForm();
  const [isCreate, setIsCreate] = useState(false)
  const [dataAccreditation, setDataAccreditation] = useState({
    total: 0,
    data: []
  })
  const [crimePlateNumber, setCrimePlateNumber] = useState('')
  const [loading, setLoading] = useState(false);
  // const inputRef = useRef(null)
   const { setUrlForModalDirectLink } = useModalDirectLinkContext();

  const OptionsColor = [
    {
      value: "white",
      lable: <div className="accreditation__parent">
        {translation("accreditation.white")}

        <IconCar className=" accreditation__circle-white" />

      </div>
    },
    {
      value: "blue",
      lable: <div className="accreditation__parent">
        {translation("accreditation.blue")}

        <IconCar className=" accreditation__circle-blue" />

      </div>
    },
    {
      value: "red",
      lable: <div className="accreditation__parent">
      {translation("accreditation.red")}

      <IconCar className=" accreditation__circle-red"/>

    </div>
    },
    {
      value: "yellow",
      lable: <div className="accreditation__parent">
        {translation("accreditation.yellow")}

        <IconCar className=" accreditation__circle-yellow" />

      </div>
    }
  ]
  const [dataFilter, setDataFilter] = useState(DEFAULT_FILTER)
  const user = useSelector((state) => state.member)
  const history = useHistory()
  const setting = useSelector(state => state.setting)
  const settingAccreditationTabs = setting.settingAccreditationTabs || ""
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

  function isHiddenTabs(value) {
    if (settingAccreditationTabs.includes(value)) {
      return true
    }
    return false
  }

  function handleFetchAccreditation(filter) {
    AccreditationService.getList(filter).then(result => {
      if (result) {
        setDataAccreditation({
          ...result
        })
      }
    })
  }

  async function handleUpdateStatus(record, status) {
    await AccreditationService.updateById({
      id: record.customerRecordId,
      data: {
        customerRecordCheckStatus: status
      }
    })
    // handleFetchAccreditation(dataFilter)
  }
  function handleUpdateById(data, isReload) {
    AccreditationService.updateById(data).then(result => {
      if (result) {
        if (result.issSuccess) {
          // form.resetFields()
          isReload && handleFetchAccreditation(dataFilter)
        }
      } else {
        notification['error']({
          message: '',
          description: translation('accreditation.updateError')
        });
      }
    })
  }

  function handleDeleteById(data) {
    AccreditationService.deleteById(data).then(result => {
      if (result && result.issSuccess) {
        notification['success']({
          message: '',
          description: translation('accreditation.delete_success')
        });
        handleFetchAccreditation(dataFilter)
      } else {
        notification['error']({
          message: '',
          description: translation('accreditation.updateError')
        });
      }
    })
  }

  const handleChangePage = (pageNum) => {
    const newFilter = {
      ...dataFilter,
      skip : (pageNum -1) * dataFilter.limit
    }
    setDataFilter(newFilter)
    handleFetchAccreditation(newFilter)
  }

  useEffect(() => {
    isMobileDevice(window.outerWidth)
    handleFetchAccreditation(dataFilter)
  }, [])

  function handleChangeRow(record, currentIndex) {
    dataAccreditation.data[currentIndex - 1] = record
    setDataAccreditation({ ...dataAccreditation })
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
      editable: true,
      rules : [
        {
          required: true,
          validator(_, value) {
            return validatorPlateNumber(value , translation);
          }
        }
      ],
      width: BIG_COLUMN_WIDTH,
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
          <TagVehicleWarn onClick={()=>{setCrimePlateNumber(customerRecordPlatenumber)}}>
						{customerRecordPlatenumber?.toUpperCase()}
					</TagVehicleWarn>
        )
      }
    }
  ];

  const components = {
    body: {
      row: (props) => <EditableRow {...props} form={form} />,
      cell: (props) => <EditableCell {...props} form={form} />,
    },
  };

  // let validateColor = (customerRecordPlatenumber) => {
  //   customerRecordPlatenumber = customerRecordPlatenumber.trim()
  //   let length = customerRecordPlatenumber.length
  //   //get last 2 character
  //   let test = customerRecordPlatenumber[length - 2] + customerRecordPlatenumber[length - 1]
  //   const REAL_LENGTH = 2
  //   let customerRecordPlateColor = OptionsColor[0].value
  //   //validate if user type V / X / T
  //   if(REAL_LENGTH !== parseInt(test).toString().length) {
  //     if(test[1].toUpperCase() === 'X') {
  //       customerRecordPlateColor = OptionsColor[1].value
  //     } else if(test[1].toUpperCase() === 'V') {
  //       customerRecordPlateColor = OptionsColor[2].value
  //     } else {
  //       customerRecordPlateColor = OptionsColor[0].value
  //     }
  //     customerRecordPlatenumber = customerRecordPlatenumber.substring(0, length-1)
  //   } else {
  //     //default not type => T => white
  //     customerRecordPlateColor = OptionsColor[0].value
  //   }

  //   return {
  //     customerRecordPlateColor : customerRecordPlateColor,
  //     customerRecordPlatenumber: customerRecordPlatenumber.toUpperCase()
  //   }
  // }

  function handleSave(row, key, isReload) {
    //   notification.error({
    //     message: '',
    //     description: translation('landing.invalidLicensePlate')
    //   })
    //   return false
    const { customerRecordId } = row
    // if(key === "customerRecordPlatenumber") {
    //   let renderLP = validateColor(customerRecordPlatenumber)
    //   handleUpdateById({
    //     id: customerRecordId,
    //     data: {
    //       customerRecordPlateColor: renderLP.customerRecordPlateColor,
    //       customerRecordPlatenumber: renderLP.customerRecordPlatenumber
    //     }
    //   })
    //   return true
    // } else {
    let customerRecordCheckExpiredDate = ''
    if (key === "customerRecordCheckDuration") {
      customerRecordCheckExpiredDate = moment(row.customerRecordCheckDate, "DD/MM/YYYY").add(Number(row.customerRecordCheckDuration), 'months').subtract(1, 'day').format("DD/MM/YYYY")
      handleUpdateById({
        id: customerRecordId,
        data: {
          [key]: row[key],
          customerRecordCheckExpiredDate: customerRecordCheckExpiredDate
        }
      }, isReload)
    } else {
      handleUpdateById({
        id: customerRecordId,
        data: {
          [key]: row[key]
        }
      }, isReload)
    }
    // }
  };

  function renderTextOrPlaceholder(record, dataIndex, placeholderTranslationKey) {
    const value = record && record[dataIndex];
    return <div>{value ? value : translation(placeholderTranslationKey)}</div>;
  }

  function renderDatePicker(dataIndex, placeholderTranslationKey, inputRef, save,setEditing) {
    return <DatePicker
      format="DD/MM/YYYY"
      defaultOpen
      placeholder={translation('accreditation.inspectionExpireDate')}
      ref={inputRef}
      onBlur={()=>{setEditing(false)}}
      onChange={save}
    />
  }

  const columnsV2 = [
    ...columns,
    {
      title: <Typography.Paragraph className='accreditation__title'>{translation("accreditation.fullName")}</Typography.Paragraph>,
      dataIndex: 'customerRecordFullName',
      key: 'customerRecordFullName',
      editable: true,
      width: VERY_BIG_COLUMN_WIDTH, 
      render: (_, record) => renderTextOrPlaceholder(record, 'customerRecordFullName', "accreditation.fullName")
    },
    {
      title: <Typography.Paragraph className='accreditation__title'>{translation("accreditation.phoneNumber")}</Typography.Paragraph>,
      dataIndex: 'customerRecordPhone',
      key: 'customerRecordPhone',
      editable: true,
      width: NORMAL_COLUMN_WIDTH,
      rules: [
        {
          required: true,
          validator(_, value) {
            return validatorPhone(value, translation);
          }
        }
      ],
      render: (_, record) => renderTextOrPlaceholder(record, 'customerRecordPhone', "accreditation.phoneNumber")
    },
    {
      title: <Typography.Paragraph className='accreditation__title'>{translation("accreditation.inspectionDate")}</Typography.Paragraph>,
      dataIndex: 'customerRecordCheckDate',
      key: 'customerRecordCheckDate',
      editable: true,
      isTime: true,
      width: BIG_COLUMN_WIDTH, 
      componentInput: (inputRef, save,form,setEditing) => {
        return renderDatePicker('customerRecordCheckDate', 'accreditation.inspectionDate', inputRef, save,setEditing)
      },
      render: (_, record) => renderTextOrPlaceholder(record, 'customerRecordCheckDate', "accreditation.inspectionDate")
    },
    {
      title: <Typography.Paragraph className='accreditation__title'>{translation("accreditation.accreditationStatus")}</Typography.Paragraph>,
      dataIndex: 'customerRecordCheckStatus',
      key: 'customerRecordCheckStatus',
      align: "center",
      width: EXTRA_BIG_COLUMND_WITDTH, // Chiều rộng của cột này đã được tăng lên để nhận phần dư 
      componentInput: (inputRef, record) => {
        return <></>
      },
      render: (value, record) => {
        const { customerRecordCheckStatus } = record;
        return (
          <div className='d-inline-flex'>
              <CompletedShowIcon status={value} onClick={(status) => handleUpdateStatus(record, status)} confirm={true} />
          </div>
        )
      }
    },
    {
      title: <Typography.Paragraph className='accreditation__title'>{translation("accreditation.endDate")}</Typography.Paragraph>,
      dataIndex: 'customerRecordCheckExpiredDate',
      key: 'customerRecordCheckExpiredDate',
      editable: true,
      isTime: true,
      width: NORMAL_COLUMN_WIDTH, 
      componentInput: (inputRef, save,form,setEditing) => {
        return renderDatePicker('customerRecordCheckExpiredDate', 'accreditation.inspectionExpireDate', inputRef, save, setEditing)
      },
      render: (_, record) => renderTextOrPlaceholder(record, 'customerRecordCheckExpiredDate', "accreditation.inspectionExpireDate")
    },
    {
      title: <Typography.Paragraph className='accreditation__title'>{translation("accreditation.inspectionCycle")}</Typography.Paragraph>,
      dataIndex: 'customerRecordCheckDuration',
      key: 'customerRecordCheckDuration',
      editable: true,
      width: NORMAL_COLUMN_WIDTH, 
      componentInput: (inputRef, save) => {
        return (
          <InputNumber
            ref={inputRef}
            min={0}
            max={99}
            type="number"
            placeholder={translation('inspectionProcess.enterProcessTime')}
            onBlur={save}
            onPressEnter={save}
          />
        )
      },
      render: (_, record) => {
        const value = record && record.customerRecordCheckDuration ? (
          `${record.customerRecordCheckDuration} ${translation('accreditation.month')}`
        ) : translation("accreditation.inspectionCycle")
        return <div>{value}</div>
      }
    },
    {
      title: "",
      dataIndex: 'Action',
      align: "center",
      key: 'Action',
      // width: NORMAL_COLUMN_WIDTH, 
      render: (_, record) => {
        const { customerRecordId } = record
        return (
          <Space>
            <Popconfirm
              title={translation("confirm-delete")}
              onConfirm={() => {
                handleDeleteById({
                  id: customerRecordId
                })
              }}
              okText={translation("accreditation.yes")}
              cancelText={translation("accreditation.no")}
            >
              <DeleteOutlined />
            </Popconfirm>
          </Space>
        )
      }
    }
  ]
  const columnsV3 = columnsV2.map((col, index) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        isTime: col.isTime ? true : false,
        componentInput: col.componentInput,
        rules : col.rules,
        handleSave: (row, isReload) => handleSave(row, col.key, isReload),
        handleChangeRow: (record) => handleChangeRow(record, index)
      }),
    };
  });

  const SCHEDULE_ERROR = useMemo(() => {
    return ({
      INVALID_STATION: translation("accreditation.scheduleError.invalidStation"),
      INVALID_BOOKING_CONFIG: translation("accreditation.scheduleError.invalidBookingConfig"),
      BOOKING_MAX_LIMITED: translation("accreditation.scheduleError.bookingMaxLimited"),
      UNCONFIRMED_BOOKING_EXISTED: translation("accreditation.scheduleError.unconfirmedBookingExisted")
    })
  }, [translation])

  const onCreateNewCustomer = ({ customerRecordPlatenumber }) => {
    // && _verifyCarNumber(customerRecordPlatenumber)
    if (customerRecordPlatenumber) {
      AccreditationService.createNewCustomer({
        customerRecordPlatenumber: customerRecordPlatenumber.toUpperCase(),
        customerStationId: user.stationsId,
        customerRecordCheckDate: moment().format('DD/MM/YYYY'),
        customerRecordPlateColor: OptionsColor[0].value
      }).then(result => {
        if (result && result.issSuccess) {
          setIsCreate(false)
          formModal.resetFields()
          // notification['success']({
          //   message: "",
          //   description: translation('accreditation.addSuccess')
          // })
          // handleFetchAccreditation(dataFilter)
        } else {
          if (Object.keys(SCHEDULE_ERROR).includes(result.message)) {
            notification.error({
              message: "",
              description: SCHEDULE_ERROR[result.message]
            })
          } else {
            notification.error({
              message: "",
              description: translation('landing.invalidLicensePlateV2')
            })
          }
        }
      })
    } else {
      notification.error({
        message: "",
        description: translation('landing.invalidLicensePlate')
      })
    }
  }

  const onReloadData = () => {
    setLoading(true)
    setTimeout(() => {
      handleFetchAccreditation(dataFilter)
      setLoading(false)
    }, BUTTON_LOADING_TIME)
  }

  const handleClearFormChange = (field) => {
    let newFilter = { ...dataFilter };
    delete newFilter.filter[field]
    newFilter.skip = 0;
    setDataFilter(newFilter);
    handleFetchAccreditation(newFilter);
  }

  const handleFormChange = (values) => {
    let newFilter = {
      ...dataFilter,
      filter: { ...dataFilter.filter, ...values },
      skip:0
    };
    setDataFilter(newFilter);
    handleFetchAccreditation(newFilter);
  }

  const isMobileDevice = (value) =>{
    if(value < 768 ){
      dataFilter.limit = 10
    }
  }

  return (
    <>
      <Tabs activeKey={ListEditAccreditationKey} onChange={(key) => {
        if (key === AccreditationNotificationKey) {
          if(setting.enableOperateMenu === 0){
            return null
          }
          setUrlForModalDirectLink("/accreditation-public")
        } else if (key === CreateNewCustomerKey) {
          history.push("/schedules?active=2")
        } else if (key === InspectionProcessKey) {
          history.push('/inspection-process')
        } else if (key === ListAccreditationKey) {
          history.push('/accreditation')
        } else if (key === AccreditationStatisticalKey) {
          history.push("/statistical-accreditation")
        } else if (key === ListReportStaistic) {
          history.push("/list-report-accreditation")
        }
      }} >
        <TabPane tab={translation("accreditation.title")} key={ListAccreditationKey} />
        <TabPane tab={translation("accreditation.list")} key={ListEditAccreditationKey}>
          <Fragment>
            {setting.enableOperateMenu === 0 ? <UnLock /> : 
            <div>
            <div className="accreditation__date">
              <div className='list_accreditation_header mb-3'>
                {/* <div className="section-title">{translation("accreditation.list")}</div> */}
                <Space size={24} wrap className='justify-content-md-center'>
                  <div>
                    <Form
                      initialValues={
                        {
                          customerRecordCheckDate: convertStrToDate(dataFilter.filter?.customerRecordCheckDate, "DD/MM/YYYY"),
                          customerRecordCheckExpiredDate: convertStrToDate(dataFilter.filter?.customerRecordCheckExpiredDate, "DD/MM/YYYY")
                        }
                      }
                      onValuesChange={handleFormChange}
                      layout="inline"
                    >
                      <Row gutter={[24 , 24]}>
                        <Col xl={12} lg={12} md={12} sm={12} xs={24}>
                          <Form.Item noStyle shouldUpdate>
                            {(values) => {
                              return (
                                <DatePicker
                                  className="w-100"
                                  format="DD/MM/YYYY"
                                  placeholder={`${translation('accreditation.startDate')}`}
                                  initialValues={values.getFieldValue("customerRecordCheckDate")}
                                  onChange={(_, dateString) => dateString ? handleFormChange({
                                    customerRecordCheckDate: dateString
                                  }) : handleClearFormChange("customerRecordCheckDate")}
                                />
                              )
                            }}
                          </Form.Item>
                        </Col>
                        <Col xl={12} lg={12} md={12} sm={12} xs={24}>
                          <Form.Item noStyle shouldUpdate>
                            {(values) => {
                              return (
                                <DatePicker
                                  className="w-100"
                                  format="DD/MM/YYYY"
                                  placeholder={`${translation('accreditation.endDate')}`}
                                  initialValues={values.getFieldValue("customerRecordCheckExpiredDate")}
                                  onChange={(_, dateString) => dateString ? handleFormChange({
                                    customerRecordCheckExpiredDate: dateString
                                  }) : handleClearFormChange("customerRecordCheckExpiredDate")}
                                />
                              )
                            }}
                          </Form.Item>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                  <Button
                    type="primary"
                    onClick={() => {
                      history.push("/schedules?active=2")
                    }}
                    icon={<PlusOutlined className="addIcon" />}
                  >
                    {translation('inspectionProcess.add')}
                  </Button>
                  <Button
                    type="default"
                    onClick={onReloadData}
                    loading={loading}
                    disabled={loading}
                  >
                    {!loading && <ReloadOutlined className="addIcon" />
                    }
                  </Button>
                </Space>
              </div>
            </div>
            <Table
              rowClassName={(record) => `${record && record.customerRecordModifyDate ? 'edited-row editable-row' : 'editable-row'} ${record && record.isAdd ? "edited-row__add" : ""}`}
              dataSource={dataAccreditation.data}
              columns={columnsV3}
              scroll={{ x: 1400 }}
              components={components}
              pagination={false}
            />
            <BasicTablePaging handlePaginations={handleChangePage} skip={dataFilter.skip} count={dataAccreditation?.data?.length < dataFilter.limit}></BasicTablePaging>
            <Modal
              visible={isCreate}
              title={translation('inspectionProcess.add')}
              onCancel={() => setIsCreate(!isCreate)}
              footer={null}
            >
              <Form onFinish={onCreateNewCustomer} form={formModal}>
                <div className="row">
                  <div className="col-12 col-md-12">
                    <Form.Item
                      name="customerRecordPlatenumber"
                    >
                      <Input autoFocus placeholder={translation('landing.license-plates')} />
                    </Form.Item>
                  </div>
                  <div className="col-9 col-md-9" />
                  <div className="col-3 col-md-3 mt-3">
                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        {translation('inspectionProcess.save')}
                      </Button>
                    </Form.Item>
                  </div>
                </div>
              </Form>
            </Modal>
            </div> }
          </Fragment>
        </TabPane>
        {!isHiddenTabs(InspectionProcessKey) &&
          <TabPane tab={translation('header.inspectionProcess')} key={InspectionProcessKey} />
        }
        {!isHiddenTabs(AccreditationNotificationKey) &&
          <TabPane tab={translation("accreditation.accreditationNotification")} key={AccreditationNotificationKey} />
        }
        {!isHiddenTabs(AccreditationStatisticalKey) &&
          <TabPane tab={translation("listCustomers.statistical")} key={AccreditationStatisticalKey} />
        }
        {!isHiddenTabs(ListReportStaistic) &&
          <TabPane tab={translation("accreditation.statistic")} key={ListReportStaistic} />
        }
      </Tabs>
      {!!crimePlateNumber && <ModalCrime plateNumber={crimePlateNumber} onClose={() => setCrimePlateNumber('')} />}
    </>
  )
}
export default ListEditAccreditation;