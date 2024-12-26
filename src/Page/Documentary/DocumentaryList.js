import React, { useState, useEffect, useRef, Fragment } from "react";
import "./index.scss";
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
  Pagination,
  Popconfirm,
  Tabs
} from "antd";
import {
  ExceptionOutlined, ReloadOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import listDocumentaryService from "../../services/listDocumentaryService";
import moment from "moment";
import { convertFileToBase64 } from "../../helper/common";
import uploadService from "../../services/uploadService";
import MessageService from "../../services/messageService";
import ModalEditDocumentary from "./ModalEditDocumentary";
import { EmailSendIcon } from "assets/icons";
import { UnionIcon } from "./../../assets/icons";
import { VectorIcon } from "./../../assets/icons";
import { AnphaIcon } from "./../../assets/icons";
import { MassIcon } from "./../../assets/icons";
import { SubmittedIcon } from "./../../assets/icons";
import { Not_yetIcon } from "./../../assets/icons";
import { BUTTON_LOADING_TIME } from "constants/time";
import { Eye } from "../../assets/icons"
import { READING_STATUS } from 'constants/listDocumentary'
import UnLock from 'components/UnLock/UnLock';
import { useSelector } from 'react-redux'
import BasicTablePaging from 'components/BasicTablePaging/BasicTablePaging';
import { NORMAL_COLUMN_WIDTH } from "constants/app";
import { EXTRA_BIG_COLUMND_WITDTH } from "constants/app";
import { BIG_COLUMN_WIDTH } from "constants/app";
import { VERY_BIG_COLUMN_WIDTH } from "constants/app";

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;


export default function DocumentaryList() {
  const { t: translation } = useTranslation();
  const [listDocumentary, setListDocumentary] = useState({
    data: [],
    total: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [crimePlateNumber, setCrimePlateNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSendMessage, setIsSendMessage] = useState(false);
  const [isUploadFile, setIsUploadFile] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState({});
  const [message, setMessage] = useState({
    message: "",
    button: translation("listCustomers.selectAll", {
      total: listDocumentary.total,
    }),
  });
  const [dataFilter, setDataFilter] = useState({
    filter: {
      documentPublishedDay: undefined
    }, 
    skip: 0, 
    limit: 20,
    searchText: undefined
  });
  const setting = useSelector((state) => state.setting);
  const [dateBySelect, setDateBySelect] = useState("");
  const [fileSelected, setFileSelected] = useState(undefined);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [messageType, setMessageType] = useState("");
  const [isModalSMSOpen, setIsModalSMSOpen] = useState(false);
  const [isMobie, setIsMobie] = useState(false);
  const [item, setItem] = useState([])
  const inputRef = useRef();

  const fetchDocumentById = (id) => {
    listDocumentaryService.getDetailDocument(id).then((result) => {
      if (result) {
        setItem(result);
      }
    });
    fetchData(dataFilter);
  };

  const columns = [
    {
      title: translation("listDocumentary.index"),
      key: "index",
      width: NORMAL_COLUMN_WIDTH,
      align: "center",
      render: (_, __, index) => {
        return (
          <div className='d-flex justify-content-center aligns-items-center'>
            {dataFilter.skip ? dataFilter.skip + index + 1 : index + 1 }
          </div>
        )
      },
    },
    {
      title: translation("listDocumentary.DocumentaryCode"),
      key: "documentCode",
      dataIndex: "documentCode",
      align: "center",
      width: EXTRA_BIG_COLUMND_WITDTH,
      render: (value, record) => {
        return <div
          onClick={() => {
            fetchDocumentById(record.stationDocumentId)
            onOpenModal(record);
            if (inputRef && inputRef.current) {
              setTimeout(() => {
                inputRef.current.focus();
              }, 0);
            }
          }}
          style={{ cursor: "pointer" }}
        >{value}</div>
      }
    },
    {
      title: translation("listDocumentary.title"),
      key: "documentTitle",
      dataIndex: "documentTitle",
      align: "left"
    },
    {
      title: translation("listDocumentary.documentPublishedDay"),
      key: "documentPublishedDay",
      dataIndex: "documentPublishedDay",
      align: "center",
      width: BIG_COLUMN_WIDTH
    },
    {
      title: translation("listDocumentary.status"),
      key: "readStatus",
      dataIndex: "readStatus",
      align: "center",
      width: BIG_COLUMN_WIDTH,
      render: (_, record) => {
        const { readStatus } = record
        return (
          <div className="d-inline-flex aligns-items-center">{readStatus === READING_STATUS.ALREADY_READ ?
            <p className="color_none mb-0">{translation("listDocumentary.read")}</p>
            : <p className="color_active mb-0">{translation("listDocumentary.new_release")}</p>}</div>
        )
      }
    },
    {
      title: translation("listCustomers.act"),
      key: "action",
      width: VERY_BIG_COLUMN_WIDTH,
      align: "center",
      render: (_, record) => {
        return (
          <Space size="middle">
            {/* <Eye className="mr-3" /> */}
            <span
              onClick={() => {
                fetchDocumentById(record.stationDocumentId)
                onOpenModal(record);
                if (inputRef && inputRef.current) {
                  setTimeout(() => {
                    inputRef.current.focus();
                  }, 0);
                }
              }}
              style={{ cursor: "pointer", color: "var(--primary-color)" }}
            >
              {translation("listDocumentary.see_details")}
            </span>
          </Space>
        );
      },
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      if (selectedRowKeys.length > 0) {
        if (selectedRowKeys.length === listDocumentary.total) {
          setMessage({
            button: translation("listCustomers.undo"),
            message: `${listDocumentary.total} ${translation(
              "listCustomers.selected"
            )}`,
          });
        } else if (selectedRowKeys.length === listDocumentary.data.length) {
          setMessage({
            button: translation("listCustomers.selectAll", {
              total: listDocumentary.total,
            }),
            message: `${selectedRowKeys.length} ${translation(
              "listCustomers.selected"
            )}`,
          });
        } else {
          setMessage({
            button: translation("listCustomers.selectAll", {
              total: listDocumentary.total,
            }),
            message: `${selectedRowKeys.length} ${translation(
              "listCustomers.selected"
            )}`,
          });
        }
        let arrCustomers = [];
        selectedRows.forEach((cus) => {
          arrCustomers.push(cus.customerRecordId);
        });
        setSelectedCustomers(arrCustomers);
        setSelectedRowKeys(selectedRowKeys);
      } else {
        setMessage({
          button: translation("listCustomers.selectAll", {
            total: listDocumentary.total,
          }),
          message: "",
        });
        setSelectedCustomers([]);
        setSelectedRowKeys([]);
      }
    },
  };

  const fetchData = (filter) => {
    listDocumentaryService.getData(filter).then((result) => {
      if (result) {
        setListDocumentary(result);
      }
    });
  };

  useEffect(() => {
    isMobileDevice(window.outerWidth)
    if(isMobileDevice(window.outerWidth) === true){
      setIsMobie(true)
      dataFilter.limit = 10
    }
    fetchData(dataFilter);
  }, []);

  const handleChangePage = (pageNum) => {
    const newFilter = {
      ...dataFilter,
      skip : (pageNum -1) * dataFilter.limit
    }
    setDataFilter(newFilter)
    fetchData(newFilter)
  }

  const onSearch = (value) => {
    const newFilter = { ...dataFilter };
    newFilter.skip = 0;
    if (!value) {
      newFilter.searchText = undefined;
    } else {
      newFilter.searchText = value;
    }
    setDataFilter(newFilter)
    fetchData(newFilter);
  };

  const onFilterByDate = (date, dateString) => {
    const newDataFilter = { ...dataFilter };
    newDataFilter.skip = 0;
    if (dateString) {
      newDataFilter.filter.documentPublishedDay = dateString
    } else {
      delete newDataFilter.filter.documentPublishedDay
    }
    setDataFilter(newDataFilter)
    fetchData(newDataFilter)
  };

  const toggleEditModal = () => {
    setIsEditing((prev) => !prev);
  };

  const onOpenModal = (customer) => {
    toggleEditModal();
    setSelectedCustomer(customer);
  };

  const onUpdateCustomer = (values) => {
    listDocumentaryService.updateCustomerInfo({
      id: selectedCustomer.customerRecordId,
      ...values,
      customerRecordCheckDate:
        moment(values.customerRecordCheckDate).format("DD/MM/YYYY") || "",
      customerRecordCheckExpiredDate:
        moment(values.customerRecordCheckDate)
          .add(Number(values.customerRecordCheckDuration), "months")
          .subtract(1, "day")
          .format("DD/MM/YYYY") || "",
    }).then((result) => {
      if (result && result.isSuccess) {
        notification["success"]({
          message: "",
          description: translation("listCustomers.updateSuccess"),
        });
        toggleEditModal();
        fetchData(dataFilter);
        return true;
      }
      notification["error"]({
        message: "",
        description: translation("listCustomers.updateFailed"),
      });
      return false;
    });
  };


  function handleSelectAll() {
    if (message.message.includes(listDocumentary.total.toString())) {
      rowSelection.onChange([], []);
    } else {
      let arrKey = [];
      listDocumentary.data.forEach((item) => {
        arrKey.push(item.key);
      });
      //click select all => send message by filter
      setSelectedRowKeys(arrKey);
      setMessage({
        button: translation("listCustomers.undo"),
        message: `${listDocumentary.total} ${translation(
          "listCustomers.selected"
        )}`,
      });
    }
  }

  const onChangeSearchText = (e) => {
    e.preventDefault()
    setDataFilter({ ...dataFilter,skip:0, searchText: e.target.value ? e.target.value : undefined })
  };

  const isMobileDevice = (value) =>{
    if(value < 768 ){
     return true
    } 
      return false
    }

  return (
    <Fragment>
      {setting.enableDocumentMenu === 0 ? <UnLock /> :
       <main className="list_customers">
      <div className="row">
        {/* <div className="col-12 col-md-6 col-lg-4 col-xl-7">
          <label className="section-title pl-3">
            {translation("listDocumentary.listDocumentary")}
          </label>
        </div>
        <div className="col-12 col-xl-1" /> */}
        <div className="col-6 col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-2 mb-3">
          <Input.Search
            autoFocus
            placeholder={translation("listCustomers.search")}
            onChange={onChangeSearchText}
            value={dataFilter.searchText}
            onSearch={onSearch}
          />
        </div>
        <div className="col-6 col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-2 mb-3">
          <DatePicker
            className="w-100"
            format="DD/MM/YYYY"
            value={dataFilter.documentPublishedDay}
            onChange={onFilterByDate}
            placeholder={translation("listDocumentary.documentPublishedDay")}
          />
        </div>
      </div>

      {message.message && (
        <div className="d-flex justify-content-center pb-3">
          <div>
            <Button disabled type="text">
              {message.message}
            </Button>
            <Button type="text" onClick={handleSelectAll}>
              {message.button}
            </Button>
          </div>
        </div>
      )}
      <div className="list_customers__body">
        <Table
          dataSource={listDocumentary.data}
          columns={columns}
          scroll={{ x: 1440 }}
          pagination={false}
        />
        <BasicTablePaging handlePaginations={handleChangePage} skip={dataFilter.skip} count={listDocumentary?.data?.length < dataFilter.limit}></BasicTablePaging>
      </div>
      <ModalEditDocumentary
        isEditing={isEditing}
        toggleEditModal={toggleEditModal}
        item={item}
        />
       </main>
     }
    </Fragment>
  );
}