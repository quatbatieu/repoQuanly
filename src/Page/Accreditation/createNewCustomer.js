import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Form, Input, Radio, notification, Select, DatePicker, Tabs } from 'antd'
import AccreditationService from '../../services/accreditationService'
import { useSelector } from 'react-redux'
import moment from 'moment'
import InspectionProcessService from '../../services/inspectionProcessService'
import { listInspectionCycle } from 'constants/listInspectionCycle'
import { IconCar } from "../../assets/icons"
// import _verifyCarNumber from 'constants/licenseplates'
import {
  ListAccreditationKey,
  ListEditAccreditationKey,
  CreateNewCustomerKey,
  AccreditationNotificationKey,
  InspectionProcessKey,
  AccreditationStatisticalKey
} from 'constants/accreditationTabs';
import AccreditationTabs from 'components/AccreditationTabs'
import { replaceSpecal } from '../../helper/common'
import AuthPunish from 'Page/Punish/authPunish'
import { useLocation } from 'react-router-dom'
import { validatorPlateNumber} from 'helper/licensePlateValidator'
import { validatorPhone } from 'helper/commonValidator'
import { useModalDirectLinkContext } from 'components/ModalDirectLink'

const { Option } = Select

function CreateNewCustomer(props) {
  const { t: translation } = useTranslation()
  const { state } = useLocation()
  const [form] = Form.useForm()
  const [stationCheckingConfig, setStationCheckingConfig] = useState([])
  const user = useSelector(state => state.member)
  const { history } = props
  const setting = useSelector((state) => state.setting);
  const { setUrlForModalDirectLink } = useModalDirectLinkContext();

  useEffect(() => {
    InspectionProcessService.getDetailById({ id: user.stationsId }).then(result => {
      if (result && result.stationCheckingConfig) {
        setStationCheckingConfig(result.stationCheckingConfig)
        form.setFieldsValue({
          customerRecordState: result.stationCheckingConfig[0].stepIndex
        })
      }
    })
  }, [])

  function onCreateNewCustomer(values) {
    // && _verifyCarNumber(values.customerRecordPlatenumber
    if (values)
      AccreditationService.createNewCustomer({
        ...values,
        customerRecordPlatenumber: replaceSpecal(values.customerRecordPlatenumber.toUpperCase()),
        "customerRecordState": Number(values.customerRecordState) || stationCheckingConfig[0].stepIndex,
        "customerRecordCheckDuration": Number(values.customerRecordCheckDuration) || undefined,
        "customerStationId": user.stationsId,
        "customerRecordCheckDate": moment(values.customerRecordCheckDate).format('DD/MM/YYYY'),
        "customerRecordCheckExpiredDate": values.customerRecordCheckDuration
          ? moment(values.customerRecordCheckDate).add(Number(values.customerRecordCheckDuration), 'months').subtract(1, 'day').format('DD/MM/YYYY')
          : undefined
      }).then(result => {
        if (result.issSuccess) {
          notification['success']({
            message: "",
            description: translation('accreditation.addSuccess')
          })
          form.resetFields()
        }
        else
          notification['error']({
            message: "",
            description: translation('accreditation.addFailed')
          })
      })
    else
      notification.error({
        message: '',
        description: translation('landing.invalidLicensePlate')
      })
  }

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
      value: "yellow",
      lable: <div className="accreditation__parent">
        {translation("accreditation.yellow")}

        <IconCar className=" accreditation__circle-yellow" />

      </div>
    },
    // {
    //   value: "red",
    //   lable: <div className="accreditation__parent">
    //     {translation("accreditation.red")}

    //     <IconCar className=" accreditation__circle-red" />

    //   </div>
    // }
  ]

  const InspectionCycle = listInspectionCycle(translation)

  const onFinishFailed = (e) => {
    if (e) {
      form.setFieldsValue({
        customerRecordCheckDate: moment()
      })
      const values = form.getFieldsValue()
      if (!values.customerRecordPlatenumber) {
        return
      } else {
        if (values.customerRecordCheckDuration && typeof values.customerRecordCheckDuration === 'string')
          values.customerRecordCheckDuration = Number(values.customerRecordCheckDuration.split(' ')[0])
        onCreateNewCustomer({
          ...values,
          customerRecordCheckDate: values.customerRecordCheckDate.toDate().toISOString(),
          customerRecordCheckDuration: values.customerRecordCheckDuration
        })
      }
    }
  }

  return (
    <>
      <AccreditationTabs
        onChangeTabs={(key) => {
          if (key === AccreditationNotificationKey) {
            if(setting.enableOperateMenu === 0){
              return null
            }
            setUrlForModalDirectLink("/accreditation-public")
          } else if (key === ListEditAccreditationKey) {
            history.push("/list-detail-accreditation", "_blank")
          } else if (key === InspectionProcessKey) {
            history.push('/inspection-process')
          } else if (key === ListAccreditationKey) {
            history.push('/accreditation')
          } else if (key === AccreditationStatisticalKey) {
            history.push("/statistical-accreditation")
          }
        }}
        ListAccreditation={null}
        activeKey={CreateNewCustomerKey}
        ListEditAccreditation={null}
        InspectionProcess={null}
        CreateNewCustomer={() => (
          <div className='row mt-4'>
            <div className='create_new_customer col-12 col-md-4'>
              <div className="section-title pb-4">{translation('accreditation.createNew')}</div>
              <Form
                onFinish={onCreateNewCustomer}
                onFinishFailed={onFinishFailed}
                onValuesChange={(values) => {
                 if(values.customerRecordPlatenumber) {
                  form.setFieldsValue({
                    customerRecordPlatenumber : values.customerRecordPlatenumber.toUpperCase()
                  })
                 }
                }}
                layout="vertical"
                form={form}
                initialValues={{
                  customerRecordPlateColor: OptionsColor[0].value,
                  customerRecordCheckDuration: 3,
                  customerRecordCheckDate: moment(),
                }}
                className="create_new_customer_body"
              >
                <Form.Item
                  name="customerRecordPlatenumber"
                  label={translation("landing.license-plates")}
                  rules={[
                    {
                      required: true,
                      validator(_, value) {
                        return validatorPlateNumber(value , translation);
                      }
                    }
                  ]}
                >
                  <Input
                    autoFocus
                    placeholder={`${translation("landing.license-plates")} (${translation("example")}: 30A38573)`}
                  />
                </Form.Item>

                <Form.Item
                  name="customerRecordFullName"
                  label={translation('landing.fullname')}
                >
                  <Input placeholder={translation('landing.fullname')} />
                </Form.Item>
                <Form.Item
                  name="customerRecordPhone"
                  label={translation('landing.phoneNumber')}
                  rules={[
                    {
                      required: true,
                      validator(_, value) {
                        return validatorPhone(value , translation);
                      }
                    }
                  ]}
                >
                  <Input placeholder={translation('landing.phoneNumber')} />
                </Form.Item>

                {/* ngày kiểm định */}
                <Form.Item
                  name="customerRecordCheckDate"
                  label={translation('accreditation.inspectionDate')}
                  rules={[
                    {
                      validator(_, value) {
                        const date = moment(value, "DD/MM/YYYY");
                        const now = moment();
                        if (Boolean(now.diff(date, 'days') > 0)) {
                          return Promise.reject(new Error(translation("accreditation.checkDateError")))
                        }
                        return Promise.resolve();
                      }
                    }
                  ]}
                >
                  <DatePicker
                    format="DD/MM/YYYY"
                    className="w-100"
                    allowClear={false}
                    placeholder={translation('accreditation.inspectionDate')}
                  />
                </Form.Item>

                {/* Chu kì kiểm định */}
                <Form.Item
                  name="customerRecordCheckDuration"
                  label={translation('accreditation.inspectionCycle')}
                >
                  <Select placeholder={translation('accreditation.inspectionCycle')}>
                    {
                      InspectionCycle.map((item, _) => {
                        return (
                          <Option value={item.value}>{item.label}</Option>
                        )
                      })
                    }
                  </Select>
                </Form.Item>

                {/* Quy trình kiểm định */}
                <div hidden className="row d-flex justify-content-center">
                  <Form.Item
                    name="customerRecordState"
                    className="col-12 col-md-6 col-lg-4"
                  >
                    <Select placeholder={translation('accreditation.inspectionProcess')}>
                      {
                        stationCheckingConfig.length > 0 && stationCheckingConfig.map((item, _) => {
                          return (
                            <Option value={item.stepIndex}>{item.stepLabel}</Option>
                          )
                        })
                      }
                    </Select>
                  </Form.Item>
                </div>

                <Form.Item
                  name="customerRecordPlateColor"
                  rules={[
                    {
                      required: true,
                      message: translation('accreditation.isRequire')
                    }
                  ]}
                  label={translation("accreditation.licensePlateColor")}
                >
                  <Radio.Group>
                    {
                      OptionsColor.map((color, _) => {
                        return (
                          <Radio key={color.value} value={color.value}>{color.lable}</Radio>
                        )
                      })
                    }
                  </Radio.Group>
                </Form.Item>
                <hr />
                <Form.Item shouldUpdate>
                  {(values) => {
                    const isError = values.getFieldsError().every(item => item.errors.length === 0)
                    return (
                      <div className="d-flex justify-content-end">
                        <Button type="primary" htmlType={isError ? "submit" : "button"}>
                          {translation("accreditation.save")}
                        </Button>
                      </div>
                    )
                  }}
                </Form.Item>
              </Form>
            </div>
            {
              window.innerWidth < 768 ? (
                <hr />
              ) : (
                <></>
              )
            }
            <div className='col-12 col-md-8'>
              <div className='p-3 m-1'>
                <AuthPunish plateNumber={state?.plateNumber || ""} />
              </div>
            </div>
          </div>
        )}
        AccreditationNotification={null}
        Punish={null}
      />
    </>
  )
}

export default CreateNewCustomer
