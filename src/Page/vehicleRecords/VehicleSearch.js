import React from "react";
import {
  DatePicker,
  Form,
  Input,
  Space,
  Select,
  Table,
  notification
} from "antd";
import { useEffect, useRef, useState, Fragment } from "react";
import { useTranslation } from "react-i18next";
import listDocumentaryService from "../../services/listDocumentaryService";
import "./index.scss";
import { widthLicensePlate } from "constants/licenseplates";
import TagVehicle from "components/TagVehicle/TagVehicle";
import { CloseOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import vehicleProfileService from "services/vehicleProfileService";
import { routes } from "App";
import stationsService from "services/stationsService";
import UnLock from 'components/UnLock/UnLock';
import { getListVehicleTypes } from "constants/listSchedule";
import { useSelector } from "react-redux";
import BasicTablePaging from 'components/BasicTablePaging/BasicTablePaging';

const { RangePicker } = DatePicker;

const LIMIT = 10;
export default function VehicleList() {
  const { t: translation } = useTranslation();
  const [listDocumentary, setListDocumentary] = useState({
    data: [],
    total: 0,
  });
  const setting = useSelector(state => state.setting);
  const VEHICLE_TYPES = getListVehicleTypes(translation);
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
  const history = useHistory();
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
    limit: LIMIT,
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

  const [dataStation, setDataStation] = useState({
    total: 0,
    data: []
  })

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
      title: translation("vehicleRecords.index"),
      key: "index",
      dataIndex: "index",
      width: 60,
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
      title: translation("vehicleRecords.registrationPlate"),
      key: "vehiclePlateNumber",
      dataIndex: "vehiclePlateNumber",
      align: "center",
      width: widthLicensePlate,
      render: (value, values) => {

        const colorList = {
          WHITE : 1 , 
          BLUE : 2 , 
          YELLOW : 3,
          RED : 4
        }
        const color = values.vehiclePlateColor ? colorList[values.vehiclePlateColor] - 1 : 0;

        return (
          <TagVehicle color={color}>
            {value}
          </TagVehicle>
        )
      }
    },
    {
      title: translation("vehicleRecords.vehicleType"),
      key: "vehicleType",
      dataIndex: "vehicleType",
      align: "center",
      width: 200,
      render: (value) => {
        return (
          <div>{VEHICLE_TYPES?.[value] || "-"}</div>
        )
      }
    },
    {
      title: translation("vehicleRecords.managementUnit"),
      key: "stationCode",
      dataIndex: "stationCode",
      align: "center",
      width: 160,
    },
    {
      title: translation("vehicleRecords.managementNumber"),
      key: "vehicleRegistrationCode",
      dataIndex: "vehicleRegistrationCode",
      align: "center",
      width: 160,
    },
    {
      title: translation("vehicleRecords.typeNumber"),
      key: "vehicleBrandModel",
      dataIndex: "vehicleBrandModel",
      align: "center",
      width: 200,
    },
    {
      title: translation("vehicleRecords.chassisNumber"),
      key: "chassisNumber",
      dataIndex: "chassisNumber",
      align: "center",
      width: 200,
    },
    {
      title: translation("vehicleRecords.engineNumber"),
      key: "engineNumber",
      dataIndex: "engineNumber",
      align: "center",
      width: 200,
    },
    {
      title: translation("vehicleRecords.image"),
      key: "fileList",
      dataIndex: "fileList",
      align: "center",
      render: (value, record) => {
        return value?.length ? (
          <div onClick={() => {
            history.push(`${routes.vehicleRecords.path}/${record.vehicleProfileId}`)
          }} style={{ color: "var(--primary-color)" }}>
            {translation("vehicleRecords.image")}
          </div>
        ) : (
          "-"
        );
      },
    }
  ];

  const onFilterUserByStationId = (e) => {
    let newFilter = dataFilter
    if (e) {
      newFilter.filter.stationsId = e
      newFilter.skip = 0
    } else {
      newFilter.filter.stationsId = undefined
      newFilter.skip = 0
    }
    setDataFilter(newFilter)
    fetchData(newFilter)
  }

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

    vehicleProfileService.search(filter).then((result) => {
      if (result) {
        setListDocumentary(result);
      }
    });

  };

  const fetchDataStation = (filter) => {
    stationsService.getStationList({
      "filter": {
      },
      "skip": 0,
      'limit': 350,
      "order": {
        "key": "stationCode",
        "value": "asc"
      }
    }).then(result => {
      if (result) {
        setDataStation(result.data)
      } else {
        notification.error({
          message: '',
          description: translation('new.fetchDataFailed')
        })
      }
    })
  };

  useEffect(() => {
    fetchDataStation();
  }, [])
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
    newFilter.skip = 0;
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
    // Nếu tắt modal xem chi tiết gọi thêm fetchData.
    if (isEditing) {
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

  const clearSearchText = () => {
		setDataFilter((prevDataFilter) => ({
			...prevDataFilter,
			searchText: ""
		}));
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
    {setting.enableVehicleRegistrationMenu === 0 ? <UnLock /> :
    <main className="list_customers">
      <Space className="w-100 d-flex justify-content-between flex-column flex-md-column flex-lg-row mb-3">
        {/* <div className="vehicleRecords-header">
          <label className="section-title pl-3">
            {translation("vehicleRecords.tabs.search")}
          </label>
        </div> */}
        <Space size={16} className="w-100 d-flex vehicleRecords-action" wrap={true}>
          <div className="w-100">
            <Input.Search
              autoFocus
              placeholder={translation("listCustomers.search")}
              onChange={onChangeSearchText}
              value={dataFilter.searchText}
              onSearch={onSearch}
            />
          </div>
          <div className="vehicleSearch-select">
            <Select onChange={onFilterUserByStationId} className="w-100" placeholder='Mã trạm'>
              <Select.Option value={0}>{translation('PhoneBook.allStations')}</Select.Option>
              {dataStation?.length > 0 && dataStation.map(item => (
                <Select.Option key={item.stationsId} value={item.stationsId}>{item.stationCode}</Select.Option>
              ))}
            </Select>
          </div>
        </Space>
      </Space>
      <div className="list_customers__body">
        <Table
          dataSource={listDocumentary.data}
          columns={columns}
          scroll={{ x: 1510 }}
          pagination={false}
        />
        <BasicTablePaging handlePaginations={handleChangePage} skip={dataFilter.skip} count={listDocumentary?.data?.length < dataFilter?.limit}></BasicTablePaging>
      </div>
    </main>
    }
    </Fragment>
  );
}