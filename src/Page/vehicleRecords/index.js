import React from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Space,
  Popconfirm,
  Table,
  notification
} from "antd";
import { BrowserView } from 'react-device-detect';
import { isMobileDevice } from "constants/account";
import { useEffect, useRef, useState, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { AnphaIcon, VectorIcon } from "../../assets/icons";
import listDocumentaryService from "../../services/listDocumentaryService";
import ModalAddVehicleRecords from "./ModalAddVehicleRecords";
import ModalEditVehicleRecords from "./ModalEditVehicleRecords";
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import ModalUpload from "./ModalUpload";
import "./index.scss";
import TagVehicle from "components/TagVehicle/TagVehicle";
import { useSelector } from "react-redux";
import { widthLicensePlate } from "constants/licenseplates";
import { getListVehicleTypes } from "constants/listSchedule";
import { routes } from "App";
import { useHistory } from "react-router-dom";
import ModalSyncComputer from "./ModalSyncComputer";
import { CloseOutlined } from "@ant-design/icons";
import vehicleProfileService from "services/vehicleProfileService";
import { getVehicleProfile } from "constants/errorMessage";
import moment from "moment";
import ModalProgress from "./ModalProgress";
import { convertFileToBase64 } from "../../helper/common";
import { ExportFile, handleParse, convertFileToArray } from 'hooks/FileHandler';
import { LIST_STATUS } from 'constants/logBox';
import { VEHICLE_TYPES_STATES_EXPORT , VEHICLE_TYPES_STATES_IMPORT } from "constants/vehicleRecordsImportExport";
import useWindowDimensions from 'hooks/window-dimensions'
import { isMobileDisplaySize } from "pageUtililiy/isMobileDisplaySize";
import UnLock from 'components/UnLock/UnLock';
import BasicTablePaging from 'components/BasicTablePaging/BasicTablePaging';
import { useModalDirectLinkContext } from "components/ModalDirectLink";
import { XLSX_TYPE } from "constants/excelFileType";
import { MIN_COLUMN_WIDTH } from "constants/app";
import { VERY_BIG_COLUMN_WIDTH } from "constants/app";
import { BIG_COLUMN_WIDTH } from "constants/app";
import { NORMAL_COLUMN_WIDTH } from "constants/app";

const { RangePicker } = DatePicker;

const listMode = {
  add: "ADD",
  import: "IMPORT"
}

const FIELDS_EXPORT_IMPORT = [
  { api: "vehiclePlateNumber", content: "Biển số xe *" },
  { api: "vehiclePlateColor", content: "Màu số xe *" },
  { api: "vehicleType", content: "Loại xe" },
  { api: "vehicleRegistrationCode", content: "Số quản lý" },
  { api: "vehicleBrandModel", content: "Số loại" },
  { api: "chassisNumber", content: "Số khung" },
  { api: "engineNumber", content: "Số máy" }
]

const DefaultFilterExport = {
  limit: 100,
};

export default function VehicleList() {
  const { t: translation } = useTranslation();
  const history = useHistory();
  const [listDocumentary, setListDocumentary] = useState({
    data: [],
    total: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const setting = useSelector(state => state.setting);
  const [isAdd, setIsAdd] = useState(false);
  const [isSync, setIsSync] = useState(false);
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
    skip: 0, 
    limit: 20,
    searchText: undefined
  });
  const [dateBySelect, setDateBySelect] = useState("");
  const [fileSelected, setFileSelected] = useState(undefined);
  const VEHICLE_TYPES = getListVehicleTypes(translation);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [messageType, setMessageType] = useState("");
  const [isModalSMSOpen, setIsModalSMSOpen] = useState(false);
  const [customerId, setCustomerId] = useState();
  const [item, setItem] = useState([])
  const { width } = useWindowDimensions()
  const { setUrlForModalDirectLink } = useModalDirectLinkContext();

  // Những Thứ dùng chung export và import
  const { onExportExcel, isLoading: isLoadingExport } = ExportFile();
  const [isModalProgress, setisModalProgress] = useState(false);
  const [percent, setPercent] = useState(0);
  const [percentPlus, setPercentPlus] = useState(0);

  // Những Thứ dùng chung Import
  const [arrImport, setArrImport] = useState([]);
  const [isImport, setIsImport] = useState(false);
  const [importSummary, setImportSummary] = useState({
    logs: [],
    numberError: 0,
    numberSuccess: 0
  });

  const inputRef = useRef();

  const VEHICLE_ERROR = getVehicleProfile(translation);
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
      width: MIN_COLUMN_WIDTH,
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
      width: BIG_COLUMN_WIDTH,
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
      width: VERY_BIG_COLUMN_WIDTH,
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
      width: BIG_COLUMN_WIDTH,
    },
    {
      title: translation("vehicleRecords.managementNumber"),
      key: "vehicleRegistrationCode",
      dataIndex: "vehicleRegistrationCode",
      align: "center",
      width: BIG_COLUMN_WIDTH,
      render: (value) => {
        return (
          <div className="text_record">{value?.vehicleRegistrationCode}</div>
        )
      }
    },
    {
      title: translation("vehicleRecords.typeNumber"),
      key: "vehicleBrandModel",
      dataIndex: "vehicleBrandModel",
      align: "center",
      width: VERY_BIG_COLUMN_WIDTH,
    },
    {
      title: translation("vehicleRecords.chassisNumber"),
      key: "chassisNumber",
      dataIndex: "chassisNumber",
      align: "center",
      width: VERY_BIG_COLUMN_WIDTH,
    },
    {
      title: translation("vehicleRecords.engineNumber"),
      key: "engineNumber",
      dataIndex: "engineNumber",
      align: "center",
      width: VERY_BIG_COLUMN_WIDTH,
    },
    {
      title: translation("vehicleRecords.image"),
      key: "fileList",
      dataIndex: "fileList",
      align: "center",
      width : NORMAL_COLUMN_WIDTH,
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
    },
    {
      title: translation("vehicleRecords.action"),
      key: "action",
      align: "center",
      // width: BIG_COLUMN_WIDTH,
      render: (_, record) => {
        return (
          <div className="d-flex justify-content-between">
            <EyeOutlined
              style={{ cursor: "pointer", color: "var(--primary-color)" }}
              onClick={() => {
                history.push(`${routes.vehicleRecords.path}/${record.vehicleProfileId}`)
              }}
            />
            <EditOutlined
              style={{ cursor: "pointer", color: "var(--primary-color)" }}
              onClick={() => {
                toggleEditModal();
                setItem(record);
              }}
            />
            <Popconfirm
              title={translation("vehicleRecords.confirm-delete")}
              onConfirm={() => onDeleteVehicle(record.vehicleProfileId)}
              okText={translation("category.yes")}
              cancelText={translation("category.no")}
            >
              <DeleteOutlined
                style={{ cursor: "pointer", color: "var(--primary-color)" }}
              />
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  const onDeleteVehicle = (id) => {
    vehicleProfileService.deleteById({ id }).then((result) => {
      if (result && result.isSuccess) {
        notification["success"]({
          message: "",
          description: translation("vehicleRecords.deleteSuccess"),
        });
        fetchData(dataFilter);
      } else {
        notification["error"]({
          message: "",
          description: translation("vehicleRecords.deleteFailed"),
        });
      }
    });
  };

  const onImportFileToDb = async () => {
    if (!fileSelected) {
      notification["warn"]({
        message: "",
        description: translation("listCustomers.wrongfile"),
      });
    } else {
      const data = await handleParse(fileSelected.file);
      const convertData = convertFileToArray({
        data,
        FIELD_IMPORT_API: FIELDS_EXPORT_IMPORT.map((item) => item.api),
        FIELD_IMPORT_FULL: FIELDS_EXPORT_IMPORT.map((item) => item.content)
      });

      const converters = {
        vehicleType: (data) => +VEHICLE_TYPES_STATES_IMPORT[data]
      }

      if (convertData.isError) {
        notification["error"]({
          message: "",
          description: translation("listCustomers.importFailed"),
        });
        return;
      }

      const dataResult = convertData.data.map((item) => {
        let object = {};
        const converterEntries = Object.entries(item);
        converterEntries.map(([key, value]) => {
          if (!converters[key]) {
            object[key] = value;
            return;
          }
          object[key] = converters[key](value)
        });
        return object;
      })

      // xóa index 
      const dataResultRemoveIndex = [...dataResult].map((item) => {
        const { index , ...newItem } = item;
        return {
          ...newItem,
          vehicleRegistrationCode : item.vehicleRegistrationCode?.toString(),
          vehicleBrandModel : item.vehicleBrandModel?.toString(),
          chassisNumber : item.chassisNumber?.toString(),
          engineNumber : item.engineNumber?.toString()
        };
      })

      setIsUploadFile(false);
      setPercent(0);
      setisModalProgress(true);
      setPercentPlus(100 / dataResultRemoveIndex.length);
      setArrImport(dataResultRemoveIndex);
      setIsImport(true);
    }
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
    vehicleProfileService.find(filter).then((result) => {
      if (result) {
        setListDocumentary(result);
      }
    });
  };

  useEffect(() => {
    if(isMobileDevice() === true){
      dataFilter.limit = 10
    }
    fetchData(dataFilter);
  }, []);

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

  const clearSearchText = () => {
    setDataFilter((prevDataFilter) => ({
      ...prevDataFilter,
      searchText: ""
    }));
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

  const toggleAddModal = () => {
    setIsAdd((prev) => !prev);
  };

  const onOpenModal = (customer) => {
    toggleEditModal();
    setSelectedCustomer(customer);
  };

  const onUpdateCustomer = (data, callback) => {
    vehicleProfileService.updateById(data).then((result) => {
      callback();
      if (result && result.isSuccess) {
        notification["success"]({
          message: "",
          description: translation("vehicleRecords.updateSuccess"),
        });
        toggleEditModal();
        fetchData(dataFilter);
        return true;
      }

      if (Object.keys(VEHICLE_ERROR).includes(result.error)) {
        notification['error']({
          message: '',
          description: VEHICLE_ERROR[result.error]
        });
        return false;
      }

      notification["error"]({
        message: "",
        description: translation("vehicleRecords.updateFailed"),
      });
      return false;
    });
  };

  const inserVehicleRecords = (values, mode = listMode.add) => {
    Object.keys(values).forEach(k => {
      if (!values[k] && values[k] !== 0) {
        delete values[k]
      }
    })

    vehicleProfileService.insert({
      ...values
    }).then(async (result) => {
      setArrImport(prev => {
        prev.shift();
        return [...prev]
      })
      setPercent(prev => prev + percentPlus);

      const handleStatus = (text, mode, status) => {

        // xử lý số lượng trạng thái Import
        if (status === LIST_STATUS.success) {
          setImportSummary(prev => ({
            ...prev,
            numberSuccess: prev.numberSuccess + 1
          }))
        } else {
          setImportSummary(prev => ({
            ...prev,
            numberError: prev.numberError + 1
          }))
        }

        if (mode === listMode.add) {
          notification['error']({
            message: '',
            description: VEHICLE_TYPES[result.error]
          });
          return;
        }
        setImportSummary(prev => ({
          ...prev,
          logs: [...prev.logs, {
            id: Math.random(),
            message: `BSX : ${values.vehiclePlateNumber} : ${text}`,
            status: status
          }]
        }))
      };

      if (!result.isSuccess) {
        if (Object.keys(VEHICLE_ERROR).includes(result.error)) {
          handleStatus(VEHICLE_ERROR[result.error], mode, LIST_STATUS.error)
          return;
        } else {
          handleStatus(translation('vehicleRecords.addFailed'), mode, LIST_STATUS.error)
          return;
        }
        return;
      }

      if (mode === listMode.import) {
        handleStatus(translation("progress.messageSuccess"), listMode.import, LIST_STATUS.success)
        return;
      }
    })
  }

  const onCrateNew = (newData, callback) => {
    vehicleProfileService.insert(newData).then(async result => {
      callback();
      if (result && result.isSuccess) {
        notification.success({
          message: "",
          description: translation('vehicleRecords.createSuccess')
        })
        isAdd && setIsAdd(false)
        formAdd.resetFields()
        fetchData(dataFilter)
      } else {
        if (Object.keys(VEHICLE_ERROR).includes(result.error)) {
          notification['error']({
            message: '',
            description: VEHICLE_ERROR[result.error]
          });
          return;
        } else {
          notification.error({
            message: "",
            description: translation('vehicleRecords.addFailed')
          })
        }
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
    setDataFilter({ ...dataFilter,skip:0, searchText: e.target.value ? e.target.value : undefined })
  };

  const toggleUploadModal = () => {
    setIsUploadFile((prev) => !prev);
  };

  const fetchExportData = async (param, filter) => {
    for (let key in filter) {
      if (!filter[key]) {
        delete filter[key]
      }
    }

    const response = await vehicleProfileService.find({
      ...filter,
      limit: DefaultFilterExport.limit,
      skip: param * DefaultFilterExport.limit
    })

    const data = await response.data;
    return data;
  }

  const handleExportExcel = async () => {
    let number = Math.ceil(listDocumentary.data.length / DefaultFilterExport.limit)
    let params = Array.from(Array.from(new Array(number)), (element, index) => index);
    let results = [];

    const percentPlus = 100 / params.length;
    setPercent(0);
    setisModalProgress(true);

    let _counter = 0;
    while (true) {
      const result = await fetchExportData(_counter++, dataFilter);
      if (result && result.length > 0) {
        setPercent(prev => prev + percentPlus);
        results = [...results, ...result];
      } else {
        break;
      }
    }

    const newResult = results.map((item, index) => ({
      ...item,
      vehicleType: VEHICLE_TYPES_STATES_EXPORT[item.vehicleType] || "",
    }))

    await setTimeout(() => {
      setisModalProgress(false);
      setPercent(0);
      onExportExcel({
        fieldApi: FIELDS_EXPORT_IMPORT.map((item) => item.api),
        fieldExport: FIELDS_EXPORT_IMPORT.map((item) => item.content),
        data: newResult,
        informationColumn: [
          [setting.stationsName, "", "", "Danh sách hồ sơ phương tiện"],
          [`Mã: ${setting.stationCode}`, "", "", `Danh sách ngày ${moment().format("DD/MM/YYYY")}`],
          ['']
        ],
        timeWait: 0,
        nameFile: "data.xlsx",
        setUrlForModalDirectLink : setUrlForModalDirectLink
      })
    }, 1000)
  }

  const onUploadFile = (e) => {
    const file = e.target.files[0] || undefined;
    if (file && file.type && !XLSX_TYPE.includes(file.type)) {
      notification["warn"]({
        message: "",
        description: translation("listCustomers.wrongfile"),
      });
    } else {
      convertFileToBase64(file).then((dataUrl) => {
        const newData = dataUrl.replace(/,/gi, "").split("base64");
        if (newData[1]) {
          const data = {
            file: newData[1],
            fileFormat: "xlsx",
          };
          setFileSelected({
            file,
            name: file.name,
            data: data,
          });
        }
      });
    }
  };

  useEffect(() => {
    if (arrImport.length > 0 && isImport) {
      setTimeout(() => {
        inserVehicleRecords(arrImport[0], listMode.import);
      }, 100);
      return;
    }

    if (!isModalProgress && isImport) {
      setIsImport(false);
      setPercent(0);
      setPercentPlus(0);
      setArrImport([])
      setImportSummary({
        logs: [],
        numberError: 0,
        numberSuccess: 0
      });
      fetchData(dataFilter)
    }
  }, [arrImport, isModalProgress, isImport]);

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
            {translation("vehicleRecords.list")}
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
          <Space size={16} className="vehicleRecords-boxBtn" wrap={true}>
            <Button
              onClick={toggleUploadModal}
              className="d-flex align-items-center gap-1 justify-content-center"
              icon={<VectorIcon />}
            >
              {translation("listCustomers.upload")}
            </Button>
            <Button
              onClick={handleExportExcel}
              className="d-flex align-items-center gap-1 justify-content-center"
              icon={<AnphaIcon />}
            >
              {translation("listCustomers.export")}
            </Button>
            <Button type="primary" className="w-100 d-flex align-items-center justify-content-center" onClick={() => setIsAdd(true)} icon={<PlusOutlined />}>
              {translation("vehicleRecords.btnNew")}
            </Button>
            {isMobileDisplaySize(width) &&
              <BrowserView>
                <Button onClick={() => setIsSync(true)}>{translation('syncComputer.syncComputer')}</Button>
                {isSync && (
                  <ModalSyncComputer visible={isSync} setVisible={setIsSync} fetchData={() => fetchData(dataFilter)} />
                )}
              </BrowserView>
            }
          </Space>
        </Space>
      </Space>
      <div className="list_customers__body">
        <Table
          dataSource={listDocumentary.data}
          columns={columns}
          scroll={{ x: 1600 }}
          pagination={false}
        />
        <BasicTablePaging handlePaginations={handleChangePage} skip={dataFilter.skip} count={listDocumentary?.data?.length < dataFilter?.limit}></BasicTablePaging>
      </div>
      {isEditing && (
        <ModalEditVehicleRecords
          isEditing={isEditing}
          form={formEdit}
          toggleEditModal={toggleEditModal}
          onUpdateCustomer={onUpdateCustomer}
          id={item.vehicleProfileId}
        />
      )}
      {isAdd && (
        <ModalAddVehicleRecords
          isAdd={isAdd}
          form={formAdd}
          inputRef={inputRef}
          onCrateNew={onCrateNew}
          toggleAddModal={toggleAddModal}
        />
      )}
      <ModalUpload
        visible={isUploadFile}
        toggleUploadModal={toggleUploadModal}
        onUploadFile={onUploadFile}
        file={fileSelected}
        onImportFileToDb={onImportFileToDb}
        isLoading={isLoading}
      />
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
    </main>
    }
    </Fragment>
  );
}