import React, { useState, useEffect, useRef, Fragment } from 'react'
import ReactToPrint from 'react-to-print';
import { Select, Table, notification, Modal, Button, Input, DatePicker, Tag, AutoComplete, Form, Tooltip, Popconfirm, Typography, Space } from 'antd'
import { PrinterOutlined, EditOutlined, CloseOutlined , DollarOutlined, ExceptionOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import './listSchedulesStyle.scss'
import ListSchedulesService from '../../services/listSchedulesService'
import AccreditationService from '../../services/accreditationService'
import ScheduleSettingService from 'services/scheduleSettingService'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import { useHistory, } from 'react-router-dom'
import { ReloadOutlined, MessageOutlined, EyeOutlined } from '@ant-design/icons'
import { BUTTON_LOADING_TIME } from "constants/time";
import { SCHEDULE_STATUS, getListVehicleTypes, getVehicleSubTypes, getVehicleSubCategories } from 'constants/listSchedule'
import { getPaymentStatusList , PAYMENT_STATE } from 'constants/receipt'
import { widthLicensePlate } from 'constants/licenseplates'
import TagVehicle from 'components/TagVehicle/TagVehicle'
import ModalAddBooking from 'Page/AddBooking/ModalAddBooking'
import { optionVehicleType } from 'constants/vehicleType'
import CardSchedule from 'Page/AddBooking/CardSchedule'
import { getOptionScheduleStatus } from 'constants/scheduleStatus';
import { ExportFile, handleParse, convertFileToArray } from 'hooks/FileHandler';
import createNewConverstationUser from '../../services/createNewConverstionUser'
import { USER_ROLES } from 'constants/permission';
import { changeTime } from 'helper/changeTime';
import { routes } from 'App';
import { convertFileToBase64 } from "../../helper/common";
import { hidePhoneNumber } from 'helper/phone';
import { VectorIcon } from "./../../assets/icons";
import { AnphaIcon } from "./../../assets/icons";
import ModalUpload from './ModalUpload';
import { convertTime } from 'helper/changeTime';
import {
  SCHEDULE_STATUS_STATES_EXPORT, SCHEDULE_STATUS_STATES_IMPORT,
  LICENSE_PLATE_COLOR_STATES_EXPORT, LICENSE_PLATE_COLOR_STATES_IMPORT,
  VEHICLE_TYPES_STATES_EXPORT, VEHICLE_TYPES_STATES_IMPORT
} from 'constants/scheduleImportExport';
import ModalProgress from './ModalProgress';
import AddBookingService from '../../services/addBookingService'
import { geScheduleError } from 'constants/errorMessage';
import { LIST_STATUS } from 'constants/logBox';
import UnLock from 'components/UnLock/UnLock';
import { ModalCrime } from 'Page/ListCustomers/ModalCrime';
import useCommonData from 'hooks/CommonData';
import { isMobileDevice } from "constants/account";
import TagVehicleWarn from 'components/TagVehicle/TagVehicleWarn';
import BasicTablePaging from 'components/BasicTablePaging/BasicTablePaging';
import { useModalDirectLinkContext } from 'components/ModalDirectLink';
import { XLSX_TYPE } from 'constants/excelFileType';
import { VERY_BIG_COLUMN_WIDTH } from 'constants/app';
import { BIG_COLUMN_WIDTH } from 'constants/app';
import { EXTRA_BIG_COLUMND_WITDTH } from 'constants/app';
import { NORMAL_COLUMN_WIDTH } from 'constants/app';

const { Option } = Select
const listMode = {
  add: "ADD",
  import: "IMPORT"
}
const { TextArea } = Input
export const ModalPrint = ({ isOpen, setIsOpen, schedule }) => {
  const printRef = useRef(null);
  const { t: translation } = useTranslation()

  return (
    <Modal
      title={translation("booking.modalTitle")}
      visible={isOpen}
      onCancel={() => setIsOpen(false)}
      footer={
        <>
          <ReactToPrint
            trigger={() => (
              <Button
                className='d-inline-flex align-items-center'
                type="primary" icon={<PrinterOutlined />}
              >
                {translation("landing.print")}
              </Button>
            )}
            content={() => printRef.current}
          >
          </ReactToPrint>
        </>
      }
    >
      <div ref={printRef}>
        <CardSchedule schedule={schedule} />
      </div>
    </Modal>
  )
}

const DefaultFilterExport = {
  limit: 100,
};

const FIELDS_EXPORT_IMPORT = [
  { api: 'index', content: 'Số TT' },
  { api: 'licensePlates', content: 'Biển số xe *' },
  { api: 'fullnameSchedule', content: 'Chủ phương tiện' },
  { api: 'phone', content: 'Số điện thoại *' },
  { api: 'dateSchedule', content: 'Ngày đặt lịch đăng kiểm *' },
  { api: 'time', content: 'Giờ đặt lịch đăng kiểm *' },
  { api: 'CustomerScheduleStatus', content: 'Trạng thái lịch hẹn' },
  { api: 'email', content: 'Email' },
  // { api: 'vehicleExpiryDate', content: 'Ngày hết hạn' },
  { api: 'licensePlateColor', content: 'Màu biển số xe *' },
  { api: 'vehicleType', content: 'Loại xe *' },
];

const ListSchedule = () => {
  const { onExportExcel, isLoading } = ExportFile();
  const { t: translation } = useTranslation()
  const [isUploadFile, setIsUploadFile] = useState(false);
  const history = useHistory()
  const SCHEDULE_ERROR = geScheduleError(translation);
  const setting = useSelector((state) => state.setting);
  const [dataListSchedules, setDataSchedules] = useState({
    data: [],
    total: 0
  })
  const [dataFilter, setDataFilter] = useState({
    filter: {
      CustomerScheduleStatus: 10
    },
    startDate: moment().format('DD/MM/YYYY'),
    endDate: moment().add(1, 'day').format('DD/MM/YYYY'),
    skip: 0, limit: 20, searchText: undefined,
    order:{
      key:'customerScheduleId',
      value: "desc"
    }
  })

  const [visible, setVisible] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState({})
  const [loading, setLoading] = useState(false);
  const { metaData } = useCommonData()
  const [stationBookingConfig, setStationBookingConfig] = useState([]);
  const [fileSelected, setFileSelected] = useState(undefined);
  const [isOpenPrint, setIsOpenPrint] = useState(false);
  const [schedule, setSchedule] = useState(null);

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
    numberSuccess: 0
  });

  const user = useSelector(state => state.member)
  const listVehicleType = optionVehicleType(translation);
  const VEHICLE_SUB_TYPES = getVehicleSubTypes(translation);
  const VEHICLE_SUB_CATEGORY = getVehicleSubCategories(translation);
  const optionScheduleStatus = getOptionScheduleStatus(translation);
  const [crimePlateNumber, setCrimePlateNumber] = useState('')
  const { setUrlForModalDirectLink } = useModalDirectLinkContext();


  function handleCreateNewCustomer(values) {
    AccreditationService.registerFromSchedule({
      customerScheduleId: values.customerScheduleId,
    }).then(result => {
      if (result.isSuccess) {
        notification['success']({
          message: "",
          description: translation('accreditation.addSuccess')
        })
        fetchListData(dataFilter);
      }
      else {
        if (
          result.error === "DUPLICATED_RECORD_IN_ONE_DAY" ||
          result.error === "DUPLICATE_LINKED_BOOKING_SCHEDULE"
        ) {
          notification['error']({
            message: "",
            description: translation('listSchedules.errorExists')
          })
          return;
        }
        notification['error']({
          message: "",
          description: translation('accreditation.addFailed')
        })
      }
    })
  }

  function handleUpdateState(record) {
    if (record && record.CustomerScheduleStatus === 0) {
      ListSchedulesService.updateSchedule({
        customerScheduleId: record.customerScheduleId,
        data: { CustomerScheduleStatus: 10 }
      }).then(result => {
        if (result && result.isSuccess) {
          notification.success({
            message: "",
            description: translation('listCustomers.success', {
              type: translation('listCustomers.handle')
            })
          })
          fetchListData(dataFilter)
        } else {
          notification.error({
            message: "",
            description: translation('listCustomers.failed', {
              type: translation('listCustomers.handle')
            })
          })
        }
      })
    } else {
      ListSchedulesService.updateSchedule({
        customerScheduleId: record.customerScheduleId,
        data: { CustomerScheduleStatus: 0 }
      }).then(result => {
        if (result && result.isSuccess) {
          notification.success({
            message: "",
            description: translation('listCustomers.success', {
              type: translation('listCustomers.handle')
            })
          })
          fetchListData(dataFilter)
        } else {
          notification.error({
            message: "",
            description: translation('listCustomers.failed', {
              type: translation('listCustomers.handle')
            })
          })
        }
      })
    }
  }

  const createNewChatUserHandler = (receiverId) => {
    createNewConverstationUser.createNewChatUser({
      receiverId: receiverId,
      appUserChatLogContent: "Chào bạn"
    }).then(result => {
      if (result.statusCode === 200) {
        history.push("/chat" , {
          appUserConversationId : result.data.conversationId
        })
      }
    })
  }

  const columns = [
    {
      title: translation('listSchedules.index'),
      dataIndex: 'scheduleCode',
      key: 'scheduleCode',
      width: VERY_BIG_COLUMN_WIDTH,
      render: (value, scheduleItem) => {
        return <span
          onClick={() => history.push(`${routes.customerSchedule.path}/${scheduleItem.customerScheduleId}`)}
        >
          {value}
        </span>
      }
    },
    {
      title: translation('listSchedules.licensePlates'),
      dataIndex: 'licensePlates',
      key: 'licensePlates',
      width: widthLicensePlate,
      render: (value, values) => {
        const color = values.licensePlateColor ? values.licensePlateColor - 1 : 0;
        const crimeIds = values?.crimeIds
        if (crimeIds.length > 0) {
          return(
            <TagVehicleWarn onClick={()=>{setCrimePlateNumber(value)}}>
              {value}
            </TagVehicleWarn>
          )
        }
        return (
          <TagVehicle color={color}>
            {value}
          </TagVehicle>
        )
      }
    },
    {
      title: translation('listSchedules.vehicleType'),
      dataIndex: 'vehicleType',
      key: 'vehicleType',
      width: VERY_BIG_COLUMN_WIDTH,
      render: (value, record) => {
        return (
          <div>
            <div>{VEHICLE_SUB_TYPES?.[record.vehicleSubType] || (VEHICLE_SUB_TYPES?.[value] || "---")}</div>
            <div>{VEHICLE_SUB_CATEGORY?.[record.vehicleSubCategory] || "---"}</div>
          </div>
        )
      }
    },
    {
      title: translation('listSchedules.customer'),
      key: 'fullnameSchedule',
      dataIndex: 'fullnameSchedule',
      width: BIG_COLUMN_WIDTH,
      render: (_, record) => {
        return (
          <div>
            <div>{record.fullnameSchedule}</div>
            <div style={{ color: '#40E0D0', fontSize: 'smaller' }}>{record?.companyName}</div>
            <span className="blue-text"
              onClick={() => history.push(`${routes.customerSchedule.path}/${record.customerScheduleId}`)}
            >
              {hidePhoneNumber(record.phone)}
            </span>
          </div>
        )
      }
    },
    {
      title: translation('listSchedules.service'),
      dataIndex: 'stationServices',
      key: 'stationServices',
      width: EXTRA_BIG_COLUMND_WITDTH,
      render: (value, scheduleItem) => {
        if (value?.length === 0) {
          return Object.values(metaData?.SCHEDULE_TYPE).find(obj => obj?.scheduleType === scheduleItem?.scheduleType)?.scheduleTypeName || '---'
        }

        return (
          <div>
            {value.map((service, index) => (
              <div key={index}>- {service.serviceName}</div>
            ))}
          </div>
        );
      }
    },
    {
      title: translation('listSchedules.time'),
      key: 'time',
      dataIndex: 'time',
      width: NORMAL_COLUMN_WIDTH,
      render: (value, scheduleItem) => {
        return (
          <div>
            <div>{changeTime(scheduleItem.time)}</div>
            <div>{scheduleItem.dateSchedule}</div>
          </div>
        )
      }
    },
    {
      title: translation('listSchedules.expirationDate'),
      dataIndex: 'vehicleExpiryDate',
      key: 'vehicleExpiryDate',
      width: NORMAL_COLUMN_WIDTH
    },
    {
      title: translation('listSchedules.status'),
      dataIndex: 'CustomerScheduleStatus',
      key: 'CustomerScheduleStatus',
      width: NORMAL_COLUMN_WIDTH,
      render: (value) => {
        return (<Typography.Paragraph style={{ color: SCHEDULE_STATUS[value]?.color || "" }} className="mb-0">
          {SCHEDULE_STATUS[value]?.text || ""}
        </Typography.Paragraph>)
      }
    },
    {
      title: translation('listSchedules.creator'),
      dataIndex: 'username',
      key: 'username',
      width: NORMAL_COLUMN_WIDTH,
      render: (value , scheduleItem) => {
        
        const {phone , username } = scheduleItem;
        if(phone !== username) {
          return username
        }

        return <span
          onClick={() => history.push(`${routes.customerSchedule.path}/${scheduleItem.customerScheduleId}`)}
          className="blue-text"
        >{hidePhoneNumber(value)}</span>
      }
    },
    {
      title: translation('listSchedules.date_created'),
      dataIndex: 'username',
      key: 'username',
      width: NORMAL_COLUMN_WIDTH,
      render: (value , scheduleItem) => {
        const {createdAt } = scheduleItem;
        const date = moment(createdAt).format("DD/MM/YYYY HH:mm")
        return <span>{date}</span>
      }
    },
    {
      title: translation("listCustomers.act"),
      align: "center",
      key: 'action',
      render: (record, scheduleItem) => {
        const receiverId = record?.appUserId
        const isUnConfimred = record.CustomerScheduleStatus === 0;
        const isConfirm = record.CustomerScheduleStatus === 10;
        // const isCustomerRecord = record.customerRecordId > 0;
        return (
          <div className="d-inline-flex align-items-center">
            <Button
              type="primary"
              onClick={() => history.push(`${routes.customerSchedule.path}/${record.customerScheduleId}`)}
              className='d-inline-flex align-items-center mx-1'
            >
              <EyeOutlined />
            </Button>
            {((isConfirm || isUnConfimred) && USER_ROLES.ADMIN === user.appUserRoleId) &&
              <>
                <Button
                  type="primary"
                  onClick={() => onOpenModal(record)}
                  className='d-inline-flex align-items-center mx-1'
                >
                  <EditOutlined />
                </Button>
                <ModalDeleteCalendar onOk={(message) => {
                  onDeleteSchedule(record && record.customerScheduleId, message)
                }} />
              </>
            }
            {isUnConfimred &&
              <Popconfirm
                title={translation("box-confirm")}
                onConfirm={() => {
                  handleUpdateState(record)
                }}
                okText={translation("category.yes")}
                cancelText={translation("category.no")}
              >
                <Button
                  type="primary"
                >
                  {translation("listSchedules.confirm")}
                </Button>
              </Popconfirm>
            }
            {/* {(isConfirm && !isCustomerRecord) &&
              <Popconfirm
                title={translation("listSchedules.popRegister")}
                onConfirm={() => {
                  handleCreateNewCustomer(scheduleItem)
                }}
                okText={translation("category.yes")}
                cancelText={translation("category.no")}
              >
                <Button
                  type="primary"
                >
                  {translation("listSchedules.register")}
                </Button>
              </Popconfirm>
            } */}
            <Button
              type="primary"
              className='d-inline-flex align-items-center mx-1'
              onClick={async () => {
                await setSchedule(scheduleItem)
                setIsOpenPrint(true);
              }}
            >
              <PrinterOutlined />
            </Button>
            <Button
              type="primary"
              className='d-inline-flex align-items-center mx-1'
              onClick={() => {
                createNewChatUserHandler(receiverId)
              }}
            >
              <MessageOutlined />
            </Button>
            {(!!setting.enablePaymentGateway && record?.paymentStatus === PAYMENT_STATE.SUCCESS) && (
              <Button
                type="primary"
                className='d-inline-flex align-items-center mx-1'
                onClick={() => {
                  history.push(`/receipt` , {
                    customerReceiptId : record.customerReceiptId
                  })
                }}
              >
                <DollarOutlined />
              </Button>
            )}
          </div>
        )
      },
    },
  ];

  const insertSchedule = (values, mode = listMode.add) => {
    Object.keys(values).forEach(k => {
      if (!values[k] && values[k] !== 0) {
        delete values[k]
      }
    })

    AddBookingService.AddBooking({
      ...values,
      notificationMethod: "SMS",
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
            description: SCHEDULE_ERROR[result.error]
          });
          return;
        }
        setImportSummary(prev => ({
          ...prev,
          logs: [...prev.logs, {
            id: Math.random(),
            message: `BSX : ${values.licensePlates} : ${text}`,
            status: status
          }]
        }))
      };

      if (!result.issSuccess) {
        if (Object.keys(SCHEDULE_ERROR).includes(result.error)) {
          handleStatus(SCHEDULE_ERROR[result.error], mode, LIST_STATUS.error)
          return;
        } else {
          handleStatus(translation('addBookingSuccess.errorExists'), mode, LIST_STATUS.error)
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

  useEffect(() => {
    if (arrImport.length > 0 && isImport) {
      setTimeout(() => {
        insertSchedule(arrImport[0], listMode.import);
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
      fetchListData(dataFilter)
    }
  }, [arrImport, isModalProgress, isImport]);

  useEffect(() => {
    if(isMobileDevice() === true){
      dataFilter.limit = 10
    }
    fetchListData(dataFilter)
  }, [])

  useEffect(() => {
    fetchDataTime()
  }, [])

  const onFilterByTime = async (time) => {
    translation('listSchedules.allTimeline')
    if (time === translation('listSchedules.allTimeline')) {
      dataFilter.filter.time = undefined
    } else {
      dataFilter.filter.time = time.split(" - ").join("-")
    }
    dataFilter.skip = 0
    setDataFilter({ ...dataFilter })
    fetchListData(dataFilter)
  }
  const onFilterScheduleType = async (scheduleType) => {
    if (!scheduleType) {
      dataFilter.filter.scheduleType = undefined
    } else {
      dataFilter.filter.scheduleType = scheduleType
    }
    dataFilter.skip = 0
    setDataFilter({ ...dataFilter })
    fetchListData(dataFilter)
  }
  const onFilterByVehicleType = (value) => {
    if (!value) {
      dataFilter.filter.vehicleType = undefined
    } else {
      dataFilter.filter.vehicleType = value
    }
    dataFilter.skip = 0
    setDataFilter({ ...dataFilter })
    fetchListData(dataFilter)
  }

  const handleChangeStatus = (values) => {
    if (values === "") {
      dataFilter.filter.CustomerScheduleStatus = undefined
    } else {
      dataFilter.filter.CustomerScheduleStatus = values
    }
    dataFilter.skip = 0
    setDataFilter({ ...dataFilter })
    fetchListData(dataFilter)
  }
  const fetchDataTime = () => {
    ScheduleSettingService.getDetailById({ id: user.stationsId }).then(result => {
      if (result && result.stationBookingConfig && result.stationBookingConfig.length > 0) {
        let data = [{
          time: translation('listSchedules.allTimeline'),
          enableBooking: 0
        }, ...result.stationBookingConfig]
        setStationBookingConfig(data)
      }
    })
  }
  const fetchListData = (filter) => {
    for (let key in filter) {
      if (!filter[key]) {
        delete filter[key]
      }
    }
    ListSchedulesService.getList(filter).then(result => {
      if (result)
        setDataSchedules(result)
      else
        dataListSchedules.data.length > 0 && setDataSchedules({
          data: [],
          total: 0
        })
    })
  }

  

  const onDeleteSchedule = (id, message) => {
    ListSchedulesService.deleteSchedule({ customerScheduleId: id, reason: message })
      .then(result => {
        if (result && result.isSuccess) {
          notification['success']({
            message: '',
            description: translation('listSchedules.deleteSuccessfully')
          });
          fetchListData(dataFilter)
        } else {
          notification['error']({
            message: '',
            description: translation('listSchedules.deletefailed')
          });
        }
      })
  }

  const toggleVisible = () => {
    setVisible(prev => !prev);
  };

  const onOpenModal = (data) => {
    toggleVisible()
    setSelectedSchedule(data)
  }

  const onChooseDate = (dates, dateStrings) => {
    const isDateStrings = dateStrings && dateStrings.length === 2;
    const filter = {
      ...dataFilter,
      filter: { ...dataFilter.filter },
      startDate: isDateStrings ? dateStrings[0] : '',
      endDate: isDateStrings ? dateStrings[1] : '',
      skip: 0,
    };
    setDataFilter(filter);
    fetchListData(filter);
  };

  const onUpdateSchedule = (values) => {
    Object.keys(values).map(key => {
      if (!values[key])
        delete values[key]
    })

    ListSchedulesService.updateSchedule({
      "customerScheduleId": selectedSchedule.customerScheduleId,
      "data": {
        ...values,
        "dateSchedule": values.dateSchedule
      }
    }).then(result => {
      if (result && result.isSuccess) {
        toggleVisible()
        fetchListData(dataFilter)
        notification['success']({
          message: '',
          description: translation('listSchedules.updateSuccessfully')
        });
      } else {
        notification['error']({
          message: '',
          description: translation('listSchedules.updateFailed')
        });
      }
    })
  }

  const onSearchSchedule = (val) => {
    dataFilter.searchText = val || undefined
    dataFilter.skip = 0
    setDataFilter({ ...dataFilter, searchText: val })
    fetchListData(dataFilter)
  }

  const reasonableCalendarSwitching = (date) => {
    let dateFormat = moment(date, "DD/MM/YYYY").format("DD/MM/YYYY");
    return dateFormat === "Invalid date" ? "" : dateFormat;
  }

  const convertStrToDate = (str) => {
    let dateFormat = moment(str, "DD/MM/YYYY");
    return !reasonableCalendarSwitching(dateFormat) ||
      reasonableCalendarSwitching(dateFormat) === "Invalid date" ? "" : dateFormat;
  }

  const fetchExportData = async (param, filter) => {
    for (let key in filter) {
      if (!filter[key]) {
        delete filter[key]
      }
    }

    const response = await ListSchedulesService.getList({
      ...filter,
      limit: DefaultFilterExport.limit,
      skip: param * DefaultFilterExport.limit
    })

    const data = await response.data;
    return data;
  }

  const handleExportExcel = async () => {
    let number = Math.ceil(dataListSchedules.data.length / DefaultFilterExport.limit)
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
      index: index + 1,
      CustomerScheduleStatus: SCHEDULE_STATUS_STATES_EXPORT[item.CustomerScheduleStatus] || "",
      licensePlateColor: LICENSE_PLATE_COLOR_STATES_EXPORT[item.licensePlateColor] || "",
      vehicleType: VEHICLE_TYPES_STATES_EXPORT[item.vehicleType] || "",
      time: changeTime(item.time)
    }))

    await setTimeout(() => {
      setisModalProgress(false);
      setPercent(0);
      onExportExcel({
        fieldApi: FIELDS_EXPORT_IMPORT.map((item) => item.api),
        fieldExport: FIELDS_EXPORT_IMPORT.map((item) => item.content),
        data: newResult,
        informationColumn: [
          ['Trung tâm đăng kiểm', "", "", "Danh sách lịch hẹn đăng kiểm"],
          ['Mã: Trung Tâm đăng kiểm xe cơ giới 123', "", "", `Danh sách lịch hẹn ngày ${moment().format("DD/MM/YYYY")}`],
          ['']
        ],
        timeWait: 0,
        nameFile: "data.xlsx",
        setUrlForModalDirectLink : setUrlForModalDirectLink
      })
    }, 1000)
  }

  const onChangeSearchText = (e) => {
    e.preventDefault()
    setDataFilter({ ...dataFilter, searchText: e.target.value ? e.target.value : undefined })
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

  const toggleUploadModal = () => {
    setIsUploadFile((prev) => !prev);
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
        time: (data) => convertTime(data),
        CustomerScheduleStatus: (data) => +SCHEDULE_STATUS_STATES_IMPORT[data],
        licensePlateColor: (data) => +LICENSE_PLATE_COLOR_STATES_IMPORT[data],
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
        const { index, CustomerScheduleStatus , notificationMethod , ...newItem } = item;
        return {
          ...newItem
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

  const handleChangePage = (pageNum) => {
    const newFilter = {
      ...dataFilter,
      skip : (pageNum -1) * dataFilter.limit
    }
    setDataFilter(newFilter)
    fetchListData(newFilter)
  }

  return (
    <Fragment>
      {setting.enableScheduleMenu === 0 ? <UnLock /> : 
      <main className="list_schedules">
      <div className='row d-flex justify-content-between'>
        {/* <div className='section-title col-md-4 col-12 col-lg-2'> {translation('listSchedules.listSchedules')}</div> */}

        <div className='col-12 col-md-12 col-lg-12 mb-3'>
          <Space size={24} className='list_schedules__box' wrap={true}>
            <div>
              <Input.Search
                autoFocus
                onSearch={onSearchSchedule}
                onChange={onChangeSearchText}
                placeholder={translation("listSchedules.searchText")}
                className="w-100"
              />
            </div>

            <div>
              <DatePicker.RangePicker
                className="w-100"
                format="DD/MM/YYYY"
                placeholder={[translation("startDate"), translation("endDate")]}
                onChange={onChooseDate}
                defaultValue={[moment(dataFilter.startDate, 'DD/MM/YYYY'), moment(dataFilter.endDate, 'DD/MM/YYYY')]}
              />
            </div>

            <div>
              <Select
                className="w-100"
                placeholder={translation('listSchedules.filterByStatus')}
                style={{
                  minWidth: 160
                }}
                onChange={handleChangeStatus}
                value={
                  dataFilter.filter.CustomerScheduleStatus === undefined ? ""
                    : dataFilter.filter.CustomerScheduleStatus
                }
              >
                <Option value={""} key={9999}>{translation('all')}</Option>
                {
                  optionScheduleStatus.map(item => {
                    return (
                      <Option value={item.value} key={item.value}>{item.label}</Option>
                    )
                  })
                }
              </Select>
            </div>

            <div>
              <Select
                className="w-100"
                placeholder={translation('listSchedules.filterByScheduleType')}
                style={{
                  minWidth: 160
                }}
                onChange={onFilterScheduleType}
              >
                {
                  Object.values(metaData?.SCHEDULE_TYPE).map(item => {
                    return (
                      <Option value={item.scheduleType} key={item.scheduleType}>{item.scheduleTypeName}</Option>
                    )
                  })
                }
              </Select>
            </div>

            <div>
              <Select
                className="w-100"
                placeholder={translation('listSchedules.filterByTime')}
                style={{
                  minWidth: 160
                }}
                onChange={onFilterByTime}
              >
                {
                  stationBookingConfig.map(item => {
                    return (
                      <Option value={item.time} key={item.time}>{changeTime(item.time)}</Option>
                    )
                  })
                }
              </Select>
            </div>

            <div>
              <Select
                className="w-100"
                placeholder={translation('listSchedules.filterByVehicleType')}
                style={{
                  minWidth: 160
                }}
                onChange={onFilterByVehicleType}
              >
                <Option value={""} key={9999}>{translation('all')}</Option>
                {
                  listVehicleType.map(item => {
                    return (
                      <Option value={item.value} key={item.value}>{item.label}</Option>
                    )
                  })
                }
              </Select>
            </div>
            <div>
              <Space size={25}>
                <Button
                  onClick={toggleUploadModal}
                  className="d-flex align-items-center gap-1 mobies"
                  icon={<VectorIcon />}
                >
                  {translation("listCustomers.upload")}
                </Button>
                <Button
                  onClick={handleExportExcel}
                  className="d-flex align-items-center gap-1 mobies"
                  icon={<AnphaIcon />}
                >
                  {translation("listCustomers.export")}
                </Button>
                <Button
                  loading={loading}
                  disabled={loading}
                  className='d-flex justify-content-center align-items-center mobies'
                  onClick={() => {
                    setLoading(true);
                    setTimeout(() => {
                      fetchListData(dataFilter)
                      setLoading(false)
                    }, BUTTON_LOADING_TIME);
                  }}
                >
                  {!loading && <ReloadOutlined />}
                </Button>
              </Space>
            </div>
          </Space>
        </div>
      </div>

      <div className="list_schedules__body row">
        <Table
          dataSource={dataListSchedules.data}
          rowClassName={(record) => `${record && record.CustomerScheduleStatus ? 'handled_customer' : ''}`}
          columns={columns}
          scroll={{ x: 1879 }}
          pagination={false}
        />
        <BasicTablePaging handlePaginations={handleChangePage} skip={dataFilter.skip} count={dataListSchedules?.data?.length < dataFilter.limit}></BasicTablePaging>
      </div>
      {visible &&
        <ModalAddBooking
          isModalOpen={visible}
          onModalClose={(bool) => setVisible(bool)}
          onSubmit={onUpdateSchedule}
          values={{
            ...selectedSchedule,
            dateSchedule: selectedSchedule.dateSchedule
          }}
          isEdit={true}
        />
      }

      <ModalUpload
        visible={isUploadFile}
        toggleUploadModal={toggleUploadModal}
        onUploadFile={onUploadFile}
        file={fileSelected}
        onImportFileToDb={onImportFileToDb}
        isLoading={isLoading}
      />
      <ModalPrint isOpen={isOpenPrint} setIsOpen={setIsOpenPrint} schedule={schedule} />
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
      {!!crimePlateNumber && <ModalCrime plateNumber={crimePlateNumber} onClose={() => setCrimePlateNumber('')} />}

      </main >
      }
    </Fragment>
  )
}

const MAX_LENGTH = 200;

const ModalDeleteCalendar = ({ onOk, values }) => {
  const { t: translation } = useTranslation();
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const inputRef = useRef();
  const listQuickResponse = [
    {
      value: translation("listSchedules.instantMessage.message1"),
    },
    {
      value: translation("listSchedules.instantMessage.message2"),
    },
    {
      value: translation("listSchedules.instantMessage.message3"),
    }
  ]

  useEffect(() => {
    setError(false);
  }, [value]);

  useEffect(() => {

    if (!isVisible) {
      setValue("")
    }

  }, [isVisible])
  return (
    <>
      <Button
        type="primary"
        onClick={() => setIsVisible(true)}
        className='d-inline-flex align-items-center mx-1'
      >
        <CloseOutlined />
      </Button>
      {isVisible &&
        <Modal
          title={translation("listSchedules.cancellationReason")}
          visible={isVisible}
          okText={translation("listSchedules.send")}
          cancelText={translation("cancel")}
          onOk={() => {
            if (!value) {
              setError(true);
              return;
            }

            setIsVisible(false)
            onOk(value)
          }}
          onCancel={() => setIsVisible(false)}
          bodyStyle={{
            maxWidth: 443,
            borderRadius: 2
          }}
          centered
          autoFocusButton={null}
        >
          <TextArea
            autoSize={{ minRows: 3 }}
            autoFocus
            value={value}
            ref={inputRef}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            showCount
          />
          {error && <div style={{ color: "#ff4d4f" }}>{translation("isReq")}</div>}
          <div className='mt-2'>
            {listQuickResponse.map(item => {
              return (
                <Tag
                  key={item.value}
                  onClick={() => {
                    setValue(prev => {
                      if ((prev + item.value).length > 200) {
                        return (prev + item.value).substring(0, 200);
                      }
                      return prev + item.value;
                    });
                    inputRef.current.focus();
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {item.value}
                </Tag>
              )
            })}
          </div>
        </Modal >
      }
    </>
  )
}
export default ListSchedule
