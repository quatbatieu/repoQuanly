import React, { useState, useEffect, useMemo, useRef, Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, DatePicker, Space, Modal, Form, InputNumber, notification, Table, Spin } from 'antd'
import moment from 'moment'
import AccreditationTabs from 'components/AccreditationTabs'
import { ArrowDownOutlined, ArrowUpOutlined, ExportOutlined, ImportOutlined } from '@ant-design/icons'
import BarChart from "Page/Charts/BarChartStatistical"
import _ from 'lodash';
import { ExportFile } from 'hooks/FileHandler'
import { DATE_DISPLAY_FORMAT } from 'constants/dateFormats'
import ModalProgress from 'Page/Schedule/ModalProgress'
import { useSelector } from 'react-redux'
import StatisticalService from "../../services/statisticalService";
import "./statisticalAccreditation.scss";
import UnLock from 'components/UnLock/UnLock';
import { formatNumber } from 'helper/common'
import {
  ListAccreditationKey,
  ListEditAccreditationKey,
  CreateNewCustomerKey,
  AccreditationNotificationKey,
  InspectionProcessKey,
  AccreditationStatisticalKey,
  ListReportStaistic
} from 'constants/accreditationTabs';
import { useModalDirectLinkContext } from 'components/ModalDirectLink'
import { HOST } from 'constants/url'
import { NORMAL_COLUMN_WIDTH, EXTRA_BIG_COLUMND_WITDTH, VERY_BIG_COLUMN_WIDTH } from 'constants/app'

function StatisticalAccreditation(props) {
  const { history } = props
  const setting = useSelector((state) => state.setting);
  const { setUrlForModalDirectLink } = useModalDirectLinkContext();
  return (
    <>
      <AccreditationTabs
        onChangeTabs={(key) => {
          if (key === AccreditationNotificationKey) {
            if(setting.enableOperateMenu === 0){
              return null
            }
            setUrlForModalDirectLink("/accreditation-public")
          } else if (key === ListEditAccreditationKey) {
            history.push("/list-detail-accreditation", "_blank")
          } else if (key === InspectionProcessKey) {
            history.push('/inspection-process')
          } else if (key === ListAccreditationKey) {
            history.push('/accreditation')
          } else if (key === CreateNewCustomerKey) {
            history.push("/schedules?active=2")
          } else if (key === ListReportStaistic) {
            history.push("/list-report-accreditation")
          }
        }}
        activeKey={AccreditationStatisticalKey}
        AccreditationStatistical={() => (
          <main>
            <AccreditationStatistical history={history} />
          </main>
        )}
      />
    </>
  )
}

const dateFormat = 'MM/YYYY';

const FIELDS_EXPORT_IMPORT = [
  { api: 'index', content: 'Số TT' },
  { api: 'reportDay', content: 'Ngày *' },
  { api: 'totalCustomerChecking', content: 'Tổng khách hàng' },
  { api: 'totalCustomerCheckingCompleted', content: 'Đ.kiểm thành công *' },
  { api: 'totalCustomerCheckingFailed', content: 'Đăng kiểm thất bại *' },
  { api: 'totalCustomerCheckingCanceled', content: 'Hủy đăng ký *' }
];

const DefaultFilterExport = {
  limit: 100,
};

const AccreditationStatistical = (props) => {
  const { history } = props;
  const { onExportExcel, isLoading } = ExportFile();
  const { t: translation } = useTranslation()
  const [statisticalData, setStatisticalData] = useState({})
  const [isModalReport, setIsModalReport] = useState(false);
  const [filter, setFilter] = useState({
    startDate: moment().startOf('month').format("DD/MM/YYYY"),
    endDate: moment().startOf('month').add(1, 'months').format("DD/MM/YYYY"),
  });
  // Những Thứ dùng chung export và import
  const [isModalProgress, setisModalProgress] = useState(false);
  const [percent, setPercent] = useState(0);
  const [percentPlus, setPercentPlus] = useState(0);
  const setting = useSelector((state) => state.setting);
  // Những Thứ dùng chung Import
  const [arrImport, setArrImport] = useState([]);
  const [isImport, setIsImport] = useState(false);
  const [importSummary, setImportSummary] = useState({
    logs: [],
    numberError: 0,
    numberSuccess: 0
  });
  
  const SAMPLE_FILE_LINK = `${HOST}/uploads/exportExcel/file_mau_import_thong_ke_dang_kiem.xlsx`;
  const { setUrlForModalDirectLink } = useModalDirectLinkContext();

  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'name',
      width: NORMAL_COLUMN_WIDTH ,
      render: (_, __, index) => {
        return index + 1
      }
    },
    {
      title: translation("statisticalAccreditation.date"),
      dataIndex: 'reportDay',
      key: 'reportDay',
      width: EXTRA_BIG_COLUMND_WITDTH
    },
    {
      title: translation("statisticalAccreditation.totalCustomers"),
      dataIndex: 'totalCustomerChecking',
      key: 'totalCustomerChecking',
      width: EXTRA_BIG_COLUMND_WITDTH
    },
    {
      title: (
        <Space className='d-flex align-items-center'>
          <div className='statistical__box' style={{ background: "#6DBEBF" }}></div>
          <p className='mb-0'>{translation("statisticalAccreditation.successRegistration")}</p>
        </Space>
      ),
      dataIndex: 'totalCustomerCheckingCompleted',
      key: 'totalCustomerCheckingCompleted',
      width: EXTRA_BIG_COLUMND_WITDTH
    },
    {
      title: (
        <Space className='d-flex align-items-center'>
          <div className='statistical__box' style={{ background: "#EC6E85" }}></div>
          <p className='mb-0'>{translation("statisticalAccreditation.failedRegistration")}</p>
        </Space>
      ),
      dataIndex: 'totalCustomerCheckingFailed',
      key: 'totalCustomerCheckingFailed',
      width: EXTRA_BIG_COLUMND_WITDTH
    },
    {
      title: (
        <Space className='d-flex align-items-center'>
          <div className='statistical__box' style={{ background: "#CEA5EE" }}></div>
          <p className='mb-0'>{translation("statisticalAccreditation.cancelRegistration")}</p>
        </Space>
      ),
      dataIndex: 'totalCustomerCheckingCanceled',
      key: 'totalCustomerCheckingCanceled',
      // width: VERY_BIG_COLUMN_WIDTH
    }
  ];

  const barChartData = useMemo(() => {
    return statisticalData.data
  }, [statisticalData.data])

  const thisMonthVal = (() => {
    if (!statisticalData.customer) return
    if (!statisticalData.customer.data) return
    if (!statisticalData.customer.data.length === 0) return

    return statisticalData.customer.data[statisticalData.customer.data.length - 1]
  })();

  const roundUp2Digits = (num) => Math.round((num + Number.EPSILON) * 100) / 100

  const onFilterByDate = async (filter) => {
    const { startDate, endDate } = filter

    const result = await StatisticalService.getStatistical({
      startDate: startDate,
      endDate: endDate
    });

    if (result && !_.isEmpty(result)) {
      setStatisticalData(result);
    }
  };

  useEffect(() => {
    onFilterByDate(filter)
  }, [])

  const customFormat = (value) => {
    const strDate = `${value.format(dateFormat)}`;
    return strDate;
  };

  const fetchExportData = async (filter) => {
    const { startDate, endDate } = filter;
    for (let key in filter) {
      if (!filter[key]) {
        delete filter[key]
      }
    }

    const result = await StatisticalService.getStatistical({
      startDate: startDate,
      endDate: endDate
    });

    const data = await result.data;
    return data;
  }

  const handleExportExcel = async () => {
    const percentPlus = 100;
    setPercent(0);
    setisModalProgress(true);
    const result = await fetchExportData(filter);

    setPercent(100);
    const newResult = result.map((item, index) => ({
      ...item,
      index: index + 1
    }))
    
    await setTimeout(() => {
      // setUrlForModalDirectLink(SAMPLE_FILE_LINK)
      setisModalProgress(false);
      setPercent(0);
      onExportExcel({
        fieldApi: FIELDS_EXPORT_IMPORT.map((item) => item.api),
        fieldExport: FIELDS_EXPORT_IMPORT.map((item) => item.content),
        data: newResult,
        informationColumn: [
          ['Trung tâm đăng kiểm', "", "", "Danh sách Thống kê đăng kiểm"],
          ['Mã: Trung Tâm đăng kiểm xe cơ giới 123', "", "", `Danh sách Thống kê ngày ${moment().format("DD/MM/YYYY")}`],
          ['']
        ],
        timeWait: 0,
        nameFile: "Thongke.xlsx",
        setUrlForModalDirectLink : setUrlForModalDirectLink
      })
    }, 1000)
  }

  return (
    <Fragment>
      {setting.enableOperateMenu === 0 ? <UnLock /> :
      <div>
        <div className="row text-right">
          {/* <div className="col-12 col-md-12 col-lg-4">
            <label className="section-title pl-3">
              {translation("statisticalAccreditation.title")}
            </label>
          </div> */}
          {/* <div className="col-12 col-md-12 col-xl-2" /> */}
  
          <div className="col-md-4 col-lg-4 col-xl-3 mb-3 d-flex align-items-center mobie_text">
            <span>{translation("select-time")}</span>
            &nbsp;
            &nbsp;
            <DatePicker
              picker="month"
              style={{ flexGrow: 1 }}
              value={moment(filter.startDate, "DD/MM/YYYY")}
              onChange={(value, valueString) => {
                if (value) {
                  const startDate = value.startOf('month').format("DD/MM/YYYY");
                  const endDate = value.startOf('month').add(1, 'months').format("DD/MM/YYYY")
  
                  setFilter({
                    startDate,
                    endDate
                  })
                  onFilterByDate({
                    startDate,
                    endDate
                  })
                }
              }}
              allowClear={false}
              format={customFormat}
              monthCellRender={(date, _) => {
                return translation(date.format("MMMM"))
              }}
            />
          </div>
          <div className="col-md-4 col-lg-4 col-xl-4 mb-3">
            <Space style={{ flexWrap : 'nowrap', columnGap : 20}}>
              <Button
                type="primary"
                icon={<ExportOutlined />}
                onClick={() => handleExportExcel(filter)}
                className="d-flex align-items-center mr-1"
              >
                {translation("statisticalAccreditation.exportReport")}
              </Button>
              <Button
                type="primary"
                icon={<ImportOutlined />}
                onClick={() => setIsModalReport(filter)}
                className="d-flex align-items-center"
                ghost
              >
                {translation("statisticalAccreditation.importReport")}
              </Button>
            </Space>
          </div>
          {isModalReport &&
            <ModalReport isModalOpen={isModalReport} setIsModalOpen={setIsModalReport} onFetch={() => onFilterByDate(filter)} />
          }
        </div>
  
        <div className='row'>
          <div className='col-12 col-lg-12'>
            <div className='statistical__wrap d-xxl-flex justify-content-xxl-center'>
              {barChartData && <BarChart data={barChartData || []} />}
            </div>
            <Table
              rowClassName={(record) => `${record && record.customerRecordModifyDate ? 'edited-row editable-row' : 'editable-row'} ${record && record.isAdd ? "edited-row__add" : ""}`}
              dataSource={statisticalData.data}
              columns={columns}
              scroll={{ x: 1370 }}
              className="mt-5"
              pagination={false}
            />
          </div>
        </div>
        {isModalProgress && (
          <ModalProgress
            visible={isModalProgress}
            setVisible={setisModalProgress}
            percent={percent}
            logs={importSummary.logs}
            isLoading={arrImport.length !== 0}
            isImport={isImport}
            numberError={importSummary.numberError}
            numberSuccess={importSummary.numberSuccess}
          />
        )}
      </div>
     }
    </Fragment>
  )
}

const StatisticalItem = ({ title, count, icon, bg, percent }) => {
  return (
    <div className="statistical_accreditation" style={{ borderLeft: `10px solid ${bg}` }}>
      <div className='statistical_accreditation-content_up'>
        <div className="icon" style={{ background: bg }}>
          <img src={icon} alt={"icon"} />
        </div>
        <div className='title'>{title}</div>
      </div>
      <div className="statistical_accreditation-content_down">
        <div className='amount' style={{ color: bg }}>{formatNumber(count)}</div>
        {/* <div className="info">
          <span className="text">So với tháng trước</span>
          <span className={`percent-${percent.type === "GT" ? "up" : percent.type === "LT" ? "down" : ""} flex-center`}>
            {
              (percent.type === "GT") ? (
                <ArrowUpOutlined />
              ) : (
                <></>
              )
            }
            {
              percent.type === "LT" ? (
                <ArrowDownOutlined />
              ) : (
                <></>
              )
            }
            {Math.ceil(percent.count)}%
          </span>
        </div> */}
      </div>
    </div>
  );
};

const ModalReport = ({ isModalOpen, setIsModalOpen , onFetch}) => {
  const { t: translation } = useTranslation()
  const [form] = Form.useForm()
  const [selectedDate, setSelectedDate] = useState(moment());
  const [isLoading , setIsLoading] = useState(false);

  const handleOk = (values) => {
    StatisticalService.submitTodayReport({
      ...values ,
      reportDay : selectedDate.format(DATE_DISPLAY_FORMAT)
    }).then((result) => {
      if (!result.isSuccess) {
        notification['error']({
          message: "",
          description: translation('statisticalAccreditation.addFailed')
        })
        return;
      }
      setIsModalOpen(false);
      onFetch();
      form.resetFields();
    });
  }
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  }

  useEffect(() => {
    setIsLoading(true);
    StatisticalService.getStatistical({ 
      startDate : selectedDate.format(DATE_DISPLAY_FORMAT),
      endDate : selectedDate.format(DATE_DISPLAY_FORMAT)
    }).then((result) => {
      if(!result.data?.[0]) {
        form.resetFields();
      }else {
        form.setFieldsValue({...result.data[0]})
      }
      setIsLoading(false);
    });
  }, [selectedDate]);

  return (
    <Modal
      title={translation("statisticalAccreditation.importReport")}
      visible={isModalOpen}
      onOk={handleOk}
      onCancel={() => setIsModalOpen(false)}
      footer={
        <>
          <Button type="link" onClick={() => setIsModalOpen(false)}>
            {translation("booking.cancel")}
          </Button>
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            {translation("confirm")}
          </Button>
        </>
      }
    >
      <Form
        form={form}
        onFinish={handleOk}
        layout="vertical"
      >
        <div className="row">
          <div className="col-12 col-md-12">
            <Form.Item
              label={translation("statisticalAccreditation.dayReport")}
            >
              <DatePicker
                className="w-100"
                format="DD/MM/YYYY"
                value={selectedDate}
                onChange={handleDateChange}
                placeholder={translation('statisticalAccreditation.placeholder-dayReport')}
              />
            </Form.Item>
          </div>
          {isLoading ? <Spin /> : (
            <>
              <div className="col-12 col-md-12">
                <Form.Item
                  name="totalCustomerCheckingCompleted"
                  rules={[
                    {
                      required: true,
                      message: translation('accreditation.isRequire')
                    }
                  ]}
                  label={translation("statisticalAccreditation.stationSuccess")}
                >
                  <InputNumber autoFocus placeholder={`${translation('statisticalAccreditation.placeholder-inputNumber')}`} max={999} />
                </Form.Item>
              </div>
              <div className="col-12 col-md-12">
                <Form.Item
                  name="totalCustomerCheckingFailed"
                  rules={[
                    {
                      required: true,
                      message: translation('accreditation.isRequire')
                    }
                  ]}
                  label={translation("statisticalAccreditation.stationFailure")}
                >
                  <InputNumber placeholder={`${translation('statisticalAccreditation.placeholder-inputNumber')}`} max={999} />
                </Form.Item>
              </div>
              <div className="col-12 col-md-12">
                <Form.Item
                  name="totalCustomerCheckingCanceled"
                  rules={[
                    {
                      required: true,
                      message: translation('accreditation.isRequire')
                    }
                  ]}
                  label={translation("statisticalAccreditation.stationCancel")}
                >
                  <InputNumber placeholder={`${translation('statisticalAccreditation.placeholder-inputNumber')}`} max={999} />
                </Form.Item>
              </div>
            </>
          )}
        </div>
      </Form>
    </Modal>
  )
}

export default StatisticalAccreditation
