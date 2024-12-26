import Icon, { DeleteOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, InputNumber, Modal, notification, Popconfirm, Row, Space, Switch, Table, Typography } from 'antd';
import { UnionIcon } from 'assets/icons';
import UnLock from 'components/UnLock/UnLock';
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import InspectionProcessService from 'services/inspectionProcessService';
import ScheduleSettingService from '../../services/scheduleSettingService';
import CreateBookingConfig from './createBookingConfig';
import './scheduleSettingStyle.scss';
const EditableContext = React.createContext(null);

function ScheduleSetting() {
  const { t: translation } = useTranslation()
  const [dataStation, setDataStation] = useState([])
  const [mixture, setMixture] = useState(0);
  const [setting, setSetting] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dailyCarNumber, setDailyCarNumber] = useState({
    totalOtherVehicle: null,
    totalSmallCar: null,
    totalRoMooc: null
  })
  const [isAdd , setIsAdd] = useState(false);
  const [formAdd] = Form.useForm()
  const [loading, setLoading] = useState(true)
  const user = useSelector((state) => state.member)
  const settings = useSelector((state) => state.setting);
  const fetchData = useCallback(async () => {
    setLoading(true)
    ScheduleSettingService.getDetailById({ id: user.stationsId }).then(result => {
      if (result && result.stationBookingConfig && result.stationBookingConfig.length > 0) {
        setDataStation(result.stationBookingConfig)
      }
      if (result) {
        setMixture(result.enableConfigMixtureSchedule || 0);
        setDailyCarNumber({
          totalOtherVehicle: result.totalOtherVehicle,
          totalSmallCar: result.totalSmallCar,
          totalRoMooc: result.totalRoMooc
        })
      }
      setLoading(false)
    })
  }, [])

  const SCHEDULE_SETTING_ERROR = useMemo(() => {
    return {
      INVALID_STATION: translation("scheduleSetting.scheduleSettingError.invalidStation"),
      WRONG_BOOKING_CONFIG: translation("scheduleSetting.scheduleSettingError.wrongBookingConfig")
    }
  }, [])
  async function handleCreateNew(values) {
    let newValues={
      ...values,
      limitSmallCar : values?.limitSmallCar ? values?.limitSmallCar : 0,
      limitRoMooc : values?.limitRoMooc ? values?.limitRoMooc : 0,
      limitOtherVehicle : values?.limitOtherVehicle ? values?.limitOtherVehicle : 0,
      enableBooking:values.enableBooking ? 1 : 0
    }
    await InspectionProcessService.createBookingConfig(newValues).then(async result => {
      if (!result.error) {
        notification.success({
          message: "",
          description: translation('bookingConfig.createSuccess')
        })
        setIsAdd(false)
        formAdd.resetFields()
        fetchData()
      } else {
        if (result.error) {
          notification.error({
            message: "",
            description: translation('bookingConfig.'+result.error)
          })
        }
      }
    })
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSwitch = async (scheduleItem) => {
    const newData = {
      id:scheduleItem.stationBookingConfigId,
      data:{
       time:scheduleItem.time,
       enableBooking:scheduleItem.enableBooking !== 1 ? 1 : 0
      }
    }
    handleUpdateById(newData);
  }

  async function handleUpdateById(values) {
    await InspectionProcessService.updateBookingConfigById(values).then(async result => {
      if (!result.error) {
        notification.success({
          message: "",
          description: translation('scheduleSetting.saveSuccess')
        })
        setIsAdd(false)
        fetchData()
      } else {
        if (result.error) {
          notification.error({
            message: "",
            description: translation('bookingConfig.'+result.error)
          })
        }else{
          notification.error({
            message: "",
            description: translation('UPDATE_FAILED')
          })
        }
      }
    })
  }
  const handleDelete = (id) => {
    if(dataStation.length === 1){
      notification.error({
        message: "",
        description: translation("accreditation.error_schedule")
      })
      return
    }
    InspectionProcessService.deleteBookingConfigById({
      id : id
    }).then((res) => {
      if(!res.error){
        notification.success({
          message: "",
          description: translation("bookingConfig.deleteSuccess"),
        });
        fetchData()
      }else {
        if (res.error) {
          notification.error({
            message: "",
            description: translation('bookingConfig.'+res.error)
          })
        }else{
          notification.error({
            message: "",
            description: translation("bookingConfig.DELETE_FAILED"),
          });
        }
      }
    })
  };
  const columns = [
    {
      title: translation("scheduleSetting.timeline"),
      dataIndex: 'time',
      key: 'time',
      align: "left",
      width: 158,
      render: (value, scheduleItem, index) => {
        return (
          <InputTime
           value={value}
           name="time"
           title={translation("bookingConfig.time") + ` (${value})`}
           onChange={(newInput) => {
             const newData = {
               id:scheduleItem.stationBookingConfigId,
               data:{
                time:newInput.time,
               }
             }
             handleUpdateById(newData);
           }}
         />
        )
      },
    },
    {
      title: translation("scheduleSetting.enableBooking"),
      dataIndex: 'enableBooking',
      align: "center",
      width: 250,
      key: 'enableBooking',
      render: (enableBooking, scheduleItem, index) => {
        return (
          <Switch
            checked={enableBooking === 1 ? true : false}
            onChange={() => handleSwitch(scheduleItem)}
          />
        )
      }
    },
    {
      title: translation("scheduleSetting.date_car"),
      dataIndex: 'enableBooking',
      key: 'enableBooking',
      align: "center",
      width: 250,
      render: (value, scheduleItem, index) => {
        const totalCar = scheduleItem.limitSmallCar + scheduleItem.limitRoMooc + scheduleItem.limitOtherVehicle
        return (
          <TextBox
           value={totalCar}
           disabled={!mixture}
           name="totalCar"
           title={translation("scheduleSetting.date_car") + ` (${scheduleItem.time})`}
           onChange={(newInput) => {
            if(newInput.totalCar === 0){
              notification['error']({
                message: "",
                description: translation('accreditation.error_car')
              })
              return
            }
             const columnSmall = Math.round(newInput.totalCar * 0.4)
             const columnMooc = newInput.totalCar - (columnSmall * 2)
             const newData = {
              id:scheduleItem.stationBookingConfigId,
               data:{
                time:scheduleItem.time,
                limitSmallCar : columnSmall,
                limitRoMooc : columnMooc,
                limitOtherVehicle : columnSmall,
               }
             }
             handleUpdateById(newData);
           }}
         />
        )
      }
    },
    {
      title: translation("scheduleSetting.limitSmallCar"),
      dataIndex: 'limitSmallCar',
      key: 'limitSmallCar',
      width: 200,
      render: (value, scheduleItem, index) => <TextBox
        value={value}
        disabled={!!mixture}
        name="limitSmallCar"
        title={translation("scheduleSetting.limitSmallCar") + ` (${scheduleItem.time})`}
        onChange={(newInput) => {
          if(newInput.limitSmallCar === 0){
            notification['error']({
              message: "",
              description: translation('accreditation.error_car')
            })
            return
          }
          const newData = {
            id:scheduleItem.stationBookingConfigId,
              data:{
              time:scheduleItem.time,
              limitSmallCar : newInput.limitSmallCar,
              }
            }
            handleUpdateById(newData);
        }}
      />
    },
    {
      title: translation("scheduleSetting.TrailersAndContainerTrucks"),
      dataIndex: 'limitRoMooc',
      key: 'limitRoMooc',
      width: 200,
      render: (value, scheduleItem, index) => <TextBox
        value={value}
        disabled={!!mixture}
        name="limitRoMooc"
        title={translation("scheduleSetting.TrailersAndContainerTrucks") + ` (${scheduleItem.time})`}
        onChange={(newInput) => {
          if(newInput.limitRoMooc === 0){
            notification['error']({
              message: "",
              description: translation('accreditation.error_car')
            })
            return
          }
          const newData = {
            id:scheduleItem.stationBookingConfigId,
            data:{
              time:scheduleItem.time,
              limitRoMooc : newInput.limitRoMooc,
            }
          }
          handleUpdateById(newData);
        }}
      />
    },
    {
      title: translation("scheduleSetting.limitOtherVehicle"),
      dataIndex: 'limitOtherVehicle',
      key: 'limitOtherVehicle',
      width: 200,
      render: (value, scheduleItem, index) => <TextBox
        value={value}
        disabled={!!mixture}
        name="limitOtherVehicle"
        title={translation("scheduleSetting.limitOtherVehicle") + ` (${scheduleItem.time})`}
        onChange={(newInput) => {
          if(newInput.limitOtherVehicle === 0){
            notification['error']({
              message: "",
              description: translation('accreditation.error_car')
            })
            return
          }
          const newData = {
            id:scheduleItem.stationBookingConfigId,
              data:{
              time:scheduleItem.time,
              limitOtherVehicle : newInput.limitOtherVehicle,
              }
            }
          handleUpdateById(newData);
        }}
      />
    },
    {
      title: translation('sms.actions'),
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      width: 120,
      render: (_, record) => {
        const { stationBookingConfigId} = record;

        let cancelButton = null;
        cancelButton = (
          <Popconfirm
            title={translation("bookingConfig.box-delete-confirm")}
            onConfirm={() => {
              handleDelete(stationBookingConfigId)
            }}
            okText={translation("category.yes")}
            cancelText={translation("category.no")}
          >
            <Button type="link">
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        );
        
        return (
          <Space size='middle'>
            {cancelButton}
          </Space>
        );
      },
    },
  ]

  const updateSchedule = (data) => {
    ScheduleSettingService.saveScheduleSetting({
      id: user.stationsId,
      data: data
    }).then(result => {
      if (result && result.issSuccess) {
        fetchData()
        notification['success']({
          message: '',
          description: translation('scheduleSetting.saveSuccess')
        });
      } else {
        if (Object.keys(SCHEDULE_SETTING_ERROR).includes(result.message)) {
          notification.error({
            message: "",
            description: SCHEDULE_SETTING_ERROR[result.message]
          })
        }
      }
    })
  }

  const handleSwitchMixture = (checked) => {
    updateSchedule({
      enableConfigMixtureSchedule: checked ? 0 : 1
    })
  }

  function handleUpdateSetting(data) {
    InspectionProcessService.updateById({ id: user.stationsId, data }).then((res) => {
      if (!res.issSuccess) {
        notification['error']({
          message: "",
          description: translation('setting.error')
        })
        return;
      }
      fetchDataSetting();
    })
  }

  const fetchDataSetting = async () => {
    setIsLoading(true);
    const result = await ScheduleSettingService.getDetailById({ id: user.stationsId });
    if (result) {
      setSetting(result);
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 300)
  };

  useEffect(() => {
    fetchDataSetting();
  }, []);

  return (
    <Fragment>
    {settings.enableScheduleMenu === 0 ? <UnLock /> : 
    <main className="schedule_setting">
      <div className="schedule_setting__title">
        {/* {translation('scheduleSetting.scheduleSetting')} */}
        <div>
          <Button
            onClick={()=>{setIsAdd(!isAdd)}}
            type="primary"
            icon={<UnionIcon />}
            className="d-flex align-items-center gap-1"
          >
            {translation('addHour')}
          </Button>
        </div>

      </div>
      {/* <Row gutter={[16, 16]} className='mb-4'>
        <Col xs={24} lg={12}>
          <SheduleConfig
            totalOtherVehicle={dailyCarNumber.totalOtherVehicle}
            totalSmallCar={dailyCarNumber.totalSmallCar}
            totalRoMooc={dailyCarNumber.totalRoMooc}
            loading={loading}
            fetchData={fetchData}
            SCHEDULE_SETTING_ERROR={SCHEDULE_SETTING_ERROR}
          />
        </Col>
      </Row> */}
      <Row gutter={[16, 16]} className='mb-4'>
        <Col xs={24} lg={24}>
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={6}>
              <Card bodyStyle={{ padding: '13px' , height: '92px',border:'1px solid'}}>
                <div className='d-flex justify-content-between align-items-center'>
                  <div>
                    <Icon type="setting" className='me-2' />
                    <Typography.Paragraph strong>
                      {translation('scheduleSetting.mixed')}
                    </Typography.Paragraph>
                  </div>
                  <Switch onChange={handleSwitchMixture} checked={!mixture} />
                </div>
              </Card>
            </Col>
            <Col xs={24} lg={6}>
              <Card bodyStyle={{ padding: '13px' , height: '92px',border:'1px solid'}}>
                <div className='d-flex justify-content-between align-items-center'>
                  <div>
                    <Icon type="calendar" className='me-2' />
                    <Typography.Paragraph strong>
                      {translation('setting.allowOverbooking')}
                    </Typography.Paragraph>
                  </div>
                  <Switch
                    checked={(setting.enableConfigBookingOnToday === 1 ? true : false)}
                    onChange={(checked) => handleUpdateSetting({ enableConfigBookingOnToday: checked ? 1 : 0 })}
                  />
                </div>
              </Card>
            </Col>
            <Col xs={24} lg={6}>
              <Card bodyStyle={{ padding: '13px' , height: '92px',border:'1px solid'}}>
                <div className='d-flex justify-content-between align-items-center'>
                  <div>
                    <Icon type="check-circle" className='me-2' />
                    <Typography.Paragraph strong>
                      {translation('setting.automaticAppointmentConfirmation')}
                    </Typography.Paragraph>
                  </div>
                  <Switch
                    checked={(setting.enableConfigAutoConfirm === 1 ? true : false)}
                    onChange={(checked) => handleUpdateSetting({ enableConfigAutoConfirm: checked ? 1 : 0 })}
                  />
                </div>
              </Card>
            </Col>
            <Col xs={24} lg={6}>
              <Card bodyStyle={{ padding: '13px' , height: '92px',border:'1px solid'}}>
                <div className='d-flex justify-content-between align-items-center'>
                  <div>
                    <Icon type="exclamation-circle" className='me-2' />
                    <Typography.Paragraph strong>
                      {translation('setting.limitOverbookingAllowed')}
                    </Typography.Paragraph>
                  </div>
                  <Switch
                    checked={(setting.enableConfigAllowBookingOverLimit === 1 ? true : false)}
                    onChange={(checked) => handleUpdateSetting({ enableConfigAllowBookingOverLimit: checked ? 1 : 0 })}
                  />
                </div>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
      <div className='schedule_setting__table'>
        <Table
          columns={columns}
          dataSource={dataStation}
          rowKey="index"
          scroll={{ x: 1400 }}
          pagination={false}
        />
        {isAdd && (
        <CreateBookingConfig
          translation={translation}
          isModalVisible={isAdd}
          handleCreateNew={handleCreateNew}
          onCancel={() => setIsAdd(false)}
        />
      )}
      </div>
    </main>
    }
    </Fragment>
  )
}

const PopUpComfirm = ({ isVisible, onOk, onCancel, title }) => {
  const { t: translation } = useTranslation()

  if (!isVisible) {
    return (<></>)
  }

  return (
    <Modal
      title={translation("short-edit") + ` ${title}`}
      visible={isVisible}
      okText={translation("confirm")}
      cancelText={translation("cancel")}
      onOk={onOk}
      className='modal-comfirm'
      onCancel={onCancel}
      bodyStyle={{
        borderRadius: 2
      }}
      centered
    >
      <p>
        {translation("scheduleSetting.descModal", {
          title
        })}
      </p>
    </Modal>
  )
}

const TextBox = ({ value, name, onChange, title, disabled }) => {
  const [form] = Form.useForm();
  const { t: translation } = useTranslation();
  const [input, setInput] = useState(value);
  const [isVisible, setIsVisible] = useState(false);
  const handleFinish = (values) => {
    if (values[name] != value) {
      setInput(values[name]);
      setIsVisible(true);
    }
  }

  const handleCancel = () => {
    form.setFieldsValue({ [name]: value })
    setInput(value)
    setIsVisible(false);
  }
  const handleChange = () => {
    setIsVisible(false)
    onChange({ [name]: Number(input) })
  }

  useEffect(() => {
    form.setFieldsValue({ [name]: value })
  }, [value])
  return (
    <Form
      onFinish={handleFinish}
      initialValues={{
        [name]: value
      }}
      form={form}
    >
      <Form.Item
        name={name}
        rules={[
          {
            pattern: /^[0-9]*$/,
            message: translation("scheduleSetting.onlyPositiveIntegersAllowed")
          }
        ]}
      >
        <InputNumber
          placeholder={translation("enterQuantity")}
          onBlur={() => form.submit()}
          disabled={disabled}
          min={1}
        />
      </Form.Item>
      <PopUpComfirm
        isVisible={isVisible}
        onCancel={handleCancel}
        onOk={handleChange}
        title={title}
      />
    </Form>
  )
}
const InputTime = ({ value, name, onChange, title, disabled }) => {
  const [form] = Form.useForm();
  const { t: translation } = useTranslation();
  const [input, setInput] = useState(value);
  const [isVisible, setIsVisible] = useState(false);
  const handleFinish = (values) => {
    if (values[name] != value) {
      setInput(values[name]);
      setIsVisible(true);
    }
  }

  const handleCancel = () => {
    form.setFieldsValue({ [name]: value })
    setInput(value)
    setIsVisible(false);
  }
  const handleChange = () => {
    setIsVisible(false)
    onChange({ [name]: input })
  }

  const handleInputTimeChange = (e)=>{
    const { value } = e.target;
    const filteredValue = value.replace(/[^\w-]/g, ''); // Loại bỏ tất cả các ký tự đặc biệt trừ dấu "-"
    form.setFieldsValue({ [name]: filteredValue });
  }

  useEffect(() => {
    form.setFieldsValue({ [name]: value })
  }, [value])
  return (
    <Form
      onFinish={handleFinish}
      initialValues={{
        [name]: value
      }}
      form={form}
    >
      <Form.Item
        name={name}
        rules={[
          {
            required: true,
            message: translation("bookingConfig.timeRequired")
          }
        ]}
      >
        <Input
          onChange={handleInputTimeChange}
          placeholder={translation("timeQuantity")}
          onBlur={() => form.submit()}
          disabled={disabled}
        />
      </Form.Item>
      <PopUpComfirm
        isVisible={isVisible}
        onCancel={handleCancel}
        onOk={handleChange}
        title={title}
      />
    </Form>
  )
}

export default ScheduleSetting