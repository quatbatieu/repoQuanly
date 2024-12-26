import {
  Input,
  InputNumber,
  Radio,
  Checkbox,
  Row,
  DatePicker,
  Col,
  Space,
} from "antd"
import React from "react"
import moment from 'moment'
import { number_to_price } from "../../helper/common";
import { CreditCardOutlined } from '@ant-design/icons';
import { getPaymentStatusList } from "constants/receipt";
import { validatorPhone , validatorEmailAllowEmpty } from "helper/commonValidator";
import { optionPaymentTypes } from "constants/receipt";
import { DATE_DISPLAY_FORMAT_HOURS_SECONDS } from "constants/dateFormats";




const FEE = 3;
const EXTRA_FEE = 1000; // 1k
const MIN_PLATE_NUMBER = 6;
const MAX_PLATE_NUMBER = 14; 

export const getReceiptionContent = (translation) => [
  {
    label: translation("receipt.INSPECTION_FEE"),
    value: "INSPECTION_FEE"
  },
  {
    label: translation("receipt.ROAD_FEE"),
    value: "ROAD_FEE"
  },
  {
    label: translation("receipt.INSURANCE"),
    value: "INSURANCE"
  },
  {
    label: translation("receipt.OTHER"),
    value: "OTHER"
  }
]

export const PAYMENT_METHOD = [
    // {value: 'direct', label : 'Tiền mặt'},
    {value: undefined, label: 'Tất cả phương thức'},
    {value: 'cash', label: 'Tiền mặt'},
    {value: 'atm', label:  'Atm/bank'},
    {value: 'vnpay', label: 'Vnpay'},
    {value: 'momo', label: 'Momo cá nhân'},
    {value: 'creditcard', label: 'Visa'},
    {value: 'domesticcard', label: 'Thẻ ghi nợ nội địa'},
    {value: 'momobusiness', label: 'Momo doanh nghiệp'}
]

/**
 * isFormItem: dùng khi tạo receipt
 * isPlainText: dùng khi verify receipt
 * isDisableEdit: dùng khi edit
 */

export const getFormBuilder = (translation) => {
  const RECEIPT_CONTENT = getReceiptionContent(translation)

  return [
    {
      label: translation("receipt.customerReceiptName"),
      name: "customerReceiptName",
      child: (props = {}) => <Input {...props} autoFocus />,
      isFormItem: true,
      isPlainText: true,
      col: 12,
      responsive: { xs: 24, sm: 24, md: 12, lg: 12, xl: 12, xxl: 12 },
      isDisableEdit: true,
      rule: [
        {
          required: false, message: translation("accreditation.isRequire")
        }
      ]
    },
    {
      label: translation("receipt.license-plates"),
      name: "customerVehicleIdentity",
      child: (props = {}) => <Input {...props} />,
      col: 12,
      responsive: { xs: 24, sm: 24, md: 12, lg: 12, xl: 12, xxl: 12 },
      isDisableEdit: true,
      rule: [
        {
          required: true,
          validator: (_, value, cb) => {
            if (!value) {
              return cb(translation("accreditation.isRequire"));
            }
            if (value) {
              if ((value.length < MIN_PLATE_NUMBER || value.length > MAX_PLATE_NUMBER)) {
                return cb(translation("accreditation.licensePlateError"))
              }
              if (!(/\d/.test(value) && /[a-zA-Z]+/.test(value))) {
                return cb(translation("accreditation.licensePlateError"));
              }
              if (!/^[a-z0-9]+$/i.test(value)) {
                return cb(translation("accreditation.licensePlateError"));
              }
              return cb();
            }
          }
        }
      ],
      isFormItem: true,
      isPlainText: true
    },
    {
      label: translation("receipt.customerReceiptPhone"),
      name: "customerReceiptPhone",
      child: (props = {}) => <Input {...props} />,
      isFormItem: true,
      isPlainText: true,
      col: 12,
      responsive: { xs: 24, sm: 24, md: 12, lg: 12, xl: 12, xxl: 12 },
      isDisableEdit: true,
      rule: [
        {
          required: true,
          validator(_, value) {
            return validatorPhone(value, translation)
          }
        }
      ]
    },
    {
      label: "Email",
      name: "customerReceiptEmail",
      child: (props = {}) => <Input {...props} />,
      col: 12,
      responsive: { xs: 24, sm: 24, md: 12, lg: 12, xl: 12, xxl: 12 },
      isDisableEdit: true,
      rule: [
        {
          required: true,
          validator(_, value) {
            return validatorEmailAllowEmpty(value, translation)
          }
        }
      ],
      isFormItem: true,
      isPlainText: true
    },
    {
      label: translation("receipt.customerReceiptContent"),
      name: "customerReceiptContent",
      isDisableEdit: true,
      getValue: (value) => {
        if (!value) {
          return ""
        }
        let content = RECEIPT_CONTENT.find(_content => _content.value === value)
        if (content) {
          return RECEIPT_CONTENT.find(_content => _content.value === value).label
        } else {
          return ``
        }
      },
      child: (props = {}) => (
        <Checkbox.Group {...props} className="w-100">
          <Row gutter={8}>
            {
              RECEIPT_CONTENT.map((_content, index) => {
                return (
                  <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12} key={index}>
                    <Checkbox
                      value={_content.value}
                      key={_content.value}
                    >{_content.label}</Checkbox>
                  </Col>
                )
              })
            }
          </Row>
        </Checkbox.Group>
      ),
      isFormItem: true,
      isPlainText: true,
      rule: [
        {
          required: true, message: translation("accreditation.isRequire")
        }
      ]
    },
    {
      label: translation("receipt.customerReceiptAmount"),
      name: "customerReceiptAmount",
      child: (props = {}) => (
        <InputNumber
          {...props}
          formatter={value => value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
          parser={value => value ? value.replace(/\$\s?|(,*)/g, '') : ''}
        />
      ),
      isFormItem: true,
      isPlainText: false,
      isDisableEdit: true,
      col: 8,
      responsive: { xs: 24, sm: 12, md: 8 },
      rule: [
        {
          required: true, message: translation("accreditation.isRequire"),
        },
        {
          validator: (_, value, cb) => {
            if (parseInt(value) < 0) {
              cb(translation("receipt.invalidAmount"))
            } else {
              cb()
            }
          }
        }
      ]
    },
    // {
    //   label: translation("receipt.total"),
    //   isDisableEdit: true,
    //   name: "customerReceiptAmount",
    //   col: 6,
    //   responsive: { xs: 24, sm: 12, md: 6 },
    //   isPlainText: true,
    //   getValue: (amount) => {
    //     if (amount) {
    //       return number_to_price(amount) + " VNĐ"
    //     } else {
    //       return ""
    //     }
    //   }
    // },
    {
      label: translation("receipt.fee"),
      isDisableEdit: true,
      col: 8,
      responsive: { xs: 24, sm: 12, md: 8 },
      name: "fee",
      getValue: (value) => value ? `${number_to_price(value)} VNĐ` : `0 VNĐ`,
      isPlainText: true
    },
    {
      label: translation("receipt.paymentAmount"),
      name: "total",
      isDisableEdit: true,
      col: 8,
      responsive: { xs: 24, sm: 12, md: 8 },
      isPlainText: true,
      getValue: (amount) => {
        if (amount) {
          return number_to_price(amount) + " VNĐ"
        } else {
          return ""
        }
      }
    },
    {
      label: translation("receipt.paymentMethod"),
      name: "paymentMethod",
      isDisableEdit: true,
      getValue: (value) => {
        return optionPaymentTypes(translation).find(_content => _content.value === value)?.label || ""
      },
      child: (props = {}) => (
        <Radio.Group {...props} className="w-100 paymentMethod">
          <Row gutter={8}>
            {
              optionPaymentTypes(translation).map((_content, index) => {
                if (_content.value === props.defaultValue || (!props.defaultValue && props?.selectedPaymentOptions?.includes(_content.id))) {
                  return (
                    <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12} key={index}>
                      <Radio value={_content.value}>
                        <div className="d-flex align-items-center" style={{ height: '60px' }}>
                          {_content.icon && (
                            <span style={{ width: '40px', height: '40px', margin: 4 }} className='d-inline-flex align-items-center me-1'>
                              {_content.icon}
                            </span>
                          )}
                          {_content.imgSrc && (
                            <img src={_content.imgSrc} alt="method" className="m-1" style={{ width: 40, height: 40 }} />
                          )}
                          {_content.label}
                        </div>
                      </Radio>
                    </Col>
                  )
                } else {
                  return <></>
                }
              })
            }
          </Row>
        </Radio.Group>
      ),
      isFormItem: true,
      isPlainText: true,
      rule: [
        {
          required: true, message: translation("accreditation.isRequire")
        }
      ]
    },
    {
      label: translation("receipt.status"),
      name: "customerReceiptStatus",
      col: 12,
      responsive: { xs: 24, sm: 12, md: 12 },
      isDisableEdit: true,
      isPlainText: true,
      getValue: (value) => {
        const statusList = getPaymentStatusList(translation);
        return statusList[value ? value : "new"]
      },
      isOnlyResult: true
    },
    {
      label: translation("receipt.paymentTime"),
      name: "paymentApproveDate",
      col: 12,
      responsive: { xs: 24, sm: 12, md: 12 },
      isDisableEdit: true,
      getValue: (value) => {
        if (value) {
          return moment(value).format("DD/MM/YYYY HH:mm:ss")
        } else {
          return moment().format("DD/MM/YYYY HH:mm:ss")
        }
      },
      child: (props = {}) => {
        return (
          <DatePicker
            className="w-100"
            {...props}
            format={DATE_DISPLAY_FORMAT_HOURS_SECONDS}
            showTime
          />
        )
      },
      isPlainText: true,
      isOnlyResult: true
    },
    {
      label: translation("receipt.detail-content"),
      name: "customerReceiptNote",
      child: (props = {}) => <Input.TextArea {...props} autoSize={{ minRows: 4 }} />,
      isFormItem: true,
      isDisableEdit: false,
      isPlainText: true,
      rule: [
        {
          required: true, message: translation("accreditation.isRequire")
        }
      ]
    }
  ]
}

export const initValuePlainText = (formItem, formValue , translation) => {
  const RECEIPT_CONTENT = getReceiptionContent(translation)
  switch (formItem.name) {
    case "total":
      return formItem.getValue(formValue["customerReceiptAmount"]);
    case "fee":
      return formItem.getValue(parseInt(formValue["customerReceiptAmount"] * FEE / 100) + EXTRA_FEE);
    case "customerReceiptContent":
      const contentPayment = formValue["customerReceiptContent-other"]
      if (contentPayment) {
        return `${formItem.getValue(formValue[formItem.name])} - ${contentPayment}`
      } else {
        return RECEIPT_CONTENT.filter(item => formValue[formItem.name].includes(item.value)).map(item => item.label).join(', ');
      }
    default:
      if (formItem.getValue) {
        return formItem.getValue(formValue[formItem.name]);
      } else {
        return formValue[formItem.name];
      }
  }
}