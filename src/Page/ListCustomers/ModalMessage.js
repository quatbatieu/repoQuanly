import React, { useState, useEffect } from "react";
import { Form, Modal, Select, Button, Input, Radio } from "antd";
import { useTranslation } from "react-i18next";
import MessageService from "../../services/messageService";
import Handlebars from "handlebars";
import moment from "moment";
import { xoa_dau } from "../../helper/common";
import { useSelector } from "react-redux";
import { getListMessageTypesFilter } from "constants/sms";

const { Option } = Select;
const ModalMessage = ({
  visible,
  toggleMessageModal,
  onSendMessage,
  message,
}) => {
  const { t: translation } = useTranslation();
  const [temps, setTemps] = useState([]);
  const [form] = Form.useForm();
  const [SMSLength, setSMSLength] = useState("");
  const stationSetting = useSelector((state) => state.setting);
  const TYPES  = getListMessageTypesFilter(translation).filter((item) => item.value !== "");
  const [filter, setFilter] = useState({
    filter : {
      messageTemplateType: TYPES[0]?.value
    }
  });
  const FORM_DATA = {
    dateSchedule: moment().format("DD/MM/YYYY"),
    time: "7h-9h",
    customerRecordPlatenumber: "99A999999",
    customerRecordCheckExpiredDate: moment().format("DD/MM/YYYY"),
    stationsBrandname: stationSetting.stationCustomSMSBrandConfig
      ? JSON.parse(stationSetting.stationCustomSMSBrandConfig).smsBrand
      : "",
    ...stationSetting,
  };

  useEffect(() => {
    MessageService.getMessageSMSTemplate(filter).then((result) => {
      if (result && result?.templates?.length > 0) {
        const template = Handlebars.compile(result.templates[0].messageTemplateContent);
        setTemps(result.templates);
        const content = xoa_dau(template(FORM_DATA));
        form.setFieldsValue({
          customerMessageTemplateId: result.templates[0].messageTemplateId,
          customerMessageContent: result.templates[0].messageTemplateContent,
          customerMessageCategories: filter?.filter?.messageTemplateType || ""
        });
        setSMSLength(
          `${content.length} ký tự - ${Math.ceil(
            content.length / 150
          )} tin nhắn`
        );
        return;
      }

      setTemps([]);
      form.setFieldsValue({
        customerMessageTemplateId: "",
        customerMessageContent: "",
        customerMessageCategories: filter?.filter?.messageTemplateType
      });
      setSMSLength("");
    });
  }, [message, filter]);

  function changeTemplateMessage(e) {
    let typeIndex = temps.findIndex((t) => t.messageTemplateId === e);
    const template = Handlebars.compile(
      temps[typeIndex].messageTemplateContent
    );
    let messageTemplateContent = temps[typeIndex].messageTemplateContent
    const content = xoa_dau(template(FORM_DATA));
    form.setFieldsValue({
      customerMessageContent: messageTemplateContent,
      customerMessageTemplateId: e,
    });
    setSMSLength(
      `${content.length + translation('characters')} - ${Math.ceil(content.length / 150) + translation('chat.title')}`
    );
  }

  function changeMethodSendMessage(e) {
    if (!e) {
      setFilter({})
      form.setFieldsValue({
        customerMessageCategories: ""
      });
      return;
    }
    setFilter({
      filter: {
        messageTemplateType: e
      }
    })
    form.setFieldsValue({
      customerMessageCategories: e
    });
  }

  function handleSendMessage(values) {
    if (values) {
      values.stationsName = stationSetting.stationsName
      values.stationsAddress = stationSetting.stationsAddress
      values.stationsHotline = stationSetting.stationsHotline
      values.stationCode = stationSetting.stationCode
      let typeIndex = temps.find((t) => {
        return t.messageTemplateId === values.customerMessageTemplateId;
      });
      if (typeIndex) {
        values.customerMessageTemplateId = typeIndex.messageTemplateId;
        values.customerMessageCategories = typeIndex.messageTemplateType;
      } else {
        values.customerMessageTemplateId = temps[0].messageTemplateId;
      }

      if (typeIndex?.messageZNSTemplateId) {
        values.customermessageZNSTemplateId = typeIndex.messageZNSTemplateId
      }

      // if (values.customerMessageCategories === TYPES[1]) {
      //   delete values.customerMessageTemplateId;
      // }
      const status = onSendMessage(values);
      if (status) {
        form.resetFields();
      }
    }
  }

  return (
    <Modal
      width={416}
      visible={visible}
      title={translation('listCustomers.sendMessageModal.title')}
      onCancel={toggleMessageModal}
      okText={translation("listCustomers.send")}
      cancelText={translation("listCustomers.cancel")}
      footer={<div className="footers justify-content-end">
        <Button onClick={toggleMessageModal} type="link">{translation("listCustomers.cancel")}</Button>
        <Button onClick={() => form.submit()} type="primary">{translation("listCustomers.send")}</Button>
      </div>}
    >
      <Form
        onFinish={handleSendMessage}
        form={form}
      >
        {/* <label className="h5">{translation("listCustomers.category")}</label>
        <Form.Item name="customerMessageCategories">
          <Radio.Group
            name="customerMessageCategories"
            defaultValue="SMS"
            onChange={handleSelectMedia}
          >
            <Radio value="SMS">{translation("listCustomers.SMS")}</Radio>
            <Radio value="Email">{translation("listCustomers.Email")}</Radio>
          </Radio.Group>
        </Form.Item> */}
        {message && (
          <div className="h6 mb-3">
            {translation("listCustomers.sendMessage")}
            {": "}
            {message}
          </div>
        )}
        <>
          <label className="h5">
            {translation("listCustomers.methodSendMessage")}
          </label>
          <Form.Item
            name='customerMessageCategories'
            rules={[
              { required: true, message: translation('isReq') }
            ]}
          >
            <Select onChange={changeMethodSendMessage}>
              {TYPES.map((item) => {
                return (
                  <Option
                    key={item.value}
                    value={item.value}
                  >
                    {item.label}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <label className="h5">
            {translation("listCustomers.formMessage")}
          </label>
          <Form.Item
            name="customerMessageTemplateId"
            rules={[
              { required: true, message: translation('isReq') }
            ]}
          >
            <Select onChange={changeTemplateMessage}>
              {temps.map((t) => {
                return (
                  <Option
                    key={t.messageTemplateId}
                    value={t.messageTemplateId}
                  >
                    {t.messageTemplateName}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <label className="h5">
            {translation("listCustomers.contentMessage")} {SMSLength}
          </label>
        </>
        <Form.Item
          name="customerMessageContent"
          rules={[
            {
              required: true,
              message: translation("listCustomers.invalidContent"),
            },
          ]}
        >
          <Input.TextArea
            disabled={true}
            className={"noselect"}
            placeholder={translation("listCustomers.messageContent")}
            size="large"
            rows={4}
          />
        </Form.Item>
        {/* <div className="d-flex justify-content-center">
          <Form.Item className="col-12 col-md-2">
            <Button
              key="submit"
              className="blue_button text-center"
              size="large"
              htmlType="submit"
            >
              <span className="text-center">
                {translation("listCustomers.send")}{" "}
              </span>
            </Button>
          </Form.Item>
        </div> */}
      </Form>
    </Modal >
  );
};

export default ModalMessage;
