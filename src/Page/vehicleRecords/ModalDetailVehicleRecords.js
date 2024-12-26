import React from "react";
import { IdcardOutlined, MessageOutlined, TagsOutlined, CheckOutlined, CloseOutlined, FileTextOutlined, CodeOutlined, NumberOutlined, BorderOutlined, PlusOutlined, ToolOutlined } from "@ant-design/icons";
import { Button, Drawer, Form, Modal, Spin, Tag, Upload } from 'antd';
import { getListVehicleTypes } from 'constants/listSchedule';
import { optionVehicleType } from "constants/vehicleType";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { IconCar } from "../../assets/icons";
import uploadService from '../../services/uploadService';
import TechnicalSpecificationsDetail from "./TechnicalSpecificationsDetail";
import "./modalDetailVehicleRecords.scss";
import HistoryDetailVehicleRecords from "./HistoryDetailVehicleRecords";
import { routes } from "App";
import { useHistory, useParams } from "react-router-dom";
import vehicleProfileService from "services/vehicleProfileService";
import { PopupHeaderContainer } from "components/PopupHeader/PopupHeader";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const ModalDetailVehicleRecordsItem = ({ icon, text, value, src, className = "col-12" }) => {
  const Icon = icon;

  return (
    <div style={{ marginTop: 12 }} className={className}>
      <div className="d-flex align-items-start">
        <div className="flex-1 d-flex align-items-center justify-content-center" style={{ height: 23, width: 25 }}>
          {src ? (
            <img src={src} style={{ height: 15 }} />
          ) : (
            <Icon style={{ fontSize: 15, color: "#0870D9" }} />
          )}
        </div>
        <div className="ms-1">
          <div className="booking-text mb-3">{text}</div>
          <p className="booking-value mb-0">
            {value}
          </p>
        </div>
      </div>
    </div>
  )
}

const StatusIndicator = ({ isBool, label }) => {
  return (
    <div className="col-12 col-md-12">
      <div className="d-flex align-items-center">
        <div className="d-flex me-1 justify-content-center">
          <div className="StatusIndicator-boxIcon" style={{ height: 23, width: 25 }}>
            {isBool ? (
              <CheckOutlined style={{ color: 'green', fontSize: 15 }} />
            ) : (
              <CloseOutlined style={{ color: 'red', fontSize: 15 }} />
            )}
          </div>
        </div>
        <span>{label}</span>
      </div>
    </div>
  );
};

const ModalDetailVehicleRecords = (props) => {
  const history = useHistory();
  const { isEditing, toggleEditModal, onUpdateCustomer, form } = props
  const [ckeditor, setCkeditor] = useState()
  const [isLoading, setIsLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [ckeditorWordCount, setWordcount] = useState(0);
  const [vehicleRecord, setVehicleRecord] = useState({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const inputRef = useRef()
  const { id } = useParams();
  const { t: translation } = useTranslation()
  const listVehicleType = optionVehicleType(translation);

  const optionsColor = [
    {
      value: 1,
      lable: <div className="accreditation__parent">
        {translation("accreditation.white")}
        <IconCar className=" accreditation__circle-white" />
      </div>
    },
    {
      value: 2,
      lable: <div className="accreditation__parent">
        {translation("accreditation.blue")}
        <IconCar className=" accreditation__circle-blue" />

      </div>
    },
    {
      value: 3,
      lable: <div className="accreditation__parent">
        {translation("accreditation.yellow")}
        <IconCar className=" accreditation__circle-yellow" />
      </div>
    }
  ]

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        {translation('vehicleRecords.file')}
      </div>
    </div>
  );

  const colorList = {
    WHITE : 1 , 
    BLUE : 2 , 
    YELLOW : 3,
    RED : 4
  }

  const handleCancel = () => setPreviewOpen(false);

  const handleUpdate = (values) => {
    setIsLoading(true);

    const newData = {
      ...values,
      image: values.image?.fileList?.map(item => item.response) || []
    }

    console.log("newData", newData);
    setIsLoading(false)
    // onUpdateCustomer({
    //   id,
    //   data: newData
    // }, () => {
    //   setIsLoading(false);
    // })
  }

  const customRequest = async ({ file, onSuccess, onError, onProgress }) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = async function () {
      let baseString = reader.result
      const params = {
        imageData: baseString.replace('data:' + file.type + ';base64,', ''),
        imageFormat: file.type.replace('image/', '')
      }
      const res = await uploadService.uploadImage(params);

      if (res.issSuccess) {
        onSuccess(res.data); // Gọi hàm onSuccess với đường dẫn URL của hình ảnh từ phản hồi của server
      } else {
        onError({
          message: "Status : " + res.statusCode
        }); // Thông điệp lỗi cụ thể
      }
    }
  };

  const BindPlate = ({ type, number }) => {
    const colors = {
      1: '#fffff',
      2: '#0050B3',
      3: '#FFC53D',
      4: '#FF4D4F'
    }

    const style = {
      width: "100%",
      height: 41,
      borderRadius: 8,
      padding: "0px 20px",
      fontWeight: 500
    }

    return (
      <Tag
        className="plate-tag white d-flex align-items-center justify-content-center"
        color={colors[type]}
        style={colors[type] === colors[2] || colors[type] === colors[4] ? { color: '#fff', ...style } : { ...style }}
      >
        {number}
      </Tag>
    )
  }

  const fetchDocumentById = (id) => {
    setIsLoading(true);
    vehicleProfileService.findById({ id }).then((result) => {
      if (result) {
        const listImage = result.fileList?.map((item) => ({
          uid: item.vehicleFileId,
          name: item.vehicleFileName,
          status: 'done',
          url: item.vehicleFileUrl,
          response: item.vehicleFileUrl
        })) || [];

        setFileList(listImage)
        setVehicleRecord(result);
        setIsLoading(false);
      }
    });
  };

  useEffect(() => {
    if (id) {
      fetchDocumentById(id)
    }
  }, [id])

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    // setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  return (
    <Drawer
      visible={true}
      className="drawerManagement"
      title={
        <PopupHeaderContainer
          screenHeaderTitle={translation('vehicleRecords.titleDetail')}
          onCloseButtonClick={() => history.push(routes.vehicleRecords.path)}
        />
      }
      closable={false}
      width="100vw"
      footer={
        <div className="d-flex w-100 justify-content-end">
          <Button
            onClick={() => history.push(routes.vehicleRecords.path)}
            className="mx-1"
          >
            {translation("category.no")}
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        onFinish={handleUpdate}
        layout="vertical"
        onValuesChange={(values) => {
          if (values.licensePlates) {
            form.setFieldsValue({
              licensePlates: values.licensePlates.toUpperCase()
            })
          }
        }}
      >
        {isLoading ? (
          <Spin />
        ) : (
          <div className="row">
            <div className="col-12 col-md-12 col-lg-4">
              <h3 className="management-title">{translation('vehicleRecords.vehicle')}</h3>
              <div className='row'>
                <div style={{ marginTop: 12 }} className='col-12 col-sm-6 col-lg-6'>
                  <div className='d-flex align-items-start'>
                    <div className='flex-1 d-flex align-items-center justify-content-center' style={{ height: 23, width: 25 }}>
                      <img src={process.env.PUBLIC_URL + '/assets/images/icon-LicensePlates.png'} style={{ height: 15 }} />
                    </div>
                    <div className='ms-1'>
                      <div className='booking-text mb-3'>{translation("vehicleRecords.license-plates")}</div>
                      <p className="booking-value mb-0">
                        <div>
                          <BindPlate
                            type={colorList[vehicleRecord.vehiclePlateColor] || 1}
                            number={vehicleRecord.vehiclePlateNumber}
                          />
                        </div>
                      </p>
                    </div>
                  </div>
                </div>
                <ModalDetailVehicleRecordsItem
                  className="col-12 col-sm-6 col-lg-6"
                  src={process.env.PUBLIC_URL + '/assets/images/icon-TypeVehicle.png'}
                  text={translation("vehicleRecords.vehicleType")}
                  value={getListVehicleTypes(translation)[vehicleRecord.vehicleType] || translation('unknowCar')}
                />

                <ModalDetailVehicleRecordsItem
                  className="col-12 col-sm-6 col-lg-6"
                  icon={IdcardOutlined}
                  text={translation("vehicleRecords.managementNumber")}
                  value={vehicleRecord.vehicleRegistrationCode}
                />

                <ModalDetailVehicleRecordsItem
                  className="col-12 col-sm-6 col-lg-6"
                  icon={TagsOutlined}
                  text={translation("vehicleRecords.typeNumber")}
                  value={vehicleRecord.vehicleBrandModel}
                />

                <ModalDetailVehicleRecordsItem
                  className="col-12 col-sm-6 col-lg-6"
                  icon={BorderOutlined}
                  text={translation("vehicleRecords.chassisNumber")}
                  value={vehicleRecord.chassisNumber}
                />

                <ModalDetailVehicleRecordsItem
                  className="col-12 col-sm-6 col-lg-6"
                  icon={CodeOutlined}
                  text={translation("vehicleRecords.engineNumber")}
                  value={vehicleRecord.engineNumber}
                />
                <div style={{ marginTop: 12 }} className='col-12 col-sm-6 col-lg-6'>
                  <div className='d-flex align-items-start'>
                    <div className='flex-1 d-flex align-items-center justify-content-center' style={{ height: 23, width: 25 }}>
                      <img src={process.env.PUBLIC_URL + '/assets/images/icon-Service.png'} style={{ height: 15 }} />
                    </div>
                    <div className='ms-1'>
                      <div className='booking-text mb-3'>{translation("vehicleRecords.note")}</div>
                      <p className="booking-value mb-0">
                        <p className='booking-item-note'>
                          <pre className='text-i notes-code'>{vehicleRecord?.vehicleNote}</pre>
                        </p>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="vehicleRecords-box">
                <StatusIndicator isBool={vehicleRecord?.vehicleForBusiness} label={translation('vehicleRecords.transportationBusiness')} />
                <StatusIndicator isBool={vehicleRecord?.vehicleForRenovation == 1} label={translation('vehicleRecords.renovation')} />
                <StatusIndicator isBool={vehicleRecord?.equipCruiseControlDevice} label={translation('vehicleRecords.monitoringDevice')} />
                <StatusIndicator isBool={vehicleRecord?.equipDashCam} label={translation('vehicleRecords.cameraEquipped')} />
                <StatusIndicator isBool={vehicleRecord?.vehicleForNoStamp == 1} label={translation('vehicleRecords.noInspectionSticker')} />
              </div>
            </div>
            <div className="col-12 col-md-12 col-lg-4 mt-2 mt-lg-0">
              <h3 className="management-title mt-md-2 mt-lg-0">{translation('vehicleRecords.specifications')}</h3>
              <TechnicalSpecificationsDetail vehicleRecord={vehicleRecord} />
            </div>
            <div className="col-12 col-md-12 col-lg-4">
              <h3 className="management-title mt-md-2 mt-lg-0">{translation('vehicleRecords.image')}</h3>
              <div className="row">
                <div className="col-12 col-md-12">
                  <Form.Item
                    name="image"
                    rules={[]}
                  >
                    <Upload
                      accept="image/png, image/jpeg"
                      showUploadList={true}
                      customRequest={customRequest}
                      multiple={true}
                      onChange={(info) => setFileList(info.fileList)}
                      onPreview={handlePreview}
                      defaultFileList={fileList}
                      disabled={true}
                      listType="picture-card"
                    >
                    </Upload>
                  </Form.Item>
                </div>
                <Modal visible={previewOpen} className="modalClose" title={previewTitle} bodyStyle={{ padding : 30 }} footer={null} onCancel={handleCancel}>
                  <img
                    alt="example"
                    style={{
                      width: '100%',
                    }}
                    src={previewImage}
                  />
                </Modal>
              </div>
            </div>
          </div>
        )}
      </Form>
    </Drawer >
  )
}

export default ModalDetailVehicleRecords;