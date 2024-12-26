import React, { useState, useEffect, useRef } from "react";
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
} from "antd";
import {
  ExceptionOutlined, ReloadOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import stationServicesServices from "../../services/stationServicesServices";
import moment from "moment";
import { convertFileToBase64 } from "../../helper/common";
import uploadService from "../../services/uploadService";
import MessageService from "../../services/messageService";
import ModalEditDocumentary from "./ModalEditDocumentary";
import ModalAddDocumentary from "./ModalAddDocumentary";
import { EmailSendIcon } from "assets/icons";
import { UnionIcon } from "../../assets/icons";
import { VectorIcon } from "../../assets/icons";
import { AnphaIcon } from "../../assets/icons";
import { MassIcon } from "../../assets/icons";
import { SubmittedIcon } from "../../assets/icons";
import { Not_yetIcon } from "../../assets/icons";
import { BUTTON_LOADING_TIME } from "constants/time";
import { Eye } from "../../assets/icons"
import { READING_STATUS } from 'constants/listDocumentary'

const { RangePicker } = DatePicker;

const testData = [
  {
    id: 10001,
    title: "Tiêu đề 1",
    price: 100,
    note: "Ghi chú 1",
    image: "https://hpconnect.vn/wp-content/uploads/2020/02/H%C3%ACnh-%E1%BA%A3nh-phong-c%E1%BA%A3nh-thi%C3%AAn-nhi%C3%AAn-31.jpg",
    content: "Nội dung 1"
  },
  {
    id: 10002,
    title: "Tiêu đề 2",
    price: 200,
    note: "Ghi chú 2",
    image: "http://2.bp.blogspot.com/-VMDINXZau1o/Ucxj16o_TpI/AAAAAAAAAWM/GL6xOtoGaJM/s1600/Nature-2.jpg",
    content: "Nội dung 2"
  },
  {
    id: 10003,
    title: "Tiêu đề 3",
    price: 300,
    note: "Ghi chú 3",
    image: "https://tse1.mm.bing.net/th?id=OIP.croavazZNL_rX6KHN45CbwHaEo&pid=Api&P=0&h=180",
    content: "Nội dung 3"
  },
  {
    id: 10004,
    title: "Tiêu đề 4",
    price: 400,
    note: "Ghi chú 4",
    image: "https://dbk.vn/uploads/ckfinder/images/tranh-anh/Anh-thien-nhien-26.jpg",
    content: "Nội dung 4"
  },
  {
    id: 10005,
    title: "Tiêu đề 5",
    price: 500,
    note: "Ghi chú 5",
    image: "https://1.bp.blogspot.com/-bPC_T2fBYMw/YSM9aFTGo4I/AAAAAAAAFHQ/XGSidjVki3sftdA9UNWwvMKBY7dOiGP8QCLcBGAsYHQ/s2000/Nature-Wallpaper-hinh-nen-thien-nhien-dep-4.jpg",
    content: "Nội dung 5"
  },
  {
    id: 10006,
    title: "Tiêu đề 6",
    price: 600,
    note: "Ghi chú 6",
    image: "https://tse1.mm.bing.net/th?id=OIP.QPaUHhuG7tNxySA03ZIW0wHaEo&pid=Api&P=0&h=180",
    content: "Nội dung 6"
  }
];

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
  
  const columns = [
    {
      title: translation("service.title"),
      key: "title",
      dataIndex: "title",
      align: "left",
    },
    {
      title: translation("service.image"),
      key: "image",
      dataIndex: "image",
      align: "center",
      render: (value) => <img src={value} alt="Service Image" style={{ width: 50, height: 50 }} />,
    },
    {
      title: translation("service.content"),
      key: "content",
      dataIndex: "content",
      align: "left",
    },
    {
      title: translation("service.price"),
      key: "price",
      dataIndex: "price",
      align: "center",
    },
    {
      title: translation("service.note"),
      key: "note",
      dataIndex: "note",
      align: "left",
    },
    {
      title: translation("service.act"),
      key: "action",
      width: 200,
      render: (_, record) => {
        return (
          <Space size="middle">
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
              style={{ cursor: "pointer", color: "#1890FF" }}
            >
              {translation("service.edit")}
            </span>
            <Popconfirm
              title={translation("file.confirm-delete")}
              onConfirm={() => {
                onDeleteCustomer(record && record.stationDocumentId);
              }}
              okText={translation("category.yes")}
              cancelText={translation("category.no")}
            >
              <span style={{ cursor: "pointer", color: "#1890FF" }}>
                {translation("service.delete")}
              </span>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const onDeleteCustomer = (id) => {
    stationServicesServices.delete({ id }).then((result) => {
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
    setListDocumentary({
      data : testData,
      total : testData.length
    });
    // stationServicesServices.getList(filter).then((result) => {
    //   if (result) {
    //   }
    // });
  };

  useEffect(() => {
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

  const toggleEditModal = () => {
    setIsEditing((prev) => !prev);
  };

  const toggleAddModal = () => {
    setIsAdd((prev) => !prev);
  };

  const onOpenModal = (customer) => {
    toggleEditModal();
    setSelectedCustomer(customer);
  };

  const onUpdateCustomer = (data, callback) => {
    stationServicesServices.updateDocument(data).then((result) => {
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
    stationServicesServices.insert(newData).then(async result => {
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

  return (
    <main className="list_customers">
      <div className="row">
        <div className="col-12 col-md-12 col-lg-12 col-xl-5">
          <label className="section-title pl-3">
            {translation("service.list")}
          </label>
        </div>
        <div className="col-12 col-xl-1" />
        <div className="col-md-4 col-lg-4 col-xl-2 mb-3">
          <Input.Search
            autoFocus
            placeholder={translation("listCustomers.search")}
            onChange={onChangeSearchText}
            value={dataFilter.searchText}
            onSearch={onSearch}
          />
        </div>
        <div className="col-md-4 col-lg-4 col-xl-2 mb-3">
          <DatePicker
            className="w-100"
            format="DD/MM/YYYY"
            value={dataFilter.documentPublishedDay}
            onChange={onFilterByDate}
            placeholder={translation("listDocumentary.documentPublishedDay")}
          />
        </div>
        <div className="col-md-4 col-lg-4 col-xl-2 mb-3" onClick={() => setIsAdd(true)}>
          <Button type="primary" className="w-100">
            {translation("file.btnNew")}
          </Button>
        </div>
      </div>
      <div className="list_customers__body">
        <Table
          dataSource={listDocumentary.data}
          columns={columns}
          scroll={{ x: 1440 }}
          pagination={
            listDocumentary.total <= 20 ? false : {
              total: listDocumentary.total,
              onChange: (current, pageSize) => {
                dataFilter.skip = (current - 1) * pageSize;
                setDataFilter({ ...dataFilter });
                fetchData(dataFilter);
              },
              current: (dataFilter.skip / 20) + 1,
              pageSize: 20,
              simple:true,
              position: ["bottomRight"]
            }}
        />
      </div>
      {isEditing && (
        <ModalEditDocumentary
          isEditing={isEditing}
          form={formAdd}
          toggleEditModal={toggleEditModal}
          onUpdateCustomer={onUpdateCustomer}
          id={item.id}
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
    </main>
  );
}