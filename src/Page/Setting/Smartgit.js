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

const SmartgitThirdParty = ({ id, setOpenContent, setId }) => {
  const { t: translation } = useTranslation();
  const [form] = useForm();
  const history = useHistory();
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
        // oaToken: partyRequiredData?.oaToken,
        userName: partyRequiredData?.userName,
        password: partyRequiredData?.password,
        mediaCode: partyRequiredData?.mediaCode,
        senderCode: partyRequiredData?.senderCode,
        authenticationURI: partyRequiredData?.authenticationURI,
        messageURI: partyRequiredData?.messageURI,
        isConnected: res.partyActiveStatus ? 1 : 0,
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
          handleConnect(await handleTestSmartgit());
          break;
      }
    } catch (error) {}
  };

  const handleUpdateConfig = async () => {
    try {
      const values = await form.getFieldsValue();
      // const isConnected = await handleTestSmartgit(false);
      // handleConnect(isConnected); updateConfigsSmartGit
      const payload = {
        data: {
          partyRequiredData: {
            // oaToken: values.oaToken,
            userName: values.userName,
            password: values.password,
            mediaCode: values.mediaCode,
            senderCode: values?.senderCode,
            authenticationURI: values.authenticationURI,
            messageURI: values.messageURI,
          },
          partyActiveStatus: values.isEnable ? 1:0,
          integrationMetadata: {},
        },
      };
      const res = await ThirdPartyIntegration.updateConfigsSmartGit(payload);
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
    switch (error) {
      case "Phone number invalid":
        notification["error"]({
          message: "",
          description: translation('ReceiverNotValid'),
        });
        break;
      case "Zalo account not existed":
        notification["error"]({
          message: "",
          description: translation('ZaloNotValid'),
        });
        break;
      default:
        notification["error"]({
          message: "",
          description: translation("telegram.errorMessage"),
        });
    }
  }

  const handleTestSmartgit = async (showError = true) => {
    try {
      const values = await form.getFieldsValue();
      const payload = {
        // oaToken: values.oaToken,
        userName: values.userName,
        password: values.password,
        mediaCode: values.mediaCode,
        senderCode: values?.senderCode,
        authenticationURI: values.authenticationURI,
        messageURI: values.messageURI,
        phoneNumber: values.phoneNumber,
      };
      await ThirdPartyIntegration.testConfigsSmartGift(payload);
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
            {translation("smartgit.title")}
          </div>
          <div className="">{translation("smartgit.installGuide")}</div>
          <div>
            <a
              className=""
              target={"_blank"}
              href="https://huong-dan-ket-noi-smartgift.gitbook.io/huong-dan-ket-noi-smartgift"
              type="link"
            >
              {translation("smartgit.moreDetail")}
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
                          style={{ width: "100%",opacity:0 }}
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
                        {/* <Form.Item
                          required
                          label={"OA Token"}
                          name="oaToken"
                          rules={[
                            {
                              required: true,
                              message: translation(
                                "smartgit.TokenValidation"
                              ),
                            },
                          ]}
                        >
                          <Input type="text" />
                        </Form.Item> */}
                        <Form.Item
                          required
                          label={"Tài khoản (Username)"}
                          name="userName"
                          rules={[
                            {
                              required: true,
                              message: translation(
                                "smartgit.UsernameValidation"
                              ),
                            },
                          ]}
                        >
                          <Input type="text" />
                        </Form.Item>
                        <Form.Item
                          label={"Mật khẩu (Password)"}
                          name="password"
                          rules={[
                            {
                              required: true,
                              message: translation(
                                "smartgit.PasswordValidation"
                              ),
                            },
                          ]}
                        >
                          <Input type="text" />
                        </Form.Item>
                        <Form.Item
                          label={"Mã đối tác (Media Code)"}
                          name="mediaCode"
                          rules={[
                            {
                              required: true,
                              message: translation(
                                "smartgit.mediaCodeValidation"
                              ),
                            },
                          ]}
                        >
                          <Input type="text" />
                        </Form.Item>
                        <Form.Item
                          label={"Mã người gửi (Sender Code)"}
                          name="senderCode"
                          rules={[
                            {
                              required: true,
                              message: translation(
                                "smartgit.senderCodeValidation"
                              ),
                            },
                          ]}
                        >
                          <Input type="text" />
                        </Form.Item>
                        <Form.Item
                          label={"Link đăng nhập (Authentication URI)"}
                          name="authenticationURI"
                          rules={[
                            {
                              required: true,
                              message: translation(
                                "smartgit.authenticationURIValidation"
                              ),
                            },
                          ]}
                        >
                          <Input type="text" />
                        </Form.Item>
                        <Form.Item
                          label={"Link tin nhắn (Message URI)"}
                          name="messageURI"
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
        <Form
          form={form}
          onFinish={() => handleTestSmartgit()}
          layout="vertical"
        >
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

export default SmartgitThirdParty;
