import React, { useState, useEffect, useRef, Fragment } from "react";
import "./listCustomersStyle.scss";
import {
  Table,
  Input,
  Space,
  Button,
  notification,
  DatePicker,
  Tooltip,
  Modal,
  List,
  Select,
  Pagination,
  Popconfirm,
  Spin,
} from "antd";
import {
  ExceptionOutlined, ReloadOutlined,
  TransactionOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import ListCustomersService from "../../services/listCustomersService";
import moment from "moment";
import { convertFileToBase64 } from "../../helper/common";
import uploadService from "../../services/uploadService";
import MessageService from "../../services/messageService";
import ModalUpload from "./ModalUpload";
import ModalMessage from "./ModalMessage";
import ModalEditUserInfo from "./ModalEditUserInfo";
import { EmailSendIcon } from "assets/icons";
import { ModalCrime } from "./ModalCrime";
import { UnionIcon } from "./../../assets/icons";
import { VectorIcon } from "./../../assets/icons";
import { AnphaIcon } from "./../../assets/icons";
import { MassIcon } from "./../../assets/icons";
import { SubmittedIcon } from "./../../assets/icons";
import { Not_yetIcon } from "./../../assets/icons";
import { BUTTON_LOADING_TIME } from "constants/time";
import TagVehicle from "components/TagVehicle/TagVehicle";
import { getIndexTagVehicleFromColor } from "constants/listSchedule";
import { widthLicensePlate } from '../../constants/licenseplates'
import { optionVehicleType } from "constants/vehicleType";
import { useSelector } from "react-redux";
import { getMessageCustomerMarketingError } from "constants/errorMessage";
import Handlebars from "handlebars";
import { routes } from "App";
import { useHistory } from "react-router-dom";
import { ERROR_FAILED } from "constants/errorConstant";
import UnLock from 'components/UnLock/UnLock';
import TagVehicleWarn from "components/TagVehicle/TagVehicleWarn";
import BasicTablePaging from 'components/BasicTablePaging/BasicTablePaging';
import { useModalDirectLinkContext } from "components/ModalDirectLink";
import { XLSX_TYPE } from "constants/excelFileType";
import ModalProgressCustomer from "components/EmailIcon/importCustomer";
import AccreditationService from "services/accreditationService";
import { MIN_COLUMN_WIDTH } from "constants/app";
import { EXTRA_BIG_COLUMND_WITDTH } from "constants/app";
import { VERY_BIG_COLUMN_WIDTH } from "constants/app";
import { BIG_COLUMN_WIDTH } from "constants/app";

const { Option } = Select
const { RangePicker } = DatePicker;

const SMSListModal = ({ id, visible, onClose }) => {
  const { t: translation } = useTranslation();
  const [detail, setDetail] = useState({});
  const [pagable, setPagable] = useState({
    page: 1,
    skip: 0,
    limit: 5,
  });

  useEffect(() => {
    id &&
      MessageService.findMessages({
        filter: { customerId: id },
        skip: pagable.skip,
        limit: pagable.limit,
      }).then((result) => {
        if (result.data) {
          setDetail(result);
        }
      });
  }, [id, pagable.limit, pagable.skip]);

  return (
    <Modal
      title={translation("listCustomers.listSMSSent")}
      width={443}
      visible={visible}
      closable
      onCancel={onClose}
      footer={
        <div className="footers justify-content-end">
          <Button type="link" onClick={onClose}>
            {translation("listCustomers.cancel")}
          </Button>
          <Button type="primary" onClick={onClose}>{translation("listSchedules.OK")}</Button>
        </div>
      }
    >
      <div>
        {detail?.data?.length > 0 ? (
          <List>
            {detail?.data?.map((message) => (
              <List.Item className="d-block">
                <div className="d-flex justify-content-between">
                  <p className="text-one">
                    {translation('sms.messageSentDate')} :
                    <span className="text-day">
                      {message?.createdAt?.slice(11, 16)}{" "}
                      {moment(message?.createdAt?.slice(0, 10)).format(
                        "DD/MM/YYYY"
                      )}
                    </span>
                  </p>
                  <p
                    className="message-status"
                    data-status={message.messageSendStatus}
                  >
                    <SubmittedIcon />
                  </p>
                </div>
                <p className="text-two">
                {translation('sms.content')} :
                  <p>
                    {message.messageContent}
                  </p>
                </p>
              </List.Item>
            ))}
          </List>
        ) : (
          <div className="icons">
            <Not_yetIcon />
          </div>
        )}
        <div className="d-flex justify-content-between align-items-baseline mt-3">
          {/* <div>
						<p>Tong so SMS: {detail.total}</p>
					</div> */}
          {
            detail?.total > 20 ? (
              <Pagination
                total={detail.total}
                pageSize={pagable.limit}
                current={pagable.page}
                simple={true}
                onChange={(page) =>
                  setPagable({
                    ...pagable,
                    page: page,
                    skip: (page - 1) * pagable.limit,
                  })
                }
              />
            ) : (
              <></>
            )
          }
        </div>
      </div>
    </Modal>
  );
};

export default function ListCustomer() {
  const { t: translation } = useTranslation();
  const setting = useSelector((state) => state.setting);
  const user = useSelector((state) => state.member)

  const history = useHistory();
  const [listDataCustomers, setListDataCustomer] = useState({
    data: [],
    total: 0,
  });
  const [percents, setPercents] = useState([]);
  const [isModalProgress, setisModalProgress] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [crimePlateNumber, setCrimePlateNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSendMessage, setIsSendMessage] = useState(false);
  const [isUploadFile, setIsUploadFile] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState({});
  const [upload, setUpload] = useState(false);
  const [message, setMessage] = useState({
    message: "",
    button: translation("listCustomers.selectAll", {
      total: listDataCustomers.total,
    }),
  });
  const [dataFilter, setDataFilter] = useState({
    filter: {},
    skip: 0,
    limit: 20,
    searchText: undefined,
    endDate: undefined,
    startDate: undefined,
    order: {
      key: 'customerRecordId',
      value: 'desc'
    }
  });
  const [dateBySelect, setDateBySelect] = useState("");
  const [fileSelected, setFileSelected] = useState(undefined);
  const [selectingFileTemplate, setSelectingFileTemplate] = useState(undefined);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [url, setUrl] = useState(null);
  const [loadingUrl, setLoadingUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messageType, setMessageType] = useState("");
  const [isModalSMSOpen, setIsModalSMSOpen] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const { setUrlForModalDirectLink } = useModalDirectLinkContext();
  const inputRef = useRef();
  const listVehicleType = optionVehicleType(translation);
  const MESSAGE_CUMTOMER_MARKETING_ERROR = getMessageCustomerMarketingError(translation);
  const onExportListCustomers = () => {
    setLoadingUrl(true);
    ListCustomersService.exportListCustomers({
      ...dataFilter,
      skip: undefined,
      limit: undefined,
    }).then((url) => {
      setTimeout(() => { 
        if (url) {
          // setUrl(url);
          setUrlForModalDirectLink(url)
        } else {
          notification["error"]({
            description: translation("listCustomers.exportFailed"),
          });
        }
        setLoadingUrl(false);
      }, 500)
    });
  };

  const columns = [
    {
      title: translation("landing.index"),
      dataIndex: "customerRecordId",
      key: "customerRecordId",
      width: MIN_COLUMN_WIDTH,
      render: (_, __, index) => {
        return (
          <div className="d-flex justify-content-center align-items-center">
            {dataFilter.skip ? dataFilter.skip + index + 1 : index + 1}
          </div>
        );
      },
    },
    {
      title: translation("listSchedules.fullName"),
      key: "customerRecordFullName",
      dataIndex: "customerRecordFullName",
      render: (_, record) => {
        return (
          <div>
            <div>{record.customerRecordFullName}</div>
            <div style={{ color: '#40E0D0', fontSize: 'smaller' }}>{record?.companyName}</div>
          </div>
        );
      },
      width: EXTRA_BIG_COLUMND_WITDTH,
    },
    {
      title: translation("accreditation.phoneNumber"),
      dataIndex: "customerRecordPhone",
      key: "customerRecordPhone",
      width: VERY_BIG_COLUMN_WIDTH,
      render: (_, record) => {
        return (
          <div className="disflex">
            {record.customerRecordPhone && (
              <div
                className="blue-text"
                onClick={() => {
                  setIsModalSMSOpen(true);
                  setCustomerId(record.customerRecordId);
                }}
              >
                {record.customerRecordPhone}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: translation("Email"),
      key: "customerRecordEmail",
      dataIndex: "customerRecordEmail",
      width: EXTRA_BIG_COLUMND_WITDTH,
      render: (_, record) => {
        return <div className="blue-text">{record.customerRecordEmail}</div>;
      },
    },
    {
      title: translation("accreditation.licensePlates"),
      dataIndex: "customerRecordPlatenumber",
      key: "customerRecordPlatenumber",
      width: widthLicensePlate,
      ellipsis: true,
      render: (_, item) => {
        const { hasCrime, customerRecordPlatenumber, customerRecordPlateColor } = item;
        const splitText =
          customerRecordPlatenumber.length >= 14
            ? `${customerRecordPlatenumber.slice(0, 14)}`
            : customerRecordPlatenumber;
        if (!hasCrime) {
          return (
            <TagVehicle color={getIndexTagVehicleFromColor(customerRecordPlateColor)}>
              {splitText}
            </TagVehicle>
          );
        }
        return (
          <TagVehicleWarn onClick={()=>{setCrimePlateNumber(customerRecordPlatenumber)}}>
						{splitText}
					</TagVehicleWarn>
        );
      },
    },
    {
      title: translation("listCustomers.dateEnd"),
      key: "customerRecordCheckExpiredDate",
      dataIndex: "customerRecordCheckExpiredDate",
      width: VERY_BIG_COLUMN_WIDTH,
      render: (item) => {
        const itemSlice = item.length >= 10 ? `${item.slice(0, 10)}` : item;
        return <div>{itemSlice}</div>;
      },
    },
    {
      title: translation("listCustomers.act"),
      key: "action",
      // width: BIG_COLUMN_WIDTH,
      render: (_, record) => {
        return (
          <Space size="middle">
            <span
              onClick={() => {
                onOpenModal(record);
                if (inputRef && inputRef.current) {
                  setTimeout(() => {
                    inputRef.current.focus();
                  }, 0);
                }
              }}
              style={{ cursor: "pointer", color: "var(--primary-color)" }}
            >
              {translation("listCustomers.edit")}
            </span>
            <Popconfirm
              title={translation("listCustomers.confirm-delete")}
              onConfirm={() => {
                onDeleteCustomer(record && record.customerRecordId);
              }}
              okText={translation("category.yes")}
              cancelText={translation("category.no")}
            >
              <span style={{ cursor: "pointer", color: "var(--primary-color)" }}>
                {translation("listCustomers.delete")}
              </span>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const LIST_SMS_EMAIL = [
    {
      id: 1,
      value: "all",
      label: translation("listCustomers.filterBySmsEmail"),
    },
    {
      id: 2,
      value: "SMS",
      label: "SMS",
    },
    {
      id: 3,
      value: "EMAIL",
      label: "EMAIL",
    },
  ];

  const onFilterByVehicleType = (value) => {
    const filter = { ...dataFilter.filter };
    if (!value) {
      delete filter.customerRecordvehicleType;
    } else {
      filter.customerRecordvehicleType = value;
    }
    setDataFilter({ ...dataFilter, filter });
    fetchData({ ...dataFilter, filter });
  };

  const toggleMessageModal = () => {
    setIsSendMessage((prev) => !prev);
  };

  const toggleUploadModal = () => {
    setIsUploadFile((prev) => !prev);
  };

  //   const headerButtons = [
  //     {
  //       key: "SMS",
  //       name: translation("listCustomers.typeMessage"),
  //       onClick: toggleMessageModal,
  //     },
  //     {
  //       key: "upload",
  //       name: translation("listCustomers.upload"),
  //       onClick: toggleUploadModal,
  //     },
  //     {
  //       key: "export",
  //       name: translation("listCustomers.export"),
  //       onClick: onExportListCustomers,
  //     },
  //   ];

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      if (selectedRowKeys.length > 0) {
        let arrCustomers = [];
        selectedRows.forEach((cus) => {
          let customer = {
            customerMessageEmail: cus.customerRecordEmail,
            customerMessagePhone: cus.customerRecordPhone,
            customerRecordPlatenumber: cus.customerRecordPlatenumber,
            customerId: cus.appUserId,
            customerRecordCheckExpiredDate: cus.customerRecordCheckExpiredDate
          }
          arrCustomers.push(customer);
        });
        setSelectedCustomers(arrCustomers);
        setSelectedRowKeys(selectedRowKeys);
        if (selectedRowKeys.length === listDataCustomers.total) {
          setMessage({
            button: translation("listCustomers.undo"),
            message: `${listDataCustomers.total} ${translation(
              "listCustomers.selected"
            )}`,
          });
          return;
        }

        if (selectedRowKeys.length === listDataCustomers.data.length) {
          setMessage({
            button: translation("listCustomers.selectAll", {
              total: listDataCustomers.total,
            }),
            message: `${selectedRowKeys.length} ${translation(
              "listCustomers.selected"
            )}`,
          });
          return;
        }

        setMessage({
          button: translation("listCustomers.selectAll", {
            total: listDataCustomers.total,
          }),
          message: `${selectedRowKeys.length} ${translation(
            "listCustomers.selected"
          )}`,
        });
      } else {
        setMessage({
          button: translation("listCustomers.selectAll", {
            total: listDataCustomers.total,
          }),
          message: "",
        });
        setSelectedCustomers([]);
        setSelectedRowKeys([]);
      }
    },
    preserveSelectedRowKeys: true,
  };

  const fetchData = (filter) => {
    ListCustomersService.getData(filter).then((result) => {
      if (result) {
        setListDataCustomer(result);
      }
    });
  };

  useEffect(() => {
    isMobileDevice(window.outerWidth)
    fetchData(dataFilter);
  }, []);

  const onSearch = (value) => {
    dataFilter.searchText = value || undefined;
    dataFilter.skip = 0;
    setDataFilter({ ...dataFilter });
    fetchData(dataFilter);
  };

  const onFilterBySmsEmail = (filterSelect) => {
    // create new state objects
    const filter = {
      ...dataFilter.filter,
      customerMessageCategory: filterSelect,
    };
    switch (filterSelect) {
      case LIST_SMS_EMAIL[1].value:
        filter.customerRecordSMSNotifyDate = dateBySelect
          ? dateBySelect.format()
          : undefined;
        filter.customerRecordEmailNotifyDate = undefined;
        break;
      case LIST_SMS_EMAIL[2].value:
        filter.customerRecordSMSNotifyDate = undefined;
        filter.customerRecordEmailNotifyDate = dateBySelect
          ? dateBySelect.format()
          : undefined;
        break;
      default:
        filter.customerRecordSMSNotifyDate = undefined;
        filter.customerRecordEmailNotifyDate = undefined;
        filter.customerMessageSentDate = dateBySelect
          ? dateBySelect.format()
          : undefined;
        break;
    }
    setDataFilter({ ...dataFilter, filter });
    setMessageType(filterSelect);
    fetchData({ ...dataFilter, filter });
  };

  const onFilterDateBySmsEmail = (date, dateString) => {
    setDateBySelect(date);

    const filter = { ...dataFilter.filter };
    const dateFormat = moment(dateString).startOf("day").format();
    switch (messageType) {
      case LIST_SMS_EMAIL[1].value:
        filter.customerRecordSMSNotifyDate = dateString
          ? dateFormat
          : undefined;
        filter.customerRecordEmailNotifyDate = undefined;
        break;
      case LIST_SMS_EMAIL[2].value:
        filter.customerRecordSMSNotifyDate = undefined;
        filter.customerRecordEmailNotifyDate = dateString
          ? dateFormat
          : undefined;
        break;
      default:
        filter.customerRecordSMSNotifyDate = undefined;
        filter.customerRecordEmailNotifyDate = undefined;
        filter.customerMessageSentDate = dateString ? dateFormat : undefined;
        break;
    }
    // currentFilter[currentFilterKey] = dateString ? dateFormat : undefined;
    setDataFilter({ ...dataFilter, filter });
    fetchData({ ...dataFilter, filter });
  };

  const onFilterByDate = (date, dateString) => {
    if (date) {
      let start = dateString[0];
      let end = dateString[1];
      dataFilter.startDate = start;
      dataFilter.skip = 0;
      dataFilter.endDate = end;
      setDataFilter({ ...dataFilter });
      fetchData(dataFilter);
    } else {
      dataFilter.startDate = undefined;
      dataFilter.endDate = undefined;
      dataFilter.skip = 0;
      setDataFilter({ ...dataFilter });
      fetchData(dataFilter);
    }
  };

  const toggleEditModal = () => {
    setIsEditing((prev) => !prev);
  };

  const onOpenModal = (customer) => {
    toggleEditModal();
    setSelectedCustomer(customer);
  };

  const onUpdateCustomer = (values) => {
    values.customerRecordCheckDuration = values.customerRecordCheckDuration || 0;
    ListCustomersService.updateCustomerInfo({
      id: selectedCustomer.customerRecordId,
      ...values,
      customerRecordCheckDate:
        moment(values.customerRecordCheckDate).format("DD/MM/YYYY") || "",
      customerRecordCheckExpiredDate: values.customerRecordCheckExpiredDate ?
        moment(values.customerRecordCheckExpiredDate)
          .add(Number(values.customerRecordCheckDuration || 0), "months")
          .format("DD/MM/YYYY") || "" : "",
    }).then((result) => {
      const { statusCode, error } = result
      if (statusCode === 200 ) {
        notification["success"]({
          message: "",
          description: translation("listCustomers.updateSuccess"),
        });
        toggleEditModal();
        fetchData(dataFilter);
        return true;
      }
      if(error === ERROR_FAILED.INVALID_PLATE_NUMBER){
        notification["error"]({
          message: "",
          description: translation("error.INVALID_PLATE_NUMBER"),
        });
        return
      }
      notification["error"]({
        message: "",
        description: translation("listCustomers.updateFailed"),
      });
      return false;
    });
  };

  const onDeleteCustomer = (id) => {
    ListCustomersService.deleteCustomerById(id).then((result) => {
      if (result && result.isSuccess) {
        notification["success"]({
          message: "",
          description: translation("listCustomers.deleteSuccess"),
        });
        fetchData(dataFilter);
      } else {
        notification["error"]({
          message: "",
          description: translation("listCustomers.deleteFailed"),
        });
      }
    });
  };

  const onUploadFile = () => {
    setFileSelected(true)
    // const { file } = info
    // // const file = e.target.files[0] || undefined;
    // if (file && file.type && !XLSX_TYPE.includes(file.type)) {
    //   notification["warn"]({
    //     message: "",
    //     description: translation("listCustomers.wrongfile"),
    //   });
    // } else {
    //   convertFileToBase64(file.originFileObj).then((dataUrl) => {
    //     const newData = dataUrl.replace(/,/gi, "").split("base64");
    //     if (newData[1]) {
    //       const data = {
    //         file: newData[1],
    //         fileFormat: "xlsx",
    //       };
    //       setFileSelected({
    //         name: file.name,
    //         data: data,
    //       });
    //     }
    //   });
    // }
  };

  const onImportFileToDb = (arr) => {
    const cleanedCustomers = arr.map(({ customerIndex, customerRecordAdress, ...rest }) => rest);
    const newArr = cleanedCustomers.map(el => {
      return {...el, customerStationId : user.stationsId}
    })
    setPercents(newArr)
    setisModalProgress(true)
    setFileSelected(true)
    // const fetchPromises = arr.map(url => 
    //    AccreditationService.createNewCustomer()
    // );
    // if (!fileSelected) {
    //   notification["warn"]({
    //     message: "",
    //     description: translation("listCustomers.wrongfile"),
    //   });
    //   return;
    // }

    //   setIsLoading(true);
    //   uploadService
    //     .importDataCustomers({ ...fileSelected.data, fileTemplate: selectingFileTemplate })
    //     .then((result) => {
    //       if (result && Object.keys(result).length > 0) {
    //         fetchData(dataFilter);
    //         setFileSelected(undefined);
    //         setIsUploadFile(false);
    //         if (result.importTotalWaiting) {
    //           notification["success"]({
    //             message: translation("listCustomers.total", {
    //               num: result.importTotalWaiting,
    //             }),
    //             description: translation("listCustomers.importTotalWaiting", {
    //               min: (result.importTotalWaiting / 50 / 60).toFixed(2),
    //             }),
    //           });
    //         } else {
    //           notification["success"]({
    //             message: translation("listCustomers.total", {
    //               num: result.importTotal,
    //             }),
    //             description: `${translation("listCustomers.importSuccess", {
    //               num: result.importSuccess,
    //             })}. 
		// 														${translation(
    //               "listCustomers.importSuccessFail",
    //               {
    //                 num:
    //                   result.importTotal - result.importSuccess,
    //               }
    //             )}`,
    //           });
    //         }
    //       } else {
    //         notification["error"]({
    //           message: "",
    //           description: translation("listCustomers.importTypeFailed"),
    //         });
    //       }
    //       setIsLoading(false);
    //       setUpload(false)
    //     });
    
  };
  function handleSelectAll() {
    if (message.message.includes(listDataCustomers.total.toString())) {
      rowSelection.onChange([], []);
    } else {
      let arrKey = [];
      listDataCustomers.data.forEach((item) => {
        arrKey.push(item.key);
      });
      //click select all => send message by filter
      setSelectedRowKeys(arrKey);
      setMessage({
        button: translation("listCustomers.undo"),
        message: `${listDataCustomers.total} ${translation(
          "listCustomers.selected"
        )}`,
      });
    }
  }

  function sendMessageByList(dataCustomerToSendMessage) {
    history.push(`${routes.sms.path}/sendSMS`, {
      data: dataCustomerToSendMessage
    });
  }

  const handleChangePage = (pageNum) => {
    const newFilter = {
      ...dataFilter,
      skip : (pageNum -1) * dataFilter.limit
    }
    setDataFilter(newFilter)
    fetchData(newFilter)
  }

  function sendMessageByFilter({
    customerMessageContent,
    customerMessageCategories,
    customerMessageTemplateId,
    filter = {},
  }) {
    MessageService.sendMessageByFilter({
      customerMessageContent,
      customerMessageCategories,
      customerMessageTemplateId,
      filter,
    }).then((result) => {
      if (result.isSuccess) {
        setIsSendMessage(false);
        notification.success({
          message: "",
          description: translation("listCustomers.sendSuccess"),
        });
        return true;
      } else {
        notification.error({
          message: "",
          description: translation("listCustomers.sendFailed"),
        });
        return false;
      }
    });
  }
  const onSendMessage = (values) => {
    if (selectedCustomers.length === 0) {
      notification.error({
        message: "",
        description: translation("listCustomers.noSelected"),
      });
      return false;
    } else {
      if (values) {
        //   // convert message
        let selectedCustomersApi = [...selectedCustomers];
        for (let i = 0; i < selectedCustomersApi.length; i++) {
          let dataObject = {
            stationsName: values.stationsName,
            stationCode: values.stationCode,
            stationsAddress: values.stationsAddress,
            stationsHotline: values.stationsHotline,
            customerRecordPlatenumber: selectedCustomersApi[i].customerRecordPlatenumber,
            vehiclePlateNumber: selectedCustomersApi[i].customerRecordPlatenumber,
            customerRecordCheckExpiredDate: selectedCustomersApi[i].customerRecordCheckExpiredDate,
            stationsHotline: values.stationsHotline,
          };
          selectedCustomersApi[i].customerMessageContent = Handlebars.compile(values.customerMessageContent)(dataObject);
        }
        let dataCustomerToSendMessage = {
          messageTemplateId: values.customerMessageTemplateId,
          template: values,
          customerList: selectedCustomersApi
        }
        //send by list
        const status = sendMessageByList(dataCustomerToSendMessage);
        return status;
      }
    }
  };
  function chunkArray(arrData, chunkSize) {
    var arrayResult = [];
    for (var i = 0; i < arrData.length; i += chunkSize) {
      arrayResult.push(arrData.slice(i, i + chunkSize));
    }
    return arrayResult;
  }
  const onChangeSearchText = (e) => {
    setDataFilter({
      ...dataFilter,
      searchText: e.target.value.length > 0 ? e.target.value : undefined,
    });
  };

  const isMobileDevice = (value) =>{
    if(value < 768 ){
      dataFilter.limit = 10
    }
  }

  return (
    <Fragment>
    {setting.enableCustomerMenu === 0 ? <UnLock /> : 
     <main className="list_customers">
      <div className="row">
        {/* <div className="col-12 col-md-12 col-lg-12 col-xl-2">
          <label className="section-title pl-3">
            {translation("listCustomers.listCustomers")}
          </label>
        </div> */}
        {/* <div className="col-md-0 col-lg-0 col-xl-3 mb-3" /> */}
        <div className="col-md-6 col-lg-3 mb-3">
          <Input.Search
            autoFocus
            placeholder={translation("listCustomers.search")}
            onChange={onChangeSearchText}
            onSearch={onSearch}
          />
        </div>
        <div className="col-md-6 col-sm-12 col-lg-3 mb-3">
					<RangePicker
						className="w-100"
						format="DD/MM/YYYY"
						onChange={onFilterByDate}
						placeholder={[
							translation("listCustomers.startDate"),
							translation("listCustomers.endDate"),
						]}
					/>
				</div>
        {/* <div className="col-md-5 col-lg-3 col-xl-2 mb-3">
					<Select
						className="w-100"
						placeholder={translation("listCustomers.vehicleType")}
						onChange={onFilterByVehicleType}
					>
						<Option value="">{translation("all")}</Option>
						{
									listVehicleType.map(item => {
										return (
											<Option value={item.value} key={item.value}>{item.label}</Option>
										)
									})
								}
					</Select>
				</div> */}
        <div className="col-12 col-md-12 col-lg-5 col-xl-4 mb-3">
          <div className="d-flex flex-wrap gap-4 justify-content-xl-start justify-content-lg-start">
            <Button
              onClick={toggleUploadModal}
              className="d-flex align-items-center gap-1"
              icon={<VectorIcon />}  
            >
              {translation("listCustomers.upload")}
            </Button>
            {/* {url ? (
              <Button
                onClick={() => {
                  setLoadingUrl(null)
                }}
                className="d-flex align-items-center gap-1"
                icon={loadingUrl ? <Spin /> : <AnphaIcon />}
              >
                <a href={url} target="_blank">{translation("Tải về")}</a>
              </Button>
            ) : ( */}
              <Button
                onClick={onExportListCustomers}
                className="d-flex align-items-center gap-1"
                icon={loadingUrl ? <Spin /> : <AnphaIcon />}
              >
                {translation("listCustomers.export")}
              </Button>
              {!!setting.enableMarketingMessages && (
              <Button
                onClick={toggleMessageModal}
                type="primary"
                icon={<UnionIcon />}
                className="d-flex align-items-center gap-1"
              >
                {translation("listCustomers.typeMessage")}
              </Button>
            )}
            {/* )} */}
            <Button
              className="d-flex justify-content-center align-items-center"
              type="default"
              loading={loading}
              disabled={loading}
              onClick={() => {
                setLoading(true);
                setTimeout(() => {
                  fetchData(dataFilter);
                  setLoading(false);
                }, BUTTON_LOADING_TIME);
              }}
            >
              {!loading && <ReloadOutlined className="addIcon" />}
            </Button>
          </div>
        </div>
      </div>
      {message.message && (
        <div className="d-flex justify-content-center pb-3">
          <div>
            <Button disabled type="text">
              {message.message}
            </Button>
            {/* <Button type="text" onClick={handleSelectAll}>
							{message.button}
						</Button> */}
          </div>
        </div>
      )}
      <div className="list_customers">
        <Table
          dataSource={listDataCustomers.data}
          rowSelection={{ ...rowSelection, selectedRowKeys: selectedRowKeys }}
          columns={columns}
          scroll={{ x: 1312 }}
          pagination={false}
        />
        <BasicTablePaging handlePaginations={handleChangePage} skip={dataFilter.skip} count={listDataCustomers?.data?.length < dataFilter?.limit}></BasicTablePaging>
      </div>
      <ModalEditUserInfo
        isEditing={isEditing}
        toggleEditModal={toggleEditModal}
        onUpdateCustomer={onUpdateCustomer}
        selectedCustomer={selectedCustomer}
        inputRef={inputRef}
      />
      <ModalMessage
        visible={isSendMessage}
        toggleMessageModal={toggleMessageModal}
        onSendMessage={onSendMessage}
        message={message.message}
      />
      <ModalUpload
        visible={isUploadFile}
        toggleUploadModal={toggleUploadModal}
        onUploadFile={onUploadFile}
        file={fileSelected}
        selectingFileTemplateChanged={setSelectingFileTemplate}
        onImportFileToDb={onImportFileToDb}
        isLoading={isLoading}
        dataFilter={dataFilter}
        upload={upload}
        setUpload={setUpload}
      />
      <SMSListModal
        id={customerId}
        visible={isModalSMSOpen}
        onClose={() => setIsModalSMSOpen(false)}
      />
      {!!crimePlateNumber && (
        <ModalCrime
          plateNumber={crimePlateNumber}
          onClose={() => setCrimePlateNumber("")}
        />
      )}
        {isModalProgress && (
        <ModalProgressCustomer
          visible={isModalProgress}
          setVisible={setisModalProgress}
          data={percents}
          setUpload={setUpload}
          toggleUploadModal={toggleUploadModal}
          setFileSelected={setFileSelected}
          fetchData={fetchData}
          dataFilter={dataFilter}
        />
      )}
     </main>
    }
    </Fragment>
  );
}
