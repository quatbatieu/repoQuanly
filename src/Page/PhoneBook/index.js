import { FormOutlined, LockOutlined, UnlockOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { notification, Space, Table, Select, Input, Button, message, Modal, Form, Popconfirm } from 'antd';
import { isMobileDevice } from "constants/account";
import React, { useEffect, useRef, useState, Fragment } from 'react'
import { useTranslation } from 'react-i18next';
import PhonebookService from '../../services/phonebookService';
import './phonebook.scss'
import EditableRow from 'components/EditableRow';
import EditableCell from 'components/EditableCell';
import { BUTTON_LOADING_TIME } from "constants/time";
import UnLock from 'components/UnLock/UnLock';
import { useSelector } from "react-redux";
import BasicTablePaging from 'components/BasicTablePaging/BasicTablePaging';
import { NORMAL_COLUMN_WIDTH } from 'constants/app';
import { EXTRA_BIG_COLUMND_WITDTH } from 'constants/app';
import { VERY_BIG_COLUMN_WIDTH } from 'constants/app';

function ListUser() {
  const { t: translation } = useTranslation()
  const [form] = Form.useForm();
  const DEFAULT_FILTER = {
    "filter": {},
    "skip": 0,
    "limit": 20,
    "searchText": undefined,
  }
  const setting = useSelector(state => state.setting);
  const [dataFilter, setDataFilter] = useState(DEFAULT_FILTER)
  const [dataUser, setDataUser] = useState({
    total: 0,
    data: []
  })
  const [dataUserRole, setDataUserRole] = useState({
    total: 0,
    data: []
  })
  const [dataStation, setDataStation] = useState({
    total: 0,
    data: []
  })
 
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('')


  function handleChangeRow(record, currentIndex) {
    dataUser.data[currentIndex - 1] = record
    setDataUser({ ...dataUser })
  }

  const columns = [
    {
      title: translation('listDocumentary.index'),
      key: 'index',
      width: NORMAL_COLUMN_WIDTH,
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
      title: translation('landing.stationCode'),
      dataIndex: 'stationCode',
      key: 'stationCode',
      width: VERY_BIG_COLUMN_WIDTH
    },
    {
      title: translation('setting.name'),
      dataIndex: 'stationsName',
      key: 'stationsName',
      // width:400,
      render: (_, row) => {
        return <div>{row.stationsName}</div>;
      },
    },
    {
      title: translation('landing.role'),
      dataIndex: 'appUserRoleName',
      key: 'appUserRoleName',
      width: VERY_BIG_COLUMN_WIDTH
    },
    {
      title: "Email",
      key: 'email',
      dataIndex: 'email',
      width: EXTRA_BIG_COLUMND_WITDTH,
      render: (_, record) => {
        return <a href={`mailto:${record.email}`} className="blue-text" target='_blank'>{record.email}</a>;
      },
    },
    {
      title: translation('landing.phoneNumber'),
      key: 'phoneNumber',
      dataIndex: 'phoneNumber',
      width: VERY_BIG_COLUMN_WIDTH,
      render: (_, record) => {
        return <a href={`tel:${record.phoneNumber}`} className="blue-text" target='_blank'>{record.phoneNumber}</a>;
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
        handleChangeRow: (record) => handleChangeRow(record, index)
      }),
    };
  });

  function fetchData(paramFilter) {
    PhonebookService.getListUser(paramFilter).then(result => {
      if (result) {
        setDataUser(result)
      } else {
        notification.error({
          message: '',
          description: translation('new.fetchDataFailed')
        })
      }
    })

    PhonebookService.getStationList({
      "filter": {
      },
      "skip": 0,
      'limit':350,
      "order": {
        "key": "stationCode",
        "value": "asc"
      }
    }).then(result => {
      if (result) {
        setDataStation(result.data)
      } else {
        notification.error({
          message: '',
          description: translation('new.fetchDataFailed')
        })
      }
    })

    PhonebookService.getUserRoleId({
      "filter": {
      },
      "skip": 0,
      'limit':20
    }).then(result => {
      if (result) {
        setDataUserRole(result.data)
      } else {
        notification.error({
          message: '',
          description: translation('new.fetchDataFailed')
        })
      }
    })
  }

  useEffect(() => {
    if(isMobileDevice() === true){
      dataFilter.limit = 10
    }
    fetchData(dataFilter)
  }, [])

  const onFilterUserByRole = (e) => {
    let newFilter = dataFilter
    if (e) {
      newFilter.filter.appUserRoleId  = e
      newFilter.skip=0
    } else {
      newFilter.filter.appUserRoleId = undefined
      newFilter.skip=0
    }
    setDataFilter(newFilter)
    fetchData(newFilter)
  }
  const onFilterUserByStationId = (e) => {
    let newFilter = dataFilter
    if (e) {
      newFilter.filter.stationsId  = e
      newFilter.skip=0
    } else {
      newFilter.filter.stationsId = undefined
      newFilter.skip=0
    }
    setDataFilter(newFilter)
    fetchData(newFilter)
  }

  function handleFilter() {
    let newFilter = dataFilter
    newFilter.searchText = searchText ? searchText : undefined
    newFilter.skip=0
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

  return (
    <Fragment>
      {setting.enableContactMenu === 0 ? <UnLock /> :
    <div className="phonebook">
      <div className="row mb-3">
        {/* <div className="col-12 col-md-3 col-lg-3">
          <label className="section-title pl-3 ">
            {translation('management.phonebookManagement')}
          </label>
        </div>
        <div className="col-12 col-lg-2 col-xl-1" /> */}
        <div className="col-md-3 col-lg-2 col-xl-3">
          <Input.Search
            className="w-100"
            value={searchText}
            onPressEnter={handleFilter}
            onSearch={handleFilter}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder={translation('landing.search')}
          />
        </div>

        <div className="col-md-3 col-lg-2">
          <Select onChange={onFilterUserByStationId} className="w-100" placeholder='Tất cả mã trạm'>
              <Select.Option value={0}>{translation('PhoneBook.allStations')}</Select.Option>
            {dataStation?.length > 0 && dataStation.map(item=>(
            <Select.Option key={item.stationsId} value={item.stationsId}>{item.stationCode}</Select.Option>
            ))}
          </Select>
        </div>
        <div className="col-md-3 col-lg-2">
          <Select onChange={onFilterUserByRole} className="w-100" placeholder='Tất cả vai trò'>
            <Select.Option value=''>{translation('allRole')}</Select.Option>
            {dataUserRole.length>0 && dataUserRole.map(item=>(
              <Select.Option key={item.appUserRoleId} value={item.appUserRoleId}>{item.appUserRoleName}</Select.Option>
            ))}
          </Select>
        </div>

        <div className='col-6 col-md-2 col-lg-1 col-xl-1'>
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
        </div>
      </div>

      <div className="phonebook__body">
        <Table
          dataSource={dataUser.data}
          columns={columnsEdit}
          scroll={{ x: 1700 }}
          components={components}
          pagination={false}
        />
        <BasicTablePaging handlePaginations={handleChangePage} skip={dataFilter.skip} count={dataUser.data.length < dataFilter.limit}></BasicTablePaging>
      </div>
    </div>
    }
    </Fragment>
  )
}

export default ListUser