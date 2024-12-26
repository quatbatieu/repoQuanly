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
  Form,
  List,
  Pagination,
  Popconfirm,
  Select
} from "antd";
import {
  PlusOutlined, ReloadOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import listDocumentaryService from "../../services/listDocumentaryService";
import moment from "moment";
import { convertFileToBase64 } from "../../helper/common";
import uploadService from "../../services/uploadService";
import MessageService from "../../services/messageService";
import ModalEditDocumentary from "./ModalEditDocumentary";
import ModalAddDocumentary from "./ModalAddDocumentary";
import ModalDetailDocumentary from "./ModalDetailDocumentary";
import { EmailSendIcon } from "assets/icons";
import { UnionIcon } from "../../assets/icons";
import { VectorIcon } from "../../assets/icons";
import { AnphaIcon } from "../../assets/icons";
import { MassIcon } from "../../assets/icons";
import { SubmittedIcon } from "../../assets/icons";
import { Not_yetIcon } from "../../assets/icons";
import { BUTTON_LOADING_TIME } from "constants/time";
import { Eye } from "../../assets/icons"
import { READING_STATUS,DOCUMENT_CATEGORY } from 'constants/listDocumentary'
import UnLock from 'components/UnLock/UnLock';
import { useSelector } from 'react-redux'
import { isMobileDevice } from "constants/account";
import BasicTablePaging from "components/BasicTablePaging/BasicTablePaging";

const { RangePicker } = DatePicker;

export default function File() {
  const { t: translation } = useTranslation();
  const [listDocumentary, setListDocumentary] = useState({
    data: [],
    total: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [formAdd] = Form.useForm()
  const [formEdit] = Form.useForm();
  const [crimePlateNumber, setCrimePlateNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDetail, setIsDetail] = useState(false);
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
      documentPublishedDay: undefined,
      documentCategory:undefined
    },
    skip: 0, 
    limit: 20,
    searchText: undefined
  });
  const [dateBySelect, setDateBySelect] = useState("");
  const [fileSelected, setFileSelected] = useState(undefined);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [messageType, setMessageType] = useState("");
  const [isModalSMSOpen, setIsModalSMSOpen] = useState(false);
  const [customerId, setCustomerId] = useState();
  const [item, setItem] = useState([])
  const inputRef = useRef();
  const setting = useSelector((state) => state.setting);
  const [isMobie, setIsMobie] = useState(false);
  
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
      title: translation("file.index"),
      key: "index",
      width: 120,
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
      title: translation("file.documentCode"),
      key: "documentCode",
      dataIndex: "documentCode",
      align: "center",
      width: 250,
      render: (value, record) => {
        return <div
          onClick={() => {
            fetchDocumentById(record.stationDocumentId)
            toggleDetailModal();
          }}
          style={{ cursor: "pointer" }}
        >{value}</div>
      }
    },
    {
      title: translation("file.documentTitle"),
      key: "documentTitle",
      dataIndex: "documentTitle",
      align: "left"
    },
    {
      title: translation("file.documentPublishedDay"),
      key: "documentPublishedDay",
      dataIndex: "documentPublishedDay",
      align: "center",
      width: 150
    },
    {
      title: translation("file.status"),
      key: "readStatus",
      dataIndex: "readStatus",
      align: "center",
      width: 150,
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
      width: 300,
      align: "center",
      render: (_, record) => {
        return (
          <Space size="middle">
            {/* <Eye className="mr-3" /> */}
            <span
              onClick={() => {
                fetchDocumentById(record.stationDocumentId)
                toggleDetailModal();
              }}
              style={{ cursor: "pointer", color: "var(--primary-color)" }}
            >
              {translation("listDocumentary.see_details")}
            </span>
            <span
              onClick={() => {
                setIsEditing(true);
                setItem(record);
                if (inputRef && inputRef.current) {
                  setTimeout(() => {
                    inputRef.current.focus();
                  }, 100);
                }
              }}
              style={{ cursor: "pointer", color: "var(--primary-color)" }}
            >
              {translation("listCustomers.edit")}
            </span>
            <Popconfirm
              title={translation("file.confirm-delete")}
              onConfirm={() => {
                onDeleteCustomer(record && record.stationDocumentId)
              }}
              okText={translation("category.yes")}
              cancelText={translation("category.no")}
            >
              <span
                style={{ cursor: "pointer", color: "var(--primary-color)" }}
              >
                {translation("listCustomers.delete")}
              </span>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const onDeleteCustomer = (id) => {
    listDocumentaryService.removeDocument({ id }).then((result) => {
      if (result && result.isSuccess) {
        notification["success"]({
          message: "",
          description: translation("file.deleteSuccess"),
        });
        fetchData(dataFilter);
      } else {
        notification["error"]({
          message: "",
          description: translation("file.deleteFailed"),
        });
      }
    });
  };

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
    listDocumentaryService.getDataStation(filter).then((result) => {
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

  const onSearch = (value) => {
    const newFilter = { ...dataFilter };
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
    if (dateString) {
      newDataFilter.filter.documentPublishedDay = dateString
    } else {
      delete newDataFilter.filter.documentPublishedDay
    }
    setDataFilter(newDataFilter)
    fetchData(newDataFilter)
  };

  const onFilterFileByCategory = (e) => {
    const newDataFilter = { ...dataFilter };
    if (e) {
      newDataFilter.filter.documentCategory  = e
    } else {
    delete newDataFilter.filter.documentCategory
    }
    setDataFilter(newDataFilter)
    fetchData(newDataFilter)
  }

  const toggleEditModal = () => {
    // Nếu tắt modal xem chi tiết gọi thêm fetchData.
    if(isEditing) {
      fetchData(dataFilter)
    }

    setIsEditing((prev) => !prev);
  };

  const toggleDetailModal = () => {
    // Nếu tắt modal xem chi tiết gọi thêm fetchData.
    if (isDetail) {
      fetchData(dataFilter)
    }

    setIsDetail((prev) => !prev);
  };

  const toggleAddModal = () => {
    setIsAdd((prev) => !prev);
  };

  const onOpenModal = (customer) => {
    toggleEditModal();
    setSelectedCustomer(customer);
  };

  const onUpdateCustomer = (data, callback) => {
    listDocumentaryService.updateDocument(data).then((result) => {
      callback();
      if (result && result.isSuccess) {
        notification["success"]({
          message: "",
          description: translation("file.updateSuccess"),
        });
        toggleEditModal();
        fetchData(dataFilter);
        return true;
      }
      notification["error"]({
        message: "",
        description: translation("file.updateFailed"),
      });
      return false;
    });
  };

  const onCrateNew = (newData, callback) => {
    listDocumentaryService.uploadDocument(newData).then(async result => {
      callback();
      if (result && result.isSuccess) {
        notification.success({
          message: "",
          description: translation('file.createSuccess')
        })
        isAdd && setIsAdd(false)
        formAdd.resetFields()
        fetchData(dataFilter)
      } else {
        notification.error({
          message: "",
          description: translation(result.error ? result.error : 'management.addFailed')
        })
      }
    })
  }

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
    setDataFilter({ ...dataFilter, searchText: e.target.value ? e.target.value : undefined })
  };

  const handleChangePage = (pageNum) => {
    const newFilter = {
      ...dataFilter,
      skip : (pageNum -1) * dataFilter.limit
    }
    setDataFilter(newFilter)
    fetchData(newFilter)
  }

  return (
    <Fragment>
      {setting.enableDocumentMenu === 0 ? <UnLock /> :
      <main className="list_customers">
        <div className="row">
          {/* <div className="col-12 col-md-12 col-lg-12 col-xl-4">
            <label className="section-title pl-3">
              {translation("file.list")}
            </label>
          </div> */}
          <div className="col-md-3 col-lg-3 col-xl-2 mb-3">
            <Input.Search
              autoFocus
              placeholder={translation("listCustomers.search")}
              onChange={onChangeSearchText}
              value={dataFilter.searchText}
              onSearch={onSearch}
            />
          </div>
          <div className="col-6 col-xs-6 col-md-3 col-lg-3 col-xl-2 mb-3">
            <DatePicker
              className="w-100"
              format="DD/MM/YYYY"
              value={dataFilter.documentPublishedDay}
              onChange={onFilterByDate}
              placeholder={translation("listDocumentary.documentPublishedDay")}
            />
          </div>
          <div className="col-6 col-xs-6 col-md-3 col-lg-3 col-xl-2 mb-3">
            <Select onChange={onFilterFileByCategory} className="w-100" placeholder='Hồ sơ'>
              <Select.Option value=''>Tất cả hồ sơ</Select.Option>
              {DOCUMENT_CATEGORY.length > 0 && DOCUMENT_CATEGORY.map(item=>(
                <Select.Option key={item.value} value={item.value}>{item.name}</Select.Option>
              ))}
            </Select>
          </div>
          <div className="col-md-3 col-lg-3 col-xl-2 mb-3" onClick={() => setIsAdd(true)}>
            <Button type="primary" className="w-100 d-flex align-items-center justify-content-center" icon={<PlusOutlined />}>
              {translation("file.btnNew")}
            </Button>
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
            // pagination={{
            //   onChange: (current, pageSize) => {
            //     dataFilter.skip = (current - 1) * pageSize
            //     setDataFilter({ ...dataFilter })
            //     fetchData(dataFilter)
            //   },
            //   position: ["bottomRight"],
            //   simple:true,
            //   total: listDocumentary.total,
            //   pageSize: dataFilter.limit,
            //   current: (dataFilter.skip / (dataFilter.limit)) + 1
            // }}
          />
          <BasicTablePaging handlePaginations={handleChangePage} skip={dataFilter.skip} count={listDocumentary?.data?.length < dataFilter.limit}></BasicTablePaging>
        </div>
        {isEditing && (
          <ModalEditDocumentary
            isEditing={isEditing}
            form={formAdd}
            toggleEditModal={toggleEditModal}
            onUpdateCustomer={onUpdateCustomer}
            id={item.stationDocumentId}
          />
        )}
        {isAdd && (
          <ModalAddDocumentary
            isAdd={isAdd}
            form={formAdd}
            inputRef={inputRef}
            onCrateNew={onCrateNew}
            toggleAddModal={toggleAddModal}
          />
        )}
        {isDetail && (
          <ModalDetailDocumentary
            isEditing={isDetail}
            toggleEditModal={toggleDetailModal}
            item={item}
          />
        )}
      </main>
      }
    </Fragment>
  );
}