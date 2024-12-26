// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next'
import {
  Table,
  Input, DatePicker, Space, Select, Button, Popover, Popconfirm, notification,
} from 'antd';
import ReceiptionService from "../../services/receiptionService"
import "./receipt.scss"
import moment from 'moment';
import _ from 'lodash';
import { useHistory, useLocation } from 'react-router';
import { number_to_price } from 'helper/common';
import { getReceiptionContent, PAYMENT_METHOD } from './common';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { BUTTON_LOADING_TIME } from 'constants/time';
import { AnphaIcon } from "./../../assets/icons";
import { getPaymentStatusList } from 'constants/receipt';
import { ExportFile } from 'hooks/FileHandler';
import { useSelector } from 'react-redux';
import ModalProgress from 'Page/Schedule/ModalProgress';
import { PAYMENT_STATE } from 'constants/receipt';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import TagVehicle from 'components/TagVehicle/TagVehicle';
import { widthLicensePlate } from 'constants/licenseplates';
import { STATUS_COLOR } from 'constants/receipt';
import EditReceipt from './editReceipt';
import CreateReceipt from './createReceipt';
import { DATE_HOURS_SECONDS } from 'constants/dateFormats';
import { isMobileDevice } from 'constants/account';
import BasicTablePaging from 'components/BasicTablePaging/BasicTablePaging';
import { useModalDirectLinkContext } from 'components/ModalDirectLink';
import { MIN_COLUMN_WIDTH } from 'constants/app';
import { NORMAL_COLUMN_WIDTH } from 'constants/app';
import { BIG_COLUMN_WIDTH } from 'constants/app';
import { VERY_BIG_COLUMN_WIDTH } from 'constants/app';
import UnLock from 'components/UnLock/UnLock';

const DefaultFilterExport = {
  limit: 100,
};
const FEE = 3;
const EXTRA_FEE = 1000; // 1k

const SIZE = 20
const DEFAULT_FILTER = { filter: {}, skip: 0, limit: SIZE }
const ENABLE_PAYMENT_GATEWAY_WIDTH = 250;
const FIELDS_EXPORT_IMPORT = [
  { api: 'index', content: 'Số TT' },
  { api: 'customerReceiptAmount', content: 'Số tiền *' },
  { api: 'paymentMethod', content: 'Phương thức *' },
  { api: 'customerReceiptEmail', content: 'Email' },
  { api: 'customerReceiptContent', content: 'Nội dung thanh toán *' },
  { api: 'customerReceiptName', content: 'Tên khách hàng *' },
  { api: 'customerReceiptNote', content: 'Nội dung chi tiết *' },
  { api: 'customerReceiptPhone', content: 'Số điện thoại *' },
];

export const PaymentStatus = ({ status }) => {
  const { t: translation } = useTranslation()
  const statusList = getPaymentStatusList(translation);
  return (
    <div style={{ color: STATUS_COLOR[status] }}>
      {statusList[status]}
    </div>
  );
};

function ListReceipt() {
  const { t: translation } = useTranslation()
  const [dataReceipt, setDataReceipt] = useState({
    total: 0,
    data: []
  })
  const location = useLocation();
  const [dataFilter, setDataFilter] = useState(DEFAULT_FILTER)
  const { onExportExcel, isLoading } = ExportFile();
  const [loading, setLoading] = useState(false);
  const [isView, setIsView] = useState(false);
  const [isAdd , isSetAdd] = useState(false);
  const [item, setItem] = useState(false);
  const [percent, setPercent] = useState(0);
  const [isModalProgress, setisModalProgress] = useState(false);
  const { setUrlForModalDirectLink } = useModalDirectLinkContext();
  const setting = useSelector(state => state.setting)

  const history = useHistory()
  const LIST_STATUS = [
    {
      label: translation("receipt.payments"),
      value: undefined
    },
    {
      label: translation("receipt.New"),
      value: "New"
    },
    {
      label: translation("receipt.Pending"),
      value: "Pending"
    },
    {
      label: translation("receipt.failed"),
      value: "Failed"
    },
    {
      label: translation("receipt.success"),
      value: "Success"
    },
    {
      label: translation("receipt.Canceled"),
      value: "Canceled"
    }
  ]
  const customerReceiptId = location.state?.customerReceiptId;
  const user = useSelector(state => state.member)
  const fetchExportData = async (param, filter) => {
    for (let key in filter) {
      if (!filter[key]) {
        delete filter[key]
      }
    }

    const response = await ReceiptionService.getListReceiption({
      ...filter,
      limit: DefaultFilterExport.limit,
      skip: param * DefaultFilterExport.limit
    })

    const data = await response.data;
    return data;
  }

  function handleUpdateState(record) {
    ReceiptionService.updateReceiptById({id:record.customerReceiptId, data:{
      customerReceiptStatus: PAYMENT_STATE.FAILED
    }}).then(result => {
      if (result && result.isSuccess) {
        notification.success({
          message: "",
          description: translation('listCustomers.success', {
            type: translation('listCustomers.handle')
          })
        })
        handleFetchReceipt(dataFilter)
      } else {
        notification.error({
          message: "",
          description: translation('listCustomers.failed', {
            type: translation('listCustomers.handle')
          })
        })
      }
    })
  }

  function handleFetchReceipt(filter) {
    for (let key in filter) {
      if (!filter[key]) {
        delete filter[key]
      }
    }

    ReceiptionService.getListReceiption(filter).then(result => {
      if (result) {
        setDataReceipt({
          ...result
        })
        if(customerReceiptId) {
          showView({ customerReceiptId });
        }
      }
    })
  }

  useEffect(() => {
    if(isMobileDevice() === true){
      dataFilter.limit = 10
    }
    handleFetchReceipt(dataFilter)
  }, [])

  const handleChangePage = (pageNum) => {
    const newFilter = {
      ...dataFilter,
      skip : (pageNum -1) * dataFilter.limit
    }
    setDataFilter(newFilter)
    handleFetchReceipt(newFilter)
  }

  function handleUpdateReceipt(id, note) {
    ReceiptionService.updateReceiptById(id, {
      customerReceiptNote: note
    }).then(res => {
      if (res) {
        notification.success({
          message: "",
          description: translation("accreditation.updateSuccess")
        })
      }
    })
  }

  const contentPopover = (rowData) => (
    <Input
      autoFocus
      defaultValue={rowData.customerReceiptNote}
      onPressEnter={(e) => {
        let value = e.target.value;
        if (value) {
          handleUpdateReceipt(rowData.customerReceiptId, value)
        }
      }}
    />
  )

  const showView = (item) => {
    setItem(item);
    setIsView(true);
  };

  let columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'name',
      width: MIN_COLUMN_WIDTH,
      render: (_, __, index) => {
        return (
          <div className='d-flex justify-content-center aligns-items-center'>
            {dataFilter.skip ? dataFilter.skip + index + 1 : index + 1}
          </div>
        )
      },
    },
    {
      title: translation("receipt.customer"),
      key: 'customerReceiptName',
      dataIndex : 'customerReceiptName',
      // width: BIG_COLUMN_WIDTH,
      render: (_, record) => {
        const { customerReceiptName, customerReceiptPhone } = record;
        return (
          <>
            {customerReceiptName}<br />
            {customerReceiptPhone}
          </>
        );
      },
    },
    {
      title: translation('receipt.licensePlates'),
      dataIndex: 'customerVehicleIdentity',
      key: 'customerVehicleIdentity',
      width: widthLicensePlate,
      render: (value, values) => {
        const color = values?.schedule?.licensePlateColor ? values?.schedule?.licensePlateColor - 1 : 0;
        return (
          <TagVehicle color={color}>
            {value || values?.schedule?.licensePlates}
          </TagVehicle>
        )
      }
    },
    {
      title: translation("receipt.amount"),
      dataIndex: 'total',
      key: 'total',
      width: BIG_COLUMN_WIDTH,
      render: (total) => {
        return number_to_price(total) + " VNĐ";
      },
    },
    {
      title: translation("receipt.approveDate"),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: BIG_COLUMN_WIDTH,
      render: (createdAt) => {
        const date = moment(createdAt).format("DD/MM/YYYY");
        const time = moment(createdAt).format("HH:mm");
        return (
          <>
            {date}
            <br />
            {time}
          </>
        );
      },
    },
    {
      title: translation("receipt.status"),
      dataIndex: 'customerReceiptStatus',
      key: 'customerReceiptStatus',
      width: VERY_BIG_COLUMN_WIDTH,
      render: (customerReceiptStatus) => {
        return <PaymentStatus status={customerReceiptStatus} />;
      },
    },
    {
      title: translation("receipt.method"),
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: VERY_BIG_COLUMN_WIDTH,
      render: (paymentMethod) => {
        const value = PAYMENT_METHOD.find(el => el.value === paymentMethod)
        return <div>{value.label}</div>;
      },
    },
    {
      title: translation("receipt.enablePaymentGateway"),
      dataIndex: 'enablePaymentGateway',
      key: 'enablePaymentGateway',
      align: 'center',
      width: ENABLE_PAYMENT_GATEWAY_WIDTH,
      render: (value, rowData) => {
        return (
          <Space>
            {value ? (
              <CheckCircleOutlined style={{ color: "#00B300" }} /> // Hiển thị biểu tượng check nếu enablePaymentGateway là true
            ) : (
              <CloseCircleOutlined style={{ color: "red" }} /> // Hiển thị biểu tượng x nếu enablePaymentGateway là false
            )}
          </Space>
        );
      },
    },
    {
      title: translation("receipt.paymentDate"),
      dataIndex: 'paymentApproveDate',
      key: 'paymentApproveDate',
      width: BIG_COLUMN_WIDTH,
      render: (paymentApproveDate) => {
        if (paymentApproveDate) {
          const date = moment(paymentApproveDate).format("DD/MM/YYYY");
          const time = moment(paymentApproveDate).format(DATE_HOURS_SECONDS);
          return (
            <>
              {date}
              <br />
              {time}
            </>
          );
        } else {
          return "-";
        }
      }
    },
    {
      title: translation("receipt.action"),
      key: 'action',
      width: BIG_COLUMN_WIDTH,
      align: 'center',
      render: (_, rowData) => {
        const isUnConfimred = rowData.customerReceiptStatus === PAYMENT_STATE.NEW;

        return (
          <>
            <Button type="link" onClick={() => showView(rowData)}>
              {translation("receipt.view")}
            </Button>
            {isUnConfimred && (
              <Popconfirm
                title={translation("receipt.box-cancel")}
                onConfirm={() => {
                  handleUpdateState(rowData)
                }}
                okText={translation("category.yes")}
                cancelText={translation("category.no")}
              >
                <Button type="link">
                  {translation("receipt.cancel")}
                </Button>
              </Popconfirm>
            )}
            {/* <Popover
              placement="topRight"
              title={translation("receipt.type-content")}
              content={() => contentPopover(rowData)}
              trigger="click"
            >
              <Button type='link'>
                {translation("receipt.note")}
              </Button>
            </Popover> */}
          </>
        );
      },
    },
  ];

  const shouldDisplayPaymentGateway = !!user?.isSynchronization; // Kiểm tra điều kiện hiển thị cột enablePaymentGateway
  if (!shouldDisplayPaymentGateway) {
    columns = columns.filter((item) => item.key !== "enablePaymentGateway");
  }

  const onChangeSearchText = (e) => {
    setDataFilter(prev => ({
      ...prev,
      searchText: e?.target?.value,
      skip:0
    }))
  }

  const onSearch = (val) => {
    let newFilter = {
      ...dataFilter,
      searchText: val ? val : undefined,
      skip:0
    }
    setDataFilter(newFilter)
    handleFetchReceipt(newFilter)
  }

  const onFilterByStatus = (value) => {
    let newFilter = {
      ...dataFilter,
      filter: {
        ...dataFilter.filter,
        customerReceiptStatus: value ? value : undefined
      },
      skip: 0,
    }
    setDataFilter(newFilter)
    handleFetchReceipt(newFilter)
  }

  const onFilterByMethod = (value) => {
    let newFilter = {
      ...dataFilter,
      filter: {
        ...dataFilter.filter,
        paymentMethod: value ? value : undefined
      },
      skip: 0,
    }
    setDataFilter(newFilter)
    handleFetchReceipt(newFilter)
  }

  const onFilterByCreationDate = (date, dateString) => {
    const newFilter = {
      ...dataFilter,
      filter: {
        ...dataFilter.filter,
      },
      startDate: dateString ? dateString : undefined,
      endDate: dateString ? dateString : undefined,
      skip:0
    };

    setDataFilter(newFilter);
    handleFetchReceipt(newFilter);
  };

  const onFilterByPaymentDate = (date, dateString) => {
    const newFilter = {
      ...dataFilter,
      filter: {
        ...dataFilter.filter,
        paymentApproveDate: dateString ? dateString : undefined
      },
      skip:0
    };

    setDataFilter(newFilter);
    handleFetchReceipt(newFilter);
  };

  const handleExportExcel = async () => {
    let number = Math.ceil(dataReceipt.data.length / DefaultFilterExport.limit)
    let params = Array.from(Array.from(new Array(number)), (element, index) => index);
    let results = [];

    const percentPlus = 100 / params.length;
    setPercent(0);
    setisModalProgress(true);

    let _counter = 0;
    while (true) {
      const result = await fetchExportData(_counter++, dataFilter);
      if (result && result.length > 0) {
        setPercent(prev => prev + percentPlus);
        results = [...results, ...result];
      } else {
        break;
      }
    }

    const newResult = results.map((item, index) => ({
      ...item,
      index: index + 1,
    }))

    await setTimeout(() => {
      setisModalProgress(false);
      setPercent(0);
      onExportExcel({
        fieldApi: FIELDS_EXPORT_IMPORT.map((item) => item.api),
        fieldExport: FIELDS_EXPORT_IMPORT.map((item) => item.content),
        data: newResult,
        informationColumn: [
          ['Trung tâm đăng kiểm', "", "", "Danh sách hóa đơn"],
          [`Mã: Trung Tâm đăng kiểm xe cơ giới ${user?.stationCode || "123"}`, "", "", `Danh sách hóa đơn ngày ${moment().format("DD/MM/YYYY")}`],
          ['']
        ],
        timeWait: 0,
        nameFile: "data.xlsx",
        setUrlForModalDirectLink : setUrlForModalDirectLink
      })
    }, 1000)
  }

  return (
    <>
      {setting.enableInvoiceMenu === 0 ? <UnLock />:(
        <main className="receipt_container mt-0">
          {/* Search/Filter Section */}
          <div className='row d-flex justify-content-between'>
            <div className='col-12 col-md-12 col-lg-12 mb-3'>
              <Space size={24} className='receipt_container__box' wrap={true}>
                <div>
                  <Input.Search
                    autoFocus
                    placeholder={translation('listCustomers.search')}
                    onChange={onChangeSearchText}
                    onSearch={onSearch}
                    className="w-100"
                  />
                </div>
  
                <div>
                  <DatePicker
                    className="w-100"
                    format="DD/MM/YYYY"
                    onChange={onFilterByPaymentDate}
                    placeholder={translation('receipt.paymentDate')}
                  />
                </div>
  
                <div>
                  <DatePicker
                    className="w-100"
                    format="DD/MM/YYYY"
                    onChange={onFilterByCreationDate}
                    placeholder={translation('receipt.approveDate')}
                  />
                </div>
  
                <div>
                  <Select
                    className="w-100"
                    placeholder={translation('receipt.filterByStatus')}
                    style={{
                      minWidth: 150
                    }}
                    onChange={onFilterByStatus}
                  >
                    {LIST_STATUS.map(item => (
                      <Select.Option value={item.value} key={item.value}>
                        {translation(item.label)}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
  
                <div>
                  <Select
                    className="w-100"
                    placeholder={translation('receipt.methods')}
                    style={{
                      minWidth: 150
                    }}
                    onChange={onFilterByMethod}
                  >
                    {PAYMENT_METHOD.map(item => (
                      <Select.Option value={item.value} key={item.value}>
                        {translation(item.label)}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
  
                <div>
                  <Space size={25}>
                    <Button
                      onClick={handleExportExcel}
                      className="d-flex align-items-center gap-1"
                      icon={<AnphaIcon />}
                    >
                      {translation('listCustomers.export')}
                    </Button>
                    <Button
                      className="d-flex align-items-center justify-content-center"
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => isSetAdd(true)}
                    >
                      {translation('receipt.create-receipt')}
                    </Button>
                  </Space>
                </div>
              </Space>
            </div>
          </div>
  
          {/* Table Section */}
          <div className="receipt_container__body row">
            <Table
              dataSource={dataReceipt.data}
              columns={columns}
              // scroll={{ x: (shouldDisplayPaymentGateway ? 1700 + ENABLE_PAYMENT_GATEWAY_WIDTH : 1700) }}
              scroll={{ x: 1500 }}
              pagination={false}
            />
            <BasicTablePaging handlePaginations={handleChangePage} skip={dataFilter.skip || 0} count={dataReceipt?.data?.length < dataFilter.limit}></BasicTablePaging>
          </div>
          <ModalProgress visible={isModalProgress} setVisible={setisModalProgress} percent={percent} />
          {(isView && !!item) && (
            <EditReceipt
              isModalVisible={isView}
              item={item}
              onCancel={() => {
                if (customerReceiptId) {
                  history.push("/receipt" , {
                    customerReceiptId : null
                  })
                }
                setIsView(false)
              }}
              onFetchReceipt={() => handleFetchReceipt(dataFilter)}
            />
          )}
          {isAdd && (
            <CreateReceipt
              isModalVisible={isAdd}
              onCancel={() => isSetAdd(false)}
            />
          )}
        </main>
      )}
    </>
  )
}
export default ListReceipt;