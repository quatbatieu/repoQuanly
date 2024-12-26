import React, { useEffect, useState } from 'react';
import { LeftOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { Button, Card, Form, Input, Switch, Row, Col, Checkbox, notification, Tag } from 'antd';
import { useForm } from 'antd/lib/form/Form';

import './TelegramThirdParty.scss';
import { useTranslation } from 'react-i18next';
import ThirdPartyIntegration from 'services/thirdPartyIntegrationService';

const TelegramThirdParty = ({ id, setOpenContent,setId }) => {
  const { t: translation } = useTranslation();
  const [form] = useForm();
  const history = useHistory();
  const [loading, setLoading] = useState(false)
  const [isActive, setIsActive] = useState(false);


  useEffect(() => {
    id && handleGetData();
  }, [id]);

  const handleGetData = async () => {
    try {
      setLoading(true)
      const res = await ThirdPartyIntegration.getThirdPartyById({ id });
      const partyRequiredData = JSON.parse(res?.partyRequiredData || "{}");
      const integrationMetadata = JSON.parse(res?.integrationMetadata || "{}");
      form.setFieldsValue({
        groupId: partyRequiredData?.telegramChatId,
        botToken: partyRequiredData?.telegramBotToken,
        reportAppointmentCount: integrationMetadata?.enableDailyScheduleReport,
        notifyNewAppointment: integrationMetadata?.enableNotifyNewSchedule,
        notifyNewDocument: integrationMetadata?.enableNotifyNewSystemDocument,
        isConnected: res.partyActiveStatus,
        isEnable: res?.partyEnableStatus
      });
      setIsActive(res.partyActiveStatus)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  };

  const handleSubmit = async (typeSubmit) => {
    try {
      await form.validateFields();
      switch (typeSubmit) {
        case "submit":
          handleUpdateConfig();
          break;
        default:
          handleConnect(await handleTestTelegram())
          break;
      }
    } catch (error) {
    }
  };

  const handleUpdateConfig = async () => {
    try {
      const values = await form.getFieldsValue();
      const isConnected = await handleTestTelegram(false)
      handleConnect(isConnected)
      if(!isConnected){
        notification['error']({
          message: "",
          description: translation('telegram.error_connect')
        })
        return
      }
      const payload = {
        data: {
          partyRequiredData: {
            telegramBotToken: values.botToken,
            telegramChatId: values.groupId,
          },
          partyActiveStatus: values.isEnable ? 1 : 0,
          integrationMetadata: {
            enableDailyScheduleReport: values.reportAppointmentCount ? 1 : 0,
            enableNotifyNewSchedule: values.notifyNewAppointment ? 1 : 0,
            enableNotifyNewSystemDocument: values.notifyNewDocument ? 1 : 0
          }
        }
      };
      const res = await ThirdPartyIntegration.updateConfigsTelegram(payload);
      if (res?.data?.length) {
        setId(res?.data[0])
      }
      notification["success"]({
        message: "",
        description: translation("telegram.updateSuccess"),
      });
    } catch (error) {
      notification['error']({
        message: "",
        description: translation('landing.error')
      })
    }
  };

  const handleTestTelegram = async (showError = true) => {
    try {
      const values = await form.getFieldsValue();
      const payload = {
        "telegramBotToken": values.botToken,
        "telegramChatId": values.groupId,
      };
      await ThirdPartyIntegration.testConfigsTelegram(payload);
      showError && notification["success"]({
        message: "",
        description: translation("telegram.successMessage"),
      });
      return 1
    } catch (error) {
      showError && notification['error']({
        message: "",
        description: translation('telegram.error_connect')
      })
      return 0
    }
  };

  const handleConnect = (value)=>{
    form.setFieldsValue({isConnected:value})
  }

  return (
    <div className='telegram-noti'>
      <Button type="default" icon={<LeftOutlined />} onClick={() => { setOpenContent("") }}>
      </Button>
      <Card loading={loading} className='telegram-noti_content'>
        <div className='section-title mb-2'>{translation('telegram.sectionTitle')}</div>
        <a className='' target={"_blank"} href="https://ttdk-organization.gitbook.io/huong-dan-quan-ly-trung-tam/quan-ly-trung-tam/11.-huong-dan-cai-dat-nhan-thong-bao-qua-telegram" type="link">
          {translation('telegram.installGuide')}
        </a>
        <div>
        <a className='' target={"_blank"} href="https://telegram.org/faq" type="link">
          {translation('telegram.moreDetail')}
        </a>
        </div>
        <div className='mt-2'>
          <Form form={form} onSubmit={handleSubmit} layout="vertical">
          {() => (
              <div>
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={{ span: 12 }} xl={{ span: 8 }}>
                <Form.Item label={translation('telegram.active')} name="isEnable">
                  <Switch defaultChecked={isActive} />
                </Form.Item>
                <Form.Item
                  required
                  label={translation('telegram.groupId')}
                  name="groupId"
                  rules={[
                    {
                      required: true,
                      message: translation('telegram.groupIdValidation'),
                    },
                  ]}
                >
                  <Input type="text" />
                </Form.Item>
                <Form.Item
                  required
                  label={translation('telegram.botToken')}
                  name="botToken"
                  rules={[
                    {
                      required: true,
                      message: translation('telegram.botTokenValidation'),
                    },
                  ]}
                >
                  <Input type="text" />
                </Form.Item>
              </Col>
              <Col xs={24} lg={{ span: 12 }} xl={{ span: 16 }}>
                <div className='telegram-check'>{translation('telegram.notificationTypes')}</div>
                <Form.Item
                  className='telegram-check'
                  name="reportAppointmentCount"
                  valuePropName="checked"
                >
                  <Checkbox>{translation('telegram.reportAppointmentCount')}</Checkbox>
                </Form.Item>
                <Form.Item
                  className='telegram-check'
                  name="notifyNewAppointment"
                  valuePropName="checked"
                >
                  <Checkbox>{translation('telegram.notifyNewAppointment')}</Checkbox>
                </Form.Item>
                <Form.Item
                  className='telegram-check'
                  name="notifyNewDocument"
                  valuePropName="checked"
                >
                  <Checkbox>{translation('telegram.notifyNewDocument')}</Checkbox>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item className='pt-1' label={translation('telegram.connectionStatus')}>
              <Tag color={form.getFieldValue("isConnected") ? 'green' : ''}>
                {form.getFieldValue("isConnected") ? translation('telegram.connected') : translation('telegram.notConnected')}
              </Tag>
            </Form.Item>
            <Button style={{ marginRight: 10 }} onClick={() => handleSubmit("submit")} className='mr-2' type="primary" htmlType="submit">{translation('telegram.updateButton')}</Button>
            <Button onClick={() => handleSubmit("")} type="submit" htmlType="button">{translation('telegram.testButton')}</Button>
            </div>
          )}
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default TelegramThirdParty;
