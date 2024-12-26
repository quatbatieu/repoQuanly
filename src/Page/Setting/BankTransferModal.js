import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal, Form, Input, Select , Spin , notification } from 'antd';
import axios from 'axios';
import { EditOutlined, BankOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { generalStringConversion } from 'helper/stringUtils';
import stationPaymentConfigsService from 'services/stationPaymentConfigsService';

const { Option } = Select;
const { Item } = Form;

const BankTransferModal = ({ isOpen, setIsOpen }) => {
  const [form] = Form.useForm();
  const inputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bankJson, setBankJson] = useState([]);
  const [paymentConfigs, setPaymentConfigs] = useState({});
  const [qrCode, setQrCode] = useState()
  const { t: translation } = useTranslation();
  const fetchData = async () => {
    setIsLoading(true);
    stationPaymentConfigsService.detail({}).then(result => {
      if (result) {
        setPaymentConfigs(result)
        if(result?.bankConfigs?.length){
          setQrCode(result?.bankConfigs[0].qrCodeBanking)
          form.setFieldsValue({ ...result?.bankConfigs[0] })
        }
      }
      setIsLoading(false);
    }).catch(err => setIsLoading(false))
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleGetBack = () => {
    axios.get('/atm/bank.json')
      .then(response => {
        setBankJson(response.data.banksnapas);
      })
  }

  useEffect(() => {
    handleGetBack();
  }, [])

  useEffect(() => {
    // Đặt dữ liệu vào form khi có thông tin từ API
    let data = paymentConfigs?.bankConfigs
    let paymentConfigsData = data?.map((item) => {
      return form.setFieldsValue(item)
    })
    return;
  }, [paymentConfigs]);

  const handleBankTransferModalCancel = () => {
    setIsOpen(false);
  };

  const handleChangeBank = (value) => {
   let newValue = value.split(",")
   let formValue = form.getFieldValue()
   form.setFieldsValue({...formValue, bankId: newValue[0], bankName: newValue[1]})
  }
  const handleBankTransferModalSubmit = (values) => {
    setIsLoading(true);
    stationPaymentConfigsService.updateBankConfigs({
      bankConfigs: [{
        ...values
      }]
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
    });
    // Thực hiện xử lý submit form tại đây
  };

  const filterBankOptions = (inputValue, option) => {
    const normalizedInput = generalStringConversion(inputValue);
    const normalizedBankLabel = generalStringConversion(option.value);
    return normalizedBankLabel.includes(normalizedInput);
  };

  // if(!isOpen) {
  //  return false;
  // }

  return (
    <div>
      {/* <Modal
        visible={isOpen}
        title={translation('setting.bankTransferModal.title')}
        onCancel={handleBankTransferModalCancel}
        footer={[
          <Button key="cancel" onClick={handleBankTransferModalCancel}>
            {translation('setting.bankTransferModal.cancelButton')}
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            {translation('setting.bankTransferModal.saveButton')}
          </Button>,
        ]}
      > */}
        {isLoading ? (
          <Spin />) : (
          <Form form={form} onFinish={handleBankTransferModalSubmit} layout="vertical">
            <Form.Item
              label={translation('setting.bankTransferModal.accountNameLabel')}
              name="accountName"
              rules={[{ required: true, message: translation('setting.bankTransferModal.required') }]}
            >
              <Input placeholder={translation('setting.bankTransferModal.accountNamePlaceholder')} ref={inputRef} autoFocus />
            </Form.Item>
              <Form.Item
                name="bankId"
                style={{display:'none'}}
              >
              </Form.Item>
            <Form.Item
              label={translation('setting.bankTransferModal.accountNumberLabel')}
              name="accountNumber"
              rules={[{ required: true, message: translation('setting.bankTransferModal.required') }]}
            >
              <Input placeholder={translation('setting.bankTransferModal.accountNumberPlaceholder')} />
            </Form.Item>
            <Form.Item
              label={translation('setting.bankTransferModal.bankNameLabel')}
              name="bankName"
              rules={[{ required: true, message: translation('setting.bankTransferModal.required') }]}
            >
              <Select
                placeholder={translation('setting.bankTransferModal.bankNamePlaceholder')}
                filterOption={filterBankOptions}
                showSearch
                onChange={handleChangeBank}
              >
                {bankJson?.map((bank) => {
                  let bankInfo = [bank.bankId, bank.shortName]
                  bankInfo = bankInfo.toString()
                  return (
                  <Option key = {bank.shortName} value={bankInfo} className='d-flex align-items-center' style={{ height: 50 }}>
                    {bank.logo && (
                      <div className='d-flex align-items-center'>
                        <img src={bank.logo} alt={bank.shortName} height="24" className='me-1' />
                        <span>{bank.shortName}</span>
                      </div>
                    )}
                    {!bank.logo &&
                      <div className='d-flex align-items-center'>
                        <span>{bank.shortName}</span>
                      </div>
                    }
                  </Option>
                )})}
              </Select>
            </Form.Item>
            <>
            <div>
              <p>{translation('setting.momoPopup.qrCode')}</p>
                <img src={qrCode}  height="160" width='160' className='me-1' />
              </div>
            </>
            <Item className='mt-2'>
              {/* <Button style={{marginRight:'10px'}} key="cancel" onClick={handleBankTransferModalCancel}>
                {translation('setting.bankTransferModal.cancelButton')}
              </Button> */}
              <Button key="submit" type="primary" onClick={() => form.submit()}>
                {translation('setting.bankTransferModal.saveButton')}
              </Button>
            </Item>
          </Form>
        )}
      {/* </Modal> */}
    </div>
  );
};

export default BankTransferModal;
