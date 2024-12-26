import React, { useEffect, useState } from "react"
import { Modal, Form, Input, Button, notification, DatePicker, Image, Upload, Drawer, Select, InputNumber } from 'antd'
import { useTranslation } from "react-i18next"
import ManagementService from "../../services/manageService"
import uploadService from '../../services/uploadService';
import { validatorPhoneAllowEmpty } from "helper/commonValidator"
import { getListPosition, getListInCharge } from "constants/management"
import { convertFileToBase64 } from "helper/common"
import UploadItem from "./UploadItem";
import { USER_ROLES } from "constants/permission";
import "./management.scss";
import { ROLE_NUMBER } from "constants/listDocumentary";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { PopupHeaderContainer } from "components/PopupHeader/PopupHeader";
import { validatorEmailAllowEmpty } from "helper/commonValidator";

const DEFAULT_FILTER = {
  "filter": {
    "appUserRoleName": undefined,
    "permissions": undefined
  },
  "skip": 0,
  "limit": 20,
}

const MIN_USERNAME = 6;
const getBase64 = (file) =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});
const ModalAddUser = ({ form, isAdd, onCancel, inputRef, onCreateNew, member }) => {
  const { t: translation } = useTranslation()
  const [appUserRoleId, setAppUserRoleId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
	const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState('');
  const [roleList, setRoleList] = useState({
    total: 0,
    data: []
  })
  const [date, Setdate] = useState('')
  const [code, setCode] = useState(false)
  const LIST_POSITION = getListPosition(translation);
  const LIST_IN_CHARGE = getListInCharge(translation);
  
  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj);
		}
		setPreviewImage(file.url || file.preview);
		setPreviewOpen(true);
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
  function convertDataCallApi(obj, selectedKeys, selectedKeysDate) {
    const arr = [...selectedKeys, ...selectedKeysDate];

    const result = {};
    const newObject = { ...obj };

    for (let i = 0; i < arr.length; i++) {
      const key = arr[i];
      if (obj.hasOwnProperty(key)) {
        if (selectedKeysDate.some(item => item === key) && obj[key] !== undefined) {
          result[key] = obj[key].format("DD/MM/YYYY")
        } else {
          result[key] = obj[key];
        }
        delete newObject[key];
      }
    }

    if(Object.keys(result).length === 0) {
      return {
        ...newObject
      }
    }
    
    return {
      ...newObject,
      appUserWorkInfo: {
        ...result
      }
    };
  }

  async function handleAdd(values) {
    setIsLoading(true);
    const newValues = { ...values };
    let listProfilePicture = newValues?.profilePicture?.fileList || [];
    let listSampleSignature = newValues?.sampleSignature?.fileList || [];

    delete values.profilePicture;
    delete values.sampleSignature;

    Object.keys(values).forEach(k => {
      if (!values[k]) {
        delete values[k]
      }
    })

    if(values.birthDay) {
      values.birthDay = values.birthDay.format("DD/MM/YYYY");
    }

    const convertData = convertDataCallApi(values,
      ["licenseNumber", "licenseCommitmentYear"],
      ["licenseDateEnd", "licenseDateFrom", "licenseDecisionDate"]
    )
    onCreateNew({
      ...convertData,
      stationsId: member.stationsId
    }, { listProfilePicture, listSampleSignature }, () => setIsLoading(false))
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

  useEffect(() => {
    function getListRole() {
      ManagementService.getListRole(DEFAULT_FILTER).then(result => {
        if (result) {
          setRoleList(result)
        } else {
          notification.error({
            message: '',
            description: translation('new.fetchDataFailed')
          })
        }
      })
    }
    getListRole()
  }, [])

  const onFilter = (value) =>{
    if(value === ROLE_NUMBER.REGISTRAR || value === ROLE_NUMBER.HIGH_REGISTRAR){
      setCode(true)
    } else {
      setCode(false)
    }
  }

  const onChange = (date, dateString) => {
    Setdate(dateString)
  };

  return (
    <Drawer
      visible={isAdd}
      className="drawerManagement"
      title={
        <PopupHeaderContainer
          screenHeaderTitle={translation('management.addUser')}
          onCloseButtonClick={onCancel}
        />
      }
      footer={
        <div className="d-flex w-100 justify-content-end">
          <Button onClick={onCancel} className="mx-1">
            {translation("category.no")}
          </Button>
          <Button
            className="mx-1"
            onClick={() => {
              form.submit()
            }}
            type="primary"
          >
            {translation('listSchedules.save')}
          </Button>
        </div>
      }
      onClose={onCancel}
      closable={false}
      width="100vw"
    >
      <Form
        form={form}
        onFinish={handleAdd}
        onValuesChange={(values) => {
          if (values.appUserRoleId) {
            setAppUserRoleId(values.appUserRoleId)
          }
        }}
        layout="vertical"
      >
        <div className="row">
          <div className="col-12 col-md-12 col-lg-4">
            <h3 className="management-title">{translation('management.personalInformation')}</h3>
            <div className="row">
              <div className="col-12 col-md-6">
                <Form.Item
                  name="username"
                  label={translation('landing.account')}
                  rules={[
                    {
                      required: true,
                      validator(_, value) {
                        if (!value) {
                          return Promise.reject(translation("isReq"));
                        }
                        if (value.length < MIN_USERNAME) {
                          return Promise.reject(translation("landing.invalidAccount"))
                        }
                        if (!/^[a-z0-9]+$/i.test(value)) {
                          return Promise.reject(translation("landing.invalidAccount"));
                        }
                        return Promise.resolve();
                      }
                    }
                  ]}
                >
                  <Input autoFocus ref={inputRef} placeholder={translation('management.placeholder.username')} />
                </Form.Item>
              </div>
              <div className="col-12 col-md-6">
                <Form.Item
                  name="password"
                  label={translation('landing.password')}
                  rules={[{ required: true, message: translation('isReq') }]}
                >
                  <Input type='password' placeholder={translation('management.placeholder.password')} />
                </Form.Item>
              </div>
              <div className="col-12 col-md-12">
                <Form.Item
                  name="firstName"
                  label={translation('management.fullName')}
                  rules={[{ required: true, message: translation('isReq') }]}
                >
                  <Input placeholder={translation('management.placeholder.firstName')} />
                </Form.Item>
              </div>
              <div className="col-12 col-md-12">
                <Form.Item
                  name="appUserIdentity"
                  label={translation("management.identityCardNumber")}
                  rules={[
                    { required: true, message: translation('isReq') },
                    {
                      pattern: /^\d{9,12}$/,
                      message: translation('management.invalidIdentityCardFormat')
                    }
                  ]}
                >
                  <Input placeholder={translation('management.placeholder.appUserIdentity')} />
                </Form.Item>
              </div>
              <div className="col-12 col-md-12">
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    // {
                    //   required: false,
                    //   validator(_, value) {
                    //     return validatorEmailAllowEmpty(value, translation)
                    //   }
                    // }
                  ]}
                >
                  <Input placeholder={translation('management.placeholder.email')} />
                </Form.Item>
              </div>
              <div className="col-12 col-md-12">
                <Form.Item
                  name="phoneNumber"
                  label={translation('landing.phoneNumber')}
                  rules={[
                    {
                      required: false,
                      validator(_, value) {
                        return validatorPhoneAllowEmpty(value, translation)
                      }
                    }
                  ]}
                >
                  <Input placeholder={translation('management.placeholder.phoneNumber')} />
                </Form.Item>
              </div>
              <div className="col-12 col-md-12">
                <Form.Item
                  name="birthDay"
                  label={translation('management.birthDay')}
                  rules={[
                    {
                      required: false,
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
                    placeholder={translation('management.placeholder.birthDay')}
                  />
                </Form.Item>
              </div>
              <div className="col-12 col-md-12">
                <Form.Item
                  name="userHomeAddress"
                  label={translation('management.home_town')}
                  rules={[
                    {
                      required: false,
                      message: translation('input_home_town')
                    }
                  ]}
                >
                  <Input placeholder={translation('management.placeholder.userHomeAddress')} />
                </Form.Item>
              </div>
              <div className="col-12 col-md-12">
                <Form.Item
                  name="appUserRoleId"
                  label={translation('management.role')}
                  rules={[{ required: true, message: translation('isReq') }]}
                >
                  <Select placeholder={translation('management.role')} onChange={onFilter}>
                    {
                      roleList && roleList.data && roleList.data.length > 0 && roleList.data.map(item => {
                        return (
                          <Select.Option value={item.appUserRoleId} key={item.appUserRoleId}>{item.appUserRoleName}</Select.Option>
                        )
                      })
                    }
                  </Select>
                </Form.Item>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-12 col-lg-4">
            <h3 className="management-title">{translation('management.jobInformation')}</h3>
            <div className="row">
              <div className="col-12 col-md-12">
                <Form.Item
                  name="licenseDecisionDate"
                  label={translation('management.decisionDay')}
                  rules={[]}
                >
                  <DatePicker
                    className="w-100"
                    format="DD/MM/YYYY"
                    style={{
                      minWidth: 160
                    }}
                    placeholder={translation('management.placeholder.licenseDecisionDate')}
                  />
                </Form.Item>
              </div>
              <div className="col-12 col-md-12">
                <Form.Item
                  name="licenseNumber"
                  label={translation('management.certificateNumber')}
                  rules={[]}
                >
                  <Input placeholder={translation('management.placeholder.licenseNumber')} disabled={appUserRoleId === USER_ROLES.PROFESSIONAL_STAFF} />
                </Form.Item>
              </div>
              <div className="col-12 col-md-12">
                <Form.Item
                  name="licenseDateFrom"
                  label={translation('management.certificateFromDate')}
                  rules={[]}
                >
                  <DatePicker
                    className="w-100"
                    format="DD/MM/YYYY"
                    disabled={appUserRoleId === USER_ROLES.PROFESSIONAL_STAFF}
                    style={{
                      minWidth: 160
                    }}
                    placeholder={translation('management.placeholder.licenseDateFrom')}
                  />
                </Form.Item>
              </div>
              <div className="col-12 col-md-12">
                <Form.Item
                  name="licenseDateEnd"
                  label={translation('management.certificateToDate')}
                  rules={[]}
                >
                  <DatePicker
                    className="w-100"
                    format="DD/MM/YYYY"
                    disabled={appUserRoleId === USER_ROLES.PROFESSIONAL_STAFF}
                    style={{
                      minWidth: 160
                    }}
                    placeholder={translation('management.placeholder.licenseDateEnd')}
                  />
                </Form.Item>
              </div>
              {code &&
                <div className="col-12 col-md-12">
                  <Form.Item
                    name="employeeCode"
                    label={translation("management.registrarCode")}
                    rules={[
                      { required: true, message: translation('isReq') },
                      {
                        pattern: /^\d{5}$/,
                        message: translation('management.invalidRegistrarCodeFormat')
                      },
                    ]}
                  >
                    <Input placeholder={translation('management.placeholder.employeeCode')} />
                  </Form.Item>
                </div>
              }
            </div>
          </div>

          <div className="col-12 col-md-12 col-lg-4">
            <h3 className="management-title">{translation('management.image')}</h3>
            <div className="col-12 col-md-12">
              <div className="row">
                {appUserRoleId === USER_ROLES.ADMIN && (
                  <div className="col-12">
                    <Form.Item
                      name="sampleSignature"
                      rules={[]}
                    >
                      <Upload
                        accept="image/png, image/jpeg"
                        showUploadList={true}
                        customRequest={customRequest}
                        listType="picture"
                        multiple={false}
                        maxCount={1}
                      >
                        <div>
                          <UploadItem
                            fileName={"Chuky.jpg"}
                            title={translation('management.sampleSignature')}
                            image={process.env.PUBLIC_URL + '/assets/images/upload-image.png'}
                          />
                        </div>
                      </Upload>
                    </Form.Item>
                  </div>
                )}
                <div className="col-12">
                  <Form.Item
                    name="profilePicture"
                    rules={[]}
                  >
                    <Upload
                      accept="image/png, image/jpeg"
                      showUploadList={true}
                      customRequest={customRequest}
                      multiple={true}
                      onPreview={handlePreview}
                      listType="picture-card"
                      defaultFileList={fileList}
                    >
                      {fileList.length >= 4 ? null : uploadButton}
                    </Upload>
                  </Form.Item>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal visible={previewOpen} className="modalClose" bodyStyle={{ padding : 30 }} footer={null} onCancel={handleCancel}>
          <img
            alt="example"
            style={{
              width: '100%',
            }}
            src={previewImage}
          />
        </Modal>
      </Form>
    </Drawer>
  )
}

export default ModalAddUser