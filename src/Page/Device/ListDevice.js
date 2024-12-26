import React, { Fragment } from "react";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  notification,
} from "antd";
import {
  getStationDeviceStatusOptions,
  getStationDevicesState,
  STATION_DEVICES_STATUS,
} from "constants/device";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import StationDevicesService from "../../services/StationDevicesService";
import listDocumentaryService from "../../services/listDocumentaryService";
import ModalAddDevice from "./ModalAddDevice";
import ModalEditDevice from "./ModalEditDevice";
import { useSelector } from "react-redux";
import { getStationDevicesError } from "constants/errorMessage";
import UnLock from "components/UnLock/UnLock";
import { isMobileDevice } from "constants/account";
import BasicTablePaging from "components/BasicTablePaging/BasicTablePaging";
import { MIN_COLUMN_WIDTH } from "constants/app";
import { VERY_BIG_COLUMN_WIDTH } from "constants/app";
import { BIG_COLUMN_WIDTH } from "constants/app";
import ModalUpload from "./ModalUpload";
import { convertFileToBase64 } from "helper/common";
import { ExportFile, handleParse, convertFileToArray } from "hooks/FileHandler";
import { XLSX_TYPE } from "constants/excelFileType";
import { VectorIcon } from "assets/icons";
import { VEHICLE_TYPES_STATES_IMPORT } from "constants/scheduleImportExport";
import { AnphaIcon } from "assets/icons";
import { useModalDirectLinkContext } from "components/ModalDirectLink";
import ModalProgress from "./ModalProgress";
import moment from "moment";
import { LIST_STATUS } from "constants/logBox";
const { RangePicker } = DatePicker;

const { Option } = Select;
export default function ListDevice() {
  const { t: translation } = useTranslation();
  const [listDocumentary, setListDocumentary] = useState({
    data: [],
    total: 0,
  });
  const setting = useSelector((state) => state.setting);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();
  const [crimePlateNumber, setCrimePlateNumber] = useState("");
  const [loading, setLoading] = useState(false);
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
    },
    skip: 0,
    limit: 20,
    searchText: undefined,
  });
  const [dateBySelect, setDateBySelect] = useState("");
  const [fileSelected, setFileSelected] = useState(undefined);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [messageType, setMessageType] = useState("");
  const [isModalSMSOpen, setIsModalSMSOpen] = useState(false);
  const [customerId, setCustomerId] = useState();
  const [item, setItem] = useState([]);
  const [isUploadFile, setIsUploadFile] = useState(false);
  const [arrImport, setArrImport] = useState([]);
  const [isImport, setIsImport] = useState(false);
  const [importSummary, setImportSummary] = useState({
    logs: [],
    numberError: 0,
    numberSuccess: 0,
  });
  const { onExportExcel, isLoading: isLoadingExport } = ExportFile();
  const [percent, setPercent] = useState(0);
  const [percentPlus, setPercentPlus] = useState(0);
  const [isModalProgress, setisModalProgress] = useState(false);
  const { setUrlForModalDirectLink } = useModalDirectLinkContext();
  const inputRef = useRef();

  const DEVICE_ERROR = getStationDevicesError(translation);

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
      title: translation("device.name"),
      key: "deviceName",
      dataIndex: "deviceName",
      width: VERY_BIG_COLUMN_WIDTH,
      align: "center",
    },
    {
      title: translation("device.statusOption"),
      key: "deviceStatus",
      dataIndex: "deviceStatus",
      width: BIG_COLUMN_WIDTH,
      align: "center",
      render: (deviceStatus, record) => {
        const stationDevicesState = getStationDevicesState(translation);
        const statusColors = {
          [STATION_DEVICES_STATUS.NEW]: "green",
          [STATION_DEVICES_STATUS.ACTIVE]: "blue",
          [STATION_DEVICES_STATUS.MAINTENANCE]: "orange",
          [STATION_DEVICES_STATUS.INACTIVE]: "red",
          [STATION_DEVICES_STATUS.MAINTENANCE_SERVICE]: "purple",
          [STATION_DEVICES_STATUS.REPAIR]: "yellow",
        };
        const color = statusColors[deviceStatus] || "black";

        return (
          <span style={{ color: color }}>
            {stationDevicesState[deviceStatus]}
          </span>
        );
      },
    },
    {
      title: translation("device.type"),
      key: "deviceType",
      dataIndex: "deviceType",
      width: BIG_COLUMN_WIDTH,
      align: "center",
    },
    {
      title: translation("device.serialNumber"),
      key: "deviceSeri",
      dataIndex: "deviceSeri",
      width: VERY_BIG_COLUMN_WIDTH,
      align: "center",
    },
    {
      title: translation("device.brand"),
      key: "deviceBrand",
      dataIndex: "deviceBrand",
      width: BIG_COLUMN_WIDTH,
      align: "center",
    },
    {
      title: translation("device.manufactureYear"),
      key: "deviceManufactureYear",
      dataIndex: "deviceManufactureYear",
      width: BIG_COLUMN_WIDTH,
      align: "center",
      render: (value) => (value === 0 ? "_" : value),
    },
    {
      title: translation("listCustomers.act"),
      key: "action",
      //   width: VERY_BIG_COLUMN_WIDTH,
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined
            onClick={() => {
              toggleEditModal();
              setItem(record);
            }}
            style={{ cursor: "pointer", color: "var(--primary-color)" }}
          />
          <Popconfirm
            title={translation("device.confirm-delete")}
            onConfirm={() => onDeleteDevice(record.stationDevicesId)}
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

  const onFilterByStatus = (selectedStatus) => {
    const newDataFilter = { ...dataFilter };
    newDataFilter.skip = 0;
    if (selectedStatus) {
      newDataFilter.filter.deviceStatus = selectedStatus;
    } else {
      delete newDataFilter.filter.deviceStatus;
    }
    setDataFilter(newDataFilter);
    fetchData(newDataFilter);
  };

  const onDeleteDevice = (id) => {
    StationDevicesService.delete({ id }).then((result) => {
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
    StationDevicesService.getList(filter).then((result) => {
      if (result) {
        setListDocumentary(result);
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

  const onSearch = (value) => {
    const newFilter = { ...dataFilter };
    newFilter.skip = 0;
    if (!value) {
      newFilter.searchText = undefined;
    } else {
      newFilter.searchText = value;
    }
    setDataFilter(newFilter);
    fetchData(newFilter);
  };

  const onFilterByDate = (date, dateString) => {
    const newDataFilter = { ...dataFilter };
    if (dateString) {
      newDataFilter.filter.documentPublishedDay = dateString;
    } else {
      delete newDataFilter.filter.documentPublishedDay;
    }
    setDataFilter(newDataFilter);
    fetchData(newDataFilter);
  };

  const toggleEditModal = () => {
    // Nếu tắt modal xem chi tiết gọi thêm fetchData.
    if (isEditing) {
      fetchData(dataFilter);
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
    StationDevicesService.update(data).then((result) => {
      callback();
      if (result && result.isSuccess) {
        notification["success"]({
          message: "",
          description: translation("device.updateSuccess"),
        });
        toggleEditModal();
        fetchData(dataFilter);
        return true;
      }

      if (
        Object.keys(getStationDevicesError(translation)).includes(result.error)
      ) {
        notification["error"]({
          message: "",
          description: getStationDevicesError(translation)[result.error],
        });
        return;
      }

      notification["error"]({
        message: "",
        description: translation("device.updateFailed"),
      });
      return false;
    });
  };

  const onCrateNew = (newData, callback) => {
    StationDevicesService.insert({
      ...newData,
      stationsId: setting.stationsId,
    }).then(async (result) => {
      callback();
      if (result && result.isSuccess) {
        notification.success({
          message: "",
          description: translation("device.createSuccess"),
        });
        isAdd && setIsAdd(false);
        formAdd.resetFields();
        fetchData(dataFilter);
      } else {
        if (
          Object.keys(getStationDevicesError(translation)).includes(
            result.error
          )
        ) {
          notification["error"]({
            message: "",
            description: getStationDevicesError(translation)[result.error],
          });
          return;
        }

        notification.error({
          message: "",
          description: translation("device.createFailed"),
        });
      }
    });
  };

  const onChangeSearchText = (e) => {
    e.preventDefault();
    setDataFilter({
      ...dataFilter,
      skip: 0,
      searchText: e.target.value ? e.target.value : undefined,
    });
  };

  const FIELDS_EXPORT_IMPORT = [
    { api: "deviceName", content: "Tên thiết bị *" },
    { api: "deviceType", content: "Loại *" },
    { api: "deviceSeri", content: "Số Seri *" },
    { api: "deviceBrand", content: "Nhãn hiệu *" },
    { api: "deviceManufactureYear", content: "Năm Sản Xuất *" },
    { api: "deviceStatus", content: "Trạng thái *" },
    { api: "deviceTestedDate", content: "Ngày kiểm chuẩn thiết bị *" },
    {
      api: "deviceExpiredTestedDate",
      content: "Ngày hết hạn kiểm chuẩn thiết bị *",
    },
  ];

  const toggleUploadModal = () => {
    setIsUploadFile((prev) => !prev);
  };

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
        FIELD_IMPORT_FULL: FIELDS_EXPORT_IMPORT.map((item) => item.content),
      });

      const converters = {
        vehicleType: (data) => +VEHICLE_TYPES_STATES_IMPORT[data],
      };

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
          object[key] = converters[key](value);
        });
        return object;
      });

      // xóa index
      const dataResultRemoveIndex = [...dataResult].map((item) => {
        const { index, ...newItem } = item;
        return {
          ...newItem,
          deviceStatus : item.deviceStatus === "Mới" ? "NEW" : 
          item.deviceStatus === "Hoạt động" ? "ACTIVE" : 
          item.deviceStatus === "Bảo trì" ? "MAINTENANCE" : 
          item.deviceStatus === "Không hoạt động" ? "INACTIVE" : 
          item.deviceStatus === "Bảo dưỡng" ? "MAINTENANCE_SERVICE" : "REPAIR"
        };
      });
      setIsUploadFile(false);
      setPercent(0);
      setisModalProgress(true);
      setPercentPlus(100 / dataResultRemoveIndex.length);
      setArrImport(dataResultRemoveIndex);
      setIsImport(true);
    }
  };

  const handleExportExcel = async () => {
    let number = Math.ceil(listDocumentary.data.length / DefaultFilterExport.limit);
    let params = Array.from(Array.from(new Array(number)),(element, index) => index);
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
      //   vehicleType: VEHICLE_TYPES_STATES_EXPORT[item.vehicleType] || "",
    }));

    await setTimeout(() => {
      setisModalProgress(false);
      setPercent(0);
      onExportExcel({
        fieldApi: FIELDS_EXPORT_IMPORT.map((item) => item.api),
        fieldExport: FIELDS_EXPORT_IMPORT.map((item) => item.content),
        data: newResult,
        informationColumn: [
          [setting.stationsName, "", "", "Danh sách thiết bị"],
          [
            `Mã: ${setting.stationCode}`,
            "",
            "",
            `Danh sách ngày ${moment().format("DD/MM/YYYY")}`,
          ],
          [""],
        ],
        timeWait: 0,
        nameFile: "data.xlsx",
        setUrlForModalDirectLink: setUrlForModalDirectLink,
      });
    }, 1000);
  };

  const DefaultFilterExport = {
    limit: 100,
  };

  const fetchExportData = async (param, filter) => {
    for (let key in filter) {
      if (!filter[key]) {
        delete filter[key];
      }
    }

    const response = await StationDevicesService.getList({
      ...filter,
      limit: DefaultFilterExport.limit,
      skip: param * DefaultFilterExport.limit,
    });

    const data = await response.data;
    return data;
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
      setArrImport([]);
      setImportSummary({
        logs: [],
        numberError: 0,
        numberSuccess: 0,
      });
      fetchData(dataFilter);
    }
  }, [arrImport, isModalProgress, isImport]);

  const inserVehicleRecords = (values, mode = listMode.add) => {
    Object.keys(values).forEach((k) => {
      if (!values[k] && values[k] !== 0) {
        delete values[k];
      }
    });

    StationDevicesService.insert({
      ...values,
    }).then(async (result) => {
      setArrImport((prev) => {
        prev.shift();
        return [...prev];
      });
      setPercent((prev) => prev + percentPlus);

      const handleStatus = (text, mode, status) => {
        // xử lý số lượng trạng thái Import
        if (status === LIST_STATUS.success) {
          setImportSummary((prev) => ({
            ...prev,
            numberSuccess: prev.numberSuccess + 1,
          }));
        } else {
          setImportSummary((prev) => ({
            ...prev,
            numberError: prev.numberError + 1,
          }));
        }

        setImportSummary((prev) => ({
          ...prev,
          logs: [
            ...prev.logs,
            {
              id: Math.random(),
              message: `Thiết bị : ${values.deviceName} : ${text}`,
              status: status,
            },
          ],
        }));
      };

      if (!result.isSuccess) {
        if (Object.keys(DEVICE_ERROR).includes(result.error)) {
          handleStatus(DEVICE_ERROR[result.error], mode, LIST_STATUS.error);
          return;
        } else {
          handleStatus(
            translation("vehicleRecords.addFailed"),
            mode,
            LIST_STATUS.error
          );
          return;
        }
        return;
      }

      if (mode === listMode.import) {
        handleStatus(
          translation("progress.messageSuccessDevice"),
          listMode.import,
          LIST_STATUS.success
        );
        return;
      }
    });
  };

  const listMode = {
    add: "ADD",
    import: "IMPORT",
  };

  return (
    <Fragment>
      {setting.enableDeviceMenu === 0 ? (
        <UnLock />
      ) : (
        <main className="list_customers">
          <Row gutter={[24, 24]} className="mb-3">
            {/* <Col xs={24} sm={24} md={24} lg={5} xl={5}>
              <label className="section-title pl-3">
                {translation("device.list")}
              </label>
            </Col> */}
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={12} md={12} lg={6} xl={6}>
                  <Input.Search
                    placeholder={translation("device.searchByNameSerial")}
                    onChange={onChangeSearchText}
                    value={dataFilter.searchText}
                    onSearch={onSearch}
                  />
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={4}>
                  <Select
                    className="w-100"
                    placeholder={translation("device.statusOption")}
                    onChange={onFilterByStatus}
                    value={dataFilter.status}
                    options={getStationDeviceStatusOptions(translation)}
                  />
                </Col>
                <Col xs={8} sm={4} md={4} lg={3} xl={2}>
                  <Button
                    onClick={toggleUploadModal}
                    className="d-flex align-items-center justify-content-center gap-1"
                    icon={<VectorIcon />}
                  >
                    {translation("listCustomers.upload")}
                  </Button>
                </Col>
                <Col xs={8} sm={4} md={4} lg={3} xl={2}>
                  <Button
                    onClick={handleExportExcel}
                    className="d-flex align-items-center justify-content-center gap-1"
                    icon={<AnphaIcon />}
                  >
                    {translation("listCustomers.export")}
                  </Button>
                </Col>
                <Col xs={8} sm={4} md={4} lg={3} xl={2} style={{ paddingLeft : '22px'}}>
                  <Button
                    type="primary"
                    className="d-flex align-items-center justify-content-center"
                    onClick={toggleAddModal}
                    icon={<PlusOutlined />}
                  >
                    {/* {translation("inspectionProcess.add")} */}
                    Tạo mới
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>

          <div className="list_customers__body">
            <Table
              dataSource={listDocumentary.data}
              columns={columns}
              scroll={{ x: 1300 }}
              pagination={false}
            />
            <BasicTablePaging
              handlePaginations={handleChangePage}
              skip={dataFilter.skip}
              count={listDocumentary?.data?.length < dataFilter.limit}
            ></BasicTablePaging>
          </div>
          {isEditing && (
            <ModalEditDevice
              isEditing={isEditing}
              form={formAdd}
              toggleEditModal={toggleEditModal}
              onUpdateCustomer={onUpdateCustomer}
              id={item.stationDevicesId}
            />
          )}
          {isAdd && (
            <ModalAddDevice
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
      )}
    </Fragment>
  );
}
