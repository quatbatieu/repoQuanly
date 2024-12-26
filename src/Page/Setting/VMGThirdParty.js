import React, { useEffect, useState } from "react";
import { LeftOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
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
import tingeeBanner from "../../assets/icons/tingeeAdvertisement.png";
import "./TelegramThirdParty.scss";
import { useTranslation } from "react-i18next";
import ThirdPartyIntegration from "services/thirdPartyIntegrationService";
import "./TingeeThirdParty.scss";

const VMGThirdParty = ({ id, setOpenContent, setId }) => {
  const { t: translation } = useTranslation();
  const [form] = useForm();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isTested, setIsTested] = useState(true);
  const [isActive, setIsActive] = useState(false);
  useEffect(() => {
    id && handleGetData();
  }, [id]);

  const handleGetData = async () => {
    try {
      setLoading(true);
      const res = await ThirdPartyIntegration.getThirdPartyById({ id });
      const partyRequiredData = JSON.parse(res?.partyRequiredData || "{}");
      form.setFieldsValue({
        vmgBrandName: partyRequiredData?.vmgBrandName,
        vmgToken: partyRequiredData?.vmgToken,
        isConnected: res.partyActiveStatus,
        isEnable: res?.partyEnableStatus,
      });
      setIsActive(res.partyActiveStatus)
      setIsTested(true)
      setLoading(false);
    } catch (error) {
      setLoading(false);
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
          handleConnect(await handleTestVMG());
          break;
      }
    } catch (error) {}
  };

  const handleUpdateConfig = async () => {
    try {
      const values = await form.getFieldsValue();
      const payload = {
        data: {
          partyRequiredData: {
            vmgToken: values.vmgToken,
            vmgBrandName: values.vmgBrandName,
          },
          partyActiveStatus: values.isEnable ? 1:0,
          integrationMetadata: {},
        },
      };
      const res = await ThirdPartyIntegration.updateConfigsVMG(payload);
      if (res?.data?.length) {
        setId(res?.data[0]);
      }
      notification["success"]({
        message: "",
        description: translation("telegram.updateSuccess"),
      });
      handleGetData()
    } catch (error) {
      notification["error"]({
        message: "",
        description: translation("landing.error"),
      });
    }
  };

  const handleConnect = (value) => {
    form.setFieldsValue({ isConnected: value });
  };

  const handleCheckError=(error)=>{
    if(error.indexOf("TokenNotValid") >= 0){
      notification["error"]({
        message: "",
        description: translation('TokenNotValid'),
      });
      return;
    }
    switch (error) {
      case "BrandnameNotValid":
        notification["error"]({
          message: "",
          description: translation(error),
        });
        break;
      case "ReceiverNotValid":
        notification["error"]({
          message: "",
          description: translation(error),
        });
        break;
      case "MsisdnNotValid":
        notification["error"]({
          message: "",
          description: translation(error),
        });
        break;
      case "AccountNotEnoughToPay":
        notification["error"]({
          message: "",
          description: translation(error),
        });
        break;
      default:
        notification["error"]({
          message: "",
          description: translation("telegram.errorMessage"),
        });
    }
  }

  const handleTestVMG = async (showError = true) => {
    try {
      const values = await form.getFieldsValue();
      const payload = {
        vmgToken: values.vmgToken,
        vmgBrandName: values.vmgBrandName,
        phoneNumber: values.phoneNumber,
      };
      await ThirdPartyIntegration.testConfigsVMG(payload);
      showError &&
        notification["success"]({
          message: "",
          description: translation("telegram.successMessage"),
        });
        setIsTested(false)
      return 1;
    } catch (error) {
      if(showError){
        handleCheckError(error.error)
      }
      setIsTested(true)
      return 0;
    }
  };

  return (
    <>
      <div className="tingee-noti">
        <Button
          type="default"
          icon={<LeftOutlined />}
          onClick={() => {
            setOpenContent("");
          }}
        ></Button>
        <Card loading={loading} className="telegram-noti_content">
          <div className="section-title mb-2">
            {translation("telegram.messaging_connection_SMS")}
          </div>
          <div className="">{translation("vmg.installGuide")}</div>
          <div>
            <a
              className=""
              target={"_blank"}
              href="https://huong-dan-ket-noi-vmg.gitbook.io/huong-dan-ket-noi-vmg/"
              type="link"
            >
              {translation("vmg.moreDetail")}
            </a>
          </div>
          <div className="mt-2 d-flex">
            <Col>
              <Form form={form} onSubmit={handleSubmit} layout="vertical">
                {() => (
                  <div>
                    <Row gutter={[16, 16]}>
                      <Col
                        xs={{ order: 1, span: 24 }}
                        md={{ order: 2, span: 14 }}
                        span={14}
                      >
                        <img
                          style={{ width: "100%",opacity:0  }}
                          src={tingeeBanner}
                          alt="Banner"
                          className="banner-image mobile-h0"
                        />
                      </Col>
                      {/* <Col xs={24} lg={{ span: 12 }} xl={{ span: 8 }}> */}
                      <Col
                        xs={{ order: 2, span: 24 }}
                        md={{ order: 1, span: 10 }}
                        span={10}
                      >
                        <Form.Item
                          label={translation("telegram.active")}
                          name="isEnable"
                        >
                          <Switch defaultChecked={isActive} />
                        </Form.Item>
                        <Form.Item
                          required
                          label={"Brand Name"}
                          name="vmgBrandName"
                          rules={[
                            {
                              required: true,
                              message: translation(
                                "vmg.BrandNameValidation"
                              ),
                            },
                          ]}
                        >
                          <Input type="text" />
                        </Form.Item>
                        <Form.Item
                          required
                          label={"Token"}
                          name="vmgToken"
                          rules={[
                            {
                              required: true,
                              message: translation("telegram.TokenValidation"),
                            },
                          ]}
                        >
                          <Input type="text" />
                        </Form.Item>
                        <Form.Item
                          className="pt-1"
                          label={translation("telegram.connectionStatus")}
                        >
                          <Tag
                            color={
                              form.getFieldValue("isConnected") ? "green" : ""
                            }
                          >
                            {form.getFieldValue("isConnected")
                              ? translation("telegram.connected")
                              : translation("telegram.notConnected")}
                          </Tag>
                        </Form.Item>
                        <div className="mb-2" style={{color:'#1890FF'}}>{translation('TestConfigs')}</div>
                        <Button
                          style={{ marginRight: 10 }}
                          onClick={() => handleSubmit("submit")}
                          className="mr-2"
                          type="primary"
                          htmlType="submit"
                          disabled={isTested}
                        >
                          {translation("telegram.updateButton")}
                        </Button>
                        <Button
                          onClick={() => setIsOpen(true)}
                          type="submit"
                          htmlType="button"
                        >
                          {translation("telegram.testButton")}
                        </Button>
                      </Col>
                    </Row>
                  </div>
                )}
              </Form>
            </Col>
          </div>
        </Card>
      </div>
      <Modal
        visible={isOpen}
        title={translation("telegram.testButton")}
        onCancel={() => setIsOpen(false)}
        footer={
          <>
            <Button onClick={() => setIsOpen(false)}>
              {translation("category.no")}
            </Button>
            <Button
              type="primary"
              onClick={() => {
                form.submit();
              }}
            >
              {translation("telegram.testButton")}
            </Button>
          </>
        }
      >
        <Form form={form} onFinish={() => handleTestVMG()} layout="vertical">
          <Form.Item
            required
            label={translation("landing.phoneNumber")}
            name="phoneNumber"
            rules={[
              {
                required: true,
                message: translation("isReq"),
              },
              {
                pattern: new RegExp(/^[0-9]*$/),
                message: translation(
                  "listCustomers.sendMessageModal.enterPhoneNumber"
                ),
              },
            ]}
          >
            <Input type="text" />
          </Form.Item>
        </Form>
        <div className="vmg_textmodal">{translation("vmg.text_modal")}</div>
      </Modal>
    </>
  );
};

export default VMGThirdParty;
