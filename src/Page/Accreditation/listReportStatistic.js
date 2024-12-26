import React, { useState, useEffect, useRef, Fragment } from "react";
import { Col, DatePicker, Row, Spin, Button, Space, notification } from "antd";
import AccreditationTabs from "components/AccreditationTabs";
import { DATE_DISPLAY_FORMAT } from "constants/dateFormats";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import {
  AccreditationNotificationKey,
  AccreditationStatisticalKey,
  InspectionProcessKey,
  ListAccreditationKey,
  ListEditAccreditationKey,
  ListReportStaistic,
} from "../../constants/accreditationTabs";
import AccreditationService from "./../../services/accreditationService";
import "./style.scss";
import { AnphaIcon, VectorIcon } from "./../../assets/icons";
import * as XLSX from "xlsx";
import { convertFileToBase64 } from "../../helper/common";
import ModalUploads from "./ModalUploads";
import { useModalDirectLinkContext } from "components/ModalDirectLink";
import { XLSX_TYPE } from "constants/excelFileType";
import { number_to_price, formatNumberThapPhan } from "../../helper/common";
import { TYPE_VEHICLE_REPORT } from "../../constants/accreditationTabs";

const { RangePicker } = DatePicker;

const ListReportStatistic = () => {
  const history = useHistory();
  const { t: translation } = useTranslation();
  const [dataFilter, setDataFilter] = useState({
    // filter: {},
    startDate: moment().subtract(7, "day").format(DATE_DISPLAY_FORMAT),
    endDate: moment().format(DATE_DISPLAY_FORMAT),
    // skip: 0,
    // limit: 20,
    searchText: undefined,
  });
  const setting = useSelector((state) => state.setting);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isUploadFile, setIsUploadFile] = useState(false);
  const [fileSelected, setFileSelected] = useState(undefined);
  const { setUrlForModalDirectLink } = useModalDirectLinkContext();

  const toggleUploadModal = () => {
    setIsUploadFile((prev) => !prev);
  };

  const newDatas = {
    data: {
      list: [
        {
          fullFeeCount: 0,
          fullFeeAmount: 0,
          halfFeeCount: 0,
          halfFeeAmount: 0,
          noFeeCount: 0,
          firstInspectionPass: 0,
          firstInspectionFail: 0,
          secondInspectionPass: 0,
          secondInspectionFail: 0,
          temporaryKDVTCount: 0,
          temporaryKhKDVTCount: 0,
          oldCarFirstInspection: 0,
          oldCarSecondInspection: 0,
          numericalOrder: 1,
        },
        {
          fullFeeCount: 0,
          fullFeeAmount: 0,
          halfFeeCount: 0,
          halfFeeAmount: 0,
          noFeeCount: 0,
          firstInspectionPass: 0,
          firstInspectionFail: 0,
          secondInspectionPass: 0,
          secondInspectionFail: 0,
          temporaryKDVTCount: 0,
          temporaryKhKDVTCount: 0,
          oldCarFirstInspection: 0,
          oldCarSecondInspection: 0,
          numericalOrder: 2,
        },
        {
          fullFeeCount: 0,
          fullFeeAmount: 0,
          halfFeeCount: 0,
          halfFeeAmount: 0,
          noFeeCount: 0,
          firstInspectionPass: 0,
          firstInspectionFail: 0,
          secondInspectionPass: 0,
          secondInspectionFail: 0,
          temporaryKDVTCount: 0,
          temporaryKhKDVTCount: 0,
          oldCarFirstInspection: 0,
          oldCarSecondInspection: 0,
          numericalOrder: 3,
        },
        {
          fullFeeCount: 0,
          fullFeeAmount: 0,
          halfFeeCount: 0,
          halfFeeAmount: 0,
          noFeeCount: 0,
          firstInspectionPass: 0,
          firstInspectionFail: 0,
          secondInspectionPass: 0,
          secondInspectionFail: 0,
          temporaryKDVTCount: 0,
          temporaryKhKDVTCount: 0,
          oldCarFirstInspection: 0,
          oldCarSecondInspection: 0,
          numericalOrder: 4,
        },
        {
          fullFeeCount: 0,
          fullFeeAmount: 0,
          halfFeeCount: 0,
          halfFeeAmount: 0,
          noFeeCount: 0,
          firstInspectionPass: 0,
          firstInspectionFail: 0,
          secondInspectionPass: 0,
          secondInspectionFail: 0,
          temporaryKDVTCount: 0,
          temporaryKhKDVTCount: 0,
          oldCarFirstInspection: 0,
          oldCarSecondInspection: 0,
          numericalOrder: 5,
        },
        {
          fullFeeCount: 0,
          fullFeeAmount: 0,
          halfFeeCount: 0,
          halfFeeAmount: 0,
          noFeeCount: 0,
          firstInspectionPass: 0,
          firstInspectionFail: 0,
          secondInspectionPass: 0,
          secondInspectionFail: 0,
          temporaryKDVTCount: 0,
          temporaryKhKDVTCount: 0,
          oldCarFirstInspection: 0,
          oldCarSecondInspection: 0,
          numericalOrder: 6,
        },
        {
          fullFeeCount: 0,
          fullFeeAmount: 0,
          halfFeeCount: 0,
          halfFeeAmount: 0,
          noFeeCount: 0,
          firstInspectionPass: 0,
          firstInspectionFail: 0,
          secondInspectionPass: 0,
          secondInspectionFail: 0,
          temporaryKDVTCount: 0,
          temporaryKhKDVTCount: 0,
          oldCarFirstInspection: 0,
          oldCarSecondInspection: 0,
          numericalOrder: 7,
        },
        {
          fullFeeCount: 0,
          fullFeeAmount: 0,
          halfFeeCount: 0,
          halfFeeAmount: 0,
          noFeeCount: 0,
          firstInspectionPass: 0,
          firstInspectionFail: 0,
          secondInspectionPass: 0,
          secondInspectionFail: 0,
          temporaryKDVTCount: 0,
          temporaryKhKDVTCount: 0,
          oldCarFirstInspection: 0,
          oldCarSecondInspection: 0,
          numericalOrder: 8,
        },
        {
          fullFeeCount: 0,
          fullFeeAmount: 0,
          halfFeeCount: 0,
          halfFeeAmount: 0,
          noFeeCount: 0,
          firstInspectionPass: 0,
          firstInspectionFail: 0,
          secondInspectionPass: 0,
          secondInspectionFail: 0,
          temporaryKDVTCount: 0,
          temporaryKhKDVTCount: 0,
          oldCarFirstInspection: 0,
          oldCarSecondInspection: 0,
          numericalOrder: 9,
        },
        {
          fullFeeCount: 0,
          fullFeeAmount: 0,
          halfFeeCount: 0,
          halfFeeAmount: 0,
          noFeeCount: 0,
          firstInspectionPass: 0,
          firstInspectionFail: 0,
          secondInspectionPass: 0,
          secondInspectionFail: 0,
          temporaryKDVTCount: 0,
          temporaryKhKDVTCount: 0,
          oldCarFirstInspection: 0,
          oldCarSecondInspection: 0,
          numericalOrder: 10,
        },
        {
          fullFeeCount: 0,
          fullFeeAmount: 0,
          halfFeeCount: 0,
          halfFeeAmount: 0,
          noFeeCount: 0,
          firstInspectionPass: 0,
          firstInspectionFail: 0,
          secondInspectionPass: 0,
          secondInspectionFail: 0,
          temporaryKDVTCount: 0,
          temporaryKhKDVTCount: 0,
          oldCarFirstInspection: 0,
          oldCarSecondInspection: 0,
          numericalOrder: 11,
        },
      ],
      sum: {
        sumFullFeeCount: 0,
        sumFullFeeAmount: 0,
        sumHalfFeeCount: 0,
        sumHalfFeeAmount: 0,
        sumNoFeeCount: 0,
        sumFirstInspectionPass: 0,
        sumFirstInspectionFail: 0,
        sumSecondInspectionPass: 0,
        sumSecondInspectionFail: 0,
        sumTemporaryKDVTCount: 0,
        sumTemporaryKhKDVTCount: 0,
        sumOldCarFirstInspection: 0,
        sumOldCarSecondInspection: 0,
        sumTotalPassCount: 0,
        sumTotalFailCount: 0,
        sumTotalVehicleInspected: 0,
        sumTotalInspectedAmount: 0,
        sumTotalFeeGCN: 0,
        sumTotalRevenue: 0,
        sumTemporaryPassCount: 0,
        sumOldCarSecondInspectionFailCount: 0,
        sumVehicleFirstInspectionCount: 0,
        sumVehicleFirstInspectionFailCount: 0,
        sumVehicleFailRate: 0,
        sumOldVehicleFirstInspectionCount: 0,
        sumOldVehicleFirstInspectionFailCount: 0,
        sumOldVehicleFailRate: 0,
        sumIdentificationFailCount: 0,
        sumFrameSeatBodyFailCount: 0,
        sumEngineFailCount: 0,
        sumPowerTransmissionSystemFailCount: 0,
        sumBrakeSystemFailCount: 0,
        sumDriveSystemFailCount: 0,
        sumSuspensionSystemFailCount: 0,
        sumTiresFailCount: 0,
        sumPowerSystemFailCount: 0,
        sumExhaustFailCount: 0,
        sumNoiseFailCount: 0,
        sumOtherSystemsFailCount: 0,
        rateIdentificationFailCount: 0,
        rateFrameSeatBodyFailCount: 0,
        rateEngineFailCount: 0,
        ratePowerTransmissionSystemFailCount: 0,
        rateBrakeSystemFailCount: 0,
        rateDriveSystemFailCount: 0,
        rateSuspensionSystemFailCount: 0,
        rateTiresFailCount: 0,
        ratePowerSystemFailCount: 0,
        rateExhaustFailCount: 0,
        rateNoiseFailCount: 0,
        rateOtherSystemsFailCount: 0,
      },
    },
    total: 0,
  };

  const onUploadFile = (e) => {
    const file = e.target.files[0] || undefined;
    if (file && file.type && !XLSX_TYPE.includes(file.type)) {
      notification["warn"]({
        message: "",
        description: translation("listCustomers.wrongfile"),
      });
    } else {
      convertFileToBase64(file).then((dataUrl) => {
        const newData = dataUrl.replace(/,/gi, "").split("base64");
        if (newData[1]) {
          const data = {
            file: newData[1],
            fileFormat: "xlsx",
          };
          setFileSelected({
            name: file.name,
            data: data,
          });
        }
      });
    }
  };

  const onImportFileToDb = () => {
    if (!fileSelected) {
      notification["warn"]({
        message: "",
        description: translation("listCustomers.wrongfile"),
      });
      return;
    }
    AccreditationService.importDataReport({
      file: fileSelected?.data?.file,
      fileFormat: fileSelected?.data?.fileFormat,
      reportDay: Number(moment().format("YYYYMMDD")),
    }).then((result) => {
      if (result && Object.keys(result).length > 0) {
        getData(dataFilter);
        setFileSelected(undefined);
        setIsUploadFile(false);
        notification["success"]({
          message: "",
          description: translation("importReportSucc"),
        });
      } else {
        notification["error"]({
          message: "",
          description: translation("importReportFail"),
        });
      }
    });
  };

  function getData(filter) {
    setLoading(true);
    AccreditationService.getReports(filter).then((result) => {
      const { statusCode, data } = result;
      if (statusCode === 200) {
        if (data.data.list.length === 0) {
          setData(newDatas);
          return;
        }
        setData(data);
      } else {
        setData(newDatas);
      }
    });
    setLoading(false);
  }

  const onChooseDate = (dates, dateStrings) => {
    if (dateStrings[0].length === 0) {
      return null;
    }
    const isDateStrings = dateStrings && dateStrings.length === 2;
    const filter = {
      ...dataFilter,
      // filter: { ...dataFilter.filter },
      startDate: isDateStrings ? dateStrings[0] : "",
      endDate: isDateStrings ? dateStrings[1] : "",
      // skip: 0,
    };
    setDataFilter(filter);
    getData(filter);
  };

  useEffect(() => {
    getData(dataFilter);
  }, []);

  if (loading) {
    return (
      <div className="flex-center loading">
        <Spin />
      </div>
    );
  }

  const onExportExcel = () => {
    let Heading = [
      [translation("accreditation.report")],
      [translation("accreditation.report_inspection")],
    ];

    const sumData = [
      [
        translation("accreditation.Total_passes_standards"),
        data?.data?.sum?.sumTotalPassCount,
        "",
        translation("totalInspection"),
        data?.data?.sum?.sumTotalInspectedAmount,
        "",
        translation("accreditation.luotPT"),
        data?.data?.sum?.sumTemporaryPassCount,
      ],
      [
        translation("accreditation.Total_not_passes_standards"),
        data?.data?.sum?.sumTotalFailCount,
        "",
        translation("accreditation.Total_fee_issuance"),
        data?.data?.sum?.sumTotalFeeGCN,
        "",
        translation("accreditation.Number_of_used"),
        data?.data?.sum?.sumOldCarSecondInspectionFailCount,
      ],
      [
        translation("accreditation.Total_number_tested"),
        data?.data?.sum?.sumTotalVehicleInspected,
        "",
        translation("accreditation.Total_proceeds"),
        data?.data?.sum?.sumTotalRevenue,
      ],
      [""],
      ["", "", translation("accreditation.statistical_vehicle")],
      [""],
      [
        translation("accreditation.Number_of_tested"),
        data?.data?.sum?.sumVehicleFirstInspectionCount,
        "",
        translation("accreditation.Number_of_used_first_time"),
        data?.data?.sum?.sumOldVehicleFirstInspectionCount,
        "",
      ],
      [
        translation("accreditation.Number_of_used_not_meet"),
        data?.data?.sum?.sumVehicleFirstInspectionFailCount,
        "",
        translation("accreditation.Number_of_used_cars_not_meet"),
        data?.data?.sum?.sumOldVehicleFirstInspectionFailCount,
      ],
      [
        translation("accreditation.Overall_failure_rate"),
        data?.data?.sum?.sumVehicleFailRate,
        "",
        translation("accreditation.Failure_rate_of_used_cars"),
        data?.data?.sum?.sumOldVehicleFailRate,
      ],
    ];

    const newValue = {
      STT: "",
      fullFeeCount: data?.data?.sum?.sumFullFeeCount,
      fullFeeAmount: data?.data?.sum?.sumFullFeeAmount,
      halfFeeCount: data?.data?.sum?.sumHalfFeeCount,
      halfFeeAmount: data?.data?.sum?.sumHalfFeeAmount,
      noFeeCount: data?.data?.sum?.sumNoFeeCount,
      firstInspectionPass: data?.data?.sum?.sumFirstInspectionPass,
      firstInspectionFail: data?.data?.sum?.sumFirstInspectionFail,
      secondInspectionPass: data?.data?.sum?.sumSecondInspectionPass,
      secondInspectionFail: data?.data?.sum?.sumSecondInspectionFail,
      temporaryKDVTCount: data?.data?.sum?.sumTemporaryKDVTCount,
      temporaryKhKDVTCount: data?.data?.sum?.sumTemporaryKhKDVTCount,
      oldCarFirstInspection: data?.data?.sum?.sumOldCarFirstInspection,
      oldCarSecondInspection: data?.data?.sum?.sumOldCarSecondInspection,
      numericalOrder: "",
    };
    data.data.list.push(newValue);
    const convertedDataTableAccreditation = data?.data?.list?.map((col) => {
      let news = TYPE_VEHICLE_REPORT.filter(
        (el) => el.value === col.numericalOrder
      );
      return {
        STT: col.numericalOrder,
        "Phân nhóm phương tiện": news[0].label,
        "Thu 100% số lượt": col.fullFeeCount,
        "Thu 100% Giá KĐ": col.fullFeeAmount,
        "Thu 25% - 50% số lượt": col.halfFeeCount,
        "Thu 25% - 50% giá KĐ": col.halfFeeAmount,
        "Thu 0% số lượt": col.noFeeCount,
        "Kiểm định lần 1 đạt": col.firstInspectionPass,
        "Kiểm định lần 1 không đạt": col.firstInspectionFail,
        "Kiểm định lần 2 đạt": col.secondInspectionPass,
        "Kiểm định lần 2 không đạt": col.secondInspectionFail,
        "Tem kiểm định không đạt": col.temporaryKDVTCount,
        "Tem kiểm định không KDVT": col.temporaryKhKDVTCount,
        "Kiểm định ô tô cũ lần 1": col.oldCarFirstInspection,
        "Kiểm định ô tô cũ lần 2": col.oldCarSecondInspection,
      };
    });

    const newArr = [
      {
        Cum: translation("accreditation.Number_not_meet"),
        sumIdentificationFailCount: data?.data?.sum?.sumIdentificationFailCount,
        sumFrameSeatBodyFailCount: data?.data?.sum?.sumFrameSeatBodyFailCount,
        sumEngineFailCount: data?.data?.sum?.sumEngineFailCount,
        sumPowerTransmissionSystemFailCount:
          data?.data?.sum?.sumPowerTransmissionSystemFailCount,
        sumBrakeSystemFailCount: data?.data?.sum?.sumBrakeSystemFailCount,
        sumDriveSystemFailCount: data?.data?.sum?.sumDriveSystemFailCount,
        sumSuspensionSystemFailCount:
          data?.data?.sum?.sumSuspensionSystemFailCount,
        sumTiresFailCount: data?.data?.sum?.sumTiresFailCount,
        sumPowerSystemFailCount: data?.data?.sum?.sumPowerSystemFailCount,
        sumExhaustFailCount: data?.data?.sum?.sumExhaustFailCount,
        sumNoiseFailCount: data?.data?.sum?.sumNoiseFailCount,
        sumOtherSystemsFailCount: data?.data?.sum?.sumOtherSystemsFailCount,
      },
      {
        Cum: translation("accreditation.Ratio") + " %",
        sumIdentificationFailCount:
          data?.data?.sum?.rateIdentificationFailCount,
        sumFrameSeatBodyFailCount: data?.data?.sum?.rateFrameSeatBodyFailCount,
        sumEngineFailCount: data?.data?.sum?.rateEngineFailCount,
        sumPowerTransmissionSystemFailCount:
          data?.data?.sum?.ratePowerTransmissionSystemFailCount,
        sumBrakeSystemFailCount: data?.data?.sum?.rateBrakeSystemFailCount,
        sumDriveSystemFailCount: data?.data?.sum?.rateDriveSystemFailCount,
        sumSuspensionSystemFailCount:
          data?.data?.sum?.rateSuspensionSystemFailCount,
        sumTiresFailCount: data?.data?.sum?.rateTiresFailCount,
        sumPowerSystemFailCount: data?.data?.sum?.ratePowerSystemFailCount,
        sumExhaustFailCount: data?.data?.sum?.rateExhaustFailCount,
        sumNoiseFailCount: data?.data?.sum?.rateNoiseFailCount,
        sumOtherSystemsFailCount: data?.data?.sum?.rateOtherSystemsFailCount,
      },
    ];

    const convertedDataTableVehicle = newArr.map((col) => {
      return {
        "Cụm, hệ thống": col.Cum,
        "Nhận dạng": col.sumIdentificationFailCount,
        "Khung, Ghế thân vỏ": col.sumFrameSeatBodyFailCount,
        "Đ.Cơ & HT liên quan": col.sumEngineFailCount,
        "Hệ thống truyền lực": col.sumPowerTransmissionSystemFailCount,
        "Hệ thống phanh": col.sumBrakeSystemFailCount,
        "Hệ thống lái": col.sumDriveSystemFailCount,
        "Hệ thống treo": col.sumSuspensionSystemFailCount,
        "Bánh lốp": col.sumTiresFailCount,
        "Hệ thống điện, đèn": col.sumPowerSystemFailCount,
        "Khí xả": col.sumExhaustFailCount,
        "Tiếng Ồn": col.sumNoiseFailCount,
        "Các cụm, HT khác": col.sumOtherSystemsFailCount,
      };
    });

    let wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet([]);

    // thêm header excel
    XLSX.utils.sheet_add_aoa(ws, Heading);

    let currentRow = 4;

    // bắt đầu từ hàng thứ 2, render ra bảng
    XLSX.utils.sheet_add_json(ws, convertedDataTableAccreditation, {
      origin: `A${currentRow}`,
      // skipHeader: true,
    });

    currentRow += convertedDataTableAccreditation.length + 2;

    XLSX.utils.sheet_add_aoa(ws, sumData, {
      origin: `A${currentRow}`,
    });

    currentRow += 10;

    XLSX.utils.sheet_add_json(ws, convertedDataTableVehicle, {
      origin: `A${currentRow}`,
      skipHeader: false,
    });

    XLSX.utils.book_append_sheet(wb, ws, "Sheet");
    XLSX.writeFile(wb, "Tram.xlsx");
  };

  return (
    <>
      <AccreditationTabs
        onChangeTabs={(key) => {
          if (key === AccreditationNotificationKey) {
            if (setting.enableOperateMenu === 0) {
              return null;
            }
            setUrlForModalDirectLink("/accreditation-public");
          } else if (key === ListEditAccreditationKey) {
            history.push("/list-detail-accreditation", "_blank");
          } else if (key === InspectionProcessKey) {
            history.push("/inspection-process");
          } else if (key === ListAccreditationKey) {
            history.push("/accreditation");
          } else if (key === AccreditationStatisticalKey) {
            history.push("/statistical-accreditation");
          }
        }}
        ListAccreditation={null}
        activeKey={ListReportStaistic}
        ListEditAccreditation={null}
        InspectionProcess={null}
        CreateNewCustomer={null}
        AccreditationNotification={null}
        ListReportStatistic={() => (
          <div>
            <Fragment style={{ paddingLeft: "15px" }}>
              <Row className="gap-4">
                <Col xs={24} sm={12} md={12} lg={6} className="">
                  {/* <Space size={24}> */}
                    <RangePicker
                      className="w-100"
                      format="DD/MM/YYYY"
                      placeholder={[
                        translation("startDate"),
                        translation("endDate"),
                      ]}
                      onChange={onChooseDate}
                      defaultValue={[
                        moment(dataFilter.startDate, DATE_DISPLAY_FORMAT),
                        moment(dataFilter.endDate, DATE_DISPLAY_FORMAT),
                      ]}
                    />
                  {/* </Space> */}
                </Col>
                <Col xs={24} sm={12} md={12} lg={6}>
                  <Space size={24}>
                    <Button
                      onClick={() => onExportExcel()}
                      className="d-flex align-items-center gap-1 mobies"
                      icon={<AnphaIcon />}
                    >
                      {translation("listCustomers.export")}
                    </Button>
                    <Button
                      onClick={toggleUploadModal}
                      className="d-flex align-items-center gap-1"
                      icon={<VectorIcon />}
                    >
                      {translation("listCustomers.toreport")}
                    </Button>
                  </Space>
                </Col>
              </Row>
              <Fragment>
                <Row className="mt-1 mb-3">
                  <Col span={24}>
                    <div className="text-center text-uppercase h1">
                      {translation("report")}
                    </div>
                    <div className="text-center text-uppercase h1">
                      {translation("accreditation.report_inspection")}
                    </div>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col span={24}>
                    <div className="tables">
                      <table
                        id="excelData"
                        border="2"
                        width="1500px;"
                        height="500px"
                        align="center"
                      >
                        <tr>
                          <th rowspan="2" className="">
                            STT
                          </th>
                          <th rowspan="2">
                            {translation("accreditation.vehicle_grouping")}
                          </th>
                          <th colspan="2">
                            {translation("accreditation.registration_fee100")}
                          </th>
                          <th colspan="2">
                            {translation("accreditation.registration_fee25")}
                          </th>
                          <th>{translation("accreditation.collect0")}</th>
                          <th colspan="2">
                            {translation("accreditation.1st_inspection")}
                          </th>
                          <th colspan="2">
                            {translation("accreditation.2nd_inspection")}
                          </th>
                          <th colspan="2">
                            {translation("accreditation.inspection_stamps")}
                          </th>
                          <th colspan="2">
                            {translation("accreditation.car_inspection")}
                          </th>
                        </tr>
                        <tr>
                          <th>
                            {translation("accreditation.number_of_turns")}
                          </th>
                          <th>{translation("accreditation.priceKD")}</th>
                          <th>
                            {translation("accreditation.number_of_turns")}
                          </th>
                          <th>{translation("accreditation.priceKD")}</th>
                          <th>
                            {translation("accreditation.number_of_turns")}
                          </th>
                          <th>{translation("accreditation.obtain")}</th>
                          <th>{translation("accreditation.not_obtain")}</th>
                          <th>{translation("accreditation.obtain")}</th>
                          <th>{translation("accreditation.not_obtain")}</th>
                          <th>{translation("accreditation.not_obtain")}</th>
                          <th>{translation("accreditation.not_KDVT")}</th>
                          <th>{translation("accreditation.first_time")}</th>
                          <th>{translation("accreditation.second_time")}</th>
                        </tr>
                        {data?.data?.list?.map((item, i) => {
                          let news = TYPE_VEHICLE_REPORT.filter(
                            (el) => el.value === item.numericalOrder
                          );
                          return (
                            <tr key={i}>
                              <th>{item.numericalOrder}</th>
                              <th>{news[0].label}</th>
                              <th>{number_to_price(item.fullFeeCount)}</th>
                              <th>{number_to_price(item.fullFeeAmount)}</th>
                              <th>{number_to_price(item.halfFeeCount)}</th>
                              <th>{number_to_price(item.halfFeeAmount)}</th>
                              <th>{number_to_price(item.noFeeCount)}</th>
                              <th>{number_to_price(item.firstInspectionPass)}</th>
                              <th>{number_to_price(item.firstInspectionFail)}</th>
                              <th>{number_to_price(item.secondInspectionPass)}</th>
                              <th>{number_to_price(item.secondInspectionFail)}</th>
                              <th>{number_to_price(item.temporaryKDVTCount)}</th>
                              <th>{number_to_price(item.temporaryKhKDVTCount)}</th>
                              <th>{number_to_price(item.oldCarFirstInspection)}</th>
                              <th>{number_to_price(item.oldCarSecondInspection)}</th>
                            </tr>
                          );
                        })}
                        <tr>
                          <th colspan="2" className="thStyle">
                            {translation("accreditation.total_add")}
                          </th>
                          <th className="thStyle">
                            {number_to_price(data?.data?.sum?.sumFullFeeCount)}
                          </th>
                          <th className="thStyle">
                            {number_to_price(data?.data?.sum?.sumFullFeeAmount)}
                          </th>
                          <th className="thStyle">
                            {number_to_price(data?.data?.sum?.sumHalfFeeCount)}
                          </th>
                          <th className="thStyle">
                            {number_to_price(data?.data?.sum?.sumHalfFeeAmount)}
                          </th>
                          <th className="thStyle">
                            {number_to_price(data?.data?.sum?.sumNoFeeCount)}
                          </th>
                          <th className="thStyle">
                            {number_to_price(
                              data?.data?.sum?.sumFirstInspectionPass
                            )}
                          </th>
                          <th className="thStyle">
                            {number_to_price(
                              data?.data?.sum?.sumFirstInspectionFail
                            )}
                          </th>
                          <th className="thStyle">
                            {number_to_price(
                              data?.data?.sum?.sumSecondInspectionPass
                            )}
                          </th>
                          <th className="thStyle">
                            {number_to_price(
                              data?.data?.sum?.sumSecondInspectionFail
                            )}
                          </th>
                          <th className="thStyle">
                            {number_to_price(
                              data?.data?.sum?.sumTemporaryKDVTCount
                            )}
                          </th>
                          <th className="thStyle">
                            {number_to_price(
                              data?.data?.sum?.sumTemporaryKhKDVTCount
                            )}
                          </th>
                          <th className="thStyle">
                            {number_to_price(
                              data?.data?.sum?.sumOldCarFirstInspection
                            )}
                          </th>
                          <th className="thStyle">
                            {number_to_price(
                              data?.data?.sum?.sumOldCarSecondInspection
                            )}
                          </th>
                        </tr>
                      </table>
                    </div>
                  </Col>
                </Row>
                <Row className="tables-text mb-3">
                  <Col xs={24} sm={15} md={12} lg={8} className="mobie_style">
                    <div>
                      {translation("accreditation.Total_passes_standards")}{" "}
                      {number_to_price(data?.data?.sum?.sumTotalPassCount)}
                    </div>
                    <div>
                      {translation("accreditation.Total_not_passes_standards")}{" "}
                      {number_to_price(data?.data?.sum?.sumTotalFailCount)}
                    </div>
                    <div>
                      {translation("accreditation.Total_number_tested")}{" "}
                      {number_to_price(
                        data?.data?.sum?.sumTotalVehicleInspected
                      )}
                    </div>
                  </Col>
                  <Col xs={24} sm={15} md={12} lg={8} className="mobie_style">
                    <div>
                      {translation("totalInspection")}{" "}
                      {number_to_price(
                        data?.data?.sum?.sumTotalInspectedAmount
                      )}{" "}
                      ({translation("accreditation.copper")})
                    </div>
                    <div>
                      {translation("accreditation.Total_fee_issuance")}{" "}
                      {number_to_price(data?.data?.sum?.sumTotalFeeGCN)} (
                      {translation("accreditation.copper")})
                    </div>
                    <div>
                      {translation("accreditation.Total_proceeds")}{" "}
                      {number_to_price(data?.data?.sum?.sumTotalRevenue)} (
                      {translation("accreditation.copper")})
                    </div>
                  </Col>
                  <Col xs={24} sm={15} md={12} lg={8} className="mobie_style">
                    <div>
                      {translation("accreditation.Number_granted")}:{" "}
                      {number_to_price(data?.data?.sum?.sumTemporaryPassCount)}
                    </div>
                    <div>
                      {translation("accreditation.Number_of_used")}:{" "}
                      {number_to_price(
                        data?.data?.sum?.sumOldCarSecondInspectionFailCount
                      )}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <div className="text-center text-uppercase h4">
                      {translation("accreditation.statistical_vehicle")}
                    </div>
                  </Col>
                </Row>
                <Row className="tables-text mb-3">
                  <Col xs={24} sm={15} md={12} lg={8} className="mobie_style">
                    <div>
                      {translation("accreditation.Number_of_tested")}{" "}
                      {number_to_price(
                        data?.data?.sum?.sumVehicleFirstInspectionCount
                      )}
                    </div>
                    <div>
                      {translation("accreditation.Number_not_meet_standards")}{" "}
                      {number_to_price(
                        data?.data?.sum?.sumVehicleFirstInspectionFailCount
                      )}
                    </div>
                    <div>
                      {translation("accreditation.Overall_failure_rate")}{" "}
                      {number_to_price(data?.data?.sum?.sumVehicleFailRate)}%
                    </div>
                  </Col>
                  <Col xs={24} sm={15} md={12} lg={8} className="mobie_style">
                    <div>
                      {translation("accreditation.Number_of_used_first_time")}{" "}
                      {number_to_price(
                        data?.data?.sum?.sumOldVehicleFirstInspectionCount
                      )}
                    </div>
                    <div>
                      {translation(
                        "accreditation.Number_of_used_cars_not_standards"
                      )}{" "}
                      {number_to_price(
                        data?.data?.sum?.sumOldVehicleFirstInspectionFailCount
                      )}
                    </div>
                    <div>
                      {translation("accreditation.Failure_rate_of_used_cars")}{" "}
                      {number_to_price(data?.data?.sum?.sumOldVehicleFailRate)}%
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <div className="tables">
                      <table
                        border="1"
                        width="1500px"
                        height="100px"
                        align="center"
                        style={{ tableLayout: "fixed" }}
                      >
                        <colgroup>
                          <col style={{ width: "7.69%" }} />
                          <col style={{ width: "7.69%" }} />
                          <col style={{ width: "7.69%" }} />
                          <col style={{ width: "7.69%" }} />
                          <col style={{ width: "7.69%" }} />
                          <col style={{ width: "7.69%" }} />
                          <col style={{ width: "7.69%" }} />
                          <col style={{ width: "7.69%" }} />
                          <col style={{ width: "7.69%" }} />
                          <col style={{ width: "7.69%" }} />
                          <col style={{ width: "7.69%" }} />
                          <col style={{ width: "7.69%" }} />
                          <col style={{ width: "7.69%" }} />
                        </colgroup>
                        <tr>
                          <th>{translation("accreditation.Cluster_system")}</th>
                          <th>{translation("accreditation.Identification")}</th>
                          <th>
                            {translation("accreditation.seat_body_shell")}
                          </th>
                          <th>{translation("accreditation.DCo_related")}</th>
                          <th>
                            {translation(
                              "accreditation.Power_transmission_system"
                            )}
                          </th>
                          <th>{translation("accreditation.Brake_system")}</th>
                          <th>{translation("accreditation.Drive_system")}</th>
                          <th>
                            {translation("accreditation.Suspension_system")}
                          </th>
                          <th>{translation("accreditation.Tires")}</th>
                          <th>
                            {translation(
                              "accreditation.Electrical_and_lighting_systems"
                            )}
                          </th>
                          <th>{translation("accreditation.Exhaust")}</th>
                          <th>{translation("accreditation.Noise")}</th>
                          <th>
                            {translation(
                              "accreditation.Other_clusters_and_systems"
                            )}
                          </th>
                        </tr>
                        <tr>
                          <th className="thStyle">
                            {translation("accreditation.Number_not_meet")}
                          </th>
                          <th className="thStyle">
                            {number_to_price(
                              data?.data?.sum?.sumIdentificationFailCount
                            )}
                          </th>
                          <th className="thStyle">
                            {number_to_price(
                              data?.data?.sum?.sumFrameSeatBodyFailCount
                            )}
                          </th>
                          <th className="thStyle">
                            {number_to_price(
                              data?.data?.sum?.sumEngineFailCount
                            )}
                          </th>
                          <th className="thStyle">
                            {number_to_price(
                              data?.data?.sum
                                ?.sumPowerTransmissionSystemFailCount
                            )}
                          </th>
                          <th className="thStyle">
                            {number_to_price(
                              data?.data?.sum?.sumBrakeSystemFailCount
                            )}
                          </th>
                          <th className="thStyle">
                            {number_to_price(
                              data?.data?.sum?.sumDriveSystemFailCount
                            )}
                          </th>
                          <th className="thStyle">
                            {number_to_price(
                              data?.data?.sum?.sumSuspensionSystemFailCount
                            )}
                          </th>
                          <th className="thStyle">
                            {number_to_price(
                              data?.data?.sum?.sumTiresFailCount
                            )}
                          </th>
                          <th className="thStyle">
                            {number_to_price(
                              data?.data?.sum?.sumPowerSystemFailCount
                            )}
                          </th>
                          <th className="thStyle">
                            {number_to_price(
                              data?.data?.sum?.sumExhaustFailCount
                            )}
                          </th>
                          <th className="thStyle">
                            {number_to_price(
                              data?.data?.sum?.sumNoiseFailCount
                            )}
                          </th>
                          <th className="thStyle">
                            {number_to_price(
                              data?.data?.sum?.sumOtherSystemsFailCount
                            )}
                          </th>
                        </tr>
                        <tr>
                          <th className="thStyle">
                            {translation("accreditation.Ratio")} %
                          </th>
                          <th className="thStyle">
                            {formatNumberThapPhan(data?.data?.sum?.rateIdentificationFailCount)}
                          </th>
                          <th className="thStyle">
                            {formatNumberThapPhan(data?.data?.sum?.rateFrameSeatBodyFailCount)}
                          </th>
                          <th className="thStyle">
                            {formatNumberThapPhan(data?.data?.sum?.rateEngineFailCount)}
                          </th>
                          <th className="thStyle">
                            {formatNumberThapPhan(data?.data?.sum?.ratePowerTransmissionSystemFailCount)}
                          </th>
                          <th className="thStyle">
                            {formatNumberThapPhan(data?.data?.sum?.rateBrakeSystemFailCount)}
                          </th>
                          <th className="thStyle">
                            {formatNumberThapPhan(data?.data?.sum?.rateDriveSystemFailCount)}
                          </th>
                          <th className="thStyle">
                            {formatNumberThapPhan(data?.data?.sum?.rateSuspensionSystemFailCount)}
                          </th>
                          <th className="thStyle">
                            {formatNumberThapPhan(data?.data?.sum?.rateTiresFailCount)}
                          </th>
                          <th className="thStyle">
                            {formatNumberThapPhan(data?.data?.sum?.ratePowerSystemFailCount)}
                          </th>
                          <th className="thStyle">
                            {formatNumberThapPhan(data?.data?.sum?.rateExhaustFailCount)}
                          </th>
                          <th className="thStyle">
                            {formatNumberThapPhan(data?.data?.sum?.rateNoiseFailCount)}
                          </th>
                          <th className="thStyle">
                            {formatNumberThapPhan(data?.data?.sum?.rateOtherSystemsFailCount)}
                          </th>
                        </tr>
                      </table>
                    </div>
                  </Col>
                </Row>
              </Fragment>
              <ModalUploads
                visible={isUploadFile}
                toggleUploadModal={toggleUploadModal}
                onUploadFile={onUploadFile}
                file={fileSelected}
                onImportFileToDb={onImportFileToDb}
                loading={loading}
              />
            </Fragment>
          </div>
        )}
        Punish={null}
      />
    </>
  );
};

export default ListReportStatistic;
