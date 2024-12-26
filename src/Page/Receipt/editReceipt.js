import React, { useEffect, useState } from 'react';
import { Form, Button, Input, Space, notification, Grid, Spin, Row, Modal, Col } from 'antd';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { getFormBuilder } from './common';
import ReceiptionService from 'services/receiptionService';
import ScheduleSettingService from 'services/scheduleSettingService';
import { PAYMENT_STATE } from 'constants/receipt';
import HistoryDetailBooking from './HistoryDetailBooking';
import moment from 'moment';

const { useBreakpoint } = Grid;

function EditReceipt(props) {
  const [form] = Form.useForm();
  const [data , setData] = useState({});
  const { t: translation } = useTranslation();
  const history = useHistory();
  const contentPayment = form.getFieldValue('customerReceiptContent');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPaymentOptions, setSelectedPaymentOptions] = useState([]);
  const FORM_BUILDER = getFormBuilder(translation);

  const user = useSelector((state) => state.member);
  const { customerReceiptStatus } = data;
  const screens = useBreakpoint();
  const updateReceipt = (data) => {
    ReceiptionService.updateReceiptById({ id: props.item?.customerReceiptId, data }).then((res) => {
      if (res.isSuccess) {
        notification['success']({
          message: '',
          description: translation('receipt.updateSuccess')
        });
      } else {
        notification['error']({
          message: '',
          description: translation('receipt.updateError')
        });
      }
      props.onFetchReceipt();
      props.onCancel();
    })
  }

  const fetchData = async () => {
    setIsLoading(true);
    await ScheduleSettingService.getDetailById({ id: user.stationsId }).then((result) => {
      if (result) {
        setSelectedPaymentOptions(result.stationPayments || []);
      }
    })
    await ReceiptionService.getDetailById(parseInt(props.item?.customerReceiptId)).then((res) => {
      if (res) {
        let content = res.customerReceiptContent;
        if (content.indexOf('OTHER') > -1) {
          content = content.split(';');
          res.customerReceiptContent = content[0];
          res['customerReceiptContent-other'] = content[1];
        }

        if (res.paymentApproveDate) {
          res.paymentApproveDate = moment(res.paymentApproveDate);
        }

        form.setFieldsValue(res);
        setData(res);
        setIsLoading(false);
      }
    });
  }

  useEffect(() => {
    if (props.item?.customerReceiptId) {
      fetchData();
    };
  }, [props.item?.customerReceiptId, form]);

  if (isLoading) {
    return (
      <Modal
        title={translation("receipt.detail-receipt")}
        visible={props.isModalVisible}
        onOk={() => false}
        onCancel={props.onCancel}
        footer={[]}
        width={1080}>
        <main className="row justify-content-center">
          <div>
            <Spin />
          </div>
        </main>
      </Modal>
    )
  }

  const isDisabledPay = PAYMENT_STATE.CANCELED === customerReceiptStatus || PAYMENT_STATE.SUCCESS === customerReceiptStatus || PAYMENT_STATE.FAILED === customerReceiptStatus;
  const arrElemt = screens.md ? (
    [
      <Button
        key="pay"
        type="primary"
        disabled={isDisabledPay}
        onClick={() => {
          Modal.confirm({
            title: translation('receipt.confirmPayment'),
            okText: translation('receipt.confirm'),
            cancelText: translation('receipt.cancel'),
            onOk: () => {
              // Xử lý thanh toán ở đây
              updateReceipt({ customerReceiptStatus: PAYMENT_STATE.SUCCESS })
            },
          });
        }}
      >
        {translation('receipt.pay')}
      </Button>,
      <Button
        key="cancel"
        danger
        disabled={isDisabledPay}
        onClick={() => {
          Modal.confirm({
            title: translation('receipt.confirmCancellation'),
            okText: translation('receipt.confirm'),
            cancelText: translation('receipt.cancel'),
            onOk: () => {
              updateReceipt({ customerReceiptStatus: PAYMENT_STATE.CANCELED })
            },
          });
        }}
      >
        {translation('receipt.cancelBill')}
      </Button>,
      <Button key="back" onClick={props.onCancel}>{translation('receipt.goBack')}</Button>,
      <Button
        key="submit"
        type="primary"
        onClick={() => {
          form.submit();
        }}
      >
        {translation('scheduleSetting.save')}
      </Button>
    ]
  ) : (
    <Row gutter={[8, 8]} justify="space-between">
      <Col span={12}>
        <Button
          key="pay"
          type="primary"
          disabled={isDisabledPay}
          onClick={() => {
            Modal.confirm({
              title: translation('receipt.confirmPayment'),
              okText: translation('receipt.confirm'),
              cancelText: translation('receipt.cancel'),
              onOk: () => {
                // Xử lý thanh toán ở đây
                updateReceipt({ customerReceiptStatus: PAYMENT_STATE.SUCCESS })
              },
            });
          }}
          block
        >
          {translation('receipt.pay')}
        </Button>
      </Col>
      <Col span={12}>
        <Button
          key="cancel"
          danger
          disabled={isDisabledPay}
          onClick={() => {
            Modal.confirm({
              title: translation('receipt.confirmCancellation'),
              okText: translation('receipt.confirm'),
              cancelText: translation('receipt.cancel'),
              onOk: () => {
                updateReceipt({ customerReceiptStatus: PAYMENT_STATE.CANCELED })
              },
            });
          }}
          block
        >
          {translation('receipt.cancelBill')}
        </Button>
      </Col>
      <Col span={12}>
        <Button key="back" onClick={props.onCancel} block>
          {translation('receipt.goBack')}
        </Button>
      </Col>
      <Col span={12}>
        <Button
          type="primary"
          onClick={() => form.submit()}
          block
        >
          {translation('scheduleSetting.save')}
        </Button>
      </Col>
    </Row>
  )
  return (
    <Modal
      title={translation("receipt.detail-receipt")}
      visible={props.isModalVisible}
      onOk={() => false}
      onCancel={props.onCancel}
      footer={arrElemt}
      width={1080}>
      <main className="row justify-content-center">
        <div>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={16}>
              <Form
                layout="vertical"
                form={form}
                onFinish={(formValue) => {
                  updateReceipt({
                    customerReceiptName: formValue.customerReceiptName,
                    customerReceiptEmail: formValue.customerReceiptEmail,
                    customerReceiptPhone: formValue.content,
                    customerReceiptNote: formValue.customerReceiptNote,
                  })
                }}
              >
                <Row gutter={16}>
                  {FORM_BUILDER.map((_form) => {
                    if (!_form.hasOwnProperty("isDisableEdit")) {
                      return (
                        <></>
                      )
                    }
                    if (_form.isDisableEdit && !_form.child) {
                      let defaultValue = _form.getValue();
                      if (_form.name === "paymentApproveDate") {
                        defaultValue = _form.getValue(
                          form.getFieldValue("paymentApproveDate")
                        );
                      }
                      if (!defaultValue || _form.name === "fee") {
                        defaultValue = _form.getValue(form.getFieldValue(_form.name))
                        form.setFieldsValue({
                          [_form.name]: defaultValue
                        })
                      }
                      return (
                        <Col span={_form.col || 24} {...(_form.responsive || {})} key={_form.name}>
                          <Form.Item
                            key={_form.name}
                            name={_form.name}
                            label={_form.label}
                            rules={_form.rule}
                          >
                            <Input
                              disabled
                              value={defaultValue}
                            />
                          </Form.Item>
                        </Col>
                      )
                    }

                    if (_form.name === "paymentMethod" && !_form.getValue(form.getFieldValue(_form.name))) {
                      return <></>
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
                            disabled: _form.isDisableEdit,
                            selectedPaymentOptions,
                            defaultValue: form.getFieldValue(_form.name)
                          })}
                        </Form.Item>
                        {/* {
                          _form.name === "customerReceiptContent" && contentPayment && contentPayment.indexOf("OTHER") > -1 ? (
                            <Form.Item
                              name={"customerReceiptContent-other"}
                              key={"customerReceiptContent-other"}
                              rules={[{
                                required: true,
                                message: translation("accreditation.isRequire")
                              }]}
                            >
                              <Input
                                disabled
                              />
                            </Form.Item>
                          ) : (
                            <></>
                          )
                        } */}
                      </Col>
                    )
                  })}
                </Row>
              </Form>
            </Col>
            <Col xs={24} md={8}>
              <HistoryDetailBooking />
            </Col>
          </Row>
        </div>
      </main>
    </Modal>
  );
}

export default EditReceipt;
