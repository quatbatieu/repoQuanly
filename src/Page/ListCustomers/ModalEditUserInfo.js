import React, { useEffect } from "react"
import { Modal, Form, Input, Button, DatePicker, InputNumber } from 'antd'
import { useTranslation } from "react-i18next"
import { validatorPlateNumber } from "helper/licensePlateValidator";
import { validatorEmailAllowEmpty } from "helper/commonValidator";
import moment from "moment"

const ModalEditUserInfo = ({ isEditing, toggleEditModal, onUpdateCustomer, selectedCustomer, inputRef }) => {
  const { t: translation } = useTranslation()
  const [form] = Form.useForm()

  async function handleUpdate(values) {
    const isOK = await onUpdateCustomer(values)
    if (isOK) {
      form.resetFields()
    }
  }

  useEffect(() => {
    if (selectedCustomer) {
      form.setFieldsValue({
        ...selectedCustomer,
        customerRecordCheckExpiredDate: selectedCustomer.customerRecordCheckExpiredDate ?
          moment(selectedCustomer.customerRecordCheckExpiredDate, "DD/MM/YYYY") :
          ''
      })
    }
    return () => form.resetFields()
  }, [selectedCustomer])

  return (
    <Modal
      visible={isEditing}
      title={translation('listCustomers.modalEditTitle')}
      onCancel={toggleEditModal}
      footer={null}
    >
      <Form
        form={form}
        onFinish={handleUpdate}
        layout="vertical"
        onValuesChange={(values) => {
          if (values.customerRecordPlatenumber) {
            form.setFieldsValue({
              customerRecordPlatenumber: values.customerRecordPlatenumber.toUpperCase()
            })
          }
        }}
      >
        <div className="row">
          <div className="col-12 col-md-6">
            <Form.Item
              name="customerRecordPlatenumber"
              rules={[
                {
                  validator: (_, value) => {
                    return validatorPlateNumber(value, translation)
                  }
                }
              ]}
              label={translation('listSchedules.licensePlates')}
            >
              <Input autoFocus ref={inputRef} placeholder={`${translation('listSchedules.licensePlates')}`} />
            </Form.Item>
          </div>
          <div className="col-12 col-md-6">
            <Form.Item
              name="customerRecordPhone"
              label={translation('listSchedules.phoneNumber')}
              rules={[
                {
                  message: translation('landing.invalidPhone'),
                  pattern: new RegExp(/^(|[0-9][0-9]*)$/)
                }
              ]}
            >
              <Input type="text" placeholder={`${translation('listSchedules.phoneNumber')}`} />
            </Form.Item>
          </div>
          <div className="col-12 col-md-6 mb-3">
            <Form.Item
              name="customerRecordFullName"
              label={translation('listSchedules.fullName')}
            >
              <Input placeholder={`${translation('listSchedules.fullName')}`} />
            </Form.Item>
          </div>
          <div className="col-12 col-md-6">
            <Form.Item
              name="customerRecordEmail"
              label="Email"
              rules={
                [
                  {
                    required: false,
                    validator(_, value) {
                      return validatorEmailAllowEmpty(value, translation)
                    }
                  }
                ]
              }
            >
              <Input
                placeholder={`Email`}
              />
            </Form.Item>
          </div>
          <div className="col-12 col-md-6">
            <Form.Item
              name="customerRecordCheckExpiredDate"
              label={translation('accreditation.inspectionExpireDate')}
            >
              <DatePicker className="w-100" format="DD/MM/YYYY" placeholder={`${translation('accreditation.inspectionExpireDate')}`} />
            </Form.Item>
          </div>
          <div className="col-12 col-md-6">
            <Form.Item
              name="customerRecordCheckDuration"
              label={translation('accreditation.inspectionCycle')}
            >
              <InputNumber
                min={0}
                max={99}
                formatter={value => `${value}`}
                parser={value => parseInt(value)}
                type="number"
                placeholder={`${translation('accreditation.inspectionCycle')}`}
              />
            </Form.Item>
          </div>
        </div>
        <div className="row">
          <div className="col-8 col-md-9" />
          <div className="col-3 col-md-3">
            <Form.Item shouldUpdate>
              {(values) => {
                const isError = values.getFieldsError().every(item => item.errors.length === 0)
                return (
                  <div className="d-flex justify-content-end">
                    <Button type="primary" htmlType={isError ? "submit" : "button"}>
                      {translation('listSchedules.save')}
                    </Button>
                  </div>
                )
              }}
            </Form.Item>
          </div>
        </div>
      </Form>
    </Modal>
  )
}

export default ModalEditUserInfo