import React, { useState, useEffect , useRef } from 'react';
import { Modal, Button, Form, Input, Select, notification, Spin, Upload } from 'antd';
import UploadItem from "./UploadItem";
import uploadService from 'services/uploadService';
import { useTranslation } from 'react-i18next';
import stationPaymentConfigsService from 'services/stationPaymentConfigsService';
import { validatorPhone } from 'helper/commonValidator';
import { QuestionCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Item } = Form;

const TYPE_MOMO = {
  PERSONAL: "personal",
  BUSINESS: "business"
}

const MomoPopup = ({ isOpen, setIsOpen }) => {
  const { t: translation } = useTranslation();
  const [form] = Form.useForm();
  const inputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [urlQRCode, setUrlQRCode] = useState(null);
  const [paymentConfigs, setPaymentConfigs] = useState({});
  const [momoType, setMomoType] = useState(TYPE_MOMO.PERSONAL);

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const customRequest = async ({ file, onSuccess, onError, onProgress }) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = async function () {
      let baseString = reader.result
      const params = {
        imageData: baseString.replace('data:' + file.type + ';base64,', ''),
        imageFormat: file.type.replace('image/', '')
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

  const handleFormBusiness = ({
    phone, QRCode,
    partnerCode, momoUrl,
    secretKey, accessKey
  }) => {
    const urlQRCode = typeof QRCode === "string" ? QRCode : QRCode?.fileList[0]?.response;
    setIsLoading(true);
    stationPaymentConfigsService.updateMomoBusinessConfigs({
      momoBusinessConfigs: {
        phone,
        QRCode: urlQRCode,
        momoUrl, secretKey,
        accessKey, partnerCode
      }
    }).then(result => {
      if (result && result.issSuccess) {
        fetchData()
        notification['success']({
          message: '',
          description: translation('setting.momoPopup.saveSuccess')
        });
      } else {
        setIsLoading(false);
        notification.error({
          message: "",
          description: translation('setting.momoPopup.saveError')
        })
      }
    })
  }

  const handleFormPersonal = ({ phone, QRCode }) => {
    const urlQRCode = typeof QRCode === "string" ? QRCode : QRCode?.fileList[0]?.response;
    setIsLoading(true);
    stationPaymentConfigsService.updateMomoPersonalConfigs({
      momoPersonalConfigs: {
        phone: phone,
        QRCode: urlQRCode
      }
    }).then(result => {
      if (result && result.issSuccess) {
        fetchData()
        notification['success']({
          message: '',
          description: translation('setting.momoPopup.saveSuccess')
        });
      } else {
        setIsLoading(false);
        notification.error({
          message: "",
          description: translation('setting.momoPopup.saveError')
        })
      }
    })
  }

  const handleFormSubmit = (values) => {
    if (TYPE_MOMO.PERSONAL === momoType) {
      handleFormPersonal(values);
      return;
    }

    if (TYPE_MOMO.BUSINESS === momoType) {
      handleFormBusiness(values);
      return;
    }

  };

  const handleMomoTypeChange = (value) => {
    setMomoType(value);
  };

  const fetchData = async () => {
    setIsLoading(true);
    stationPaymentConfigsService.detail({}).then(result => {
      if (result) {
        setPaymentConfigs(result);
      } else {
        notification.error({
          message: "",
          description: translation('setting.momoPopup.fetchError')
        })
      }
      setIsLoading(false);
    })
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Đặt dữ liệu vào form khi có thông tin từ API
    if (TYPE_MOMO.PERSONAL === momoType) {
      setUrlQRCode(paymentConfigs?.momoPersonalConfigs?.QRCode)
      form.setFieldsValue(paymentConfigs?.momoPersonalConfigs);
      return;
    }

    if (TYPE_MOMO.BUSINESS === momoType) {
      form.setFieldsValue(paymentConfigs?.momoBusinessConfigs);
      return;
    }
  }, [paymentConfigs, form, momoType]);

  const labelContent = (label, href) => {
    return (
      <div className='d-flex align-items-center'>
        <p className='mb-0'>
          {label}{' '}
        </p>
        <a href={href} className='d-flex ms-1' target='_blank'>
          <QuestionCircleOutlined />
        </a>
      </div>
    )
  };

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      setUrlQRCode(info.fileList[0].response)
      return;
    }
  };

  if(!isOpen) {
    return false;
   }

  return (
    <>
      <Modal
        title={translation('setting.momoPopup.title')}
        visible={isOpen}
        onCancel={handleCloseModal}
        footer={null}
      >
        {isLoading ? (
          <Spin />
        ) : (
          <Form onFinish={handleFormSubmit} layout="vertical" form={form}>
            <Item name="momoType" label={translation('setting.momoPopup.selectType')}>
              <Input.Group compact>
                <Item name="momoType" noStyle initialValue={momoType}>
                  <Select value={momoType} onChange={handleMomoTypeChange} className='w-100'>
                    <Option value="personal">{translation('setting.momoPopup.personal')}</Option>
                    <Option value="business">{translation('setting.momoPopup.business')}</Option>
                  </Select>
                </Item>
              </Input.Group>
            </Item>

            {momoType === TYPE_MOMO.PERSONAL && (
              <>
                <Item
                  name="phone"
                  label={translation('setting.momoPopup.phoneNumber')}
                  rules={[{
                    required: true,
                    validator(_, value) {
                      return validatorPhone(value, translation);
                    }
                  }]}
                >
                  <Input ref={inputRef} autoFocus />
                </Item>
                <Item
                  name="QRCode"
                  label={translation('setting.momoPopup.uploadQRCode')}
                  rules={[{ required: true, message: translation('isReq') }]}
                >
                  <Upload
                    accept="image/png, image/jpeg"
                    showUploadList={false}
                    customRequest={customRequest}
                    multiple={false}
                    listType="picture"
                    onChange={handleChange}
                    maxCount={1}
                  >
                    {urlQRCode ? (
                      <div style={{ width: 200 }}>
                        <img
                          src={urlQRCode}
                          alt="avatar"
                          style={{
                            width: '100%',
                          }}
                        />
                      </div>
                    ) : (
                      <div style={{ width: 200 }}>
                        <UploadItem
                          fileName={"Hinhhoso.jpg"}
                          title={""}
                          image={process.env.PUBLIC_URL + '/assets/images/upload-image.png'}
                        />
                      </div>
                    )}
                  </Upload>
                </Item>
              </>
            )}

            {momoType === TYPE_MOMO.BUSINESS && (
              <>
                <Item
                  name="partnerCode"
                  label={labelContent(translation('setting.momoPopup.partnerCode'), 'https://developers.momo.vn/v2/#/?id=key-credential')}
                  rules={[{ required: true, message: translation('isReq') }]}
                >
                  <Input ref={inputRef} autoFocus />
                </Item>
                <Item name="secretKey"
                  label={labelContent(translation('setting.momoPopup.secretKey'), 'https://developers.momo.vn/v2/#/?id=key-credential')}
                  rules={[{ required: true, message: translation('isReq') }]}
                >
                  <Input />
                </Item>
                <Item
                  name="accessKey"
                  label={labelContent(translation('setting.momoPopup.accessKey'), 'https://developers.momo.vn/v2/#/?id=key-credential')}
                  rules={[{ required: true, message: translation('isReq') }]}
                >
                  <Input />
                </Item>
              </>
            )}

            <Item>
              <Button type="primary" htmlType="submit">
                {translation('save')}
              </Button>
            </Item>
          </Form>
        )}
      </Modal>
    </>
  );
};

export default MomoPopup;
