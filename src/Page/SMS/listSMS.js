import React, { useState, useEffect, Fragment } from "react";
import {
  Table,
  Modal,
  notification,
  Spin,
  Tooltip,
  Space,
  Pagination,
  Typography,
  Select,
  Input,
  Button,
  DatePicker,
  Popconfirm,
} from "antd";
import { useTranslation } from "react-i18next";
import MessageService from "../../services/messageService";
import {
  // Delete,
  Renew,
  // Edit,
  Star,
  ScheduleSend,
  Close,
  Block,
  TaskAlt,
} from "../../assets/icons";
import { SendOutlined, HourglassOutlined } from "@ant-design/icons";
import UpdateMessageModal from "./updateModal";
import "./smsStyle.scss";
import {
  PlusOutlined,
  ReloadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { BUTTON_LOADING_TIME } from "constants/time";
import moment from "moment";
import { useSelector } from "react-redux";
import {
  getListMessageTypes,
  getMarketingMessageSendStatusList,
} from "constants/sms";
import { MESSAGE_TYPES } from "constants/sms";
import { EyeOutlined } from "@ant-design/icons";
import { AnphaIcon } from "../../assets/icons";
import { ExportFile } from "hooks/FileHandler";
import ModalProgress from "components/ModalProgress/ModalProgress";
import {
  MESSAGE_SEND_STATUS_EXPORT,
  MESSAGE_TYPE_STATUS_EXPORT,
  MESSAGE_CATEGORIES_EXPORT,
} from "constants/smsImportExport";
import {
  MESSAGE_SEND_STATUS,
  MARKETING_MESSAGE_SEND_STATUS,
} from "constants/sms";
import EllipsisText from "components/EllipsisText/EllipsisText";
import TagVehicle from "components/TagVehicle/TagVehicle";
import { widthLicensePlate } from "constants/licenseplates";
import SendMessageDrawer from "./SendMessageDrawer";
import ImportListDrawer from "./ImportListDrawer";
import MessageCustomerMarketingService from "services/MessageCustomerMarketingService";
import { DATE_DISPLAY_FORMAT } from "constants/dateFormats";
import addKeyLocalStorage from "helper/localStorage";
import UnLock from "components/UnLock/UnLock";
import BasicTablePaging from "components/BasicTablePaging/BasicTablePaging";
import { useModalDirectLinkContext } from "components/ModalDirectLink";
import { HOST } from "constants/url";
import { MIN_COLUMN_WIDTH } from "constants/app";
import { BIG_COLUMN_WIDTH } from "constants/app";
import { NORMAL_COLUMN_WIDTH } from "constants/app";
import { VERY_BIG_COLUMN_WIDTH } from "constants/app";

const { Text } = Typography;

const DeleteModal = ({ messageCustomerId, closeModal, fetchMessage }) => {
  const [message, setMessage] = useState({});
  const { t: translation } = useTranslation();

  useEffect(() => {
    MessageService.getMessageById(messageCustomerId).then((result) => {
      setMessage(result);
    });
  }, [messageCustomerId]);

  const deleteMessage = () => {
    MessageService.updateMessageById({
      id: messageCustomerId,
      data: {
        customerMessageCategories: message.customerMessageCategories,
        customerMessageContent: message.customerMessageContent,
        customerRecordPhone: message.customerMessagePhone,
        isDeleted: 1,
      },
    }).then(() => {
      closeModal();
      fetchMessage();
    });
  };

  return (
    <Modal
      visible
      okText={translation("landing.confirm")}
      cancelText={translation("listCustomers.cancel")}
      width={400}
      closable={false}
      onCancel={() => closeModal()}
      onOk={deleteMessage}
    >
      {translation("sms.wantDelete")}
    </Modal>
  );
};

const SMSModal = (props) => {
  const {
    modal: { type, args },
    closeModal,
    fetchMessage,
  } = props;
  const setting = useSelector((state) => state.setting);

  const { t: translation } = useTranslation();

  const sendMessage = () => {
    MessageService.sendSms({
      message: args.customerMessageContent,
      phoneNumber: args.customerMessagePhone,
    }).then((res) => {
      if (res.isSuccess) {
        notification["success"]({
          message: "",
          description: translation("sms.resend.successful"),
        });
        fetchMessage();
      } else {
        notification["error"]({
          message: "",
          description: translation("sms.resend.error"),
        });
      }
    });
    closeModal();
  };

  const parseMessageContent = () => {
    if (!args.customerMessageContent) {
      return "";
    } else {
      return args.customerMessageContent
        .replace("{{stationsBrandname}}", setting.stationsName)
        .replace("{{stationsAddress}}", setting.stationsAddress)
        .replace(
          "{{customerRecordCheckExpiredDate}}",
          args.customerRecordCheckExpiredDate
        )
        .replace("{{stationsHotline}}", setting.stationsHotline)
        .replace(
          "{{customerRecordPlatenumber}}",
          args.customerMessagePlateNumber
        );
    }
  };

  switch (type) {
    case "delete":
      return (
        <DeleteModal
          messageCustomerId={args.messageCustomerId}
          closeModal={closeModal}
          fetchMessage={fetchMessage}
        />
      );
    case "resend":
      return (
        <Modal
          visible
          okText={translation("landing.confirm")}
          cancelText={translation("listCustomers.cancel")}
          width={400}
          closable={false}
          onCancel={() => closeModal()}
          onOk={sendMessage}
          title={translation("wantResend")}
        >
          <div>
            {translation("landing.phoneNumber")}: {args.customerMessagePhone}
          </div>
          <div>
            {translation("sms.content")}: {parseMessageContent()}
          </div>
        </Modal>
      );
    case "update":
      return (
        <UpdateMessageModal
          args={args}
          closeModal={closeModal}
          fetchMessage={fetchMessage}
        />
      );
    default:
      return <></>;
  }
};

const Status = ({ status }) => {
  const { t: translation } = useTranslation();

  const displayMappings = {
    1: {
      // NEW
      text: translation("sms.status.new"), //Đang chờ
      Icon: Star,
      className: "sms__new",
      color: "#FFD700",
    },
    10: {
      // SENDING
      text: translation("sms.status.sending"), //Đang gửi đi
      Icon: SendOutlined,
      className: "sms__sending",
      color: "#1E90FF",
    },
    50: {
      // COMPLETED
      text: translation("sms.status.completed"), //Hoàn tất
      Icon: TaskAlt,
      className: "sms__receive",
      color: "#32CD32",
    },
    20: {
      // FAILED
      text: translation("sms.status.failed"), //Gửi thất bại
      Icon: Close,
      className: "sms__fail",
      color: "#FF4500",
    },
    30: {
      // CANCELED
      text: translation("sms.status.canceled"), //Đã hủy
      Icon: Block,
      className: "sms__cancel",
      color: "#808080",
    },
    40: {
      // SKIP
      text: translation("sms.status.skip"), //Tạm ngưng
      Icon: HourglassOutlined,
      className: "sms__waiting",
      color: "#FFA500",
    },
  };

  const { text, Icon, className, color } =
    displayMappings[status] || displayMappings[1]; // Default to NEW if status is not recognized

  return (
    <>
      <span style={{ color }}>{text}</span>&nbsp;
      <Icon className={className} style={{ color }} />
    </>
  );
};

const FIELDS_EXPORT_IMPORT = [
  { api: "customerMessagePhone", content: "Số điện thoại" },
  { api: "customerMessagePlateNumber", content: "Biển số xe" },
  { api: "messageContent", content: "Nội dung" },
  { api: "customerMessageCategories", content: "Loại tin" },
  { api: "messageSendStatus", content: "Trạng thái" },
  { api: "createdAt", content: "Ngày tạo" },
  { api: "messageSendDate", content: "Ngày gửi" },
];

const DefaultFilterExport = {
  limit: 100,
};

const ListSMS = () => {
  const { onExportExcel, isLoading } = ExportFile();
  const { t: translation } = useTranslation();
  const stationSetting = useSelector((state) => state.setting);
  const history = useHistory();
  const [selectedMessageType, setSelectedMessageType] = useState("");
  const [isSendMessageDrawer, setIsSendMessageDrawer] = useState(false);
  const messageTypes = getListMessageTypes(translation);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    data: [],
    total: 0,
  });
  const setting = useSelector((state) => state.setting);
  const [filter, setFilter] = useState({
    filter: {},
    skip: 0,
    limit: 20,
    order: {
      key: "messageMarketingId",
      value: "desc",
    },
  });
  const { setUrlForModalDirectLink } = useModalDirectLinkContext();
  const SAMPLE_FILE_LINK = `${HOST}/uploads/exportExcel/file_mau_import_sms.xlsx`;
  const [modal, setModal] = useState({
    type: "",
    args: {},
  });

  // Những Thứ dùng chung export và import
  const [isModalProgress, setisModalProgress] = useState(false);
  const [percent, setPercent] = useState(0);
  const [percentPlus, setPercentPlus] = useState(0);

  // Những Thứ dùng chung Import
  const [arrImport, setArrImport] = useState([]);
  const [isImport, setIsImport] = useState(false);
  const [importSummary, setImportSummary] = useState({
    logs: [],
    numberError: 0,
    numberSuccess: 0,
  });

  const fetchMessage = (filter) => {
    MessageCustomerMarketingService.getList(filter).then((result) => {
      if (result) setData(result);
    });
  };

  useEffect(() => {
    isMobileDevice(window.outerWidth);
    if (isMobileDevice(window.outerWidth) === true) {
      filter.limit = 10;
    }
    fetchMessage(filter);
  }, []);

  const closeModal = () =>
    setModal({
      type: "",
      args: {},
    });

  const columns = [
    {
      title: translation("sms.index"),
      dataIndex: "index",
      key: "index",
      width: MIN_COLUMN_WIDTH,
      render: (_, __, index) => {
        return (
          <div className="d-flex justify-content-center align-items-center">
            {filter.skip ? filter.skip + index + 1 : index + 1}
          </div>
        );
      },
    },
    {
      title: translation("sms.phoneNumber"),
      dataIndex: "customerMessagePhone",
      key: "customerMessagePhone",
      width: BIG_COLUMN_WIDTH,
      render: (value) => {
        return <div className="blue-text">{value}</div>;
      },
    },
    {
      title: translation("sms.licensePlate"),
      dataIndex: "customerMessagePlateNumber",
      key: "customerMessagePlateNumber",
      width: widthLicensePlate,
      render: (value, values) => {
        const color = values.licensePlateColor
          ? values.licensePlateColor - 1
          : 0;
        return <TagVehicle color={color}>{value}</TagVehicle>;
      },
    },
    {
      title: translation("sms.content"),
      dataIndex: "messageContent",
      key: "messageContent",
      // width: '350px',
      render: (value) => {
        return (
          <Typography.Paragraph
            className="sms-content"
            style={{ width: 400 }}
            ellipsis={{
              rows: 2,
              expandable: true,
              symbol: "Hiển thị",
            }}
          >
            {value}
          </Typography.Paragraph>
        );
      },
    },
    {
      title: translation("sms.messageType"),
      dataIndex: "customerMessageCategories",
      key: "customerMessageCategories",
      width: BIG_COLUMN_WIDTH,
      render: (value) => {
        return (
          <div>
            {messageTypes.find((item) => item.value == value)?.label || "---"}
          </div>
        );
      },
    },
    {
      title: translation("sms.statusTitle"),
      dataIndex: "messageSendStatus",
      key: "messageSendStatus",
      width: BIG_COLUMN_WIDTH,
      render: (value) => {
        return (
          <div className="d-flex align-items-center">
            <Status status={value} />
          </div>
        );
      },
    },
    {
      title: translation("sms.createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      width: NORMAL_COLUMN_WIDTH,
      render: (value) =>
        value ? (
          <>
            <div>{moment(value).format("DD/MM/YYYY")}</div>
            <div>{moment(value).format("HH:mm:ss")}</div>
          </>
        ) : null,
    },
    {
      title: translation("sms.messageSentDate"),
      dataIndex: "messageSendDate",
      key: "messageSendDate",
      width: NORMAL_COLUMN_WIDTH,
      render: (value) =>
        value ? (
          <>
            <div>{moment(value).format("DD/MM/YYYY")}</div>
            <div>{moment(value).format("HH:mm:ss")}</div>
          </>
        ) : null,
    },
    {
      title: translation("sms.actions"),
      dataIndex: "action",
      key: "action",
      align: "center",
      width: VERY_BIG_COLUMN_WIDTH,
      render: (_, record) => {
        const {
          messageSendStatus,
          messageMarketingId,
          customerMessageContent,
          customerMessagePhone,
        } = record;

        let resendButton = null;
        let cancelButton = null;

        // if (true) {
        //   resendButton = (
        //     <Button type="link" onClick={() => setModal({
        //       type: 'resend',
        //       args: record
        //     })}>
        //       <ReloadOutlined />
        //     </Button>
        //   );
        // }

        if (messageSendStatus === MARKETING_MESSAGE_SEND_STATUS.NEW) {
          cancelButton = (
            <Popconfirm
              title={translation("sms.box-delete-confirm")}
              onConfirm={() => {
                handleDelete(record.messageMarketingId);
              }}
              okText={translation("category.yes")}
              cancelText={translation("category.no")}
            >
              <Button type="link">
                <DeleteOutlined />
              </Button>
            </Popconfirm>
          );
        }
        return (
          <Space size="middle">
            {resendButton}
            {cancelButton}
            {/* <Button type="link" onClick={() => setModal({
              type: 'details',
              args: record
            })}>
              <EyeOutlined />
            </Button> */}
          </Space>
        );
      },
    },
    {
      title: translation("service.note"),
      dataIndex: "messageNote",
      key: "messageNote",
      width: VERY_BIG_COLUMN_WIDTH,
      render: (value) => {
        return (
          <Typography.Paragraph
            className="sms-content"
            style={{ width: 400 }}
            ellipsis={{
              rows: 2,
              expandable: true,
              symbol: translation("sms.show"),
            }}
          >
            {value}
          </Typography.Paragraph>
        );
      },
    },
  ];

  const handleFilter = (e) => {
    let value;
    if (typeof e === "string") {
      value = e;
    } else {
      value = e.target.value;
    }
    if (value) {
      filter.searchText = value;
      filter.skip = 0;
    } else {
      filter.searchText = undefined;
      filter.skip = 0;
    }
    fetchMessage(filter);
    setFilter(filter);
  };

  const handleChangePage = (pageNum) => {
    const newFilter = {
      ...filter,
      skip: (pageNum - 1) * filter.limit,
    };
    setFilter(newFilter);
    fetchMessage(newFilter);
  };

  const onFilterUserByStatus = (value) => {
    let newFilter = filter;
    if (value) {
      newFilter.filter.messageSendStatus = value;
      filter.skip = 0;
    } else {
      newFilter.filter.messageSendStatus = undefined;
      filter.skip = 0;
    }

    setFilter(newFilter);
    fetchMessage(newFilter);
  };

  const onFilterMessageType = (value) => {
    let newFilter = filter;
    if (value) {
      newFilter.filter.customerMessageCategories = value;
      filter.skip = 0;
    } else {
      newFilter.filter.customerMessageCategories = undefined;
      filter.skip = 0;
    }

    setFilter(newFilter);
    fetchMessage(newFilter);
  };

  const fetchExportData = async (param) => {
    for (let key in filter) {
      if (!filter[key]) {
        delete filter[key];
      }
    }
    const response = await MessageService.findMessages({
        filter: {
          ...filter.filter
        },
        ...filter,
        skip: param * DefaultFilterExport.limit,
        limit:  DefaultFilterExport.limit,
        startDate: filter.startDate,
        endDate: filter.endDate,
    })
    const data = await response.data;
    return data;
  };

  const handleExportExcel = async () => {
    let number = Math.ceil(data.data.length / DefaultFilterExport.limit)
    let params = Array.from(Array.from(new Array(number)), (element, index) => index);
    let results = [];

    const percentPlus = 100 / params.length;
    setPercent(0);
    setisModalProgress(true);

    let _counter = 0;
    while (true) {
      const result = await fetchExportData(_counter++);
      if (result && result.length > 0) {
        setPercent(prev => prev + percentPlus);
        results = [...results, ...result];
      } else {
        break;
      }
    }

    const newResult = results.map((item, index) => ({
      ...item,
      messageSendStatus:
        MESSAGE_SEND_STATUS_EXPORT[item.messageSendStatus] || "",
      customerMessageCategories:
        MESSAGE_CATEGORIES_EXPORT[item.customerMessageCategories],
      createdAt: item.createdAt
        ? moment(item.createdAt).format("DD/MM/YYYY HH:mm:ss")
        : "",
      messageSendDate: item.messageSendDate
        ? moment(item.messageSendDate).format("DD/MM/YYYY HH:mm:ss")
        : "",
    }));

    await setTimeout(() => {
      // setUrlForModalDirectLink(SAMPLE_FILE_LINK)
      setisModalProgress(false);
      setPercent(0);
      onExportExcel({
        fieldApi: FIELDS_EXPORT_IMPORT.map((item) => item.api),
        fieldExport: FIELDS_EXPORT_IMPORT.map((item) => item.content),
        data: newResult,
        informationColumn: [
          [
            `${stationSetting.stationsName}`,
            "",
            "",
            "Danh sách tin nhắn đăng kiểm",
          ],
          [
            `Mã: Trung Tâm đăng kiểm xe cơ giới ${stationSetting.stationCode}`,
            "",
            "",
            `Danh sách tin nhắn ngày ${moment().format("DD/MM/YYYY")}`,
          ],
          [""],
        ],
        timeWait: 0,
        nameFile: "dataSms.xlsx",
        setUrlForModalDirectLink: setUrlForModalDirectLink,
      });
    }, 1000);
  };

  const handleDateRange = (dates) => {
    let newFilter = { ...filter };

    if (dates && dates.length === 2) {
      const [startDate, endDate] = dates;

      if (startDate && endDate) {
        newFilter.startDate = startDate.startOf("D").format("DD/MM/YYYY");
        newFilter.endDate = endDate.endOf("D").format("DD/MM/YYYY");
        newFilter.skip = 0;
      } else {
        newFilter.startDate = undefined;
        newFilter.endDate = undefined;
        newFilter.skip = 0;
      }
    } else {
      newFilter.startDate = undefined;
      newFilter.endDate = undefined;
      newFilter.skip = 0;
    }

    setFilter(newFilter);
    fetchMessage(newFilter);
  };

  const handleDelete = (id) => {
    MessageService.cancelSMSMessage({
      messageMarketingId: id,
    }).then((res) => {
      if (res.isSuccess) {
        fetchMessage(filter);
      } else {
        notification["error"]({
          message: "",
          description: translation("sms.deleteFailed"),
        });
      }
    });
  };

  useEffect(() => {
    const saveSmsTemplate = sessionStorage.getItem(
      addKeyLocalStorage("saveSmsTemplate")
    );
    if (saveSmsTemplate) {
      setIsSendMessageDrawer(true);
    }
  }, []);

  const isMobileDevice = (value) => {
    if (value < 768) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <Fragment>
      {setting.enableMarketingMessages === 0 ? (
        <UnLock />
      ) : (
        <main className="sms">
          <div className="row d-flex justify-content-start">
            <div className="section-title col-lg-3 mb-3 col-xl-2">
              <Input.Search
                onPressEnter={handleFilter}
                onSearch={handleFilter}
                placeholder={translation("sms.search")}
              />
            </div>

            <div className="col-md-6 col-lg-3 col-xl-2 mb-3">
              <DatePicker.RangePicker
                className="w-100"
                format={DATE_DISPLAY_FORMAT}
                placeholder={[translation("startDate"), translation("endDate")]}
                onChange={handleDateRange}
              />
            </div>
            <div className="col-md-6 col-lg-3 col-xl-2 mb-3 mobie_style">
              <Select
                onChange={onFilterUserByStatus}
                style={{ width: "100%" }}
                placeholder="Trạng thái"
              >
                <Select.Option value="">
                  {translation("new.allPost")}
                </Select.Option>
                {getMarketingMessageSendStatusList(translation).map((type) => (
                  <Select.Option key={type.value} value={type.value}>
                    {type.label}
                  </Select.Option>
                ))}
              </Select>
            </div>
            <div className="col-md-6 col-lg-3 col-xl-2 mb-3 mobie_style">
              <Select
                onChange={onFilterMessageType}
                style={{ width: "100%" }}
                placeholder="Loại tin nhắn"
              >
                <Select.Option value="">
                  {translation("sms.all_type")}
                </Select.Option>
                {messageTypes.map((type) => (
                  <Select.Option key={type.value} value={type.value}>
                    {type.label}
                  </Select.Option>
                ))}
              </Select>
            </div>
            <div className="col-12 col-md-12 col-lg-5 col-xl-4 mb-3">
              <div className="d-flex flex-wrap gap-4 justify-content-xl-start justify-content-lg-start">
                <Button
                  onClick={handleExportExcel}
                  className="d-flex align-items-center"
                  icon={<AnphaIcon />}
                > 
                  {translation("listCustomers.export")}
                </Button>

                <Button
                  className="d-flex align-items-center gap-1"
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setIsSendMessageDrawer(true);
                  }}
                >
                  {translation("listCustomers.toSend")}
                </Button>
              </div>
            </div>
          </div>

          <div className="list_sms_body row">
            <Table
              dataSource={data.data}
              columns={columns}
              scroll={{ x: 2100 }}
              pagination={false}
            />
            <BasicTablePaging
              handlePaginations={handleChangePage}
              count={data?.data?.length < filter.limit}
              skip={filter.skip}
            ></BasicTablePaging>
          </div>
          {isModalProgress && (
            <ModalProgress
              visible={isModalProgress}
              setVisible={setisModalProgress}
              percent={percent}
              logs={importSummary.logs}
              isLoading={arrImport.length !== 0}
              isImport={isImport}
              numberError={importSummary.numberError}
              numberSuccess={importSummary.numberSuccess}
            />
          )}
          <SMSModal
            modal={modal}
            closeModal={closeModal}
            fetchMessage={() => fetchMessage(filter)}
          />
          {isSendMessageDrawer && (
            <SendMessageDrawer
              isSendMessageDrawer={isSendMessageDrawer}
              setIsSendMessageDrawer={setIsSendMessageDrawer}
              fetchMessage={() => fetchMessage(filter)}
            />
          )}
        </main>
      )}
    </Fragment>
  );
};

export default ListSMS;
