import React, { useEffect, useRef } from "react"
import { Modal, Form, Input, Button, DatePicker, Upload, Spin, InputNumber } from 'antd'
import { useTranslation } from "react-i18next"
import moment from "moment"
import uploadService from '../../services/uploadService';
import listDocumentaryService from "../../services/listDocumentaryService";
import { useState } from "react";
import { Row, Col } from "antd";
import { ZipIcon } from "../../assets/icons";
import TextEditor from "components/TextEditor";
import UploadItem from "Page/Management/UploadItem";
import { convertStingToDate } from "helper/date";

const testDataId = {
  title: "Tiêu đề 1",
  price: 100,
  note: "Ghi chú 1",
  image: "https://hpconnect.vn/wp-content/uploads/2020/02/H%C3%ACnh-%E1%BA%A3nh-phong-c%E1%BA%A3nh-thi%C3%AAn-nhi%C3%AAn-31.jpg",
  content: "<p>Nội dung 1</p>"
}

const ModalEditDocumentary = (props) => {
  const { isEditing, toggleEditModal, onUpdateCustomer, id, form } = props
  const [ckeditor, setCkeditor] = useState()
  const [isLoading, setIsLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [ckeditorWordCount, setWordcount] = useState(0)
  const inputRef = useRef()
  const { t: translation } = useTranslation()

  const handleUpdate = (values) => {
    // setIsLoading(true);
    // const newData = {
    //   documentTitle: values.documentTitle,
    //   documentContent: values.documentContent,
    //   documentCode: values.documentCode,
    // }

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

  const fetchDocumentById = (id) => {
    const listImage = [{
      uid: "001",
      name: "File",
      status: 'done',
      url: testDataId.image
    }]

    form.setFieldsValue({
      ...testDataId,
    })
    setFileList(listImage)

    // listDocumentaryService.getDetailDocument(id).then((result) => {
    //   if (result) {
    //     const listImage = result.documentFiles.map((item) => ({
    //       uid: item.stationDocumentFileId,
    //       name: "File",
    //       status: 'done',
    //       url: item.documentFileUrl
    //     }))

    //     form.setFieldsValue({
    //       ...result,
    //       documentExpireDay: convertStingToDate(result.documentExpireDay),
    //       documentPublishedDay: convertStingToDate(result.documentPublishedDay)
    //     })
    //     setFileList(listImage)
    //   }
    // });
  };

  useEffect(() => {
    if (id) {
      fetchDocumentById(id)
    }
    return () => form.resetFields()
  }, [id])

  return (
    <Modal
      visible={isEditing}
      title={translation('service.titleEdit')}
      onCancel={toggleEditModal}
      width={800}
      footer={
        <>
          <Button
            onClick={toggleEditModal}
          >
            {translation("category.no")}
          </Button>
          <Button
            type="primary"
            onClick={() => {
              form.submit()
            }}
          >
            {translation('listSchedules.save')}
          </Button>
        </>
      }
    >
      {isLoading ? (
        <Spin />
      )
        : (
          <Form
            form={form}
            onFinish={handleUpdate}
            layout="vertical"
          >
            <div className="row">
              <div className="col-12 col-md-12">
                <Form.Item
                  name="title"
                  label={translation("service.title")}
                  rules={[{ required: true, message: translation('isReq') }]}
                >
                  <Input placeholder={translation('service.title')} autoFocus />
                </Form.Item>
              </div>
              <div className="col-12 col-md-12">
                <Form.Item
                  name="price"
                  label={translation('service.price')}
                  rules={[{ required: true, message: translation('isReq') }]}
                >
                  <InputNumber placeholder={translation('service.price')} />
                </Form.Item>
              </div>
              <div className="col-12 col-md-12">
                <Form.Item
                  name="note"
                  label={translation('service.note')}
                  rules={[]}
                >
                  <Input.TextArea
                    placeholder={translation('service.note')}
                    autoSize={{
                      minRows: 3,
                    }}
                  />
                </Form.Item>
              </div>
              <div className="col-12 col-md-12">
                <Form.Item
                  name="content"
                  label={translation('file.documentContent')}
                  rules={[]}
                >
                  <div className="file-textEditor">
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
                          content: editor.getData(),
                        })
                      }}
                      onReady={(editor) => {
                        const data = form.getFieldValue('content')
                        if (data) {
                          editor.setData(data)
                        }
                        setCkeditor(editor)
                      }}
                    />
                  </div>
                </Form.Item>
              </div>
              <div className="col-12 col-md-12">
                <Form.Item
                  name="documentFileUrlList"
                  rules={[]}
                >
                  <Upload
                    accept="image/png, image/jpeg"
                    showUploadList={true}
                    disabled
                    customRequest={customRequest}
                    maxCount={1}
                    multiple={false}
                    onChange={(info) => setFileList(info.fileList)}
                    fileList={fileList}
                    listType="picture"
                  >
                    <div>
                      <UploadItem
                        fileName={"file.jpg"}
                        title={translation('file.enterFile')}
                        image={process.env.PUBLIC_URL + '/assets/images/upload-image.png'}
                      />
                    </div>
                  </Upload>
                </Form.Item>
              </div>
            </div>
          </Form>
        )}
    </Modal>
  )
}

export default ModalEditDocumentary