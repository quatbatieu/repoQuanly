import React, { useEffect, useRef, useState } from 'react'
import { Button, notification, Space, Table } from 'antd'
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { DeleteOutlined, LeftOutlined } from '@ant-design/icons';
import './setting.scss'
import { convertFileToBase64 } from '../../helper/common';
import _ from 'lodash';
import uploadService from '../../services/uploadService';
import { SETTING } from 'constants/setting';

function EditBanner(props) {
  const setting = useSelector(state => state.setting)
  const member = useSelector(state => state.member)
  const inputBannerRight = useRef()
  const inputBannerLeft = useRef()
  const dispatch = useDispatch()
  const { t: translation } = useTranslation()
  const [bannerLeft, setBannerLeft] = useState({
    preview: '',
    file: null
  })
  const [bannerRight, setBannerRight] = useState({
    preview: '',
    file: null
  })

  function initImage() {
    if(setting && !_.isEmpty(setting)) {
      setBannerRight({
        preview: setting.stationsCustomAdBannerRight,
        file: null
      })
      setBannerLeft({
        preview: setting.stationsCustomAdBannerLeft,
        file: null
      })
    }
  }

  useEffect(() => {
    initImage()
  },[])

  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'name',
      width: 50,
      className: 'accreditation__center accreditation__stt'
    },
    {
      title: translation("accreditation.licensePlates"),
      dataIndex: 'customerRecordPlatenumber',
      key: 'customerRecordPlatenumber',
      width: 100,
      render: (_, record) => {
        return (
          <h4 className="accreditation__center">
            <b style={{fontFamily: "sans-serif"}}>{record.customerRecordPlatenumber}</b>
          </h4>
        )
      }
    }
  ];

  const columnsV1 =[...columns]
  setting.stationCheckingConfig.forEach(item=>{
    columnsV1.push({
      title: item.stepLabel,
      dataIndex: item.stepIndex,
      key: item.stepLabel,
      className: "accreditation__center",
      render: (_, record)=>{
        return <div className="accreditation"></div>
      }
    })
  })

  function onChangeBannerLeft(e) {
    const image = e.target.files[0]
    if(image) {
      convertFileToBase64(image).then(dataUrl => {
        const newData = dataUrl.replace(/,/gi, '').split('base64')
        if(newData[1]) {
          const data = {
            "imageData": newData[1],
            "imageFormat": "png"
          }
          setBannerLeft({
            preview: dataUrl,
            file: data
          })
        }
      })
    }
  }

  function onChangeBannerRight(e) {
    const image = e.target.files[0]
    if(image) {
      convertFileToBase64(image).then(dataUrl => {
        const newData = dataUrl.replace(/,/gi, '').split('base64')
        if(newData[1]) {
          const data = {
            "imageData": newData[1],
            "imageFormat": "png"
          }
          setBannerRight({
            preview: dataUrl,
            file: data
          })
        }
      })
    }
  }

  async function handleUploadImage(data) {
    return uploadService.uploadImageBanner(data).then(result => { 
      if(result.issSuccess) {
        return result.data;
      } else {
        return null
      }
    })
  }

  async function handleUpdateBanner() {
    let bannerLeftUrl = ''
    let bannerRightUrl = ''
    if(bannerLeft.file) {
      bannerLeftUrl = await handleUploadImage(bannerLeft.file)
      if(bannerLeftUrl) {
        uploadService.updateBanner("/Stations/updateLeftAdBanner", {
          "stationsId": member.stationsId,
          "stationsCustomAdBannerLeft": bannerLeftUrl
        }).then((result) => {
          if(result.issSuccess) {
            dispatch({ type: SETTING, data: { ...setting, stationsCustomAdBannerLeft: bannerLeftUrl } })
            notification.success({
              message: "",
              description: translation("inspectionProcess.updateSuccess")
            })
          } else {
            notification.error({
              message: "",
              description: translation("inspectionProcess.updateError")
            })
          }
        })
      } else {
        notification.error({
          message: "",
          description: translation("setting.uploadImageFail")
        })
      }
    }
    if(bannerRight.file) {
      bannerRightUrl = await handleUploadImage(bannerRight.file)
      if(bannerRightUrl) {
        uploadService.updateBanner("/Stations/updateRightAdBanner", {
          "stationsId": member.stationsId,
          "stationsCustomAdBannerRight": bannerRightUrl
        }).then((result) => {
          if(result.issSuccess) {
            dispatch({ type: SETTING, data: { ...setting, stationsCustomAdBannerRight: bannerLeftUrl } })
            notification.success({
              message: "",
              description: translation("inspectionProcess.updateSuccess")
            })
          } else {
            notification.error({
              message: "",
              description: translation("inspectionProcess.updateError")
            })
          }
        })
      } else {
        notification.error({
          message: "",
          description: translation("setting.uploadImageFail")
        })
      }
    }
  }

  function onRemoveBanner(path, data, cb) {
    uploadService.updateBanner(path, data).then((result) => {
      if(result.issSuccess) {
        cb()
        notification.success({
          message: "",
          description: translation("setting.deleteBannerSuccess")
        })
      } else {
        notification.error({
          message: "",
          description: translation("setting.deleteBannerFailed")
        })
      }
    })
  }

  return (
    <main className='edit_banner'>
      <div onClick={props.history.goBack} className='d-flex pointer align-items-center edit_banner_back pb-3'>
        <LeftOutlined /> {translation('addBookingSuccess.goBack')}
      </div>

      <div className='edit_banner__body'>
        <div className='edit_banner__body_banner'>
          <input ref={inputBannerLeft} onChange={onChangeBannerLeft} hidden id="banner-left" type='file' accept='image/*'/>
          {
            bannerLeft.preview !== '' ? (
              <img src={bannerLeft.preview}/>
            ) : (
              <label htmlFor='banner-left'>
                {translation('listCustomers.selectFile')}
                <div className='w-100 edit_banner__body_pixel d-flex justify-content-center align-items-center'>
                  160x600
                </div>
              </label>
            )
          }
        </div>
        <Table 
          dataSource={[]} 
          className='edit_banner__body_table'
          columns={columnsV1} 
          rowClassName={(record, index) => `${record &&record.isAdd ? "edited-row__add" : ""}`}  
          scroll={{x:1190}}
        />
        <div className='edit_banner__body_banner'>
          <input ref={inputBannerRight} onChange={onChangeBannerRight} hidden id="banner-right" type='file' accept='image/*'/>
          {
            bannerRight.preview !== '' ? (
              <img src={bannerRight.preview}/>
            ) : (
              <label htmlFor='banner-right'>
                {translation('listCustomers.selectFile')}
                <div className='w-100 edit_banner__body_pixel d-flex justify-content-center align-items-center'>
                  160x600
                </div>
              </label>
            )
          }
        </div>
      </div>

      <div className='d-flex justify-content-between py-1'>
        <div onClick={() => {
          inputBannerLeft.current.value = ''
          onRemoveBanner(
            "/Stations/updateLeftAdBanner",
            {
              "stationsId": member.stationsId,
              "stationsCustomAdBannerLeft": ''
            },
            () => {
              dispatch({ type: SETTING, data: { ...setting, stationsCustomAdBannerLeft: '' } })
              setBannerLeft({
                preview: "",
                file: null
              })
            }
          )
        }} className='edit_banner__button pointer'><DeleteOutlined /></div>
        <div onClick={() => {
          inputBannerRight.current.value = ''
          onRemoveBanner(
            "/Stations/updateRightAdBanner",
            {
              "stationsId": member.stationsId,
              "stationsCustomAdBannerRight": ''
            },
            () => {
              dispatch({ type: SETTING, data: { ...setting, stationsCustomAdBannerRight: '' } })
              setBannerRight({
                preview: "",
                file: null
              })
            }
          )
        }} className='edit_banner__button pointer'><DeleteOutlined /></div>
      </div>


      <div className='w-100 d-flex justify-content-center pb-3'>
        <Space>
          <Button onClick={initImage} type='default'>{translation('listSchedules.cancel')}</Button>
          <Button onClick={handleUpdateBanner} type='primary'>{translation('listSchedules.save')}</Button>
        </Space>
      </div>
    </main>
  )
}

export default EditBanner
