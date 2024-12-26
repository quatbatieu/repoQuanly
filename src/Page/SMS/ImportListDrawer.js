import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, Input, Button, Upload, Table, Drawer, List, notification } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { ExclamationCircleOutlined, CheckCircleOutlined, ArrowLeftOutlined, CloseOutlined } from '@ant-design/icons';
import { ExportFile, handleParse, convertFileToArray } from 'hooks/FileHandler';
import "./importListModal.scss";
import ModalProgress from 'components/importExport/ModalProgress';
import { LIST_STATUS } from 'constants/logBox';
import MessageCustomerMarketing from 'services/MessageCustomerMarketingService';
import { getMessageCustomerMarketingError } from 'constants/errorMessage';
import EventEmitter from 'events';
import Handlebars from 'handlebars';
import { useSelector } from 'react-redux';
import { xoa_dau } from 'helper/common';
import { PopupHeaderContainer } from 'components/PopupHeader/PopupHeader';
import moment from 'moment';
import { useMemo } from 'react';
import { getTranslationKeys } from 'constants/sms';
import addKeyLocalStorage from 'helper/localStorage';
import { useModalDirectLinkContext } from 'components/ModalDirectLink';
import { HOST } from 'constants/url';
import mautinzalo from "../../assets/import/file_mau_gui_tin_nhan_zalo.xlsx";

const { Title, Text } = Typography;
const SAMPLE_FILE_LINK = `${HOST}/uploads/exportExcel/file_mau_gui_tin_nhan.xlsx`;
const UPLOAD_ROW_LIMIT = 10000;
const FIELDS_EXPORT_IMPORT = [
  { api: 'customerMessagePhone', content: 'Số điện thoại' },
  { api: 'customerRecordPlatenumber', content: 'Biển số xe' },
  { api: 'customerRecordCheckExpiredDate', content: 'Ngày hết hạn' },
];
const FIELDS_EXPORT_IMPORT_ZALO = [
  { api: 'customerMessagePhone', content: 'Số điện thoại' },
  { api: 'customerRecordPlatenumber', content: 'Biển số xe' },
  { api: 'customerRecordCheckExpiredDate', content: 'Ngày hết hạn' },
  { api: 'customerRecordFullName', content: 'Tên khách hàng' },
];
const messageTemplateRegistration = 3015
// const FIELDS_EXPORT_IMPORT = [
//   { api: 'customerMessagePhone', content: translation('landing.phoneNumber') },
//   { api: 'customerRecordPlatenumber', content: translation('landing.license-plates') },
//   { api: 'customerRecordCheckExpiredDate', content: translation('landing.endDate') },
// ];
const ImportListDrawer = ({ isSendMessageDrawer, setIsSendMessageDrawer, template, fetchMessage, setCurrentStep, setTemplate, dataCustomerToSendMessage = null, isSendSMS = false , onBackClick }) => {
  const { t: translation } = useTranslation();
  // Những Thứ dùng chung export và import
  const [isModalProgress, setisModalProgress] = useState(false);
  const [percent, setPercent] = useState(0);
  const [shouldCancel, setShouldCancel] = useState(false);
  const [percentPlus, setPercentPlus] = useState(0);
  const cancelEventRef = useRef(new EventEmitter());
  const stationSetting = useSelector((state) => state.setting);
  const MESSAGE_CUMTOMER_MARKETING_ERROR = getMessageCustomerMarketingError(translation);
  const { setUrlForModalDirectLink } = useModalDirectLinkContext();
  const setting = useSelector((state) => state.setting);

  function decodeHtmlEntities(encodedString) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = encodedString;
    return textArea.value;
  }

  const templateContentHTML = useMemo(() => {
    const translationKeys = getTranslationKeys(translation);
		const translations = {
			"vehiclePlateNumber": `<b>{{${translationKeys.vehiclePlateNumber}}}</b>`,
			"customerRecordCheckExpiredDate": `<b>{{${translationKeys.customerRecordCheckExpiredDate}}}</b>`,
			"stationCode": `<b>{{${translationKeys.stationCode}}}</b>`,
			"stationsAddress": `<b>{{${translationKeys.stationsAddress}}}</b>`,
			"stationsHotline": `<b>{{${translationKeys.stationsHotline}}}</b>`,
			"customerRecordPlatenumber": `<b>{{${translationKeys.customerRecordPlatenumber}}}</b>`,
			"stationsName": `<b>{{${translationKeys.stationsName}}}</b>`
		};

    const templateConvert = Handlebars.compile(
      template.messageTemplateContent
    );

    let messageTemplateContent = template.messageTemplateContent
    const content = templateConvert(translations);
    const decodedContent = decodeHtmlEntities(content);
    return decodedContent;

  }, [template])

  const [arrImport, setArrImport] = useState([]);
  const [fileUpload, setFileUpload] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [isImport, setIsImport] = useState(false);
  const [importSummary, setImportSummary] = useState({
    logs: [],
    numberError: 0,
    numberSuccess: 0
  });

  const listInstructions = [
    translation('listCustomers.importListModal.instructions.fileFormat'),
    translation('listCustomers.importListModal.instructions.maxLines'),
    translation('listCustomers.importListModal.instructions.matchingColumns'),
    translation('listCustomers.importListModal.instructions.noDuplicate')
  ];

  const columns = [
    {
      title: translation('listCustomers.importListModal.table.position'),
      dataIndex: 'position',
      key: 'position',
      width: '25%',
      render: (value, __, index) => {
        return <p className='mb-0 fw-bold'>{value}</p>
      }
    },
    {
      title: translation('listCustomers.importListModal.table.column1'),
      dataIndex: 'column1',
      width: '25%',
      key: 'column1'
    },
    {
      title: translation('listCustomers.importListModal.table.column2'),
      dataIndex: 'column2',
      width: '25%',
      key: 'column2'
    },
    {
      title: translation('listCustomers.importListModal.table.column3'),
      dataIndex: 'column3',
      width: '25%',
      key: 'column3'
    }
  ];

  const columnsZalo = [
    {
      title: translation('listCustomers.importListModal.table.position'),
      dataIndex: 'position',
      key: 'position',
      width: '20%',
      render: (value, __, index) => {
        return <p className='mb-0 fw-bold'>{value}</p>
      }
    },
    {
      title: translation('listCustomers.importListModal.table.column1'),
      dataIndex: 'column1',
      width: '20%',
      key: 'column1'
    },
    {
      title: translation('listCustomers.importListModal.table.column2'),
      dataIndex: 'column2',
      width: '20%',
      key: 'column2'
    },
    {
      title: translation('listCustomers.importListModal.table.column3'),
      dataIndex: 'column3',
      width: '20%',
      key: 'column3'
    },
    {
      title: translation('listCustomers.importListModal.table.column4'),
      dataIndex: 'column4',
      width: '20%',
      key: 'column4'
    }
  ];

  const data = [
    {
      key: '1',
      position: <span style={{ color: 'black' }}>{translation('listCustomers.importListModal.table.parameter')}</span>,
      // column1: <span style={{ color: 'blue' }}>{translation('listCustomers.importListModal.table.email')}</span>,
      column1: <span style={{ color: 'blue' }}>{translation('listCustomers.importListModal.table.phone')}</span>,
      column2: <span style={{ color: 'blue' }}>{translation('listCustomers.importListModal.table.plateNumber')}</span>,
      column3: <span style={{ color: 'blue' }}>{translation('listCustomers.importListModal.table.expiryDate')}</span>,
    },
    {
      key: '2',
      position: <span style={{ color: 'black' }}>{translation('listCustomers.importListModal.table.sampleData')}</span>,
      // column1: 'ttdk@gmail.com',
      column1: "0985201236",
      column2: "36D5869",
      column3: "27/06/2023"
    },
    {
      key: '3',
      position: <span style={{ color: 'black' }}>{translation('listCustomers.importListModal.table.maxCharacters')}</span>,
      // column1: "254 ký tự",
      column1: "10 "+translation('number'),
      column2: "6-12 "+translation('characters'),
      column3: "10 "+translation('characters')
    },
    {
      key: '4',
      position: <span style={{ color: 'black' }}>{translation('listCustomers.importListModal.table.format')}</span>,
      // column1: <span style={{ color: 'red' }}>{translation('listCustomers.importListModal.table.validEmail')}</span>,
      column1: <span style={{ color: 'red' }}>{translation('listCustomers.importListModal.table.onlyNumbers')}</span>,
      column2: <span style={{ color: 'red' }}>{translation('listCustomers.importListModal.table.lettersAndNumbers')}</span>,
      column3: <span style={{ color: 'red' }}>{translation('listCustomers.importListModal.table.specialCharacterFormat')}</span>
    },
    {
      key: '5',
      position: <span style={{ color: 'black' }}>{translation('listCustomers.importListModal.table.mandatory')}</span>,
      // column1: <span style={{ color: 'green', fontWeight: "bold" }}>Có</span>,
      column1: <span style={{ color: 'green', fontWeight: "bold" }}>{translation('yes')}</span>,
      column2: <span style={{ color: 'green', fontWeight: "bold" }}>{translation('yes')}</span>,
      column3: <span style={{ color: 'green', fontWeight: "bold" }}>{translation('yes')}</span>
    }
];

const dataZalo = [
  {
    key: '1',
    position: <span style={{ color: 'black' }}>{translation('listCustomers.importListModal.table.parameter')}</span>,
    // column1: <span style={{ color: 'blue' }}>{translation('listCustomers.importListModal.table.email')}</span>,
    column1: <span style={{ color: 'blue' }}>{translation('listCustomers.importListModal.table.phone')}</span>,
    column2: <span style={{ color: 'blue' }}>{translation('listCustomers.importListModal.table.plateNumber')}</span>,
    column3: <span style={{ color: 'blue' }}>{translation('listCustomers.importListModal.table.expiryDate')}</span>,
    column4: <span style={{ color: 'blue' }}>{translation('receipt.customerReceiptName')}</span>,
  },
  {
    key: '2',
    position: <span style={{ color: 'black' }}>{translation('listCustomers.importListModal.table.sampleData')}</span>,
    // column1: 'ttdk@gmail.com',
    column1: "0985201236",
    column2: "36D5869",
    column3: "27/06/2023",
    column4: 'Vũ Văn Tài'
  },
  {
    key: '3',
    position: <span style={{ color: 'black' }}>{translation('listCustomers.importListModal.table.maxCharacters')}</span>,
    // column1: "254 ký tự",
    column1: "10 số",
    column2: "6-12 kí tự",
    column3: "10 kí tự",
    column4: 'Không có'
  },
  {
    key: '4',
    position: <span style={{ color: 'black' }}>{translation('listCustomers.importListModal.table.format')}</span>,
    // column1: <span style={{ color: 'red' }}>{translation('listCustomers.importListModal.table.validEmail')}</span>,
    column1: <span style={{ color: 'red' }}>{translation('listCustomers.importListModal.table.onlyNumbers')}</span>,
    column2: <span style={{ color: 'red' }}>{translation('listCustomers.importListModal.table.lettersAndNumbers')}</span>,
    column3: <span style={{ color: 'red' }}>{translation('listCustomers.importListModal.table.specialCharacterFormat')}</span>,
    column4: <span style={{ color: 'red' }}>{translation('listCustomers.importListModal.table.string_chacracter')}</span>
  },
  {
    key: '5',
    position: <span style={{ color: 'black' }}>{translation('listCustomers.importListModal.table.mandatory')}</span>,
    // column1: <span style={{ color: 'green', fontWeight: "bold" }}>Có</span>,
    column1: <span style={{ color: 'green', fontWeight: "bold" }}>{translation('yes')}</span>,
    column2: <span style={{ color: 'green', fontWeight: "bold" }}>{translation('yes')}</span>,
    column3: <span style={{ color: 'green', fontWeight: "bold" }}>{translation('yes')}</span>,
    column4: <span style={{ color: 'green', fontWeight: "bold" }}>{translation('yes')}</span>,
  },
];

  const handleUploadChange = async (info) => {
    setFileList(info?.fileList)
    if (info.file.status === 'done') {
      if (!(template.messageTemplateType.includes("SMS") || template.messageTemplateType.includes("ZALO"))) {
        notification["error"]({
          message: "",
          description: translation("listCustomers.importListModal.unsupportedMethod"),
        });
        return;
      }
      setFileUpload(info)
      return;
    }
    if (info.file.status === 'error') {
      notification.error({
        message: "",
        description: translation('error')
      })
    }
  };

  // Cho phép user import ngày hết hạn với định dạng D/M/YYYY', 'DD/M/YYYY', 'D/MM/YYYY
  const convertCustomerRecordCheckExpiredDate = (dateString) => {
    const EXPIRED_DATE_FORMAT = 'DD/MM/YYYY';
    const ALLOW_EXPIRED_DATE_FORMATS = ['DD/MM/YYYY', 'D/M/YYYY', 'DD/M/YYYY', 'D/MM/YYYY'];

    // Phân tích ngày tháng từ chuỗi đầu vào
    const date = moment(dateString, ALLOW_EXPIRED_DATE_FORMATS, true);

    // Kiểm tra nếu ngày tháng hợp lệ
    if (date.isValid()) {
      // Định dạng lại ngày tháng theo định dạng DD/MM/YYYY
      return  date.format(EXPIRED_DATE_FORMAT);
    } else {
      // Trả về ngày không đúng định dạng để show lỗi
      return dateString
    }
  };

  async function handleSendMessage() {
    const data = await handleParse(fileUpload.file.originFileObj,false);
    let convertData
    if(fileUpload.file.type == 'application/vnd.ms-excel'){
      const result = {
        isError: false,
        data: []
      };
      const arrNew = data.map(item => item.map(j => j || ''));
      const arraySlice = arrNew.slice(6);
      const arrayFilter = arraySlice.filter(item => item.length !== 0);
      arrayFilter.pop()
      let arrayData=[]
      for(let i=0;i<arrayFilter.length;i++){
        let resultItem= {
          customerMessagePhone:arrayFilter[i][12],
          customerRecordPlatenumber:arrayFilter[i][2],
          customerRecordCheckExpiredDate:arrayFilter[i][1],
        };
        arrayData.push(resultItem)
      }
      result.data = arrayData;
      convertData = result;
    }else{
      convertData = convertFileToArray({
        data,
        FIELD_IMPORT_API: template.messageTemplateId !== messageTemplateRegistration ? FIELDS_EXPORT_IMPORT.map((item) => item.api) : FIELDS_EXPORT_IMPORT_ZALO.map((item) => item.api),
        FIELD_IMPORT_FULL: template.messageTemplateId !== messageTemplateRegistration ? FIELDS_EXPORT_IMPORT.map((item) => item.content) : FIELDS_EXPORT_IMPORT_ZALO.map((item) => item.content),
        removeLine: 0
      });
    }

      const converters = {
        customerRecordCheckExpiredDate: convertCustomerRecordCheckExpiredDate
      }
      
      if (convertData.isError) {
        notification["error"]({
          message: "",
          description: translation("listCustomers.importTypeFailed"),
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

      if(dataResult.length > UPLOAD_ROW_LIMIT){
        notification["error"]({
          message: "",
          description: translation("sms.uploadError.description", { limit: UPLOAD_ROW_LIMIT }),
        });
        return;
      }

      // xóa index 
      const dataResultRemoveIndex = [...dataResult].map((item) => {
        const { index, CustomerScheduleStatus, notificationMethod, ...newItem } = item;
        return {
          ...newItem
        };
      })
      const newDataResultRemoveIndex = [...dataResultRemoveIndex];

      setFileList([])
      setFileUpload(undefined);
      setPercent(0);
      setisModalProgress(true);
      setPercentPlus(100 / newDataResultRemoveIndex.length);
      setArrImport(newDataResultRemoveIndex);
      setIsImport(true);
  }

  const handleSendTemplateZalo = (values) => {
    values.customerRecordPlatenumber = values.customerRecordPlatenumber + ""
    const newTemplate = Handlebars.compile(template.messageTemplateContent);
    const newDate = `${moment().format("YYYYMMDDHHmm")}_${setting.stationsId}`

    if(values.customerRecordFullName === undefined){
      values.customerRecordFullName = template.messageTemplateId == 3013 ? "!" : `Chủ PT ${values.customerRecordPlatenumber}`
    }
    const content = xoa_dau(newTemplate(
      {
        stationsBrandname: stationSetting.stationCustomSMSBrandConfig
          ? JSON.parse(stationSetting.stationCustomSMSBrandConfig).smsBrand
          : "",
        vehiclePlateNumber: values.customerRecordPlatenumber,
        ...stationSetting,
        ...values,
        customerRecordPlatenumber:Number(values.customerRecordPlatenumber.trim().charAt(values.customerRecordPlatenumber.trim().length-1)) ?  values.customerRecordPlatenumber.replace(/[^a-zA-Z0-9]/g, '') : values.customerRecordPlatenumber.replace(/[^a-zA-Z0-9]/g, '').slice(0, -1),
      }
    ));
    Object.keys(values).forEach(k => {
      if (!values[k] && values[k] !== 0) {
        delete values[k]
      }
    })
    setShouldCancel(true);
    MessageCustomerMarketing.sendZNSMessageToCustomerListExportImport({
      customerList: [{
        ...values,
        customerMessageContent: content
      }],
      messageTemplateData: { 
        ...values,
        customerMessageContent: content,
        campaignId : newDate
      },
      messageZNSTemplateId: template.messageZNSTemplateId?.toString(),
      messageTemplateId: template.messageTemplateId,
    }, cancelEventRef.current).then(async (result) => {
      setShouldCancel(false);
      setArrImport(prev => {
        prev.shift();
        return [...prev]
      })
      setPercent(prev => prev + percentPlus);
      const handleStatus = (text, status) => {
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
        if(!values.customerMessagePhone){
          setImportSummary(prev => ({
            ...prev,
            logs: [...prev.logs, {
              id: Math.random(),
              message: `Zalo : ${values.customerMessagePhone} : ${translation('listCustomers.customerMarketingError.error_bsx')}`,
              status: status
            }]
          }))
          return
        }
        if(values.customerRecordPlatenumber === "undefined"){
          setImportSummary(prev => ({
            ...prev,
            logs: [...prev.logs, {
              id: Math.random(),
              message: `Zalo : ${values.customerMessagePhone} : ${translation('listCustomers.customerMarketingError.error_bsx')}`,
              status: status
            }]
          }))
          return
        }
        if(!values.customerRecordCheckExpiredDate){
          setImportSummary(prev => ({
            ...prev,
            logs: [...prev.logs, {
              id: Math.random(),
              message: `Zalo : ${values.customerMessagePhone} : ${translation('listCustomers.customerMarketingError.error_bsx')}`,
              status: status
            }]
          }))
          return
        }
        setImportSummary(prev => ({
          ...prev,
          logs: [...prev.logs, {
            id: Math.random(),
            message: `Zalo : ${values.customerMessagePhone} : ${text}`,
            status: status
          }]
        }))
      };

      if (!result.isSuccess) {
        if (Object.keys(MESSAGE_CUMTOMER_MARKETING_ERROR).includes(result.error)) {
          handleStatus(MESSAGE_CUMTOMER_MARKETING_ERROR[result.error], LIST_STATUS.error)
          return;
        } else {
          handleStatus(translation('listCustomers.customerMarketingError.errorExists'), LIST_STATUS.error)
          return;
        }
        return;
      }
      handleStatus(translation("sms.messageSuccess"), LIST_STATUS.success)
    })
  }

  const handleSendTemplateSMS = (values) => {
    if(values?.customerRecordPlatenumber === undefined){
      notification["error"]({
        message: "",
        description: translation("listCustomers.customerMarketingError.BSX_NOT_FOUND"),
      });
      values.customerRecordPlatenumber = ''
    }
    values.customerRecordPlatenumber = values.customerRecordPlatenumber + ""
    const newTemplate = Handlebars.compile(template.messageTemplateContent);
    const content = xoa_dau(newTemplate(
      {
        stationsBrandname: stationSetting.stationCustomSMSBrandConfig
          ? JSON.parse(stationSetting.stationCustomSMSBrandConfig).smsBrand
          : "",
          ...stationSetting,
          ...values,
          vehiclePlateNumber: Number(values.customerRecordPlatenumber.trim().charAt(values.customerRecordPlatenumber.trim().length-1)) ?  values.customerRecordPlatenumber.replace(/[^a-zA-Z0-9]/g, '') : values.customerRecordPlatenumber.replace(/[^a-zA-Z0-9]/g, '').slice(0, -1),
      }
    ));
    Object.keys(values).forEach(k => {
      if (!values[k] && values[k] !== 0) {
        delete values[k]
      }
    })
    setShouldCancel(true);
    const newDate = `${moment().format("YYYYMMDDHHmm")}_${setting.stationsId}`

    MessageCustomerMarketing.sendSMSMessageToCustomerListExportImport({
      customerList: [{
        ...values,
        customerMessageContent: content,
      }],
      campaignId : newDate,
      messageTemplateId: template.messageTemplateId,
    }, cancelEventRef.current).then(async (result) => {
      setShouldCancel(false);
      setArrImport(prev => {
        prev.shift();
        return [...prev]
      })
      setPercent(prev => prev + percentPlus);
      const handleStatus = (text, status) => {
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
        if(!values.customerMessagePhone){
          setImportSummary(prev => ({
            ...prev,
            logs: [...prev.logs, {
              id: Math.random(),
              message: `Zalo : ${values.customerMessagePhone} : ${translation('listCustomers.customerMarketingError.error_bsx')}`,
              status: status
            }]
          }))
          return
        }
        if(values.customerRecordPlatenumber === "undefined"){
          setImportSummary(prev => ({
            ...prev,
            logs: [...prev.logs, {
              id: Math.random(),
              message: `Zalo : ${values.customerMessagePhone} : ${translation('listCustomers.customerMarketingError.error_bsx')}`,
              status: status
            }]
          }))
          return
        }
        if(!values.customerRecordCheckExpiredDate){
          setImportSummary(prev => ({
            ...prev,
            logs: [...prev.logs, {
              id: Math.random(),
              message: `Zalo : ${values.customerMessagePhone} : ${translation('listCustomers.customerMarketingError.error_bsx')}`,
              status: status
            }]
          }))
          return
        }
        setImportSummary(prev => ({
          ...prev,
          logs: [...prev.logs, {
            id: Math.random(),
            message: `SMS : ${values.customerMessagePhone} : ${text}`,
            status: status
          }]
        }))
      };

      if (!result.isSuccess) {
        if (Object.keys(MESSAGE_CUMTOMER_MARKETING_ERROR).includes(result.error)) {
          handleStatus(MESSAGE_CUMTOMER_MARKETING_ERROR[result.error], LIST_STATUS.error)
          return;
        } 
        if( result.error === "INVALID_PLATE_NUMBER"){
          handleStatus(translation('listCustomers.customerMarketingError.errorExists'), LIST_STATUS.error)
          return
        } else {
          handleStatus(translation('listCustomers.customerMarketingError.error_bsx'), LIST_STATUS.error)
          return;
        }
        return;
      }
      handleStatus(translation("sms.messageSuccess"), LIST_STATUS.success)
    })
  }
  const handleSendTemplate = (values) => {
    if (template.messageTemplateType.includes("SMS")) {
      handleSendTemplateSMS(values);
      return
    }

    if (template.messageTemplateType.includes("ZALO") || template.messageTemplateType.includes("ZNS")) {
      handleSendTemplateZalo(values);
      return;
    }
  };

  const handleStop = () => {
    // Hủy bỏ gọi api ngay lập tức
    cancelEventRef.current.emit('cancel');
  }

  useEffect(() => {
    return () => {
      if (shouldCancel) {
        // Hủy bỏ gọi api ngay lập tức
        cancelEventRef.current.emit('cancel');
      }
    };
  }, [shouldCancel]);

  useEffect(() => {
    if (arrImport.length > 0 && isImport && isModalProgress) {
      setTimeout(() => {
        handleSendTemplate(arrImport[0]);
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
      fetchMessage();
      handleStop();
    }
  }, [arrImport, isModalProgress, isImport]);

  useEffect(() => {
    if (isSendSMS) {
      setFileList([])
      setFileUpload(undefined);
      setPercent(0);
      setisModalProgress(true);
      setPercentPlus(100 / dataCustomerToSendMessage.length);
      setArrImport(dataCustomerToSendMessage);
      setIsImport(true);
    }
  }, [isSendSMS, dataCustomerToSendMessage])

  const handleBackClick = () => {
    if(isSendSMS) {
      onBackClick();
      return;
    }
    sessionStorage.removeItem(addKeyLocalStorage("saveSmsTemplate"))
    setTemplate(null);
    setCurrentStep(1)
  };

  const handleDirectLink = (template) => {
    if(template.messageTemplateId === messageTemplateRegistration){ // nhắn lịch đăng kiểm khi đến hạn (zalo)
    window.open(mautinzalo , '_blank');
   } else {
    setUrlForModalDirectLink(SAMPLE_FILE_LINK)
   }
  }

  return (
    <Drawer
      title={
        <PopupHeaderContainer
          screenHeaderTitle={!isSendSMS ? translation('listCustomers.importListModal.importTitle') : translation('listCustomers.importListModal.sendSms')}
          onCloseButtonClick={() => handleBackClick(false)}
          backButtonVisiblePC={true}
          onBackButtonClickPC={handleBackClick}
        />
      }
      width="100vw"
      height="100vh"
      visible={isSendMessageDrawer}
      closable={false}
      onClose={() => setIsSendMessageDrawer(false)}
      className='import-list-modal'
    >
      <div className="settings-list">
        <div className="list-info">
          <div className='d-flex align-items-center'>
            <ExclamationCircleOutlined className="info-icon" />
            <span className='text-small'>{translation('listCustomers.importListModal.ensureFileFormat')}</span>
          </div>
          <List
            bordered
            dataSource={listInstructions}
            renderItem={item => (
              <List.Item>
                <div className='d-flex align-items-center'>
                  <CheckCircleOutlined className="check-icon" />
                  <div className='d-flex text-small'>
                    {item}
                  </div>
                </div>
              </List.Item>
            )}
          />
        </div>
      </div>
      <div className="template-message-section mb-2">
        <Title level={5} className='title-small'>{translation('listCustomers.importListModal.templateMessageTitle')}</Title>
        <Text className='text-small'>{translation('listCustomers.importListModal.descriptionText')}</Text>
        <Card className="template-content mt-2" bordered={true} bodyStyle={{ padding: '16px' }}>
          {template.messageDemo}
        </Card>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <div className='d-flex justify-content-between'>
          <div>
            <Title level={5} className='title-small'>{translation('listCustomers.importListModal.contentTitle')}</Title>
          </div>
          <Button type="primary" onClick={() => handleDirectLink(template)}>{translation('listCustomers.importListModal.downloadSampleFile')}</Button>
        </div>
        <Text style={{ display: 'block' }} className='text-small'>
          {translation('listCustomers.importListModal.fileContentDescription')}
        </Text>
        <Table columns={template.messageTemplateId !== messageTemplateRegistration ? columns : columnsZalo} dataSource={template.messageTemplateId !== messageTemplateRegistration ? data : dataZalo} style={{ marginTop: '20px' }} scroll={{ x: 1000 }} pagination={false} />
        {!isSendSMS && (
          <div style={{ marginTop: '20px' }}>
            <div className="upload-container">
              <Title level={5} className='title-small'>{translation('listCustomers.importListModal.uploadListTitle')}</Title>
              <Upload.Dragger
                fileList={fileList}
                listType="picture"
                maxCount={1}
                accept=".xlsx, .xls"
                showUploadList={true}
                multiple={false}
                onChange={handleUploadChange}
                customRequest={({ onSuccess }) => {
                  setTimeout(() => {
                    onSuccess('ok');
                  }, 0);
                }}
              >
                <div className='d-flex align-items-center justify-content-center mb-2'>
                  <div className="upload-drag-icon me-2">
                    <UploadOutlined />
                  </div>
                  <div>
                    <p className="upload-text text-small">{translation('listCustomers.importListModal.dragOrUploadFile')}</p>
                  </div>
                </div>
                <p className="upload-hint text-small">{translation('listCustomers.importListModal.useXLSXFormat')}</p>
              </Upload.Dragger>
            </div>
          </div>
        )}
        <div className='d-flex justify-content-end gap-2 mt-2' style={{ height: 50 }}>
          <Button onClick={handleBackClick}>{translation('Quay lại')}</Button>
          <Button onClick={handleSendMessage} type="primary" disabled={!fileUpload} >{translation('Start_send')}</Button>
        </div>
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
    </Drawer>
  );
};

export default ImportListDrawer;
