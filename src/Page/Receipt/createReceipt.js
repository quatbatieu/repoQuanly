import React, { useEffect, useState } from 'react'
import {
  Form,
  Button,
  Input,
  Row,
  Spin,
  Modal,
  notification,
  Col,
  Space
} from "antd";
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { getFormBuilder } from './common';
import ReceiptionService from 'services/receiptionService';
import ScheduleSettingService from 'services/scheduleSettingService';

function CreateReceipt(props) {
  const [form] = Form.useForm()
  // force rerender
  const [customerReceiptContent, setCustomerReceiptContent] = useState()
  const { t: translation } = useTranslation()
  const history = useHistory()
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPaymentOptions, setSelectedPaymentOptions] = useState([]);
  const FORM_BUILDER = getFormBuilder(translation)
  const user = useSelector((state) => state.member);

  useEffect(() => {
    let sessionFormValue = sessionStorage.getItem("customer_data")
    if (sessionFormValue) {
      sessionFormValue = JSON.parse(sessionFormValue.trim() || "{}")
      form.setFieldsValue(sessionFormValue)
    }
  }, [])

  const fetchData = async () => {
    setIsLoading(true);
    await ScheduleSettingService.getDetailById({ id: user.stationsId }).then((result) => {
      if (result) {
        setSelectedPaymentOptions(result.stationPayments || []);
        setIsLoading(false);
      }
    })
  }

  useEffect(() => {
    fetchData();
  }, []);
  
  if(isLoading) {
   return <Spin />
  }

  return (
    <Modal
      title={translation("receipt.create-receipt")}
      visible={props.isModalVisible}
      onOk={() => false}
      onCancel={props.onCancel}
      footer={[
        <Button onClick={props.onCancel}>{translation("receipt.goBack")}</Button>,
        <Button
          type="primary"
          onClick={() => form.submit()}
        >
          {translation("receipt.create-receipt")}
        </Button>
      ]}
      width={720}>
      <main>
        <div className="row">
          <div>
            {isLoading ? (
              <Spin />
            ) : (
              <Form
                layout="vertical"
                form={form}
                onValuesChange={(values) => {
                  if(values.customerReceiptContent) {
                    setCustomerReceiptContent(values.customerReceiptContent);
                  }
                  if (values.customerVehicleIdentity) {
                    form.setFieldsValue({
                      customerVehicleIdentity : values.customerVehicleIdentity.toUpperCase()
                    })
                  }
                }}
                onFinish={(values) => {
                  const contentPayment = values["customerReceiptContent-other"]
                  if (contentPayment) {
                    values.customerReceiptContent = `${values.customerReceiptContent};${contentPayment}`
                  }

                  ReceiptionService.createReceipt({
                    customerReceiptName: values.customerReceiptName,
                    customerReceiptEmail: values.customerReceiptEmail,
                    customerReceiptPhone: values.customerReceiptPhone,
                    customerReceiptAmount: values.customerReceiptAmount,
                    customerVehicleIdentity: values.customerVehicleIdentity,
                    customerReceiptContent: values.customerReceiptContent?.join(','),
                    paymentMethod: values.paymentMethod,
                    customerReceiptNote: values.customerReceiptNote
                  }).then(res => {
                    const { statusCode, error, data} = res
                    if (statusCode === 200) {
                      sessionStorage.setItem("customer_data", JSON.stringify({
                        ...values, 
                        id : data[0]
                      }))
                      history.push("/verify-receipt")
                      // if (formValue.paymentMethod === PAYMENT_TYPE_STATE.VNPAY_PERSONAL) {
                      //   onCreateVNPayment(res[0])
                      // } else {
                      //   sessionStorage.removeItem("customer_data")
                      //   history.push("/receipt")
                      // }
                    } else {
                      if(error === "DUPLICATE_EMAIL"){
                        notification.error({
                          message: "",
                          description: translation('DUPLICATE_EMAIL')
                        })
                        return
                      }
                      notification.error({
                        message: "",
                        description: translation('landing.error')
                      })
                    }
                  })

                }}
              >
                <Row gutter={16}>
                  {
                    FORM_BUILDER.map(_form => {
                      if (_form.isFormItem) {
                        if(_form.name === "paymentMethod" && selectedPaymentOptions.length === 0) {
                          return <></>
                        }

                        if (_form.name === "customerReceiptAmount") {
                          return (
                            <Col span={24} key={"customerReceiptAmount"}>
                              <Form.Item
                                name={_form.name}
                                key={_form.name}
                                label={_form.label}
                                rules={_form.rule}
                              >
                                {_form.child()}
                              </Form.Item>
                              {
                                _form.name === "customerReceiptContent" && customerReceiptContent === "OTHER" ? (
                                  <Form.Item
                                    name={"customerReceiptContent-other"}
                                    key={"customerReceiptContent-other"}
                                    rules={[{
                                      required: true,
                                      message: translation("accreditation.isRequire")
                                    }]}
                                  >
                                    <Input />
                                  </Form.Item>
                                ) : (
                                  <></>
                                )
                              }
                            </Col>
                          )
                        }

                        return (
                          <Col span={_form.col || 24} {...(_form.responsive || {})} key={_form.name}>
                            <Form.Item
                              name={_form.name}
                              key={_form.name}
                              label={_form.label}
                              rules={_form.rule}
                            >
                              {_form.child({
                                selectedPaymentOptions
                              })}
                            </Form.Item>
                            {
                              _form.name === "customerReceiptContent" && customerReceiptContent === "OTHER" ? (
                                <Form.Item
                                  name={"customerReceiptContent-other"}
                                  key={"customerReceiptContent-other"}
                                  rules={[{
                                    required: true,
                                    message: translation("accreditation.isRequire")
                                  }]}
                                >
                                  <Input />
                                </Form.Item>
                              ) : (
                                <></>
                              )
                            }
                          </Col>
                        )
                      } else {
                        return <></>
                      }
                    })
                  }
                </Row>
              </Form>
            )}
          </div>
        </div>
      </main >
    </Modal>
  )
}

export default CreateReceipt