import React, { useEffect, useRef } from "react";
import { Modal, Form, Input, Button, DatePicker, Spin, Upload, InputNumber } from 'antd';
import { useTranslation } from "react-i18next";
import moment from "moment";
import uploadService from '../../services/uploadService';
import listDocumentaryService from "../../services/listDocumentaryService";
import { useState } from "react";
import { Row, Col } from "antd";
import { ZipIcon } from "../../assets/icons";
import TextEditor from "components/TextEditor";
import UploadItem from "Page/Management/UploadItem";

const ModalAddDocumentary = (props) => {
  const { isAdd, toggleAddModal, onCrateNew, form, inputRef } = props;
  const [ckeditor, setCkeditor] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [ckeditorWordCount, setWordcount] = useState(0);
  const { t: translation } = useTranslation();

  const customRequest = async ({ file, onSuccess, onError, onProgress }) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async function () {
      let baseString = reader.result;
      const params = {
        imageData: baseString.replace('data:' + file.type + ';base64,', ''),
        imageFormat: file.type.replace('image/', '')
      };
      const res = await uploadService.uploadImage(params);

      if (res.issSuccess) {
        onSuccess(res.data); // Gọi hàm onSuccess với đường dẫn URL của hình ảnh từ phản hồi của server
      } else {
        onError({
          message: "Status : " + res.statusCode
        }); // Thông điệp lỗi cụ thể
      }
    };
  };

  async function handleCreateNew(values) {
    // setIsLoading(true);
    // Object.keys(values).forEach(k => {
    //   if (!values[k]) {
    //     delete values[k];
    //   }
    // });

    // const newData = {
    //   ...values,
    //   documentFileUrlList: values.documentFileUrlList.fileList?.map(item => item.response) || []
    // };

    // onCrateNew(newData, () => {
    //   setIsLoading(false);
    // });
  }

  useEffect(() => {
    form.resetFields();
  }, []);

  return (
    <Modal
      visible={isAdd}
      title={translation('service.titleAdd')}
      onCancel={toggleAddModal}
      width={800}
      footer={
        <>
          <Button
            onClick={toggleAddModal}
          >
            {translation("category.no")}
          </Button>
          <Button
            type="primary"
            onClick={() => {
              form.submit();
            }}
          >
            {translation('listSchedules.save')}
          </Button>
        </>
      }
    >
      <Form
        form={form}
        onFinish={handleCreateNew}
        layout="vertical"
        onValuesChange={(values) => {
          if (values.customerRecordPlatenumber) {
            form.setFieldsValue({
              customerRecordPlatenumber: values.customerRecordPlatenumber.toUpperCase()
            });
          }
        }}
      >
        {isLoading ? (
          <Spin />
        ) : (
          <div className="row">
            <div className="col-12 col-md-12">
              <Form.Item
                name="documentTitle"
                label={translation("service.title")}
                rules={[{ required: true, message: translation('isReq') }]}
              >
                <Input placeholder={translation('service.title')} autoFocus />
              </Form.Item>
            </div>
            <div className="col-12 col-md-12">
              <Form.Item
                name="servicePrice"
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
                  accept="image/png, image/jpeg"
                  showUploadList={true}
                  customRequest={customRequest}
                  maxCount={1}
                  multiple={false}
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
        )}
      </Form>
    </Modal >
  )
}

export default ModalAddDocumentary;

