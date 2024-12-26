import React, { Fragment } from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  notification,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import StationDevicesService from "../../services/StationDevicesService";
import { useSelector } from "react-redux";
import UnLock from "components/UnLock/UnLock";
import { isMobileDevice } from "constants/account";
import BasicTablePaging from "components/BasicTablePaging/BasicTablePaging";
import { MIN_COLUMN_WIDTH } from "constants/app";
import { VERY_BIG_COLUMN_WIDTH } from "constants/app";
import { BIG_COLUMN_WIDTH } from "constants/app";
import { EXTRA_BIG_COLUMND_WITDTH } from "constants/app";

const { Option } = Select;
export default function Webhooks() {
  const { t: translation } = useTranslation();
  const [listDocumentary, setListDocumentary] = useState({
    data: [],
    total: 0,
  });
  const setting = useSelector((state) => state.setting);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [isTestBtn, setIsTestBtn] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [testConnet, setTestConnet] = useState("");
  const [form] = Form.useForm();
  const requiredRule = {
    required: true,
    message: translation("isReq"),
  };
  const [dataFilter, setDataFilter] = useState({
    filter: {},
    skip: 0,
    limit: 20,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [item, setItem] = useState([]);
  const inputRef = useRef();
  const typeOptions = [
    {
      value: 1,
      label: translation("webhook.appointmentNotice"),
    },
    {
      value: 2,
      label: translation("webhook.inspectionNotice"),
    },
    {
      value: 3,
      label: translation("webhook.fineNotice"),
    },
  ];

  const columns = [
    {
      title: translation("device.index"),
      key: "index",
      render: (_, __, index) => {
        return (
          <div className="d-flex justify-content-center aligns-items-center">
            {dataFilter.skip ? dataFilter.skip + index + 1 : index + 1}
          </div>
        );
      },
      width: MIN_COLUMN_WIDTH,
      align: "center",
    },
    {
      title: translation("webhook.name"),
      key: "webhookName",
      dataIndex: "webhookName",
      width: EXTRA_BIG_COLUMND_WITDTH,
    },
    {
      title: translation("webhook.type"),
      key: "webhookType",
      width: EXTRA_BIG_COLUMND_WITDTH,
      render: (row) =>
        typeOptions.find((item) => item?.value == row?.webhookType)?.label,
    },
    {
      title: translation("webhook.link"),
      key: "webhookUrl",
      dataIndex: "webhookUrl",
      width: EXTRA_BIG_COLUMND_WITDTH,
    },
    {
      title: translation("webhook.status"),
      key: "webhookStatus",
      width: BIG_COLUMN_WIDTH,
      align: "center",
      render: (row) =>
        row?.webhookStatus == 1
          ? translation("webhook.isActive")
          : translation("webhook.isWrong"),
    },
    {
      title: translation("listCustomers.act"),
      key: "action",
      // width: 280,
      align: "center",
      render: (record) => (
        <Space size="middle">
          <EditOutlined
            onClick={() => {
              setIsEditing(true);
              setIsAdd(true);
              setItem(record);
              setIsConnected(record.webhookStatus == 1 ? true : false);
              getDetailWebhook(record.stationWebHooksId);
            }}
            style={{ cursor: "pointer", color: "var(--primary-color)" }}
          />
          <Popconfirm
            title={translation("webhook.confirm-delete")}
            onConfirm={() => onDeleteDevice(record.stationWebHooksId)}
            okText={translation("category.yes")}
            cancelText={translation("category.no")}
          >
            <DeleteOutlined
              style={{ cursor: "pointer", color: "var(--primary-color)" }}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const onDeleteDevice = (id) => {
    StationDevicesService.deleteWebhook({ id }).then((result) => {
      if (result && result.isSuccess) {
        notification["success"]({
          message: "",
          description: translation("device.deleteSuccess"),
        });
        fetchData(dataFilter);
      } else {
        notification["error"]({
          message: "",
          description: translation("device.deleteFailed"),
        });
      }
    });
  };

  const fetchData = (filter) => {
    StationDevicesService.getListWebhook(filter).then((result) => {
      if (result) {
        setListDocumentary(result);
      }
    });
  };

  const getDetailWebhook = (id) => {
    StationDevicesService.getDetailWebhook({ id }).then((result) => {
      if (result) {
        form.setFieldsValue({
          webhookName: result?.webhookName,
          webhookStatus: result?.webhookStatus,
          webhookType: result?.webhookType,
          webhookUrl: result?.webhookUrl,
        });
      }
    });
  };

  useEffect(() => {
    isMobileDevice(window.outerWidth);
    if (isMobileDevice(window.outerWidth) === true) {
      dataFilter.limit = 10;
    }
    fetchData(dataFilter);
  }, []);

  const handleChangePage = (pageNum) => {
    const newFilter = {
      ...dataFilter,
      skip: (pageNum - 1) * dataFilter.limit,
    };
    setDataFilter(newFilter);
    fetchData(newFilter);
  };

  const toggleAddModal = () => {
    setIsAdd((prev) => !prev);
    setIsEditing(false);
    form.resetFields();
  };

  const onUpdateWebhook = (data) => {
    let newData = {
      id: item.stationWebHooksId,
      data: {
        ...data,
        webhookStatus: isConnected ? 1 : 0,
      },
    };
    StationDevicesService.updateWebhook(newData).then((result) => {
      if (result && result.isSuccess) {
        notification["success"]({
          message: "",
          description: translation("webhook.updateSuccess"),
        });
        setIsEditing(false);
        setIsAdd(false);
        fetchData(dataFilter);
        return true;
      }
      notification["error"]({
        message: "",
        description: translation("webhook.updateFailed"),
      });
      return false;
    });
  };

  const onCrateNew = (newData) => {
    StationDevicesService.insertWebhook({
      ...newData,
      webhookStatus: isConnected ? 1 : 0,
      stationsId: setting.stationsId,
    }).then(async (result) => {
      if (result && result.statusCode == "200") {
        notification.success({
          message: "",
          description: translation("webhook.createSuccess"),
        });
        isAdd && setIsAdd(false);
        form.resetFields();
        fetchData(dataFilter);
      } else {
        notification.error({
          message: "",
          description: translation("webhook.createFailed"),
        });
      }
    });
  };
  const handleTestWebhook = (data) => {
    let newData = {
      webhookUrl: data?.webhookUrl,
    };
    StationDevicesService.testConnectWebhook(newData).then((result) => {
      if (result && result.statusCode == "200") {
        notification.success({
          message: "",
          description: translation("webhook.connectSuccess"),
        });
        setIsConnected(true);
        setTestConnet(result.data);
      } else {
        setTestConnet(result)
        setIsConnected(false);
        notification.error({
          message: "",
          description: translation("webhook.connectFailed"),
        });
      }
    });
  };
  const onFinish = (values) => {
    if (isEditing) {
      onUpdateWebhook(values);
    } else {
      onCrateNew(values);
    }
  };
  const onSubmitBtn = (values) => {
    if (isTestBtn) {
      handleTestWebhook(values);
    } else {
      onFinish(values);
    }
  };

  return (
    <Fragment>
      {setting.enableDeviceMenu === 0 ? (
        <UnLock />
      ) : (
        <main className="list_customers">
          <Row>
            <Col xs={24} sm={12} md={4} lg={3} xl={3}>
              <Button
                type="primary"
                className="w-100 mb-3"
                style={{ minWidth: "130px" }}
                onClick={toggleAddModal}
              >
                {translation("webhook.btnNew")}
              </Button>
            </Col>
          </Row>

          <div className="list_customers__body">
            <Table
              dataSource={listDocumentary.data}
              columns={columns}
              scroll={{ x: 1200 }}
              pagination={false}
            />
            <BasicTablePaging
              handlePaginations={handleChangePage}
              skip={dataFilter.skip}
              count={listDocumentary?.data?.length < dataFilter.limit}
            ></BasicTablePaging>
          </div>
          <Modal
            visible={isAdd}
            title={
              isEditing
                ? translation("webhook.titleEdit")
                : translation("webhook.titleAdd")
            }
            onCancel={toggleAddModal}
            width={400}
            footer={
              <>
                <Button
                  type="primary"
                  style={{ width: "100px" }}
                  onClick={() => {
                    form.submit();
                    setIsTestBtn(false);
                  }}
                >
                  {translation("listSchedules.save")}
                </Button>
                <Button
                  type="primary"
                  style={{ width: "100px" }}
                  onClick={() => {
                    setIsTestBtn(true);
                    setTimeout(() => {
                      form.submit();
                    }, 200);
                  }}
                >
                  {translation("webhook.test")}
                </Button>
              </>
            }
          >
            <Form
              form={form}
              onFinish={onSubmitBtn}
              layout="vertical"
              onValuesChange={(values) => {
                if (values.customerRecordPlatenumber) {
                  form.setFieldsValue({
                    customerRecordPlatenumber:
                      values.customerRecordPlatenumber.toUpperCase(),
                  });
                }
              }}
            >
              {isLoading ? (
                <Spin />
              ) : (
                <div className="row">
                  <div className="col-12 col-md-12">
                    <Form.Item
                      name="webhookName"
                      label={translation("webhook.name")}
                      rules={[requiredRule]}
                    >
                      <Input
                        placeholder={translation("webhook.name")}
                        autoFocus
                      />
                    </Form.Item>
                  </div>
                  <div className="col-12 col-md-12">
                    <Form.Item
                      name="webhookType"
                      label={translation("webhook.type")}
                      rules={[requiredRule]}
                    >
                      <Select placeholder={translation("webhook.type")}>
                        {typeOptions.map((option) => (
                          <Option key={option.value} value={option.value}>
                            {option.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                  <div className="col-12 col-md-12">
                    <Form.Item
                      name="webhookUrl"
                      label={translation("webhook.link")}
                      rules={[requiredRule]}
                    >
                      <Input placeholder={translation("webhook.link")} />
                    </Form.Item>
                  </div>
                  <div className="col-12 col-md-12">
                    <Form.Item
                      className=""
                      label={translation("telegram.connectionStatus")}
                    >
                      <Tag color={isConnected ? "green" : ""}>
                        {isConnected
                          ? translation("webhook.isActive")
                          : translation("webhook.isWrong")}
                      </Tag>
                    </Form.Item>
                    {testConnet.data ? (
                      <Form.Item className="" label={""}>
                        <Tag>
                          <div>data : {testConnet?.data}</div>
                          <div>
                            error : {testConnet?.error === null ? "null" : ""}
                          </div>
                          <div>message : {testConnet?.message}</div>
                          <div>statusCode : {testConnet?.statusCode}</div>
                        </Tag>
                      </Form.Item>
                    ) : (
                      ""
                    )}

                    {testConnet.error ? (
                      <Form.Item className="" label={""}>
                        <Tag>
                          <div>statusCode : {testConnet?.statusCode}</div>
                          <div>
                            error : {testConnet?.error}
                          </div>
                          <div>message : {testConnet?.message}</div>
                        </Tag>
                      </Form.Item>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              )}
            </Form>
          </Modal>
        </main>
      )}
    </Fragment>
  );
}
