import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'
import './setting.scss'
import { useDispatch } from 'react-redux';
import { SETTING } from './../../constants/setting'
import { useSelector } from 'react-redux'
import InspectionProcessService from "./../../services/inspectionProcessService"
import UploadService from "./../../services/uploadService"
import { convertFileToBase64 } from '../../helper/common';
import { UPDATE } from '../../constants/introduction'
import {
  Input,
  Button,
  Upload,
  notification,
  Switch,
  Spin,
  Modal
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import _ from 'lodash';
import { IconCopy } from '../../assets/icons';
import { useHistory } from 'react-router-dom';
import uploadService from './../../services/uploadService';
import ScheduleSettingService from 'services/scheduleSettingService';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

const BLACK = "BLACK"
const BLUE = "BLUE"
const BLUE_SECOND = "BLUE_SECOND"
const BLUE_THIRD = "BLUE_THIRD"
const GREEN = "GREEN"

export default function SettingWeb({
  setLoading
}) {
  const { t: translation } = useTranslation()
  const user = useSelector((state) => state.member)
  const stationsIntroduction = useSelector((state) => state.introduction)
  const dispatch = useDispatch()
  const history = useHistory()
  const [imageUrl, setImageUrl] = useState();
  const [setting, setSetting] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addImage, setAddImage] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTitle, setPreviewTitle] = useState('');
  const [imageUrls, setImageUrls] = useState();
  const [addImages, setAddImages] = useState(false);
  const [previewOpens, setPreviewOpens] = useState(false);
  const [previewTitles, setPreviewTitles] = useState('');

  const handleCancel = () => setPreviewOpen(false);
  const handleCancels = () => setPreviewOpens(false);

  let newArrLogo = setting.stationsLogo ? [{
    uid: setting.stationsId,
    name: setting.stationsLogo,
    status: 'done',
    url: setting.stationsLogo,
    response: setting.stationsLogo
  }] : []

  let newArrBanner = setting.stationsBanner ? [{
    uid: setting.stationsId,
    name: setting.stationsBanner,
    status: 'done',
    url: setting.stationsBanner,
    response: setting.stationsBanner
  }] : []

  const handlePreview = async (file) => {
    setPreviewOpen(true);
  };

  const handlePreviews = async (file) => {
    setPreviewOpens(true);
  };

  function handleUpdateSetting(data) {
    InspectionProcessService.updateById({ id: user.stationsId, data }).then((res) => {
      if (!res.issSuccess) {
        notification['error']({
          message: "",
          description: translation('setting.error')
        })
        return;
      }
      fetchData();
    })
  }

  function handleUpdateIntroduction(data) {
    uploadService.updateStationIntroduction({ id: user.stationsId, data })
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

  const handleImageChange = (info, name) => {
    if (info.file.status === 'done') {
      const imageUrl = info.file.response;
      setTimeout(() => {
        handleUpdateSetting({
          [name]: imageUrl
        })
      }, 300)
    }
  };

  function handleCopyItem(id) {
    const copyText = document.getElementById(id);
    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /* For mobile devices */
    /* Copy the text inside the text field */
    navigator.clipboard.writeText(copyText.value);
    notification.info({
      message: "",
      description: translation('setting.copied')
    })
  }

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

  const fetchData = async () => {
    setIsLoading(true);
    const result = await ScheduleSettingService.getDetailById({ id: user.stationsId });
    if (result) {
      setSetting(result);
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 300)
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <Spin />
    )
  }
  return (

    <div className="setting">
      <div className="row">
        {/* <div className="col-12 col-md-4">
					<label>Slogan</label>
				</div>
				<div className="col-12 col-md-8">
					<div className="ant-row ant-form-item">
						<Input
							placeholder="Slogan"
							value={stationsIntroduction.stationIntroductionSlogan}
							onChange={(e) => {
								dispatch({
									type: UPDATE,
									data: {
										stationIntroductionSlogan: e.target.value
									}
								})
							}}
							onBlur={(e) => {
								const { value } = e.target
								handleUpdateIntroduction({ stationIntroductionSlogan: value })
							}}
						/>
					</div>
				</div> */}
        {/* <div className="col-12 col-md-4">
					<label>{translation('setting.service')}</label>
				</div> */}
        {/* <div className="col-12 col-md-8">
					<div className="ant-row ant-form-item">
						<Input
							placeholder={translation('setting.service')}
							value={stationsIntroduction.stationIntroServices}
							onChange={(e) => {
								dispatch({
									type: UPDATE,
									data: {
										stationIntroServices: e.target.value
									}
								})
							}}
							onBlur={(e) => {
								const { value } = e.target
								handleUpdateIntroduction({ stationIntroServices: value })
							}}
						/>
					</div>
				</div> */}
        {/* <div className="col-12 col-md-4">
					<label>{translation('setting.logo')}</label>
				</div>
				<div className="col-12 col-md-8">
					<div className="ant-row ant-form-item">
						<Upload showUploadList={false} accept="image/*" onChange={normFile} name="logo" listType="picture">
							<Button type="primary">{translation('setting.upFile')} <UploadOutlined /></Button>
						</Upload>
					</div>
					{setting.stationsLogo && (
						<div className='mb-4'>
							<img width={200} src={setting.stationsLogo} />
						</div>
					)}
				</div> */}
        {/* <div className="col-12 col-md-4">
					<label>{translation('setting.settingAdvertising')}</label>
				</div>
				<div className="col-12 col-md-8">
					<div className="ant-row ant-form-item">
						<Button onClick={() => history.push('/edit-banner')} type="primary">{translation('setting.settingAdvertising')}</Button>
					</div>
				</div> */}
        {/* <div className="col-12 col-md-4">
					<label>Trang giới thiệu</label>
				</div>
				<div className="col-12 col-md-8">
					<div className="ant-row ant-form-item">
						<Button onClick={() => history.push('/edit-landing-page')} type="primary">Chỉnh sửa</Button>
					</div>
				</div>
				<div className="col-12 col-md-4">
					<label>Đường dẫn trang web</label>
				</div>
				<div className="col-12 col-md-8">
					<div className="ant-row ant-form-item position-relative">
						<Input
							placeholder={translation('setting.inputLink')}
							value={setting.stationUrl}
							id="stationUrl"
							onChange={() => { }}
							disabled
						/>
						<div className="setting__copy_icon bg" />
						<IconCopy onClick={() => handleCopyItem("stationUrl")} className="setting__copy_icon" />
					</div>
				</div> */}
        {/* <div className="col-12 col-md-4">
					<label>Liên kết dữ liệu (Webhook)</label>
				</div>
				<div className="col-12 col-md-8">
					<div className="ant-row ant-form-item position-relative">
						<Input
							placeholder={translation('setting.inputLink')}
							value={setting.stationWebhookUrl}
							id="stationWebhookUrl"
							onChange={() => { }}
							disabled
						/>
						<div className="setting__copy_icon bg" />
						<IconCopy onClick={() => handleCopyItem("stationWebhookUrl")} className="setting__copy_icon" />
					</div>
				</div> */}
        <div className="col-12 col-md-4">
          <label className='text-small'>{translation('setting.allowOverbooking')}</label>
        </div>
        <div className="col-12 col-md-8 mb-4">
          <Switch
            checked={(setting.enableConfigBookingOnToday === 1 ? true : false) || false}
            onChange={(checked) => handleUpdateSetting({ enableConfigBookingOnToday: checked ? 1 : 0 })}
          />
        </div>
        <div className="col-12 col-md-4">
          <label className='text-small'>{translation('setting.automaticAppointmentConfirmation')}</label>
        </div>
        <div className="col-12 col-md-8 mb-4">
          <Switch
            checked={(setting.enableConfigAutoConfirm === 1 ? true : false)}
            onChange={(checked) => handleUpdateSetting({ enableConfigAutoConfirm: checked ? 1 : 0 })}
          />
        </div>
        <div className="col-12 col-md-4">
          <label className='text-small'>{translation('setting.limitOverbookingAllowed')}</label>
        </div>
        <div className="col-12 col-md-8 mb-4">
          <Switch
            checked={(setting.enableConfigAllowBookingOverLimit === 1 ? true : false)}
            onChange={(checked) => handleUpdateSetting({ enableConfigAllowBookingOverLimit: checked ? 1 : 0 })}
          />
        </div>
        <div className="col-12 mb-2">
          <label className='text-small'>{translation('setting.logoUploadField')}</label>
        </div>
        <div className="col-12 mb-4">
          <ImgCrop rotate>
            <Upload
              showUploadList={true}
              multiple={false}
              maxCount={1}
              accept="image/*"
              beforeUpload={(file) => {
                return new Promise((resolve, reject) => {
                  const reader = new FileReader();
                  reader.readAsDataURL(file);
                  reader.onload = () => {
                    const img = new Image();
                    img.src = reader.result;

                    img.onload = async () => {
                      const canvas = document.createElement('canvas');
                      canvas.width = 160;
                      canvas.height = 160;
                      const ctx = canvas.getContext('2d');

                      // Resize the image to fit within the canvas
                      const scale = Math.min(160 / img.width, 160 / img.height);
                      const width = img.width * scale;
                      const height = img.height * scale;
                      ctx.drawImage(img, 0, 0, width, height);

                      canvas.toBlob((blob) => {
                        const newFile = new File([blob], 'newImage.jpg', {
                          type: 'image/jpeg', // Change to the appropriate image type if needed
                        });

                        resolve(newFile);
                      }, 'image/jpeg'); // Change to the appropriate image type if needed
                    };
                  };
                });
              }}
              customRequest={customRequest}
              listType="picture-card"
              onPreview={handlePreview}
              onRemove={() => {
                handleUpdateSetting({
                  stationsLogo: ""
                })
              }}
              onChange={(info) => handleImageChange(info, "stationsLogo")}
              defaultFileList={newArrLogo}
            >
              {!setting.stationsLogo && (
                uploadButton
              )}
            </Upload>
          </ImgCrop>
        </div>
        <div className="col-12 mb-2">
          <label className='text-small'>{translation('setting.introImageUploadField')}</label>
        </div>
        <div className="col-12">
          <div className='vehicleRecords'>
            <ImgCrop rotate aspect={1200 / 648}>
              <Upload
                showUploadList={true}
                multiple={false}
                accept="image/*"
                maxCount={1}
                name="stationsBanner"
                onRemove={() => {
                  handleUpdateSetting({
                    stationsBanner: ""
                  })
                }}
                listType="picture-card"
                onChange={(info) => handleImageChange(info, "stationsBanner")}
                onPreview={handlePreviews}
                customRequest={customRequest}
                defaultFileList={newArrBanner}
              >
                {!setting.stationsBanner && (
                  uploadButton
                )}
              </Upload>
            </ImgCrop>
          </div>
        </div>
      </div>
      {/* <hr />
				<div className="setting__hr"></div>
				<div className="row">
					<div className="col-12">
						<label>{translation('setting.color')}</label>
					</div>
					<div className="col-12 setting__inline">
						<div onClick={() => {
							handleUpdateSetting({ stationsColorset: BLACK })
							handleOnChange({ stationsColorset: BLACK })
						}} className={`setting__circle ${setting.stationsColorset === BLACK ? "selected" : ""} `}>
							<div className="setting__black" />
						</div>
						<div onClick={() => {
							handleUpdateSetting({ stationsColorset: BLUE })
							handleOnChange({ stationsColorset: BLUE })
						}} className={`setting__circle ${setting.stationsColorset === BLUE ? "selected" : ""} `}>
							<div className="setting__black setting__blue " />
						</div>
						<div onClick={() => {
							handleUpdateSetting({ stationsColorset: BLUE_SECOND })
							handleOnChange({ stationsColorset: BLUE_SECOND })
						}} className={`setting__circle ${setting.stationsColorset === BLUE_SECOND ? "selected" : ""} `}>
							<div className="setting__black setting__blue-second " />
						</div>
						<div onClick={() => {
							handleUpdateSetting({ stationsColorset: BLUE_THIRD })
							handleOnChange({ stationsColorset: BLUE_THIRD })
						}} className={`setting__circle ${setting.stationsColorset === BLUE_THIRD ? "selected" : ""} `}>
							<div className="setting__black setting__blue-third " />
						</div>
						<div onClick={() => {
							handleUpdateSetting({ stationsColorset: GREEN })
							handleOnChange({ stationsColorset: GREEN })
						}} className={`setting__circle ${setting.stationsColorset === GREEN ? "selected" : ""} `}>
							<div className="setting__black setting__green" />
						</div>
					</div>
				</div> */}
      <Modal
        visible={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
        centered
        width={160}
        bodyStyle={{
          padding: 0,
          textAlign: 'center',
        }}
      >
        <img
          alt="example"
          style={{
            width: '100&',
          }}
          src={setting.stationsLogo}
        />
      </Modal>
      <Modal
        visible={previewOpens}
        title={previewTitles}
        footer={null}
        onCancel={handleCancels}
        width={600}
      >
        <img
          alt="example"
          style={{
            width: '100%',
          }}
          src={setting.stationsBanner}
        />
      </Modal>
    </div>
  )
}