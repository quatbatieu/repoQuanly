import React, { useState, useRef, useLayoutEffect, useEffect, useMemo } from 'react';
import ReactToPrint from 'react-to-print';
import { Modal, Button, Table, Typography, Space, notification, Input, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import "./modalPrint.scss";
import AppUserWorkingHistoryService from 'services/AppUserWorkingHistoryService';
import ManagementService from 'services/manageService';
import moment from 'moment';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import html2canvas from 'html2canvas';
import { PlusOutlined } from '@ant-design/icons';
import html2pdf from "html2pdf.js";
import { LIST_TYPE_PRINT } from './EmployeePositionMapping';
const NUMBER_DOC = 20;
const HEIGHT_A4 = 1122;

const TableCalculation = ({ dataUser, date, isLoading, isDataPrint, setIsDataPrint, setDataPrint }) => {
  const { t: translation } = useTranslation();
  const setting = useSelector(state => state.setting);
  const rowRefs = useRef([]);
  const refTbody = useRef(null);
  const refTheader = useRef(null);
  const refTFooter = useRef(null);
  useEffect(() => {
    if (refTbody.current && !isLoading && refTheader.current && refTFooter.current) {
      let totalHeight = 0;
      let linesInCurrentPage = 0;
      const maxPageHeight = 500;
      let currentPageIndex = 1;
      let pages = [];
      let currentPage = [];

      const heightFooter = refTFooter.current.offsetHeight;
      const heightHeader = refTheader.current.offsetHeight;
      let heightBody = HEIGHT_A4 - heightFooter - heightHeader - 32;

      dataUser.data.forEach((item, index) => {
        const rowHeight = rowRefs.current[index]?.offsetHeight || 0;
        if (totalHeight + rowHeight <= heightBody) {
          totalHeight += rowHeight;
          currentPage.push(item);
        } else {
          pages.push(currentPage);
          currentPage = [item];
          totalHeight = rowHeight;

          currentPageIndex += 1;
          if (currentPageIndex > 1) {
            heightBody = HEIGHT_A4 - heightFooter - 32;
          }
        }
      });
      if (currentPage.length) {
        pages.push(currentPage);
      }

      const convertData = pages.map((item) => {
        return item.map((Iitem, Iindex) => ({
          "stt": 0,
          "username": ``,
          "appUserWorkStep": ``,
          "appUserPosition": ``,
          "signature": ``,
          "note": ``,
          stt: Iindex + 1,
          ...Iitem
        }))
      })
      setDataPrint(convertData);
      setIsDataPrint(true)
    }

  }, [dataUser.data, refTbody.current, isLoading, refTheader.current, refTFooter.current]);

  return (
    <div>
      <div>
        <div className="print-page">
          <Space direction="vertical" size="large" className="print-content w-100 modalPrint" style={{ height: 1100, padding: 16 }} >
            <div style={{ height: "auto" }} ref={refTheader}>
              <Typography.Title level={5} className='text-center mb-1'>{translation('management.print.centerTitle', {
                stationCode: setting.stationCode
              })}</Typography.Title>
              <Typography.Title level={3} className='text-center mt-0'>{translation('management.print.assignmentTitle')}</Typography.Title>
              <Typography.Text className='mb-0'>
                {translation('management.print.currentDate', { date: date ? moment(date).format('DD/MM/YYYY') : moment().format('DD/MM/YYYY') })}
              </Typography.Text>
            </div>
            <div>
              <table border="1" className='w-100'>
                <thead>
                  <tr>
                    <th style={{ textAlign: "center" }}>{translation('management.print.stt')}</th>
                    <th style={{ textAlign: "center" }}>{translation('management.print.name')}</th>
                    <th style={{ textAlign: "center" }}>{translation('management.print.task')}</th>
                    <th style={{ textAlign: "center" }}>{translation('management.print.position')}</th>
                    <th style={{ textAlign: "center" }}>{translation('management.print.signature')}</th>
                    <th style={{ textAlign: "center" }}>{translation('management.print.note')}</th>
                  </tr>
                </thead>
                <tbody ref={refTbody}>
                  {dataUser.data.map((item, index) => (
                    <tr key={item.stt} ref={el => rowRefs.current[index] = el}>
                      <td style={{ textAlign: "center" }}>{index + 1}</td>
                      <td style={{ textAlign: "left" }}>{item.firstName || "-"}</td>
                      <td style={{ width: 210, textAlign: "left" }}>
                        {
                          item.appUserWorkStep ?
                            item.appUserWorkStep
                            : "-"
                        }
                      </td>
                      <td style={{ width: 130, textAlign: "left" }}>{item.appUserPosition || "-"}</td>
                      <td style={{ width: 120, textAlign: "left" }}>{item.signature}</td>
                      <td style={{ width: 100, textAlign: "left" }}>{item.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className='d-flex flex-column align-items-end' ref={refTFooter}>
              <Typography.Title level={5} style={{ marginBottom: 180 }}>
                <div className='d-flex flex-column align-items-center'>{translation('management.print.unitLeaderOrLineManager')}</div>
                <i className='d-flex flex-column align-items-center' style={{ fontWeight: 400 }}>{translation('management.print.signAndFullName')}</i>
              </Typography.Title>
            </div>
          </Space>
        </div>
      </div>
    </div>
  )
}

const ModalPrint = ({ isVisible, onCancel, id, TypePrint }) => {
  const { t: translation } = useTranslation();
  const setting = useSelector(state => state.setting);
  const [numberDoc, setNumberDoc] = useState(NUMBER_DOC);
  const [value, setValue] = useState(NUMBER_DOC);
  const [isCreate, setIsCreate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const [date, setDate] = useState(null);
  const [dataUser, setDataUser] = useState({
    total: 0,
    data: []
  })
  const printRef = useRef(null);
  const [isDataPrint, setIsDataPrint] = useState(false);
  const [dataPrint, setDataPrint] = useState([]);

  function fetchData(skip = 0) {
    setIsLoading(true);
    if (id) {
      AppUserWorkingHistoryService.getDetailWorkingHistory({
        id,
      }).then((res) => {
        if (res) {
          setDate(res.createdAt)
          setDataUser({
            total: res.workingRecords?.length || 0,
            data: res.workingRecords.filter(employee => employee.username !== `${setting.stationCode}admin`)
          });
        }
        setIsLoading(false);
      })
      return;
    }

    ManagementService.getListUser({
      "skip": skip,
      "limit": numberDoc,
    }).then(result => {
      if (result) {
        const combinedData = {
          total: dataUser.total + result.total,
          data: [...dataUser.data, ...result.data]
        };

        setDataUser(prev => ({
          total: prev.total + result.total,
          data: [...prev.data, ...result.data.filter(employee => employee.username !== `${setting.stationCode}admin`)]
        }));
        if (combinedData.total > (skip + NUMBER_DOC)) {
          fetchData(skip + NUMBER_DOC);
          return;
        }
        setIsLoading(false);
      } else {
        notification.error({
          message: '',
          description: translation('new.fetchDataFailed')
        })
      }
    })
  }

  function exportToPDF() {
    const opt = {
      margin: 1,
      filename: 'myfile.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 4 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(printRef.current).set(opt).save();
  }

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleInputChange = _.debounce((value) => {
    setIsLoading(false);
    if (value === '' || value < 0 || !Number.isInteger(Number(value))) {
      setValue(0)
      setNumberDoc(0);
    } else {
      setNumberDoc(Number(value));
      setValue(Number(value))
    }
  }, 1000);

  const handlecreateAssignmentTicket = () => {
    setIsLoadingCreate(true)
    AppUserWorkingHistoryService.createAppUserWorkingHistory({}).then((res) => {
      if (res.isSuccess) {
        setIsCreate(true);
        notification.success({
          message: '',
          description: translation('management.print.assignmentSuccess')
        });
        setIsLoadingCreate(false)
      } else {
        setIsLoadingCreate(false)
        notification.success({
          message: '',
          description: translation('management.print.assignmentSuccess')
        });
      }
    })
  }

  let titleModal = translation('management.print.createAssignment');

  if (TypePrint === LIST_TYPE_PRINT.EXPORT_FILE) {
    titleModal = translation('management.print.employeeAssignmentBook');
  }

  if (TypePrint === LIST_TYPE_PRINT.VIEW_DETAILS) {
    titleModal = translation('management.print.titleSeeDetails');
  }

  if (TypePrint === LIST_TYPE_PRINT.PRINT_SLIP) {
    titleModal = translation('management.print.printAssignment');
  }

  return (
    <div className="app-container" >
      <Modal
        title={titleModal}
        visible={isVisible}
        className="fixedWidthModal"
        width={835}
        centered
        onCancel={onCancel}
        footer={<div className='d-flex align-items-center justify-content-end'>
          <Button key="cancel" onClick={onCancel}>
            {translation('cancel')}
          </Button>
          <>
            <>
              {!isCreate && TypePrint !== (LIST_TYPE_PRINT.VIEW_DETAILS) && TypePrint !== LIST_TYPE_PRINT.PRINT_SLIP ? (
                <Button
                  icon={isLoadingCreate ? <Spin /> : <PlusOutlined />}
                  onClick={handlecreateAssignmentTicket}
                  type="primary"
                  className='d-inline-flex align-items-center'
                >{translation('management.createAssignmentTicket')}
                </Button>
              ) : (
                <>
                  {/* <ReactToPrint
											trigger={() => (
												<Button key="employeeAssignmentBook" onClick={exportToPDF} type="primary">
													{translation('management.print.export')}
												</Button>
											)}
											content={() => printRef.current}
										>
										</ReactToPrint> */}
                  <ReactToPrint
                    trigger={() => (
                      <Button key="print" type="primary">
                        {translation('management.print.printAssignment')}
                      </Button>
                    )}
                    content={() => printRef.current}
                    pageStyle={"@page {size: A4}"}
                  >
                  </ReactToPrint>
                </>
              )}
            </>
          </>
        </div>}
      >
        {isLoading ? (
          <Spin />
        ) : (
          <>
            {isDataPrint ? (
              <div>
                <div ref={printRef}>
                  {dataPrint.map((itemData, index) => (
                    <div className="print-page">
                      <Space direction="vertical" size="large" className="print-content w-100 modalPrint" style={{ height: '100%', padding: 16 }} >
                        {index === 0 && (
                          <div style={{ height: "auto" }}>
                            <Typography.Title level={4} className='text-center mb-0'>{translation('management.print.Title')}</Typography.Title>
                            <Typography.Title level={5} className='text-center mt-0'>{translation('management.print.centerTitle', {
                              stationCode: setting.stationCode
                            })}</Typography.Title>
                            <Typography.Title level={4} className='text-center mt-1 mb-0'>{translation('management.print.assignmentTitle')}</Typography.Title>
                            <Typography.Title level={4} className='text-center mt-0'>{translation('management.print.assignmentTitle2')}</Typography.Title>
                            <div className='text-center mt-0'>
                              {translation('management.print.currentMonth', { month: date ? moment(date).format('MM') : moment().format('MM') })} {translation('management.print.currentYear', { year: date ? moment(date).format('YYYY') : moment().format('YYYY') })}
                            </div>
                          </div>
                        )}
                        <table border="1" className='w-100'>
                          <thead>
                            <tr>
                              <th rowspan='2' style={{ textAlign: "center" }}>{translation('management.print.stt')}</th>
                              <th rowspan='2' style={{ textAlign: "center" }}>{translation('management.print.name')}</th>
                              <th rowspan='2' style={{ textAlign: "center" }}>{translation('management.print.task')}</th>
                              <th colspan="4" style={{ textAlign: "center" }}>{translation('management.print.position')}</th>
                              <th rowspan='2' style={{ textAlign: "center" }}>{translation('management.print.signature')}</th>
                              <th rowspan='2' style={{ textAlign: "center"  }}>{translation('management.print.note')}</th>
                            </tr>
                            <tr>
                              <th style={{ textAlign: "center"  }}>1</th>
                              <th style={{ textAlign: "center"  }}>2</th>
                              <th style={{ textAlign: "center"  }}>3</th>
                              <th style={{ textAlign: "center"  }}>4</th>
                            </tr>
                          </thead>
                          <tbody>
                            {itemData.map(item => (
                              <tr key={item.stt}>
                                <td style={{ textAlign: "center" }}>{item.stt}</td>
                                <td style={{ width: 150, textAlign: "left" }}>{item.firstName || "-"}</td>
                                <td style={{ width: 210, textAlign: "left" }}>
                                  {
                                    item.appUserWorkStep ?
                                      item.appUserWorkStep
                                      : "-"
                                  }
                                </td>
                                <td style={{ width: 60, textAlign: "center" }}>{(item?.appUserPosition == 'Dây chuyền số 1' || item?.appUserPosition == 'Dây chuyền 1') ? 'X' : '' }</td>
                                <td style={{ width: 60, textAlign: "center" }}>{(item?.appUserPosition == 'Dây chuyền số 2' || item?.appUserPosition == 'Dây chuyền 2') ? 'X' : '' }</td>
                                <td style={{ width: 60, textAlign: "center" }}>{(item?.appUserPosition == 'Dây chuyền số 3' || item?.appUserPosition == 'Dây chuyền 3') ? 'X' : '' }</td>
                                <td style={{ width: 60, textAlign: "center" }}>{(item?.appUserPosition == 'Dây chuyền số 4' || item?.appUserPosition == 'Dây chuyền 4') ? 'X' : '' }</td>
                                <td style={{ width: 80, textAlign: "left" }}>{item.signature}</td>
                                <td style={{ width: 100, textAlign: "left" }}>{item.note}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className='d-flex flex-column align-items-end'>
                          <Typography.Title level={5} style={{ marginBottom: 150 }}>
                            <div className='d-flex flex-column align-items-center'>{translation('management.print.unitLeaderOrLineManager')}</div>
                            <i className='d-flex flex-column align-items-center' style={{ fontWeight: 400 }}>{translation('management.print.signAndFullName')}</i>
                          </Typography.Title>
                          <div className='mt-0 first'>
                            <div>Chú ý:</div>
                            <div className='mb-1'>{translation('management.print.note1')}</div>
                            <div className='mb-1'>{translation('management.print.note2')}</div>
                            <div className='mb-1'>{translation('management.print.note3')}</div>
                            <div className='mb-1'>{translation('management.print.note4')}</div>
                          </div>
                        </div>
                      </Space>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <TableCalculation
                dataUser={dataUser}
                date={date}
                isLoading={isLoading}
                isDataPrint={isDataPrint}
                setIsDataPrint={setIsDataPrint}
                setDataPrint={setDataPrint}
              />
            )}
          </>
        )
        }
      </Modal>
    </div>
  );
};

export default ModalPrint;
