import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Form,
  Input,
  Button,
  InputNumber,
  Upload,
  Space,
  Row,
  Col,
  notification,
  Switch
} from 'antd'
import {
  MinusCircleOutlined,
  DownloadOutlined,
  PlayCircleOutlined,
  UploadOutlined
} from '@ant-design/icons'
import { IconAddCircle } from './../../assets/icons'
import { useSelector } from 'react-redux'
import InspectionProcessService from './../../services/inspectionProcessService'
import './inspectionProcess.scss'
import {
  ListAccreditationKey,
  ListEditAccreditationKey,
  CreateNewCustomerKey,
  AccreditationNotificationKey,
  InspectionProcessKey,
  AccreditationStatisticalKey,
  ListReportStaistic
} from 'constants/accreditationTabs'
import uploadService from '../../services/uploadService';
import AccreditationTabs from 'components/AccreditationTabs'
import { capitalizeFirstLetter } from 'helper/common'
import AudioPlayerButton from './AudioPlayerButton'
import UnLock from 'components/UnLock/UnLock';
import { useModalDirectLinkContext } from 'components/ModalDirectLink'

const { Dragger } = Upload;

function InspectionProcess(props) {
  const { t: translation } = useTranslation()
  const user = useSelector((state) => state.member)
  const [dataValues, setDataValues] = useState([])
  const [loading, setLoading] = useState(true)
  const [form] = Form.useForm();
  const [isAuto, setIsAuto] = useState(0)
  const [buttonLoading, setButtonLoading] = useState(false)
  const setting = useSelector((state) => state.setting);
  const { history } = props
  const { setUrlForModalDirectLink } = useModalDirectLinkContext();
  useEffect(() => {
    InspectionProcessService.getDetailById({ id: user.stationsId }).then(
      (result) => {
        if (result && result.stationCheckingConfig) {
          setDataValues(result.stationCheckingConfig)
          setIsAuto(result.stationCheckingAuto ? 1 : 0)
        }
        setLoading(false)
      }
    )
  }, [buttonLoading])

  const checkStepIndex = (data) => {
    let stations = data.stations

    const addStepLabelArray = stations?.map((item) => ({
      ...item,
      stepVoiceUrl: item?.stepVoiceUrl?.response || item.stepVoiceUrl
    }))

    let storeIndexNotEqual
    for (let i = 0; i < addStepLabelArray.length; i++) {
      if (addStepLabelArray[i].stepIndex !== i) {
        storeIndexNotEqual = i
        break
      }
    }

    if (storeIndexNotEqual !== undefined) {
      for (let i = storeIndexNotEqual; i < stations.length; i++) {
        stations[i].stepIndex = i
      }
    }
    return {
      ...data,
      stations: addStepLabelArray,
    }
  }

  const customRequest = async ({ file, onSuccess, onError, onProgress }) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = async function () {
      let baseString = reader.result

      const params = {
        imageData: baseString.replace('data:' + file.type + ';base64,', ''),
        imageFormat: file.name.split('.').pop().toLowerCase()
      }
      const res = await uploadService.uploadImage(params);

      if (res.issSuccess) {
        onSuccess(res.data); // Gọi hàm onSuccess với đường dẫn URL của hình ảnh từ phản hồi của server
      } else {
        onError({
          message: "Status : " + res.statusCode
        }); // Thông điệp lỗi cụ thể
      }
    }
  };

  const handleUploadFile = (form, index, response) => {
    const updatedStations = [...form.getFieldValue('stations')];
    updatedStations[index] = {
      ...updatedStations[index],
      stepVoiceUrl: response
    };
    form.setFieldsValue({ stations: updatedStations });
  }

  const onFinish = (values) => {
    const newData = values ? checkStepIndex(values) : {}
    setButtonLoading(true)
    newData.stationCheckingAuto = isAuto ? 1 : 0
    InspectionProcessService.updateById({
      id: user.stationsId,
      data: {
        stationCheckingConfig: newData.stations,
        stationCheckingAuto: newData.stationCheckingAuto,
      },
    }).then((result) => {
      if (result && result.issSuccess) {
        notification['success']({
          message: '',
          description: translation('inspectionProcess.updateSuccess'),
        })
      } else {
        notification['error']({
          message: '',
          description: translation('inspectionProcess.updateError'),
        })
      }
      setButtonLoading(false)
    })
  }

  const onChangeAuto = (e) => {
    setIsAuto(prev => !prev)
    notification['info']({
      message: '',
      description: e
        ? translation('accreditation.autoOn')
        : translation('accreditation.autoOff'),
    })
  }

  return (
    <AccreditationTabs
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
        } else if (key === ListAccreditationKey) {
          history.push('/accreditation')
        } else if (key === AccreditationStatisticalKey) {
          history.push("/statistical-accreditation")
        } else if (key === ListReportStaistic) {
          history.push("/list-report-accreditation")
        }
      }}
      ListAccreditation={null}
      activeKey={InspectionProcessKey}
      ListEditAccreditation={null}
      InspectionProcess={() => (
        <main className='inspection_process'>
        {setting.enableOperateMenu === 0 ? <UnLock /> :
          <div className='inspection_process_wrap'>
            <div className='list_accreditation_header item-3'>
              <div className="section-title">{capitalizeFirstLetter(translation('inspectionProcess.title'))}</div>
            </div>
            {!loading ? (
              <Form
                initialValues={{
                  stations: dataValues,
                  stationCheckingAuto: isAuto === 0 ? false : true,
                }}
                form={form}
                onFinish={onFinish}
                autoComplete='off'
                className='inspection_process__form'
              >
                <div className='row inspection_process__form__title'>
                  <Col span={2}></Col>
                  <Col span={8}>
                    {translation('inspectionProcess.processName')}
                  </Col>
                  <Col span={6}>
                    {translation('inspectionProcess.processNameVoice')}
                  </Col>
                  <Col span={6}>
                    {translation('inspectionProcess.timeMinutes')}
                  </Col>
                  <Col span={2}></Col>
                </div>
                <Form.List name='stations'>
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, fieldKey, ...restField }) => {
                        const stepVoiceUrl = form?.getFieldValue(['stations', name, 'stepVoiceUrl']);
                        return (
                          <Row  className='inspection_process__form' gutter={16}>
                            <Col className='custom_displayNone' span={2}>
                              <div className='ant-row ant-form-item inspection_process__form__number'>
                                <div>
                                  <span>{name + 1}</span>
                                  <Form.Item
                                    {...restField}
                                    name={[name, 'stepIndex']}
                                    fieldKey={[fieldKey, 'stepIndex']}
                                    className='displayNone'
                                    initialValue={name}
                                  >
                                    <Input />
                                  </Form.Item>
                                </div>
                              </div>
                            </Col>
                            <Col span={8}>
                              <Form.Item
                                {...restField}
                                name={[name, 'stepLabel']}
                                fieldKey={[fieldKey, 'stepLabel']}
                              >
                                <Input
                                  placeholder={translation(
                                    'inspectionProcess.enterProcessName'
                                  )}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={6}>
                              <Form.Item
                                {...restField}
                                name={[name, 'stepVoiceUrl']}
                                fieldKey={[fieldKey, 'stepVoiceUrl']}
                                valuePropName='file'
                                getValueFromEvent={e => e.file}
                              >
                                {stepVoiceUrl ? (
                                  <div className="d-flex align-items-center justify-content-between w-100 bg-light border rounded p-1" style={{ height: 31 }}>
                                    <Button className='d-flex align-items-center justify-content-between' type="link" icon={<DownloadOutlined style={{ fontSize: 14 }} />} href={stepVoiceUrl} download target="_blank">
                                      {translation('inspectionProcess.download')}
                                    </Button>
                                    <div>
                                      <AudioPlayerButton url={typeof stepVoiceUrl === "string" ? stepVoiceUrl : stepVoiceUrl?.response} />
                                    </div>
                                  </div>
                                ) : null && (
                                  <Upload
                                    accept=".mp3"
                                    maxCount={1}
                                    beforeUpload={file => file.type.startsWith('audio/') && file.size <= 5 * 1024 * 1024}
                                    onChange={info => {
                                      const { status, response } = info.file;
                                      if (status === 'done') {
                                        handleUploadFile(form, name, response);
                                      }
                                    }}
                                    customRequest={customRequest}
                                    showUploadList={false}
                                  >
                                    <Button icon={<UploadOutlined />} className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-between">
                                      {translation('inspectionProcess.uploadVoice')}
                                    </Button>
                                  </Upload>
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={6}>
                              <Form.Item
                                {...restField}
                                name={[name, 'stepDuration']}
                                fieldKey={[fieldKey, 'stepDuration']}
                                rules={[
                                  {
                                    required: true,
                                    message: translation(
                                      'inspectionProcess.enterProcessTime'
                                    ),
                                  },
                                ]}
                              >
                                <InputNumber
                                  className='inspection_process__form__input'
                                  min={1}
                                  type='number'
                                  placeholder={translation(
                                    'inspectionProcess.enterProcessTime'
                                  )}
                                />
                              </Form.Item>
                            </Col>
                            <Col className='custom-padding-0' span={2}>
                              <div className='ant-row ant-form-item inspection_process__form__number inspection_process__form__number-second'>
                                <MinusCircleOutlined
                                  className='inspection_process__form__delete'
                                  onClick={() => remove(name)}
                                  style={{ color: 'red' }}
                                />
                              </div>
                            </Col>
                          </Row>
                        )
                      })}
                    </>
                  )}
                </Form.List>
                <div className='row mt-2 button-bottom'>
                  <div className='col-6 col-lg-8 d-flex justify-content-end pt-1 custom_displayNone'>
                  </div>
                  <div className='col-3 col-lg-1 d-flex justify-content-end'>

                  </div>
                  <div className="inspection_process__form__save ">
                    <Space direction="horizontal" size="middle" className="d-flex align-items-center justify-content-center">
                      <div className="d-flex align-items-center">
                        <Switch defaultChecked={isAuto} name="stationCheckingAuto" onClick={onChangeAuto} />
                        <label htmlFor='stationCheckingAuto' className="ml-2">
                          {translation('accreditation.auto')}
                        </label>
                      </div>
                      <Form.List name='stations'>
                        {(fields, { add }) => (
                          <>
                            {fields.length < 10 && (
                              <Button
                                className='inspection_process__form__button'
                                onClick={() => add()}
                                icon={<IconAddCircle />}
                              >
                                {translation('inspectionProcess.add')}
                              </Button>
                            )}
                          </>
                        )}
                      </Form.List>
                      <Button
                        disabled={buttonLoading}
                        type='primary'
                        htmlType='submit'
                        className='inspection_process__form__submit'
                      >
                        {translation('inspectionProcess.save')}
                      </Button>
                    </Space>
                  </div>
                </div>
              </Form>
            ) : null}
          </div>
      }
        </main> 
      )}
      CreateNewCustomer={null}
      AccreditationNotification={null}
      Punish={null}
    />
  )
}
export default InspectionProcess
