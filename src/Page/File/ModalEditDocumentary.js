import React, { useEffect, useRef } from "react"
import { Modal, Form, Input, Button, DatePicker, Upload, Spin, InputNumber,Select } from 'antd'
import { useTranslation } from "react-i18next"
import moment from "moment"
import uploadService from '../../services/uploadService';
import listDocumentaryService from "../../services/listDocumentaryService";
import { useState } from "react";
import { Row, Col } from "antd";
import { ZipIcon } from "../../assets/icons";
import TextEditor from "components/TextEditor";
import UploadItem from "Page/Management/UploadItem";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import { convertStingToDate } from "helper/date";
import { DOCUMENT_CATEGORY } from 'constants/listDocumentary'

const ModalEditDocumentary = (props) => {
  const { isEditing, toggleEditModal, onUpdateCustomer, id, form } = props
  const [ckeditor, setCkeditor] = useState()
  const [isLoading, setIsLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [ckeditorWordCount, setWordcount] = useState(0)
	const [previewTitle, setPreviewTitle] = useState('');
  const [previewImage, setPreviewImage] = useState('');
	const [previewOpen, setPreviewOpen] = useState(false);
  const inputRef = useRef()
  const { t: translation } = useTranslation()
  const getBase64 = (file) =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});
  const handleUpdate = (values) => {
    setIsLoading(true);
    let documentFileUrlList = fileList?.map((item) => {
      return {
        documentFileName : item.name || translation('listDocumentary.DocumentaryName'),
        documentFileSize : item.size || 5000,
        documentFileUrl :  item.response
      }
    })
    const newData = {
      documentTitle: values.documentTitle,
      documentContent: values.documentContent,
      documentCode: values.documentCode,
      documentFileUrlList:documentFileUrlList,
      documentCategory:values.documentCategory,
    }

    onUpdateCustomer({
      id,
      data: newData
    }, () => {
      setIsLoading(false);
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
  const customRequest = async ({ file, onSuccess, onError, onProgress }) => {
		const reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onload = async function () {
			let baseString = reader.result
			const params = {
				imageData: baseString.replace('data:' + file.type + ';base64,', ''),
				imageFormat: file.name.split('.').pop().toLowerCase()
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
    listDocumentaryService.getDetailDocument(id).then((result) => {
      if (result) {
        const listImage = result.documentFiles.map((item) => ({
          uid: item.stationDocumentFileId,
          name: item.documentFileName,
          status: 'done',
          size:item.documentFileSize,
          url: item.documentFileUrl
        }))

        form.setFieldsValue({
          ...result,
          documentExpireDay: convertStingToDate(result.documentExpireDay),
          documentPublishedDay: convertStingToDate(result.documentPublishedDay)
        })
        setFileList(listImage)
      }
    });
  };
  const handlePreview = async (file) => {

		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj);
		}
		setPreviewImage(file.url || file.preview);
		setPreviewOpen(true);
		setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
	};
  const handleCancel = () => setPreviewOpen(false);

  useEffect(() => {
    if (id) {
      fetchDocumentById(id)
    }
    return () => form.resetFields()
  }, [id])

  return (
    <Modal
      visible={isEditing}
      title={translation('file.titleEdit')}
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
                  name="documentCode"
                  label={translation('file.documentCode')}
                  rules={[{ required: true, message: translation('isReq') }]}
                >
                  <Input placeholder={translation('file.documentCode')} autoFocus autoComplete="off" />
                </Form.Item>
              </div>
              <div className="col-12 col-md-12">
                <Form.Item
                  name="documentTitle"
                  label={translation('file.documentTitle')}
                  rules={[{ required: true, message: translation('isReq') }]}
                >
                  <Input placeholder={translation('file.documentTitle')} />
                </Form.Item>
              </div>
              <div className="col-12 col-md-12">
                <Form.Item
                  name="documentCategory"
                  isDisabled={true}
                  label={translation('file.documentType')}
                  rules={[{ required: true, message: translation('isReq') }]}
                >
                  <Select defaultValue={0} className="w-100">
                    <Select.Option value={0}>{translation('allDocs')}</Select.Option>
                    {DOCUMENT_CATEGORY.length > 0 && DOCUMENT_CATEGORY.map(item=>(
                      <Select.Option key={item.value} value={item.value}>{item.name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="col-12 col-md-12">
                <Form.Item
                  name="documentPublishedDay"
                  label={translation('file.documentPublishedDay')}
                  rules={[{ required: true, message: translation('isReq') }]}
                >
                  <DatePicker
                    className="w-100"
                    format="DD/MM/YYYY"
                    disabled
                    style={{
                      minWidth: 160
                    }}
                    placeholder={translation('file.documentPublishedDay')}
                  />
                </Form.Item>
              </div>
              <div className="col-12 col-md-12">
                <Form.Item
                  name="documentExpireDay"
                  label={translation('file.documentExpireDay')}
                  rules={[{ required: true, message: translation('isReq') }]}
                >
                  <DatePicker
                    className="w-100"
                    format="DD/MM/YYYY"
                    disabled
                    style={{
                      minWidth: 160
                    }}
                    placeholder={translation('file.documentExpireDay')}
                  />
                </Form.Item>
              </div>
              <div className="col-12 col-md-12">
                <Form.Item
                  name="documentContent"
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
                          documentContent: editor.getData(),
                        })
                      }}
                      onReady={(editor) => {
                        const data = form.getFieldValue('documentContent')
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
                    accept="*"
                    showUploadList={true}
                    customRequest={customRequest}
                    onPreview={handlePreview}
                    multiple={true}
                    onChange={(info) => {
                      return (
                      setFileList(info.fileList)
                      )}
                    }
                    fileList={fileList}
                    listType="picture-card"
                  >
                    {fileList.length >= 8 ? null : uploadButton}
                  </Upload>
                </Form.Item>
              </div>
            </div>
          </Form>
        )}
        <Modal visible={previewOpen} className="modalClose" title={previewTitle} bodyStyle={{ padding : 30 }} footer={null} onCancel={handleCancel}>
        <img
          alt="example"
          style={{
            width: '100%',
          }}
          src={previewImage}
        />
      </Modal>
    </Modal>
  )
}

export default ModalEditDocumentary;