import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Form, Input, Select, notification, Checkbox, Row, Col, Spin, Upload } from 'antd';
import UploadItem from "./UploadItem";
import uploadService from 'services/uploadService';
import { useTranslation } from 'react-i18next';
import stationPaymentConfigsService from 'services/stationPaymentConfigsService';
import { validatorPhone } from 'helper/commonValidator';
import { QuestionCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Item } = Form;

const TYPE_MOMO = {
  BUSINESS: "business"
}

const MomoBusinessPopup = ({ isOpen, setIsOpen }) => {
  const { t: translation } = useTranslation();
  const [form] = Form.useForm();
  const inputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [urlQRCode, setUrlQRCode] = useState(null);
  const [paymentConfigs, setPaymentConfigs] = useState({});
  const [momoType, setMomoType] = useState(TYPE_MOMO.BUSINESS);

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

  const handleFormSubmit = (values) => {
    handleFormBusiness(values);
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
      }
      setIsLoading(false);
    })
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Đặt dữ liệu vào form khi có thông tin từ API
    form.setFieldsValue(paymentConfigs?.momoBusinessConfigs);
    return;
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

  // if (!isOpen) {
  //   return false;
  // }

  return (
    <>
      {/* <Modal
        title={translation('setting.momoPopup.titleBusiness')}
        visible={isOpen}
        onCancel={handleCloseModal}
        footer={null}
      > */}
        {isLoading ? (
          <Spin />
        ) : (
          <Form onFinish={handleFormSubmit} layout="vertical" form={form}>
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
            <Item>
              <Checkbox.Group style={{ width: '100%' }} disabled defaultValue={[1, 2, 3]}>
                <Row gutter={[16, 16]}>
                  <Col xs={24} lg={24} xl={12}>
                    <Checkbox value={1}>{translation("setting.payment.options.domesticcard")}</Checkbox>
                  </Col>
                  <Col xs={24} lg={24} xl={12}>
                    <Checkbox value={2}>{translation("setting.payment.options.visaMasterJcb")}</Checkbox>
                  </Col>
                  <Col xs={24} lg={24} xl={12}>
                    <Checkbox value={3}>{translation("setting.payment.options.momoWallet")}</Checkbox>
                  </Col>
                </Row>
              </Checkbox.Group>
            </Item>
            <Item>
              <Button type="primary" htmlType="submit">
                {translation('save')}
              </Button>
            </Item>
          </Form>
        )}
      {/* </Modal> */}
    </>
  );
};

export default MomoBusinessPopup;
