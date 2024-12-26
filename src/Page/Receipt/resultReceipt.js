import { Button, notification } from 'antd'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { getFormBuilder, initValuePlainText } from './common'
import ReceiptionService from '../../services/receiptionService'

function ResultReceipt() {
  const { t: translation } = useTranslation()
  const history = useHistory()
  const query = new URLSearchParams(window.location.search);
  const receiptRef = query.get("vnp_TxnRef")
  const [formValue, setFormValue] = useState()
  const FORM_BUILDER = getFormBuilder(translation)

  useEffect(() => {
    if (receiptRef) {
      ReceiptionService.getDetailByRef(receiptRef)
        .then(res => {
          if (res) {
            if (res.customerReceiptContent.indexOf("OTHER") > -1) {
              res.customerReceiptContent = res.customerReceiptContent.split(";")
              res['customerReceiptContent-other'] = res.customerReceiptContent[1]
              res.customerReceiptContent = res.customerReceiptContent[0]
            }
            setFormValue(res)
          } else {
            notification.error({
              message: "",
              description: translation("receipt.invalid_receipt")
            })
          }
        })
    } else {
      notification.error({
        message: "",
        description: translation("receipt.invalid_receipt")
      })
    }
  }, [receiptRef])

  return (
    <main className='create_receipt'>
      {
        (formValue && receiptRef) ? (
          <div className='row'>
            <div className="col-12 col-md-3" />
            <div className='col-12 col-md-6 create_receipt-body'>
              <div id="order">
                <div className='section-title text-center mb-3 title'>{translation("receipt.verify_info_receipt")}</div>
                {
                  FORM_BUILDER.map(_form => {
                    if (_form.isPlainText) {
                      return (
                        <div className='row create_receipt-body-item'>
                          <div className='col-6'>{_form.label}:&nbsp;</div>
                          <div className="col-6">
                            {initValuePlainText(_form, formValue)}
                          </div>
                        </div>
                      )
                    } else {
                      return <></>
                    }
                  })
                }
              </div>
              <div className="create_receipt-footer">
                <Button
                  onClick={() => history.push('/create-receipt')}
                  className='m-1'
                >{translation("receipt.close")}</Button>
                <Button
                  className='m-1'
                  type="primary"
                  onClick={window.print}
                >{translation("receipt.print")}</Button>
              </div>
            </div>
            <div className="col-12 col-md-3" />
          </div>
        ) : (
          <div className='text-error'>{translation("receipt.invalid_receipt")}</div>
        )
      }
    </main >
  )
}

export default ResultReceipt