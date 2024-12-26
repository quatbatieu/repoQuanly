import React, { useEffect, useState } from 'react';
import { LeftOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { Button, Card, Form, Input, Switch, Row, Col, Checkbox, notification, Tag, Select } from 'antd';
import { useForm } from 'antd/lib/form/Form';

import './TingeeThirdParty.scss';
import { useTranslation } from 'react-i18next';
import ThirdPartyIntegration from 'services/thirdPartyIntegrationService';
import Axios from 'axios';
import { generalStringConversion } from 'helper/stringUtils';
import Paragraph from 'antd/lib/typography/Paragraph';
import { HOST } from 'constants/url';
import { getBanksLocal } from 'services/bankService';
import tingeeBanner from '../../assets/icons/tingeeAdvertisement.png'
import { useSelector } from 'react-redux';

const { Option } = Select;

const BANK_SUPPORT_BY_TINNGE = ["OCB", "MB", "BIDV"]

const TingeeThirdParty = ({ id, setOpenContent, setId }) => {
  const { t: translation } = useTranslation();
  const [form] = useForm();
  const history = useHistory();
  const [bankJson, setBankJson] = useState([]);
  const [loading, setLoading] = useState(false)
  const user = useSelector(state => state.member)

  useEffect(() => {
    id && handleGetData();
    handleGetBank()
  }, [id]);

  const handleGetBank = async () => {
    const response = await getBanksLocal()
    setBankJson(response.data?.banksnapas?.filter(bank => BANK_SUPPORT_BY_TINNGE.includes(bank.shortName)));
  }

  const handleGetData = async () => {
    try {
      setLoading(true)
      const res = await ThirdPartyIntegration.getThirdPartyById({ id });
      handleSetupData(res)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  };

  function normalizeTingeeBankName(bankName) {
    //map lai values MB bank, tren tingee MB = MBB
    if (bankName === "MB") {
      return "MBB";
    }
    return bankName;
  }
  function denormalizeTingeeBankName(bankName) {
    //map lai values MB bank, tren tingee MB = MBB
    if (bankName === "MBB") {
      return "MB";
    }
    return bankName;
  }

  const handleSetupData = (res) => {
    const partyRequiredData = JSON.parse(res?.partyRequiredData || "{}");
    const integrationMetadata = JSON.parse(res?.integrationMetadata || "{}");
    form.setFieldsValue({
      groupId: partyRequiredData?.telegramChatId,
      botToken: partyRequiredData?.telegramBotToken,
      secretKeyTingee: partyRequiredData.secretKeyTingee,
      bankAccountNumber: partyRequiredData.bankAccountNumber,
      bankName: denormalizeTingeeBankName(partyRequiredData.bankName),
      isConnected: res.partyActiveStatus,
      isEnable: res?.partyEnableStatus,
      qrCodeImage: integrationMetadata?.qrCodeImage,
      clientIdTingee: res?.clientIdThridParty
    });
  }

  const handleTestTelegram = async (showError = true) => {
    try {
      const values = await form.getFieldsValue();
      const payload = {
        "telegramBotToken": values.botToken,
        "telegramChatId": values.groupId,
      };
      await ThirdPartyIntegration.testConfigsTelegram(payload);
      return 1
    } catch (error) {
      showError && notification['error']({
        message: "",
        description: translation('tingee.connectTelegramError')
      })
      return 0
    }
  };

  const handleSubmit = async () => {
    await form.validateFields();
    handleUpdateConfig();
  };

  const handleUpdateConfig = async () => {
    try {
      const values = await form.getFieldsValue();
      const testSuccess = await handleTestTelegram()
      if(!testSuccess) return
      const payload = {
        data: {
          partyRequiredData: {
            telegramBotToken: values.botToken,
            telegramChatId: values.groupId,
            secretKeyTingee: values.secretKeyTingee,
            bankAccountNumber: values.bankAccountNumber,
            bankName: normalizeTingeeBankName(values.bankName)
          },
          partyEnableStatus: values.isEnable ? 1 : 0,
          clientIdThridParty: values.clientIdTingee,
        }
      };
      const res = await ThirdPartyIntegration.updateConfigsTingee(payload);
      //Nếu là lần đầu tiên cập nhật, thì sẽ update lại id
      if (res?.data?.length) {
        setId(res?.data[0])
      }
      else {
        handleGetData()

      }
      notification["success"]({
        message: "",
        description: translation("tingee.updateSuccess"),
      });
    } catch (error) {
      notification['error']({
        message: "",
        description: translation('tingee.updateError')
      })
    }
  };

  const filterBankOptions = (inputValue, option) => {
    const normalizedInput = generalStringConversion(inputValue);
    const normalizedBankLabel = generalStringConversion(option.value);
    return normalizedBankLabel.includes(normalizedInput);
  };

  const handleChangeBank = (value) => {
    let newValue = value.split(",")
    let formValue = form.getFieldValue()
    form.setFieldsValue({ ...formValue, bankId: newValue[0], bankName: newValue[1] })
  }

  return (
    <div className='tingee-noti'>
      <Button type="default" icon={<LeftOutlined />} onClick={() => { setOpenContent("") }}>
      </Button>
      <Card loading={loading} className='telegram-noti_content'>
        <div className='section-title mb-2'>{translation('tingee.sectionTitle')}</div>
        <div className='mt-2'>
          <Form load form={form} onSubmit={handleSubmit} layout="vertical">
            {() => (
              <div>
                <Row gutter={[16, 16]}>
                  <Col xs={{order:1,span:24}}  md={{order:2,span:14}} span={14}>
                    <img style={{ width: "100%" }} src={tingeeBanner} alt="Banner" className='banner-image' />
                  </Col>
                  <Col  xs={{order:2,span:24}}  md={{order:1,span:10}} span={10} >
                    <Card
                      className='telegram-noti_content'
                      title=
                      {<div className='d-flex'>
                        {translation('tingee.settingInforTingee')}
                        <Button className='flex-center' href='https://docs.tingee.vn/v.-tich-hop-phan-mem/5.1.-tich-hop-webhook' target='_blank' type='link' icon={<QuestionCircleOutlined />
                        } />
                      </div>}

                    >
                      <Form.Item
                        required
                        label={translation("tingee.secretToken")}
                        name="secretKeyTingee"
                        rules={[
                          {
                            required: true,
                            message: translation('tingee.validateRequired'),
                          },
                        ]}
                      >
                        <Input type="text" placeholder={translation("tingee.secretToken")} />
                      </Form.Item>
                      <Form.Item
                        required
                        label={translation("tingee.clientId")}
                        name="clientIdTingee"
                        rules={[
                          {
                            required: true,
                            message: translation('tingee.validateRequired'),
                          },
                        ]}
                      >
                        <Input type="text" placeholder={translation("tingee.clientId")} />
                      </Form.Item>
                    </Card>
                    <Card className='telegram-noti_content' title={translation('tingee.settingInforBank')}>

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
                              <Option key={bank.shortName} value={bankInfo} className='d-flex align-items-center' style={{ height: 50 }}>
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
                            )
                          })}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        label={translation('setting.bankTransferModal.accountNumberLabel')}
                        name="bankAccountNumber"
                        rules={[{ required: true, message: translation('setting.bankTransferModal.required') }]}
                      >
                        <Input placeholder={translation('setting.bankTransferModal.accountNumberPlaceholder')} />
                      </Form.Item>
                    </Card>
                    <Card className='telegram-noti_content'
                      title={<div className='d-flex'>
                        {translation('tingee.settingInforTelegram')}
                        <Button className='flex-center'  href='https://ttdk-organization.gitbook.io/huong-dan-quan-ly-trung-tam/quan-ly-trung-tam/11.-huong-dan-cai-dat-nhan-thong-bao-qua-telegram' target='_blank' type='link' icon={<QuestionCircleOutlined />
                        } />
                      </div>}
                    >

                      <Form.Item
                        required
                        label={translation('telegram.groupId')}
                        name="groupId"
                        rules={[
                          {
                            required: true,
                            message: translation('tingee.validateRequired'),
                          },
                        ]}
                      >
                        <Input type="text" placeholder={translation('telegram.groupId')} />
                      </Form.Item>
                      <Form.Item
                        required
                        label={translation('telegram.botToken')}
                        name="botToken"
                        rules={[
                          {
                            required: true,
                            message: translation('tingee.validateRequired'),
                          },
                        ]}
                      >
                        <Input type="text" placeholder={translation('telegram.botToken')} />
                      </Form.Item>
                    </Card>
                    <Card className='telegram-noti_content'>

                      <Form.Item
                        className='mt-2'
                        required
                        label={translation("tingee.webhook")}
                        name="hook"
                      >
                        <Paragraph type='success' copyable>{`${HOST}/ThirdParty/TingeeWebhook/${user?.stationCode}`}</Paragraph>
                      </Form.Item>
                      <div className='mt-2'>
                        <span>{translation("tingee.qrCode")}</span>
                        <div>
                          <a href='#' type='link' > {translation("tingee.instructTestFeature")}</a>
                        </div>
                        <img src={form.getFieldValue("qrCodeImage")} height="160" width='160' className='me-1' />

                      </div>
                      <Col span={24}>
                        <Form.Item label={translation('telegram.active')} name="isEnable" valuePropName="checked">
                          <Switch />
                        </Form.Item></Col>
                      <Form.Item className='pt-1' label={translation('telegram.connectionStatus')}>
                        <Tag color={form.getFieldValue("isConnected") ? 'green' : ''}>
                          {form.getFieldValue("isConnected") ? translation('telegram.connected') : translation('telegram.notConnected')}
                        </Tag>
                      </Form.Item>
                      <Button style={{ marginRight: 10 }} onClick={() => handleSubmit("submit")} className='mr-2' type="primary" htmlType="submit">{translation('telegram.updateButton')}</Button>
                    </Card>
                  </Col>
                </Row>
              </div>
            )}
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default TingeeThirdParty;
