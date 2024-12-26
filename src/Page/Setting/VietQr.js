import React, { useEffect, useState } from "react";
import { LeftOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Input,
  Switch,
  Row,
  Col,
  notification,
  Tag,
  Modal,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import { useTranslation } from "react-i18next";
import ThirdPartyIntegration from "services/thirdPartyIntegrationService";
import "./TelegramThirdParty.scss";
import "./TingeeThirdParty.scss";

const VietQr = ({ id, setOpenContent, setId }) => {
  const { t: translation } = useTranslation();
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isTested, setIsTested] = useState(true);

  useEffect(() => {
    id && handleGetData();
  }, [id]);

  const handleGetData = async () => {
    try {
      setLoading(true);
      const res = await ThirdPartyIntegration.getThirdPartyById({ id });
      const partyRequiredData = JSON.parse(res?.partyRequiredData || "{}");
      form.setFieldsValue({
        userName: partyRequiredData?.userName,
        password: partyRequiredData?.password,
        customerPay: partyRequiredData?.customerPay ?? true,
        collectionTTDK: partyRequiredData?.collectionTTDK ?? false,
        isConnected: res.partyActiveStatus ? 1 : 0,
        isEnable: res?.partyEnableStatus,
      });
      setIsActive(res.partyActiveStatus);
      setIsTested(true);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      if (!form.getFieldValue("isConnected")) {
        setIsOpen(true);
        return;
      }
      handleUpdateConfig();
    } catch (error) {}
  };

  const handleUpdateConfig = async () => {
    try {
      const values = await form.getFieldsValue();
      const payload = {
        data: {
          partyRequiredData: {
            username: values.username,
            password: values.password,
            customerPay: values.customerPay,
            collectionTTDK: values.collectionTTDK,
          },
          partyActiveStatus: values.isEnable ? 1 : 0,
          integrationMetadata: {},
        },
      };
      const res = await ThirdPartyIntegration.updateConfigsVietQR(payload);
      if (res?.data?.length) {
        setId(res?.data[0]);
      }
      notification["success"]({
        message: "",
        description: translation("vietqr.updateSuccess"),
      });
      handleGetData();
    } catch (error) {
      notification["error"]({
        message: "",
        description: translation("landing.error"),
      });
    }
  };

  const handleTestTransaction = async () => {
    try {
      const values = await form.getFieldsValue();
      const payload = {
        username: values.username,
        password: values.password,
      };
      await ThirdPartyIntegration.testConfigsVietQR(payload);
      notification["success"]({
        message: "",
        description: translation("vietqr.successMessage"),
      });
      form.setFieldsValue({ isConnected: 1 });
      setIsTested(false);
      setIsOpen(false);
    } catch (error) {
      notification["error"]({
        message: "",
        description: translation("vietqr.errorMessage"),
      });
    }
  };

  return (
    <>
      <div className="tingee-noti">
        <Button
          type="default"
          icon={<LeftOutlined />}
          onClick={() => setOpenContent("")}
        />
        <Card loading={loading} className="telegram-noti_content">
          <div className="section-title mb-2">
            {translation("vietqr.title")}
          </div>
          <Form form={form} layout="vertical">
            <Row gutter={[16, 16]}>
              <Col
                xs={{ order: 2, span: 24 }}
                md={{ order: 1, span: 10 }}
                span={10}
              >
                <Form.Item
                  required
                  label={translation("vietqr.username")}
                  name="username"
                  rules={[{ required: true, message: translation("isReq") }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  required
                  label={translation("vietqr.password")}
                  name="password"
                  rules={[{ required: true, message: translation("isReq") }]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  label={translation("vietqr.customerPay")}
                  name="customerPay"
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Switch />
                </Form.Item>
                <Form.Item
                  label={translation("vietqr.collectionTTDK")}
                  name="collectionTTDK"
                  valuePropName="checked"
                  initialValue={false}
                >
                  <Switch />
                </Form.Item>
                <Form.Item label={translation("vietqr.connectionStatus")}>
                  <Tag color={form.getFieldValue("isConnected") ? "green" : ""}>
                    {form.getFieldValue("isConnected")
                      ? translation("vietqr.connected")
                      : translation("vietqr.notConnected")}
                  </Tag>
                </Form.Item>
                <Button type="primary" onClick={handleSubmit}>
                  {translation("vietqr.save")}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>

      <Modal
        visible={isOpen}
        title={translation("vietqr.testTransaction")}
        onCancel={() => setIsOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsOpen(false)}>
            {translation("cancel")}
          </Button>,
          <Button key="test" type="primary" onClick={handleTestTransaction}>
            {translation("vietqr.sendVD")}
          </Button>,
        ]}
      >
        <p>{translation("vietqr.testTransactionMessage")}</p>
      </Modal>
    </>
  );
};

export default VietQr;
