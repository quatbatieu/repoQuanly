import { Button, notification } from 'antd'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { getFormBuilder, initValuePlainText } from './common'
import ReceiptionService from '../../services/receiptionService'
import { PAYMENT_TYPE_STATE } from 'constants/receipt'

function VerifyReceipt() {
  let formValue = sessionStorage.getItem("customer_data")
  formValue = JSON.parse(formValue?.trim() || "{}")
  const { t: translation } = useTranslation()
  const history = useHistory()
  const FORM_BUILDER = getFormBuilder(translation)

  const [detailQR, setDetailQR] = useState()
  const onCreateVNPayment = (id) => {
    ReceiptionService.createVNPayQRCodeByTnx(id)
      .then(res => {
        if (res && res) {
          setTimeout(() => {
            setDetailQR(res)
          }, 1000)
        } else {
          notification.error({
            message: "",
            description: translation('landing.error')
          })
        }
      })
  }

  const onCancel = () => {
    ReceiptionService.cancelById(formValue.id).then(res => {
      if (res.isSuccess) {
        sessionStorage.removeItem("customer_data")
        history.push("/receipt")
      } else {
        notification.error({
          message: "",
          description: translation('landing.error')
        })
      }
    })
  }

  const onConfirm = () => {
    ReceiptionService.payById(formValue.id).then(res => {
      if (res.isSuccess) {
        sessionStorage.removeItem("customer_data")
        history.push("/receipt")
      } else {
        notification.error({
          message: "",
          description: translation('landing.error')
        })
      }
    })
  }

  return (
    <main className='create_receipt'>
      <div className="row">
        <div className="col-12 col-md-3" />
        <div className="col-12 col-md-6 create_receipt-body">
          <div className='section-title text-center mb-3 title'>{translation("receipt.verify_info_receipt")}</div>
          {
            FORM_BUILDER.map(_form => {
              if (_form.isPlainText && !_form.isOnlyResult) {
                return (
                  <div className='row create_receipt-body-item'>
                    <div className='col-12 col-md-6'>{_form.label}:&nbsp;</div>
                    <div className="col-12 col-md-6">
                      {initValuePlainText(_form, formValue , translation)}
                    </div>
                  </div>
                )
              } else {
                return <></>
              }
            })
          }
          <div className="create_receipt-footer">
            <Button
              className='m-1'
              type="primary"
              onClick={onConfirm}
            >{translation("receipt.pay")}</Button>
            {formValue.customerReceiptStatus && (
              <Button
                onClick={window.print}
                className='m-1'
                type="primary"
                ghost
              >{translation("receipt.print")}</Button>
            )}
            <Button
              onClick={onCancel}
              type="danger"
              className='m-1'
            >{translation("listSchedules.cancel")}</Button>
          </div>
        </div>
        <div className="col-12 col-md-3" />
      </div>
    </main>
  )
}

export default VerifyReceipt