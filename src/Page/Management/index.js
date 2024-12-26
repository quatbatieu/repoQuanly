import { FormOutlined, LockOutlined, UnlockOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { notification, Space, Table, Select, Input, Button, message, Modal, Form, Popconfirm, Typography } from 'antd';
import ModalEditUserInfo from './ModalEditUserInfo';
import React, { useEffect, useRef, useState, Fragment } from 'react'
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import LoginService from "services/loginService"
import { useSelector } from 'react-redux';
import ManagementService from '../../services/manageService';
import { validatorPassword } from 'helper/commonValidator';
import './management.scss'
import ModalAddUser from './ModalAdd';
import Explaintation from 'Page/ExplainPower';
import EditableRow from 'components/EditableRow';
import EditableCell from 'components/EditableCell';
import { BUTTON_LOADING_TIME } from "constants/time";
import { getListPosition, getListInCharge } from 'constants/management';
import { USER_ROLES } from 'constants/permission';
import { UserOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import AppUserDocumentService from 'services/appUserDocumentService';
import { DOCUMENT_TYPE } from 'constants/management';
import { ReactComponent as PrivacyTip } from "assets/icons/privacy_tip.svg";
import { SweetAlertWrapperConfirm } from 'components/SweetAlert/SweetAlertWrapper';
import UnLock from 'components/UnLock/UnLock';
import { isMobileDevice } from "constants/account";
import BasicTablePaging from 'components/BasicTablePaging/BasicTablePaging';
import stationsService from 'services/stationsService';
import { MIN_COLUMN_WIDTH } from 'constants/app';
import { EXTRA_BIG_COLUMND_WITDTH } from 'constants/app';
import { BIG_COLUMN_WIDTH } from 'constants/app';
import { VERY_BIG_COLUMN_WIDTH } from 'constants/app';

function ListUser() {
  const { t: translation } = useTranslation()
  const member = useSelector(state => state.member)
  const setting = useSelector((state) => state.setting);
  const [formAdd] = Form.useForm()
  const [form] = Form.useForm();
  const LIST_POSITION = getListPosition(translation);
  const LIST_IN_CHARGE = getListInCharge(translation);
  const [isAdd, setIsAdd] = useState(false)
  const [changeStation, setChangeStation] = useState(false)
  const [stationData, setStationData] = useState([])
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
  const [dataFilter, setDataFilter] = useState(DEFAULT_FILTER)
  const [dataUser, setDataUser] = useState({
    total: 0,
    data: []
  })
  const [isEditting, setIsEditting] = useState(false)
  const inputRef = useRef()
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [role, setRole] = useState(false)
  const [listStation, setListStation] = useState([])
  const [lock, setLock] = useState(false)
  const [rows, setRow] = useState('')

  function handleSave(row, key, isReload) {
    const { appUserId } = row


    updateUserData({
      id: appUserId,
      data: {
        [key]: row[key]
      }
    })
  }
  const getStationList = () => {
    stationsService.getStationList({
      "filter": {},
      "skip": 0,
      'limit': 350,
      "order": {
        "key": "stationCode",
        "value": "asc"
      }
    }).then((result) => {
      if (result) {
        setListStation(result.data);
      }
    });
  };
  const onChangeStation=(data,value) => {
    let newData={
      id: data.appUserId,
      data: {
        stationsId: value,
      }
    }
    ManagementService.changeStationById(newData).then(result => {
      if (result.isSuccess) {
        notification.success({
          message: '',
          description: translation('accreditation.updateSuccess')
        })
        setChangeStation(false)
        fetchData(dataFilter)
      } else {
        notification.error({
          message: '',
          description: translation('accreditation.updateError')
        })
        setChangeStation(false)
      }
    })
  }

  function handleChangeRow(record, currentIndex) {
    dataUser.data[currentIndex - 1] = record
    setDataUser({ ...dataUser })
  }

  const columns = [
    {
      title: translation('listDocumentary.index'),
      key: 'index',
      width: MIN_COLUMN_WIDTH,
      align: "center",
      render: (_, __, index) => {
        return (
          <div className='d-flex justify-content-center aligns-items-center'>
            {dataFilter.skip ? dataFilter.skip + index + 1 : index + 1 }
          </div>
        )
      },
    },
    {
      title: translation('landing.fullname'),
      key: 'customerRecordPlatenumber',
      width: EXTRA_BIG_COLUMND_WITDTH,
      render: (_, row) => {
        return `${row.firstName} ${row.lastName ? row.lastName : ""}`
      }
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
      title: "Email",
      key: 'email',
      dataIndex: 'email',
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
      title: translation('landing.phoneNumber'),
      key: 'phoneNumber',
      dataIndex: 'phoneNumber',
      width: VERY_BIG_COLUMN_WIDTH
    },
    // {
    //   title: <div className='d-flex'>
    //     <div>{translation('landing.stationCode')}</div>
    //   </div>,
    //   key: 'appUserRoleName',
    //   dataIndex: 'appUserRoleName',
    //   width: 200,
    //   render: (_, row) => {
    //     return (
    //       <div className='d-flex align-items-center'>
    //         <Select defaultValue={row.stationsId} onChange={(e)=>onChangeStation(row,e)} className="w-100">
    //           {listStation && listStation?.map(item=>(
    //             <Select.Option value={item.stationsId}>{item.stationCode}</Select.Option>
    //           ))}
    //         </Select>
    //       </div>
    //     )
    //   }
    // },
    {
      title: translation("receipt.action"),
      key: 'action',
      // width: EXTRA_BIG_COLUMND_WITDTH,
      render: (_, record) => {
        return (
          <div className='d-flex align-items-center justify-content-between'>
            {
              record.active === 1 ? (
                <LockOutlined
                  // onClick={() => updateUserData({
                  //   id: record.appUserId,
                  //   data: {
                  //     active: 0
                  //   }
                  // })}
                  onClick={() => {
                   setLock(true)
                   setRow(record)
                   }}
                  style={{ color: "var(--primary-color)" }}
                />
              ) : (
                <UnlockOutlined 
                // onClick={() => updateUserData({
                //   id: record.appUserId,
                //   data: {
                //     active: 1
                //   }
                // })} 
                onClick={() => {
                setLock(true)
                setRow(record)
                }}
                />
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
            {/* {record?.appUserRoleId != USER_ROLES.ADMIN ? (
            <SweetAlertWrapperConfirm
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
            </SweetAlertWrapperConfirm>
            ) : (
              <Button
                type="link"
                className='p-0'
                style={{ width: 24 }}
              >

              </Button>
            )
            } */}
            <Button
              type='link'
              className='p-0'
              onClick={() => {
                setChangeStation(true)
                setStationData(record)
              }}
            >
              Chuyển trạm
            </Button>
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
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        isTime: col.isTime ? true : false,
        componentInput: col.componentInput,
        rules: col.rules,
        handleSave: (row, isReload) => handleSave(row, col.key, isReload),
        handleChangeRow: (record) => handleChangeRow(record, index)
      }),
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
          message: "",
          description: translation(result.error ? result.error : "accreditation.updateError")
        })
      }
    })
  }

  function fetchData(paramFilter) {
    ManagementService.getListUser(paramFilter).then(result => {
      if (result) {
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
    getStationList()
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
    newFilter.skip = 0;
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

  async function handleCreateNew(values, { listProfilePicture, listSampleSignature }, callback) {
    await ManagementService.registerUser(values).then(async result => {
      if (result && result.isSuccess) {
        uploadDocumentProfile({
          id: result.id,
          listProfilePicture,
          listSampleSignature
        }, () => {
          callback();
          notification.success({
            message: "",
            description: translation('management.createSuccess')
          })
          isAdd && setIsAdd(false)
          formAdd.resetFields()
          fetchData(dataFilter)
        })
      } else {
        if (result.error) {
          notification.error({
            message: "",
            description: translation(result.error)
          })
        }
      }
    })
  }

  const ModalLock = ({ modal, onCancel, }) => {
    const { t: translation } = useTranslation()
    return (
      <Modal
        visible={modal}
        title={translation('Notification')}
        onCancel={onCancel}
        centered
        onOk={() =>checkActive(rows)}
        // footer={null}
        // width="1400px"
      >
        <div className='modal_role'>
          {translation('box-agree')}
        </div>
      </Modal>
    )
  }

  const checkActive = (rows) =>{
    if(rows.active === 1){
      updateUserData({
          id: rows.appUserId,
          data: {
            active: 0
          }
    })} else {
      updateUserData({
        id: rows.appUserId,
        data: {
          active: 1
        }
    })}
    setLock(false)
  }

  return (
    <Fragment>
      {setting.enableManagerMenu === 0 ? <UnLock /> :
       <div className="management">
      <div className="row mb-3">
        {/* <div className="col-12 col-md-4 col-lg-3">
          <label className="section-title pl-3 ">
            {translation('management.userManagement')}
          </label>
        </div>
        <div className="col-12 col-lg-2 col-xl-3" /> */}
        <Space size={16} className="d-flex vehicleRecords-action" wrap={true}>
         <div className="w-100">
          <Input.Search
            className="w-100"
            value={searchText}
            onPressEnter={handleFilter}
            onSearch={handleFilter}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder={translation('landing.search')}
            style={{
              minWidth: 160
            }} 
          />
         </div>
         <div className="w-100">
           <Select onChange={onFilterUserByStatus} className="w-100" placeholder='Trạng thái' style={{
                  minWidth: 180
                }} 
            >
            <Select.Option value="">{translation('new.allPost')}</Select.Option>
            <Select.Option value={1}>{translation('management.active')}</Select.Option>
            <Select.Option value={0}>{translation('management.inActive')}</Select.Option>
          </Select>
         </div>
        <Button
            className='w-100 d-flex align-items-center justify-content-center'
            icon={<PlusOutlined />}
            onClick={() => {
              setIsAdd(true)
              setTimeout(() => {
                if (inputAddRef && inputAddRef.current) {
                  inputAddRef.current.focus()
                }
              }, 10)
            }}
            type="primary"
          >{translation('inspectionProcess.add')}</Button>
          <Button
            className='d-flex align-items-center justify-content-center'
            loading={loading}
            onClick={() => {
              setLoading(true);
              setTimeout(() => {
                fetchData(dataFilter)
                setLoading(false)
              }, BUTTON_LOADING_TIME);
            }}
          >
            {!loading && <ReloadOutlined />}
          </Button>
        </Space>

        {/* <div className='col-6 col-md-2 col-lg-1 col-xl-1 mb-1'>
          <Button
            className='d-flex align-items-center justify-content-center'
            loading={loading}
            onClick={() => {
              setLoading(true);
              setTimeout(() => {
                fetchData(dataFilter)
                setLoading(false)
              }, BUTTON_LOADING_TIME);
            }}
          >
            {!loading && <ReloadOutlined />}
          </Button>
        </div> */}
      </div>

      <div className="management__body">
        <Table
          dataSource={dataUser.data}
          columns={columnsEdit}
          scroll={{ x: 1300 }}
          components={components}
          pagination={false}
        />
        <BasicTablePaging handlePaginations={handleChangePage} skip={dataFilter.skip} count={dataUser?.data?.length < dataFilter.limit}></BasicTablePaging>
      </div>
      <ModalRole
        modal={role}
        onCancel={() => setRole(false)}
      />
      <ModalLock
        modal={lock}
        onCancel={() => setLock(false)}
      />
      <ModalEditUserInfo
        isEditing={isEditting}
        toggleEditModal={() => setIsEditting(!isEditting)}
        onUpdateUser={updateUserData}
        selectedUserId={selectedUser?.appUserId}
        inputRef={inputRef}
        member={member}
      />
      <ModalAddUser
        isAdd={isAdd}
        onCancel={() => setIsAdd(false)}
        form={formAdd}
        onCreateNew={handleCreateNew}
        inputRef={inputAddRef}
        member={member}
      />
      <Modal
        visible={changeStation}
        title={'Chuyển trạm'}
        onCancel={()=>setChangeStation(false)}
        footer={null}
        width="350px"
      >
        <div className='modal_role'>
          <div className='mb-1'>{translation('landing.stationCode')}</div>
          <div className='d-flex align-items-center'>
            <Select defaultValue={stationData.stationsId} onChange={(e)=>onChangeStation(stationData,e)} className="w-100">
              {listStation && listStation?.map(item=>(
                <Select.Option value={item.stationsId}>{item.stationCode}</Select.Option>
              ))}
            </Select>
          </div>
        </div>
      </Modal>
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

const ModalRole = ({ modal, onCancel, }) => {
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

export default ListUser