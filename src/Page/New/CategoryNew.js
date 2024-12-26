import React, { useState, useEffect } from "react";
import {
  Form,
  Upload,
  Image,
  notification,
  Input,
  Button,
  Space,
  Typography,
  Table,
  Modal
} from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { convertFileToBase64 } from "../../helper/common";
import uploadService from "../../services/uploadService";
import NewService from "../../services/newService";
import _ from "lodash";
import "./newStyle.scss";
import TextArea from "antd/lib/input/TextArea";

const CONTENT_MAXLENGTH = 1500;

function CategoryNew() {
  const { t: translation } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [totalCategories, setTotalCategories] = useState(0);
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [skip, setSkip] = useState(0)
  // dùng để xử  lý UX phần cập nhật
  const [fileList, setFileList] = useState([])

  const columns = [
    {
      title: 'STT',
      dataIndex: 'stationNewsCategoryDisplayIndex',
      key: 'stationNewsCategoryDisplayIndex',
      width: 50
    },
    {
      title: translation("category.list"),
      dataIndex: 'customerRecordPlatenumber',
      key: 'customerRecordPlatenumber',
      render: (_, record) => {
        return (
          <div className="d-flex gap-4">
            <Image alt="img" width={22} height={22} src={record.stationNewsCategoryAvatar} />
            <span>
              {record.stationNewsCategoryTitle}
            </span>
          </div>
        )
      }
    },
    {
      title: translation("new.content"),
      dataIndex: 'stationNewsCategoryContent',
      key: 'stationNewsCategoryContent'
    },
    {
      title: translation("receipt.action"),
      dataIndex: 'stationNewsCategoryId',
      key: 'stationNewsCategoryId',
      width: 200,
      render: (stationNewsCategoryId, rowData) => {
        return (
          <div className="d-flex">
            <Button
              type="link"
              onClick={() => onInitEditCategory(rowData)}
            >{translation("short-edit")}</Button>
            <Button
              type="link"
              onClick={() => onDeleteCategory(stationNewsCategoryId)}
            >{translation("category.delete")}</Button>
          </div>
        )
      }
    }
  ]

  async function getListCategory(skip) {
    const categoriesRes = await NewService.getListCategory(skip);
    setCategories(categoriesRes.data);
    setTotalCategories(categoriesRes.total);
  }

  useEffect(() => {
    getListCategory(skip)
  }, [skip]);

  const onFormReset = () => {
    form.resetFields();
    setSelectedCategory(null);
  };

  const uploadImage = async (file) => {
    if (file) {
      return convertFileToBase64(file.originFileObj).then(async (dataUrl) => {
        const newData = dataUrl.replace(/,/gi, "").split("base64");
        if (newData[1]) {
          return uploadService
            .uploadImage({
              imageData: newData[1],
              imageFormat: file.type.replace("image/", ""),
            })
            .then((result) => {
              if (result.issSuccess) {
                return result.data;
              } else {
                notification["error"]({
                  message: "",
                  description:
                    result.statusCode === 413
                      ? translation("new.imageTooLarge")
                      : translation("new.saveImageFailed"),
                });
                return undefined;
              }
            });
        }
      });
    }
    return undefined;
  };

  const handleCategoryNew = async (data) => {
    NewService.addCategory(data).then(async (result) => {
      if (result.isSuccess) {
        onFormReset();
        setIsOpenModal(false);
        const categoriesRes = await NewService.getListCategory();

        setCategories(categoriesRes.data);
        setTotalCategories(categoriesRes.total);

        notification["success"]({
          message: "",
          description: translation("category.addCategorySuccess"),
        });
      } else {
        notification["error"]({
          message: "",
          description: translation("category.addCategoryFailed"),
        });
      }
    });
  };

  const onCategoryNew = (value) => {
    if (value) {
      uploadImage(value.file.file)
        .then((result) => {
          if (result) {
            delete value.file;
            handleCategoryNew({
              ...value,
              stationNewsCategoryAvatar: result
            });
          }
        })
    }
  };

  const onUpdateCategory = async (newValue) => {
    if (newValue.file) {
      if (typeof newValue.file === "string") {
        // no update image file
        delete newValue.file
      } else if (typeof newValue.file === "object") {
        // update image 
        await uploadImage(newValue.file.file)
          .then((result) => {
            if (result) {
              delete newValue.file;
              newValue.stationNewsCategoryAvatar = result
            }
          })
      }
    }

    handleUpdateCategory({
      id: selectedCategory.stationNewsCategoryId,
      data: newValue
    })
  }

  const handleUpdateCategory = (data) => {
    NewService.updateCategory(data).then((result) => {
      if (result.isSuccess) {
        onFormReset()
        notification["success"]({
          message: "",
          description: translation("category.updateSuccess"),
        });
        setIsOpenModal(false)
        getListCategory(skip)
      } else {
        notification["error"]({
          message: "",
          description: translation("category.updateFailed"),
        });
      }
    });
  };

  const onDeleteCategory = async (id) => {
    const result = await NewService.deleteCategory({ id });

    if (result && result.isSuccess) {
      setCategories(
        categories.filter((item) => item.stationNewsCategoryId !== id)
      );
      notification.success({
        message: "",
        description: translation("category.updateSuccess"),
      });
    } else {
      notification.error({
        message: "",
        description: translation("category.updateFailed"),
      });
    }
  };

  const onInitEditCategory = async (data) => {
    setIsOpenModal(true)
    const imageUrl = data.stationNewsCategoryAvatar
    form.setFieldsValue({
      ...data,
      file: imageUrl
    });
    setSelectedCategory(data);
    if (imageUrl) {
      setFileList([{
        uid: 'uid',
        name: imageUrl.split("/media/")[1],
        status: 'done',
        url: imageUrl,
        thumbUrl: imageUrl,
      }])
    }
  };

  const handleChangePage = async (pageNum) => {
    setCurrentPage(pageNum);
    const newSkip = Math.abs((pageNum - 1) * 20);
    setSkip(newSkip)
    const categoriesRes = await NewService.getListCategory(newSkip);

    setCategories(categoriesRes.data);
  };

  return (
    <>
      <main>
        <div className="category_header">
          <div
            className="section-title pb-3"
          >{translation("category.list")}</div>
          <div>
            <Button
              type="primary"
              className="d-flex align-items-center gap-1"
              icon={<PlusOutlined />}
              onClick={() => setIsOpenModal(true)}
            >{translation("category.addCategory")}</Button>
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={categories}
          pagination={{
            position: ['bottomRight'],
            pageSize: 20,
            simple:true,
            total: totalCategories,
            onChange: handleChangePage,
            current: currentPage
          }}
          scroll={{
            x: 1200
          }}
        />
      </main>
      <ModalCategory
        isModalOpen={isOpenModal}
        handleCancel={() => {
          if (selectedCategory) {
            onFormReset()
            fileList.length > 0 && setFileList([])
          }
          setIsOpenModal(false)
        }}
        form={form}
        handleOk={(values) => {
          if (selectedCategory) {
            onUpdateCategory(values)
          } else {
            onCategoryNew(values)
          }
        }}
        selectedCategory={selectedCategory}
        fileList={fileList}
        setFileList={setFileList}
      />
    </>
  );
}

const ModalCategory = ({
  isModalOpen, handleOk, handleCancel,
  selectedCategory, form, fileList, setFileList
}) => {
  const { t: translation } = useTranslation()
  const onSubmit = () => {
    form.submit()
    const formValue = form.getFieldsValue()
    const isInvalid = Object.values(formValue).some(val => val === undefined)
    if (!isInvalid) {
      handleOk(formValue)
    }
  }

  const uploadImage = (options) => {
    const { onSuccess, onError, file } = options;
    if (file.size >= 1e+7) {
      notification["error"]({
        message: "",
        description: translation("new.imageTooLarge"),
      });
      onError();
      return
    }
    onSuccess("Ok");
  };

  const uploadProps = selectedCategory ?
    {
      fileList,
      onChange: ({ fileList }) => setFileList(fileList)
    } :
    {}

  return (
    <Modal
      title={
        selectedCategory
          ? translation("category.updateCategory")
          : translation("category.addCategory")
      }
      visible={isModalOpen}
      onOk={onSubmit}
      onCancel={handleCancel}
      footer={
        <>
          <Button onClick={handleCancel} type="link">{translation("category.no")}</Button>
          <Button onClick={onSubmit} type="primary">{translation("inspectionProcess.save")}</Button>
        </>
      }
    >
      <>
        <Form
          layout="vertical"
          form={form}
        >
          <div className='new_component__modal_title mb-1'>
            <Space>
              {translation("new.title")}
              <Typography.Text type='danger'>*</Typography.Text>
            </Space>
          </div>
          <Form.Item
            name="stationNewsCategoryTitle"
            rules={[
              {
                required: true, message: translation("accreditation.isRequire")
              }
            ]}
          >
            <Input
              placeholder={translation("receipt.type-content")}
            />
          </Form.Item>

          <div className='new_component__modal_title mb-1'>
            <Space>
              {translation("new.content")}
              <Typography.Text type='danger'>*</Typography.Text>
            </Space>
          </div>
          <Form.Item
            name="stationNewsCategoryContent"
            rules={[
              {
                required: true, message: translation("accreditation.isRequire")
              }
            ]}
          >
            <TextArea maxLength={CONTENT_MAXLENGTH} rows={10} placeholder={translation("receipt.type-content")} />
          </Form.Item>

          <div className='new_component__modal_title mb-1'>
            <Space>
              {translation("new.addImage")}
              <Typography.Text type='danger'>*</Typography.Text>
            </Space>
          </div>
          <Form.Item
            name="file"
            rules={[
              {
                required: true, message: translation("accreditation.isRequire")
              }
            ]}
          >
            <Upload
              listType="picture"
              accept="image/*"
              customRequest={uploadImage}
              maxCount={1}
              {...uploadProps}
            >
              <Button icon={<UploadOutlined />}>{translation("listCustomers.selectFile")}</Button>
            </Upload>
          </Form.Item>
        </Form>
      </>
    </Modal>
  )
}

export default CategoryNew;
