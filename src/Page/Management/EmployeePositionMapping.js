import { FormOutlined, LockOutlined, UnlockOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { notification, Space, Table, Select, Input, Button, message, Modal, Form, Popconfirm, Spin, Typography } from 'antd';
import ModalEditUserInfo from './ModalEditUserInfo';
import Explaintation from 'Page/ExplainPower';
import React, { useEffect, useRef, useState, useCallback, Fragment } from 'react'
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import LoginService from "services/loginService"
import { useSelector } from 'react-redux';
import ManagementService from '../../services/manageService';
import { validatorPassword } from 'helper/commonValidator';
import './management.scss'
import ModalAddUser from './ModalAdd';
import UnLock from 'components/UnLock/UnLock';
import EditableRow from 'components/EditableRow';
import EditableCell from 'components/EditableCell';
import { getListPosition, getListInCharge } from 'constants/management';
import { USER_ROLES } from 'constants/permission';
import { UserOutlined , QuestionCircleOutlined } from '@ant-design/icons';
import AppUserDocumentService from 'services/appUserDocumentService';
import { DOCUMENT_TYPE } from 'constants/management';
import { ReactComponent as PrivacyTip } from "assets/icons/privacy_tip.svg";
import StationDevicesService from 'services/StationDevicesService';
import debounce from 'lodash/debounce';
import ModalPrint from './ModalPrint';
import { isMobileDevice } from "constants/account";
import BasicTablePaging from 'components/BasicTablePaging/BasicTablePaging';

export const LIST_TYPE_PRINT = {
  ADD_NEW: "ADD_NEW",
  EXPORT_FILE: "EXPORT_FILE",
  PRINT_SLIP: "PRINT_SLIP",
  VIEW_DETAILS: "VIEW_DETAILS"
};

function renderNotAllowedIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      onClick={e => e.stopPropagation()}
      height="24px"
      viewBox="0 0 24 24"
      width="24px"
      fill="red"
      style={{ cursor: "not-allowed", pointerEvents: "none" }}
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z" />
    </svg>
  );
}

const SelectSearchApi = ({ save, inputRef, form, handleSave, record }) => {
  const { t: translation } = useTranslation();
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const handleSearch = useCallback(
    debounce((value) => {
      getListDevices(value);
    }, 500),
    []
  );

  const getListDevices = (value) => {
    setIsLoading(true);
    const filterSearch = {
      ...(value && { searchText: value }),
      limit: 100,
    };

    StationDevicesService.getList(filterSearch).then((response) => {
      if (response?.data) {
        setSearchResults(response.data);
      } else {
        setSearchResults([]);
      }
      setIsLoading(false);
    });
  }

  useEffect(() => {
    getListDevices(null);
  }, []);

  const handleChange = (value) => {
    form.setFieldsValue({ appUserPosition: value });
  }

  const handleBlur = async () => {
    const values = await form.validateFields();
    handleSave(values);
  }

  return (
    <Select onBlur={handleBlur} onChange={handleChange} autoFocus ref={inputRef} filterOption={false} defaultOpen onSelect={handleBlur} showSearch onSearch={handleSearch}>
      <Select.Option value={999999999999999911} disabled>
        <p style={{ color: 'grey', whiteSpace: "pre-line", wordBreak: "break-word" }} className='text-very-small text-center'>{translation('management.searchIfNotFound')}</p>
      </Select.Option>
      {searchResults.length === 0 && (
        <Select.Option value={""}>{translation('management.noAssignment')}</Select.Option>
      )}
      {isLoading ? (
        <Select.Option>
          <Spin />
        </Select.Option>
      ) : (
        searchResults.map(item => {
          return (
            <Select.Option value={item.deviceName} key={item.stationDevicesId}>{item.deviceName}</Select.Option>
          )
        })
      )}
    </Select>
  )
}

function EmployeePositionMapping() {
  const { t: translation } = useTranslation()
  const member = useSelector(state => state.member)
  const setting = useSelector((state) => state.setting);
  const [formAdd] = Form.useForm()
  const [form] = Form.useForm();
  const LIST_POSITION = getListPosition(translation);
  const LIST_IN_CHARGE = getListInCharge(translation);
  const [isPrint, setIsPrint] = useState(false)
  const inputAddRef = useRef()
  const DEFAULT_FILTER = {
    "filter": {
      "active": undefined,
      "username": undefined,
      "email": undefined,
      "phoneNumber": undefined,
      "stationsId": member.stationsId
    },
    "skip": 0,
    "limit": 20,
    "searchText": undefined,
  }
  const [dataFilter, setDataFilter] = useState(DEFAULT_FILTER)
  const [isCreate , setIsCreate] = useState(false);
  const [TypePrint , setTypePrint] = useState(LIST_TYPE_PRINT.ADD_NEW);
  const [dataUser, setDataUser] = useState({
    total: 0,
    data: []
  })
  const [isEditting, setIsEditting] = useState(false)
  const inputRef = useRef()
  const [selectedUser, setSelectedUser] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [role, setRole] = useState(false)

  const LIST_COLOR = {
    1: {
      bg: "#7367f01f",
      icon: "#7367f0"
    },
    2: {
      bg: "#28c76f1f",
      icon: "#28c76f"
    },
    3: {
      bg: "#ff9f431f",
      icon: "#ff9f43"
    },
    4: {
      bg: "#00cfe81f",
      icon: "#00cfe8"
    },
  }
  function getColorByAppUserRoleId(appUserRoleId) {
    if (LIST_COLOR[appUserRoleId]) {
      return LIST_COLOR[appUserRoleId]
    } else {
      return {
        bg: "#00cfe81f",
        icon: "#00cfe8"
      }
    }
  }


  function handleSave(row, key, isReload) {
    const { appUserId } = row


    updateUserData({
      id: appUserId,
      data: {
        [key]: row[key]
      }
    })
  }

  function handleChangeRow(record, currentIndex) {
    dataUser.data[currentIndex - 1] = record
    setDataUser({ ...dataUser })
  }

  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'name',
      width: 60,
      render: (_, __, index) => {
        // return dataFilter.skip ? dataUser.total - (dataFilter.skip + index) : dataUser.total - (index)
        return dataFilter.skip ? dataFilter.skip + index + 1 : index + 1 
      }
    },
    {
      title: translation('management.registrarCode'),
      key: 'employeeCode',
      dataIndex: 'employeeCode',
      width: 200,
    },
    {
      title: translation('landing.account'),
      dataIndex: 'username',
      key: 'username',
      width: 250,
      render: (value) => {
        return (
          <Typography.Paragraph
            className="sms-content"
            style={{ width: 218 }}
            ellipsis={{
              rows: 1,
              expandable: true,
              symbol: "Hiển thị",
            }}
          >
            {value}
          </Typography.Paragraph>
        );
      },
    },
    {
      title: <div className='style_flex'>
        <div>{translation('management.role')}</div>
        <div className='style_question' onClick={() => setRole(true)}><QuestionCircleOutlined /></div>
      </div>,
      key: 'appUserRoleName',
      dataIndex: 'appUserRoleName',
      width: 250,
      render: (_, row) => {
        return (
          <div className='d-flex align-items-center'>
            <div className='d-flex me-1 management-roleIcon' style={{ background: getColorByAppUserRoleId(row.appUserRoleId).bg }}>
              <UserOutlined style={{ color: getColorByAppUserRoleId(row.appUserRoleId).icon }} />
            </div>
            <div>{row.appUserRoleName ? row.appUserRoleName : translation('management.none')}</div>
          </div>
        )
      }
    },
    {
      title: translation('management.inCharge'),
      key: 'appUserWorkStep',
      dataIndex: 'appUserWorkStep',
      width: 250,
      rules: [],
      componentInput: (inputRef, save, form, setEditing ,handleSave) => {
        const handleChange = (values) => {
          if (values.findIndex(item => item === null) > 0) {
            form.setFieldsValue({ appUserWorkStep: null });
            return;
          }

          if (values[0] === null) {
            const updatedValues = values.filter(item => item !== null);
            form.setFieldsValue({ appUserWorkStep: updatedValues });
          }
        }

        const handleBlur = async () => {
          const values = await form.validateFields();
          if (!values.appUserWorkStep || values.appUserWorkStep === null || values.appUserWorkStep?.length === 0) {
            handleSave({
              appUserWorkStep: null
            });
            return;
          }

          handleSave({
            appUserWorkStep: values.appUserWorkStep.join(", "),
          });
          setEditing(false)
        }

        return (
          <Select mode="multiple" onBlur={handleBlur} onChange={handleChange} ref={inputRef} defaultOpen >
            <Select.Option value={null} disabled={form.getFieldValue('appUserWorkStep') === null}>
              {translation('management.notInCharge')}
            </Select.Option>
            {LIST_IN_CHARGE.map(item => {
              return (
                <Select.Option value={item.value} key={item.value}>{item.label}</Select.Option>
              )
            })}
          </Select>
        )
      },
      render: (value, record) => {

        if(!value) {
          return  <p>{value || <span style={{ color: "#1890ff" }}>{"---"}</span>}</p>
        }

        return (
          <p>{value.join(", ")}</p>
        );
      },
      editable: true,
    },
    {
      title: translation('management.position'),
      key: 'appUserPosition',
      dataIndex: 'appUserPosition',
      width: 250,
      rules: [],
      componentInput: (inputRef, save, form, setEditing, handleSave, record) => {
        return (
          <SelectSearchApi onBlur={(()=> setEditing(false))} inputRef={inputRef} save={save} form={form} handleSave={handleSave} record={record} />
        )
      },
      render: (value, record) => {
        const allowedRoles = [USER_ROLES.ADMIN, USER_ROLES.VEHICLE_INSPECTOR, USER_ROLES.SENIOR_VEHICLE_INSPECTOR];
        const isEditableRole = allowedRoles.includes(record.appUserRoleId);
      
        if (!isEditableRole) {
          return renderNotAllowedIcon();
        }

        return (
          <p>{value || <span style={{ color: "#1890ff" }}>{"---"}</span>}</p>
        )
      },
      editable: true,
    },
    {
      title: translation("receipt.action"),
      key: 'action',
      // width: 200,
      render: (_, record) => {
        return (
          <div className='d-flex align-items-center justify-content-between'>
            {
              record.active === 1 ? (
                <LockOutlined
                  onClick={() => updateUserData({
                    id: record.appUserId,
                    data: {
                      active: 0
                    }
                  })}
                  style={{ color: "var(--primary-color)" }}
                />
              ) : (
                <UnlockOutlined onClick={() => updateUserData({
                  id: record.appUserId,
                  data: {
                    active: 1
                  }
                })} />
              )
            }
            <IconChangePassword
              record={record}
              member={member}
            />
            <Button
              type='link'
              className='p-0'
              onClick={() => {
                setSelectedUser(record)
                setIsEditting(true)
                if (inputRef && inputRef.current) {
                  setTimeout(() => {
                    inputRef.current.focus()
                  }, 100)
                }
              }}
            >
              {translation("short-edit")}
            </Button>
            {/* {record?.appUserRoleId != USER_ROLES.ADMIN ? (<Popconfirm
              title={translation("management.confirm-delete")}
              onConfirm={() => {
                if (record?.appUserRoleId != USER_ROLES.ADMIN) {
                  updateUserData({
                    id: record.appUserId,
                    data: {
                      isDeleted: 1
                    }
                  })
                }
              }}
              okText={translation("category.yes")}
              cancelText={translation("category.no")}
            >

              <Button
                type="link"
                className='p-0'
              >
                {translation("listCustomers.delete")}
              </Button>
            </Popconfirm>
            ) : (
              <Button
                type="link"
                className='p-0'
                style={{ width: 24 }}
              >

              </Button>
            )
            } */}
          </div>
        )
      },
    }
  ];

  const components = {
    body: {
      row: (props) => <EditableRow {...props} form={form} />,
      cell: (props) => <EditableCell {...props} form={form} />,
    },
  };

  const columnsEdit = columns.map((col, index) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => {
        const allowedRoles = [USER_ROLES.ADMIN, USER_ROLES.VEHICLE_INSPECTOR, USER_ROLES.SENIOR_VEHICLE_INSPECTOR];
        const isEditableRole = allowedRoles.includes(record.appUserRoleId);
        
        const nonEditableFields = ["appUserPosition"];
        const isEditableField = !nonEditableFields.includes(col.dataIndex);

        return {
          record,
          editable: isEditableField ? col.editable : isEditableRole,
          dataIndex: col.dataIndex,
          title: col.title,
          isTime: !!col.isTime,
          componentInput: col.componentInput,
          rules: col.rules,
          handleSave: (row, isReload) => handleSave(row, col.key, isReload),
          handleChangeRow: (record) => handleChangeRow(record, index)
        };
      }
    };
  });

  function updateUserData(data, callback = () => false) {
    ManagementService.updateUser(data).then(result => {
      if (result.isSuccess) {
        setSelectedUser(null)
        fetchData(dataFilter)
        isEditting && setIsEditting(false)
        notification.success({
          message: '',
          description: translation('accreditation.updateSuccess')
        })
        callback()
      } else {
        callback()
        notification.error({
          message: '',
          description: translation(result.error ? result.error : "accreditation.updateError")
        })
      }
    })
  }

  function fetchData(paramFilter) {
    ManagementService.getListUser(paramFilter).then(result => {
      if (result) {
        result.data = result.data.map((item) => {
          if (!item.appUserWorkStep) {
            return item;
          }

          return {
            ...item,
            appUserWorkStep : item.appUserWorkStep?.split(',').map(item => item.trim())
          }
        })
        setDataUser(result)
      } else {
        notification.error({
          message: '',
          description: translation('new.fetchDataFailed')
        })
      }
    })
  }

  useEffect(() => {
    isMobileDevice(window.outerWidth)
    if(isMobileDevice(window.outerWidth) === true){
      dataFilter.limit = 10
    }
    fetchData(dataFilter)
  }, [])

  const handleChangePage = (pageNum) => {
    const newFilter = {
      ...dataFilter,
      skip : (pageNum -1) * dataFilter.limit
    }
    setDataFilter(newFilter)
    fetchData(newFilter)
  }
  
  const onFilterUserByStatus = (e) => {
    let newFilter = dataFilter
    if (e || e === 0) {
      newFilter.filter.active = e
    } else {
      newFilter.filter.active = undefined
    }
    setDataFilter(newFilter)
    fetchData(newFilter)
  }

  function handleFilter() {
    let newFilter = dataFilter
    newFilter.skip = 0;
    newFilter.searchText = searchText ? searchText : undefined
    setDataFilter(newFilter)
    fetchData(newFilter)
  }

  const uploadDocument = async (param, documentType, id) => {
    const { response, name } = param;
    return await AppUserDocumentService.addDocument({
      appUserId: id,
      documentName: name,
      documentType: documentType,
      documentURL: response
    })
  }

  async function uploadDocumentProfile({ id, listProfilePicture, listSampleSignature }, callback) {
    for (const param of listProfilePicture) {
      const result = await uploadDocument(param, DOCUMENT_TYPE.PROFILE, id);
      if (!result.issSuccess) {
        notification.warn({
          message: '',
          description: translation('management.errorAddDocument', {
            fileName: param.name
          })
        })
      }
    }

    for (const param of listSampleSignature) {
      const result = await uploadDocument(param, DOCUMENT_TYPE.SIGNATURE, id);
      if (!result.issSuccess) {
        notification.warn({
          message: '',
          description: translation('management.errorAddDocument', {
            fileName: param.name
          })
        })
      }
    }
    callback();
  }

  return (
    <Fragment>
     {setting.enableManagerMenu === 0 ? <UnLock /> :
      <div className="management managementEmployee">
      <div className="row mb-3">
        <div className="col-md-3 col-lg-3 col-xl-2">
          <Input.Search
            className="w-100"
            value={searchText}
            onPressEnter={handleFilter}
            onSearch={handleFilter}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder={translation('landing.search')}
          />
        </div>

        <div className='col-12 col-md-4 col-lg-3 col-xl-2'>
          <Button
            className='w-100 d-flex align-items-center justify-content-center'
            icon={<PlusOutlined />}
            onClick={() => {
              setIsPrint(true)
              setTypePrint(LIST_TYPE_PRINT.ADD_NEW);
              setTimeout(() => {
                if (inputAddRef && inputAddRef.current) {
                  inputAddRef.current.focus()
                }
              }, 10)
            }}
            type="primary"
          >{translation('management.createAssignmentTicket')}
          </Button>
        </div>
        {/* <div className='col-12 col-md-4 col-lg-3 col-xl-2'>
          <Button
            className='w-100 d-flex align-items-center justify-content-center'
            onClick={() => {
              setIsPrint(true)
              setTypePrint(LIST_TYPE_PRINT.EXPORT_FILE);
              setTimeout(() => {
                if (inputAddRef && inputAddRef.current) {
                  inputAddRef.current.focus();
                }
              }, 10)
            }}
            type="primary"
          >{translation('management.print.employeeAssignmentBook')}
          </Button>
        </div>
        <div className='col-12 col-md-4 col-lg-3 col-xl-2'>
          <Button
            className='w-100 d-flex align-items-center justify-content-center'
            onClick={() => {
              setIsPrint(true)
              setTypePrint(LIST_TYPE_PRINT.PRINT_SLIP);
              setTimeout(() => {
                if (inputAddRef && inputAddRef.current) {
                  inputAddRef.current.focus();
                }
              }, 10)
            }}
            type="primary"
          >{translation('management.print.printAssignment')}
          </Button>
        </div> */}
      </div>

      <div className="management__body">
        <Table
          dataSource={dataUser.data}
          columns={columnsEdit}
          scroll={{ x: 1400 }}
          components={components}
          pagination={false}
        />
        <BasicTablePaging handlePaginations={handleChangePage} skip={dataFilter.skip} count={dataUser?.data?.length < dataFilter?.limit}></BasicTablePaging>
      </div>
      <ModalEditUserInfo
        isEditing={isEditting}
        toggleEditModal={() => setIsEditting(!isEditting)}
        onUpdateUser={updateUserData}
        selectedUserId={selectedUser?.appUserId}
        inputRef={inputRef}
        member={member}
      />
      {isPrint && (
        <ModalPrint
          isVisible={isPrint}
          onCancel={() => setIsPrint(false)}
          member={member}
          data={dataUser}
          TypePrint={TypePrint}
        />
      )}
      <ModalRole
        modal={role}
        onCancel={() => setRole(false)}
      />
      </div>
     }
    </Fragment>
  )
}

const IconChangePassword = ({ member, record }) => {
  const [isOpenModalChangePassword, setIsOpenModalChangePassword] = useState(false);

  return (
    <>
      <span onClick={() => setIsOpenModalChangePassword(true)} className='management-privacyTip'>
        <PrivacyTip />
      </span>
      {member.appUserRoleId === USER_ROLES.ADMIN && (
        <>
          {isOpenModalChangePassword && (
            <ModalChangePassword
              isOpen={isOpenModalChangePassword}
              toggleModal={() => setIsOpenModalChangePassword(!isOpenModalChangePassword)}
              selectedUserId={record.appUserId}
            />
          )}
        </>
      )}
    </>
  )
}

const ModalChangePassword = ({ isOpen, toggleModal, selectedUserId }) => {
  const { t: translation } = useTranslation()
  const [form] = Form.useForm()

  const onFinish = (values) => {
    LoginService.changePasswordUser({
      id: selectedUserId,
      ...values
    }).then(result => {
      if (result && result.isSuccess) {
        notification.success({
          message: "",
          description: translation("listCustomers.success", {
            type: translation('setting.changePass')
          })
        })
        form.resetFields()
        toggleModal()
      } else {
        notification.error({
          message: "",
          description: translation("listCustomers.failed", {
            type: translation('setting.changePass')
          })
        })
      }
    })
  }
  return (
    <Modal
      visible={isOpen}
      title={translation('setting.changePass')}
      onCancel={toggleModal}
      footer={null}
    >
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          name="password"
          rules={[
            {
              required: false,
              validator(_, value) {
                return validatorPassword(value, translation);
              }
            }
          ]}
          label={translation('landing.newPassword')}
        >
          <Input placeholder={translation('landing.enterNewPassword')} autoFocus />
        </Form.Item>

        <div className="d-flex w-100 justify-content-end">
          <Button type="primary" htmlType="submit">
            {translation('landing.confirm')}
          </Button>
        </div>
      </Form>
    </Modal>
  )
}

const ModalRole = ({ modal, onCancel,  }) => {
  const { t: translation } = useTranslation()
  return (
    <Modal
      visible={modal}
      title={translation('header.explainPower')}
      onCancel={onCancel}
      footer={null}
      width="1400px"
    >
      <div className='modal_role'>
      <Explaintation />
      </div>
    </Modal>
  )
}

export default EmployeePositionMapping;