import { FormOutlined, LockOutlined, UnlockOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { notification, Space, Table, Select, Input, Button, message, Modal, Form, Popconfirm, Spin , DatePicker } from 'antd';
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
import { isMobileDevice } from "constants/account";
import EditableRow from 'components/EditableRow';
import EditableCell from 'components/EditableCell';
import { getListPosition, getListInCharge } from 'constants/management';
import { USER_ROLES } from 'constants/permission';
import { UserOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import AppUserDocumentService from 'services/appUserDocumentService';
import { DOCUMENT_TYPE } from 'constants/management';
import { ReactComponent as PrivacyTip } from "assets/icons/privacy_tip.svg";
import StationDevicesService from 'services/StationDevicesService';
import debounce from 'lodash/debounce';
import ModalPrint from './ModalPrint';
import AppUserWorkingHistoryService from 'services/AppUserWorkingHistoryService';
import { DATE_DISPLAY_FORMAT } from 'constants/dateFormats';
import { EyeOutlined } from '@ant-design/icons';
import { LIST_TYPE_PRINT } from './EmployeePositionMapping';
import UnLock from 'components/UnLock/UnLock';
import BasicTablePaging from 'components/BasicTablePaging/BasicTablePaging';

function CreateAssignmentHistory() {
  const { t: translation } = useTranslation()
  const member = useSelector(state => state.member)
  const setting = useSelector((state) => state.setting);
  const [formAdd] = Form.useForm()
  const [item , setItem] = useState({});
  const [form] = Form.useForm();
  const LIST_POSITION = getListPosition(translation);
  const LIST_IN_CHARGE = getListInCharge(translation);
  const [isPrint, setIsPrint] = useState(false)
  const [TypePrint , setTypePrint] = useState(LIST_TYPE_PRINT.ADD_NEW);
  const inputAddRef = useRef()
  const DEFAULT_FILTER = {
    "skip": 0,
    "limit": 20,
    "searchText": undefined
  }
  const [dataFilter, setDataFilter] = useState(DEFAULT_FILTER)
  const [isCreate, setIsCreate] = useState(false);
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
      title: translation('management.createAssignmentHistory.registrarCode'),
      key: 'appUserWorkingHistoryId',
      dataIndex: 'appUserWorkingHistoryId',
      width: 50
    },
    {
      title: translation('management.createAssignmentHistory.date'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 170,
      render: (text) => moment(text).format(DATE_DISPLAY_FORMAT)
    },
    {
      title: translation('management.createAssignmentHistory.creator'),
      dataIndex: 'firstName',
      key: 'firstName',
      width: 250
    },
    {
      title: translation('management.createAssignmentHistory.action'),
      key: 'action',
      width: 200,
      render: (_, record) => {
        return (
          <Button type='link' onClick={() => {
            setIsPrint(true);
            setTypePrint(LIST_TYPE_PRINT.VIEW_DETAILS)
            setItem(record);
          }}>
            <EyeOutlined style={{ fontSize: 16 }} />
          </Button>
        );
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
      if (result) {
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
          description: translation('accreditation.updateError')
        })
      }
    })
  }

  function fetchData(paramFilter) {
    AppUserWorkingHistoryService.getListWorkingHistory(paramFilter).then(result => {
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
  }, [])

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
    newFilter.searchText = searchText ? searchText : undefined
    setDataFilter(newFilter)
    fetchData(newFilter)
  }

  const handleChangePage = (pageNum) => {
    const newFilter = {
      ...dataFilter,
      skip : (pageNum -1) * dataFilter.limit
    }
    setDataFilter(newFilter)
    fetchData(newFilter)
  }

  const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
      const startDate = moment(dates[0]).format("YYYYMMDD");
      const endDate = moment(dates[1]).format("YYYYMMDD");
      const newFilter = {
        ...dataFilter ,
        skip : 0,
        startDate : +startDate,
        endDate : +endDate
      }
      setDataFilter(newFilter);
      fetchData(newFilter)
    } else {
      const newFilter = {
        ...dataFilter ,
        skip : 0
      }

      delete newFilter.startDate;
      delete newFilter.endDate;

      setDataFilter(newFilter);
      fetchData(newFilter);
    }
  };

  return (
    <Fragment>
      {setting.enableManagerMenu === 0 ? <UnLock /> :
    <div className="management managementEmployee">
      <div className="row mb-3">
        <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
          <DatePicker.RangePicker
            onChange={handleDateChange}
            className='w-100'
            format="DD/MM/YYYY"
            placeholder={[
              translation('startDate'),
              translation('endDate')
            ]}
          />
        </div>
      </div>
      <div className="management__body">
        <Table
          dataSource={dataUser.data}
          columns={columnsEdit}
          scroll={{ x: 1200 }}
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
          id={item.appUserWorkingHistoryId}
          TypePrint={TypePrint}
        />
      )}
    </div>
    }
    </Fragment>
  )
}

export default CreateAssignmentHistory;