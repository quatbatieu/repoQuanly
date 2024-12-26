import React, { useEffect, useState } from 'react';
import { Upload, Modal, notification, Spin } from "antd";
import ImgCrop from 'antd-img-crop';
import { useTranslation } from 'react-i18next';
import uploadService from "services/uploadService";
import { StatusInput } from './general';
import InspectionProcessService from 'services/inspectionProcessService';
import { useSelector } from 'react-redux';
import { PlusOutlined } from '@ant-design/icons';
import "./setting.scss";

const INFO_IMAGE_UPLOAD_WIDTH = 1976;
const INFO_IMAGE_UPLOAD_HEIGHT = 1165;
const LOGO_IMAGE_UPLOAD_WIDTH = 160;
const LOGO_IMAGE_UPLOAD_HEIGHT = 160;

function LogoBanner({ setting, fetchData }) {
  const user = useSelector((state) => state.member)
  const [previewOpens, setPreviewOpens] = useState(false);
  const { t: translation } = useTranslation();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewTitle, setPreviewTitle] = useState('');
  const [previewTitles, setPreviewTitles] = useState('');

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

  const handleCancel = () => setPreviewOpen(false);
  const handleCancels = () => setPreviewOpens(false);

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

  const handlePreview = async (file) => {
    setPreviewOpen(true);
  };

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

  if (isLoading) {
    return (
      <Spin />
    )
  }

  return (
    <>
      <div className="col-12 col-md-6">
        <label className="setting__label text-small">
          {translation("setting.logoUploadField" , {
            width : LOGO_IMAGE_UPLOAD_WIDTH ,
            height : LOGO_IMAGE_UPLOAD_HEIGHT
          })}
        </label>
        <div className="ant-row ant-form-item">
          <ImgCrop rotate aspect={LOGO_IMAGE_UPLOAD_WIDTH / LOGO_IMAGE_UPLOAD_HEIGHT}>
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
                      canvas.width = LOGO_IMAGE_UPLOAD_WIDTH;
                      canvas.height = LOGO_IMAGE_UPLOAD_HEIGHT;
                      const ctx = canvas.getContext('2d');

                      // Resize the image to fit within the canvas
                      const scale = Math.min(LOGO_IMAGE_UPLOAD_WIDTH / img.width, LOGO_IMAGE_UPLOAD_HEIGHT / img.height);
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
      </div>
      <div className="col-12 col-md-6">
        <label className="setting__label text-small">
          {translation("setting.introImageUploadField" , {
            height : INFO_IMAGE_UPLOAD_HEIGHT ,
            width : INFO_IMAGE_UPLOAD_WIDTH
          })}
        </label>
        <div className="ant-row ant-form-item">
          <div className='vehicleRecords'>
            <ImgCrop rotate aspect={INFO_IMAGE_UPLOAD_WIDTH / INFO_IMAGE_UPLOAD_HEIGHT}>
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
      <Modal
        visible={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
        centered
        width={LOGO_IMAGE_UPLOAD_WIDTH}
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
    </>
  );
}

export default LogoBanner;