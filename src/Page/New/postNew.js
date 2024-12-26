import React, { useState, useEffect, Fragment } from 'react'
import {
  Form,
  Upload,
  Image,
  notification,
  Input,
  Button,
  Select,
  Space,
  Typography,
  Row,
  DatePicker,
} from 'antd'
import { PlusOutlined, RetweetOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { convertFileToBase64 } from '../../helper/common'
import uploadService from '../../services/uploadService'
import NewService from '../../services/newService'
import 'ckeditor5-custom-build/build/translations/vi'
import _ from 'lodash'
import TextEditor from '../../components/TextEditor'
import './newStyle.scss'
import { FeedDetailView } from './Component/FeedDetailView'
import { useSelector } from 'react-redux'
import UnLock from 'components/UnLock/UnLock';
import moment from 'moment'
import Editor from 'ckeditor5-custom-build/build/ckeditor'
import dayjs from 'dayjs';
import { DATE_DISPLAY_FORMAT } from 'constants/dateFormats'

const CONTENT_MAXLENGTH = 10000
const { TextArea } = Input;

function PostNew({
  setIsReload,
  oldPostImage,
  oldPost,
  defaultKey,
  setActiveKey,
  listCategory,
}) {
  const { t: translation } = useTranslation()
  const [selectedImage, setSelectedImage] = useState({
    imageFile: null,
    imageUrl: null,
  })
  const [selectedPost, setSelectedPost] = useState(null)
  const [form] = Form.useForm()
  const [ckeditor, setCkeditor] = useState()
  const [contentPost, setcontentPost] = useState("")
  const [detailPost, setDetailPost] = useState({
    stationNewsTitle:""
  })
  const [ckeditorWordCount, setWordcount] = useState(0)
  const ASPECT_RATIO_X = 1976;
  const ASPECT_RATIO_Y = 1165;
  const setting = useSelector((state) => state.setting);
  const options = listCategory.map((item) => {
    return {
      value: item.stationNewsCategoryId,
      label: item.stationNewsCategoryTitle,
    }
  })
  // lấy ra 3 danh mục : ưu đãi, tuyển dụng, chuyên ra chia sẻ
  const newList = options?.slice(2,5)
  const selectValue = newList.filter(el => el.value === oldPost?.stationNewsCategoryId)

    if(oldPost !== null){
      form.setFieldsValue({
        stationNewsCategories: selectValue[0]?.value,
      })
    }

  useEffect(() => {
    if (oldPost && oldPostImage) {
      setSelectedPost(oldPost)
      form.setFieldsValue({
        ...oldPost,
        stationNewsCategories:
          listCategory.find(
            (item) =>
              item?.stationNewsCategoryId.toString() ===
              oldPost.stationNewsCategories
          )?.stationNewsCategoryTitle || '',
      })
      setSelectedImage(oldPostImage)
      setDetailPost({
        ...oldPost,
        stationNewsCategories:
          listCategory.find(
            (item) =>
              item?.stationNewsCategoryId.toString() ===
              oldPost.stationNewsCategories
          )?.stationNewsCategoryTitle || '',
      })
      form.setFieldsValue({
        ...oldPost,
        stationNewsExpirationDate: oldPost.stationNewsExpirationDate ?
        moment(oldPost?.stationNewsExpirationDate,"YYYYMMDD"):
          ''
      })
    } else {
      form.resetFields()
      setSelectedImage({
        imageFile: null,
        imageUrl: null,
      })
    }
  }, [oldPostImage, oldPost])

  const onSelectImage = async (e) => {
    if (!e) {
      setSelectedImage({
        imageFile: null,
        imageUrl: null,
      })
    } else {
      const { file } = e
      if (file) {
        const validImageTypes = 'image/'
        const fileType = file['type']
        if (!fileType.includes(validImageTypes)) {
          notification['error']({
            message: '',
            description: translation('new.wrongImageFile'),
          })
        } else {
          if (file.status !== 'uploading') {
            convertFileToBase64(file.originFileObj).then((dataUrl) => {
              const newData = dataUrl.replace(/,/gi, '').split('base64')
              if (newData[1]) {
                setSelectedImage({
                  imageFile: {
                    imageData: newData[1],
                    imageFormat: 'png',
                  },
                  imageUrl: dataUrl,
                })
                setDetailPost({
                  ...detailPost,
                  stationNewsAvatar:dataUrl
                })
              }
            })
          }
        }
      }
    }
  }

  const onPostNew = (value) => {
    let imageUrl = ''
    if (selectedImage.imageFile) {
      uploadService
        .uploadImage(selectedImage.imageFile)
        .then((result) => {
          if (result.issSuccess) {
            imageUrl = result.data
          } else {
            notification['error']({
              message: '',
              description:
                result.statusCode === 413
                  ? translation('new.imageTooLarge')
                  : translation('new.saveImageFailed'),
            })
          }
        })
        .then(() => {
          handlePostNew({
            ...value,
            stationNewsAvatar: imageUrl,
            stationNewsCategories: value.stationNewsCategories.toString(),
            stationNewsExpirationDate:Number(moment(value.stationNewsExpirationDate).format("YYYYMMDD"))
          })
        })
    } else {
      notification.error({
        message: '',
        description: translation('new.wrongImageFile'),
      })
    }
  }

  const handlePostNew = (data) => {
    NewService.postNew({ ...data }).then((result) => {
      if (result.isSuccess) {
        form.resetFields()
        setIsReload(true)
        setSelectedImage({
          imageFile: null,
          imageUrl: '',
        })
        ckeditor.setData('')
        setActiveKey("#1")
        notification['success']({
          message: '',
          description: translation('new.postSucess'),
        })
      } else {
        notification['error']({
          message: '',
          description: translation('new.postFailed'),
        })
      }
    })
  }

  const onUpdatePost = (newValue) => {
    let imageUrl = ''
    if (selectedImage.imageFile) {
      uploadService
        .uploadImage(selectedImage.imageFile)
        .then((result) => {
          if (result.issSuccess) {
            imageUrl = result.data
          } else {
            notification['error']({
              message: '',
              description:
                result.statusCode === 413
                  ? translation('new.imageTooLarge')
                  : translation('new.saveImageFailed'),
            })
          }
        })
        .then(() => {
          handleUpdatePost({
            id: selectedPost.stationNewsId,
            data: {
              stationNewsTitle: newValue.stationNewsTitle,
              stationNewsContent: newValue.stationNewsContent,
              stationNewsAvatar: imageUrl,
              isDeleted: newValue.isDeleted,
              isHidden: newValue.isHidden,
              stationNewsExpirationDate:Number(moment(newValue.stationNewsExpirationDate).format("YYYYMMDD"))
            },
          })
        })
    } else {
      handleUpdatePost({
        id: selectedPost.stationNewsId,
        data: {
          stationNewsTitle: newValue.stationNewsTitle,
          stationNewsContent: newValue.stationNewsContent,
          isDeleted: newValue.isDeleted,
          isHidden: newValue.isHidden,
          stationNewsExpirationDate:Number(moment(newValue.stationNewsExpirationDate).format("YYYYMMDD")),
          stationNewsCategories:
            newValue.stationNewsCategories.length > 3
              ? oldPost.stationNewsCategories
              : newValue.stationNewsCategories.toString(),
        },
      })
    }
  }

  const handleUpdatePost = (data) => {
    NewService.updateANew(data).then((result) => {
      if (result.isSuccess) {
        form.resetFields()
        setSelectedPost(null)
        setIsReload(true)
        setSelectedImage({
          imageFile: null,
          imageUrl: '',
        })
        setActiveKey("#1")
        ckeditor.setData('')
        notification['success']({
          message: '',
          description: translation('new.updateSuccess'),
        })
      } else {
        notification['error']({
          message: '',
          description: translation('new.updateFailed'),
        })
      }
    })
  }

  const disabledDate = (current) => {
    return current && current < dayjs().startOf('day');
  };

  return (
    <Fragment>
      {setting.enableNewsMenu === 0 ? <UnLock /> :
      <main className='row post_new'>
        <div className='section-title pb-3'>{translation("new.post")}</div>
        <Form onFinish={selectedPost ? onUpdatePost : onPostNew} form={form}>
          <Row>
            <div className='col-12 col-md-6 p-1'>
              <div>
                <div className='new_component__modal_title mb-1'>
                  <Space>
                    {translation('new.title')}
                    <Typography.Text type='danger'>*</Typography.Text>
                  </Space>
                </div>
                <Form.Item
                  rules={[
                    { required: true, message: translation('new.errorContent') },
                  ]}
                  name='stationNewsTitle'
                >
                  <Input
                    className='new_component__modal_content'
                    maxLength={200}
                    placeholder={translation('new.type')}
                    onChange={(e)=>{
                      setDetailPost({
                        ...detailPost,
                        stationNewsTitle: e.target.value
                      })
                    }}
                  />
                </Form.Item>
              </div>
  
              <div>
                <div className='new_component__modal_title mb-1'>
                  <Space>
                    {`${translation(
                      'new.content'
                    )} (${ckeditorWordCount.toLocaleString()} / ${CONTENT_MAXLENGTH.toLocaleString()})`}
                    <Typography.Text type='danger'>*</Typography.Text>
                  </Space>
                </div>
                <Form.Item
                  name='stationNewsContent'
                  rules={[
                    { required: true, message: translation('new.errorContent') },
                    {
                      validator: () =>
                        ckeditorWordCount > CONTENT_MAXLENGTH
                          ? Promise.reject(translation('new.invalidContentPost'))
                          : Promise.resolve(),
                    },
                  ]}
                >
                  <div className='new_component__modal_content'>
                    <TextEditor
                      // editor={Editor}
                      config={{
                        language: 'vi',
                        placeholder: translation('new.type'),
                        wordCount: {
                          displayCharacters: true,
                          onUpdate: (stats) => {
                            setWordcount(stats.characters)
                          },
                        },
                      }}
                      onChange={(__, editor) => {
                        form.setFieldsValue({
                          ...form.getFieldsValue(),
                          stationNewsContent: editor.getData(),
                        })
                        setDetailPost({
                          ...detailPost,
                          stationNewsContent: editor.getData()
                        })
                      }}
                      onReady={(editor) => {
                        const data = form.getFieldValue('stationNewsContent')
                        if (data) {
                          editor.setData(data)
                        }
                        setCkeditor(editor)
                      }}
                    />
                  </div>
                </Form.Item>
              </div>
  
              <div>
                <div className='new_component__modal_title mb-1'>
                  <Space>
                    {translation('listCustomers.category')}
                    <Typography.Text type='danger'>*</Typography.Text>
                  </Space>
                </div>
                <Form.Item
                  name='stationNewsCategories'
                  rules={[
                    { required: true, message: translation('new.errorContent') },
                  ]}
                >
                  <Select
                    className='new_component__modal_content'
                    placeholder={translation('new.selectCategory')}
                    options={newList}
                  />
                </Form.Item>
              </div>
              <div>
                <div className='new_component__modal_title mb-1'>
                  <Space>
                    {translation('accreditation.endDate')}
                    <Typography.Text type='danger'>*</Typography.Text>
                  </Space>
                </div>
                <Form.Item
                  name="stationNewsExpirationDate"
                  rules={[
                    {
                      required: true,
                      message: translation('isReq')
                    }
                  ]}
                >
                  <DatePicker
                    className="w-100"
                    format="DD/MM/YYYY"
                    style={{
                      minWidth: 160
                    }}
                    placeholder={translation('accreditation.endDate')}
                    disabledDate={disabledDate}
                  />
                </Form.Item>
              </div>
              <div className='new_component__modal_title'>
                <Space>
                  {translation('new.addImage')}
                  <div>({ASPECT_RATIO_X}px x {ASPECT_RATIO_Y}px)</div>
                  <Typography.Text type='danger'>*</Typography.Text>
                </Space>
              </div>
  
              <div className='form-item-upload'>
                <div className='col-12'>
                  <Upload.Dragger
                    id='image'
                    showUploadList={false}
                    accept='image/*'
                    onChange={onSelectImage}
                    listType='picture'
                    beforeUpload={(file) => file['type'].includes('image/')}
                  >
                    <p className='ant-upload-drag-icon'>
                      {selectedImage.imageUrl ? (
                        <RetweetOutlined />
                      ) : (
                        <PlusOutlined />
                      )}
                    </p>
                    <p className='ant-upload-text'>
                      {selectedImage.imageUrl
                        ? translation('new.changeImage')
                        : translation('new.selectImage')}
                    </p>
                  </Upload.Dragger>
                  <Image
                    src={selectedImage.imageUrl}
                    preview={false}
                    hidden={selectedImage.imageUrl ? false : true}
                    className='new_component__preview_image col-12 col-md-4 mt-2'
                  />
                </div>
              </div>
  
              <div>
                <div className='new_component__modal_title mb-1'>
                  <Space>
                    {translation('new.embeddedVideo')}
                    {/* <Typography.Text type='danger'>*</Typography.Text> */}
                  </Space>
                </div>
                <Form.Item
                  rules={[
                    { required: false, message: translation('new.errorContent') },
                  ]}
                  name='embeddedCode'
                >
                  <TextArea
                    placeholder={translation('new.typeEmbedded')}
                    autoSize={{
                      minRows: 5
                    }}
                    onChange={(e)=>{
                       setDetailPost({
                          ...detailPost,
                          embeddedCode:e.target.value
                        })
                    }}
                  />
                </Form.Item>
                <div>
                  <Form.Item shouldUpdate noStyle>
                    {(values) => {
                      const valueEmbedded = values.getFieldValue("embeddedCode")
                      return valueEmbedded && <div dangerouslySetInnerHTML={{ __html: valueEmbedded }} className='new_component__embedded' />;
                    }}
                  </Form.Item>
                </div>
              </div>
  
               <div className='mt-4 w-100 d-flex justify-content-end'>
                <Form.Item>
                  <Button
                    type='primary'
                    size='large'
                    htmlType='submit'
                  >
                    {selectedPost
                      ? translation('new.updatePost')
                      : translation('new.post')}
                  </Button>
                </Form.Item>
              </div>
            </div>
            <div className='col-12 col-md-6 p-1'>
              {/* <div className='mb-1 text-center'>
                <span onClick={()=>setIsShowPhone(true)} className={`border p-1 me-2 ${isShowPhone ? "bg-primary text-white": ""}` }>Phone</span>
                <span onClick={()=>setIsShowPhone(false)} className={`border p-1 ${!isShowPhone ? "bg-primary text-white": ""}`}>Desktop</span>
              </div>
              <div className="border p-1"
                style={{margin:"0 auto 25px auto", height: "calc(100% - 48px)", minHeight: "50px", overflow:"auto", maxWidth: isShowPhone ? "450px": "988px"}}
                dangerouslySetInnerHTML={{__html: `<div class="preview-post" style="max-width:${isShowPhone ? "450x": "988px"}; width:${isShowPhone ? "450x": "988px"}">${contentPost}</div>` }}
              /> */}
              <div className="border p-1"
                style={{margin:"25px auto", height: "calc(100% - 115px)", minHeight: "150px", overflow:"auto"}}>
                <FeedDetailView detailPost={detailPost}/>
              </div>
            </div>
          </Row>
        </Form>
      </main>
      }
    </Fragment>
  )
}

export default PostNew
