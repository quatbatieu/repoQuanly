import React from 'react'
import { Button, DatePicker, Drawer, Form, Input, Select, Upload , InputNumber , notification, Modal } from 'antd'
import { DOCUMENT_TYPE, getListInCharge, getListPosition } from "constants/management"
import { USER_ROLES } from "constants/permission"
import { validatorPhoneAllowEmpty } from "helper/commonValidator"
import { convertStingToDate } from "helper/date"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import AppUserDocumentService from "services/appUserDocumentService"
import uploadService from "services/uploadService"
import ManagementService from "../../services/manageService"
import UploadItem from "./UploadItem"
import "./management.scss"
import AppUserWorkInfoServer from 'services/appUserWorkInfoServer'
import { ROLE_NUMBER } from "constants/listDocumentary";
import moment from 'moment'
import { CloseOutlined, PlusOutlined } from '@ant-design/icons'
import { PopupHeaderContainer } from 'components/PopupHeader/PopupHeader'
import { validatorEmailAllowEmpty } from 'helper/commonValidator'

const DEFAULT_FILTER = {
  "filter": {
    "appUserRoleName": undefined,
    "permissions": undefined
  },
  "skip": 0,
  "limit": 20,
}
const getBase64 = (file) =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});
const ModalEditUserInfo = ({ isEditing, toggleEditModal, onUpdateUser, selectedUserId, preventEdit, titlePopup ,inputRef, member }) => {
  const [fieldChange, setFieldChange] = useState({});
  const [appUserRoleId, setAppUserRoleId] = useState(null);
  const [appUserRoleIdFirstTime , setAppUserRoleIdFirstTime] = useState(null);
  const [detailHistory , setDetailHistory] = useState({});
  const [listProfilePicture, setListProfilePicture] = useState([]);
  const [isOpenModalChangePassword, setIsOpenModalChangePassword] = useState(false)
  const [listSampleSignature, setListSampleSignature] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { t: translation } = useTranslation()
  const [form] = Form.useForm()
  const [profilePicture, setProfilePicture] = useState({});
  const [sampleSignature, setSampleSignature] = useState({})
  const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState('');
  const [roleList, setRoleList] = useState({
    total: 0,
    data: []
  })
  const [employeeCodeVisible, setemployeeCodeVisible] = useState(false)
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
  const uploadButton2 = (
		<div>
			<PlusOutlined />
			<div
				style={{
					marginTop: 8,
				}}
			>
				{translation('management.sampleSignature')}
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
        if (selectedKeysDate.some(item => item === key) && obj[key]) {
          result[key] = obj[key].format("DD/MM/YYYY")
        } else {
          result[key] = obj[key];
        }
        delete newObject[key];
      }
    }

    return {
      ...newObject,
      ...result,
      licenseCommitmentYear: result.licenseCommitmentYear?.toString() || 0
    };
  }
  

  const handleUpdateJob = async (values) => {
    const convertData = convertDataCallApi(values,
      ["licenseNumber", "licenseCommitmentYear"],
      ["licenseDateEnd", "licenseDateFrom", "licenseDecisionDate"]
    )

    Object.keys(convertData).forEach(k => {
      if (!convertData[k] && convertData[k] !== 0) {
        convertData[k] = ""
      }
    })

    return await AppUserWorkInfoServer.updateById({
      id: selectedUser.appUserId,
      data: {...convertData}
    }).then(result => {
      if (result.isSuccess) {
        return true
      } else {
        notification.error({
          message: '',
          description: translation('accreditation.updateError')
        })
        return false
      }
    })
  }

  async function handleUpdate(values) {
    setIsLoading(true);
    const newValues = { ...values };
    let listProfilePicture = newValues?.profilePicture?.fileList || [];
    let listSampleSignature = newValues?.sampleSignature?.fileList || [];

    if (values.appUserRoleId && typeof values.appUserRoleId === 'string') {
      const findItem = roleList.data.find(item => item.appUserRoleName === values.appUserRoleId)
      values.appUserRoleId = findItem.appUserRoleId
    }

    const allowedRoles = [USER_ROLES.ADMIN, USER_ROLES.VEHICLE_INSPECTOR, USER_ROLES.SENIOR_VEHICLE_INSPECTOR];
    const shouldClearFields = !allowedRoles.includes(values.appUserRoleId);

    const isSuccess = await handleUpdateJob({
      licenseNumber: values.licenseNumber,
      licenseCommitmentYear: values.licenseCommitmentYear,
      licenseDateEnd: values.licenseDateEnd,
      licenseDateFrom: values.licenseDateFrom,
      licenseDecisionDate: values.licenseDecisionDate
    })

    if(values.birthDay) {
      values.birthDay = values.birthDay.format("DD/MM/YYYY");
    }

    if(isSuccess) {
      onUpdateUser({
        id: selectedUser.appUserId,
        data: {
          firstName: values.firstName,
          email: values.email,
          phoneNumber: values.phoneNumber,
          appUserRoleId: values.appUserRoleId,
          employeeCode : values.employeeCode,
          userHomeAddress : values.userHomeAddress,
          birthDay : values.birthDay,
          appUserIdentity : values.appUserIdentity,
          appUserPosition : shouldClearFields ? "": detailHistory.appUserPosition
        }
      }, () => setIsLoading(false))
    }
  }

  const customRequest = async ({ file, onSuccess, onError, onProgress }, documentType) => {
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
        onProgress({ percent: 50 }); // Gọi hàm onSuccess với đường dẫn URL của hình ảnh từ phản hồi của server
      } else {
        onProgress({ percent: 100 });
        onError({
          message: "Status : " + res.statusCode
        }); // Thông điệp lỗi cụ thể
      }

      const resDocument = await AppUserDocumentService.addDocument({
        appUserId: selectedUserId,
        documentName: file.name,
        documentType: documentType,
        documentURL: res.data
      })

      if (resDocument.issSuccess) {
        onProgress({ percent: 100 });
        onSuccess(res.data)
      } else {
        onProgress({ percent: 100 });
        onError({
          message: "Status : " + res.statusCode
        }); // Thông điệp lỗi cụ thể
      }
    }
  };

  const fetchData = (selectedUserId) => {
    ManagementService.stationUserDetail({ id: selectedUserId }).then(res => {
      if (!res.isSuccess) {
        res = {
          ...res , 
          ...res.appUserWorkInfo
        }
        let oldId = roleList.data.find(item => item.appUserRoleId === res.appUserRoleId)
        if (!oldId) {
          oldId = undefined
        } else {
          oldId = oldId['appUserRoleName']
        }

        if(res.birthDay) {
          res.birthDay = moment(res.birthDay , "DD/MM/YYYY");
        }

        const licenseDateEnd = res?.licenseDateEnd;
        const licenseDateFrom = res?.licenseDateFrom;
        const licenseDecisionDate = res?.licenseDecisionDate;
        const listDocument = res.documents?.map((item) => ({
          uid: item.appUserDocumentId,
          name: item.documentName,
          status: 'done',
          documentType: item.documentType,
          url: item.documentURL
        })) || []

        setAppUserRoleId(res.appUserRoleId);
        setAppUserRoleIdFirstTime(res.appUserRoleId);
        setListProfilePicture(
          listDocument.filter((item) => item.documentType === DOCUMENT_TYPE.PROFILE)
        )
        setListSampleSignature(listDocument.filter((item) => item.documentType === DOCUMENT_TYPE.SIGNATURE))

        const values = {
          ...res,
          licenseDateEnd: convertStingToDate(licenseDateEnd),
          licenseDateFrom: convertStingToDate(licenseDateFrom),
          licenseDecisionDate: convertStingToDate(licenseDecisionDate),
          appUserRoleId: oldId
        };
        form.setFieldsValue(values)
        setDetailHistory({
          ...values , 
          appUserRoleId : res.appUserRoleId
        })
        setSelectedUser(res);
        if(res.appUserRoleId === ROLE_NUMBER.REGISTRAR || res.appUserRoleId === ROLE_NUMBER.HIGH_REGISTRAR){
          setemployeeCodeVisible(true)
        }
      } else {
        notification.error({
          message: '',
          description: translation('accreditation.updateError')
        })
      }
    })
  }

  const handleRemove = async (id) => {
    const resDocument = await AppUserDocumentService.deleteDocument({
      appUserId: selectedUserId,
      appUserDocumentId: id
    })

    if (resDocument.issSuccess) {
      fetchData(selectedUserId);
    } else {
      notification.error({
        message: '',
        description: translation('management.errorDeteleDocument')
      })
    }
  }

  useEffect(() => {
    if (selectedUserId) {
      fetchData(selectedUserId)
    }
    return () => form.resetFields()
  }, [selectedUserId])

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
    if(value === 2 || value === 3){
      setemployeeCodeVisible(true)
    } else {
      setemployeeCodeVisible(false)
    }
  }

  return (
    <Drawer
      visible={isEditing}
      className="drawerManagement"
      title={
        <PopupHeaderContainer
          screenHeaderTitle={titlePopup || translation('listCustomers.modalEditTitle')}
          onCloseButtonClick={toggleEditModal}
        />
      }
      onClose={toggleEditModal}
      width="100vw"
      closable={false}
      footer={
        <div className="d-flex w-100 justify-content-end">
          <Button onClick={toggleEditModal} className="mx-1">
            {translation("category.no")}
          </Button>
          {
            !preventEdit &&
            <Button
              className="mx-1"
              onClick={() => {
                form.submit()
              }}
              type="primary"
            >
              {translation('listSchedules.save')}
            </Button>
          }
        </div>
      }
    >
      <Form
        form={form}
        onFinish={handleUpdate}
        onValuesChange={(values) => {
          if (values.appUserRoleId) {
            setAppUserRoleId(values.appUserRoleId);
          }
          setFieldChange(prev => ({ ...prev, ...values }))
        }}
        layout="vertical"
      >
        <div className="row">
          <div className="col-12 col-md-12 col-lg-4">
            <h3 className="management-title">{translation('management.personalInformation')}</h3>
            <div className="row">
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
                    // },
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
                  <Select 
                   placeholder={translation('management.placeholder.appUserRoleId')} 
                   onChange={onFilter}
                  >
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
                    clearIcon={false}
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
                    clearIcon={false}
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
                    clearIcon={false}
                    style={{
                      minWidth: 160
                    }}
                    placeholder={translation('management.placeholder.licenseDateEnd')}
                  />
                </Form.Item>
              </div>
              {employeeCodeVisible &&
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
            <div className='row'>
              <div className="col-12 col-md-12">
                <div className="row">
                  <div className="col-12">
                    <Form.Item
                      name="sampleSignature"
                      rules={[]}
                    >
                      <Upload
                        accept="image/png, image/jpeg"
                        showUploadList={true}
                        customRequest={(handle) => customRequest(handle, DOCUMENT_TYPE.SIGNATURE)}
                        listType="picture-card"
                        fileList={listSampleSignature}
                        onChange={(info) => setListSampleSignature(info.fileList)}
                        multiple={false}
                        onPreview={handlePreview}
                        onRemove={({ uid }) => {
                          handleRemove(uid)
                        }}
                        maxCount={1}
                        disabled={preventEdit}
                      >
                        {listSampleSignature.length >= 1 ? null : uploadButton2}
                      </Upload>
                    </Form.Item>
                  </div>
                  <div className="col-12">
                    <Form.Item
                      name="profilePicture"
                      rules={[]}
                    >
                      <Upload
                        accept="image/png, image/jpeg"
                        showUploadList={true}
                        customRequest={(handle) => customRequest(handle, DOCUMENT_TYPE.PROFILE)}
                        multiple={true}
                        fileList={listProfilePicture}
                        listType="picture-card"
                        onPreview={handlePreview}
                        onRemove={({ uid }) => {
                          handleRemove(uid)
                        }}
                        onChange={(info) => setListProfilePicture(info.fileList)}
                        disabled={preventEdit}
                      >
                        {listProfilePicture.length >= 4 ? null : uploadButton}
                      </Upload>
                    </Form.Item>
                  </div>
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

export default ModalEditUserInfo