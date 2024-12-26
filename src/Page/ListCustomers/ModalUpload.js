import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  Button,
  message,
  Upload,
  notification,
  Table,
  Dropdown,
  Space,
} from "antd";
import {
  LoadingOutlined,
  InboxOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { HOST } from "../../constants/url";
import { VectorIcon } from "./../../assets/icons";
import { ColaIcon } from "./../../assets/icons";
import { ZipIcon } from "./../../assets/icons";
import { useModalDirectLinkContext } from "components/ModalDirectLink";
import { XLSX_TYPE } from "constants/excelFileType";
import TagVehicle from "components/TagVehicle/TagVehicle";
import { getIndexTagVehicleFromColor } from "constants/listSchedule";
import TagVehicleWarn from "components/TagVehicle/TagVehicleWarn";
import { handleParse } from "hooks/FileHandler";
import { convertFileToArray } from "hooks/FileHandler";
import moment from "moment";
import _ from "lodash";

const SAMPLE_FILE_LINK = `${HOST}/uploads/exportExcel/file_mau_import.xlsx`;
const SAMPLE_FILE_LINK2 = `${HOST}/uploads/exportExcel/file_mau_import_khach_hang_2.xlsx`;
const SAMPLE_FILE_LINK3 = `${HOST}/uploads/exportExcel/file_mau_import_khach_hang_3.xls`;
const ModalUpload = ({
  visible,
  toggleUploadModal,
  onUploadFile,
  file,
  onImportFileToDb,
  isLoading,
  selectingFileTemplateChanged,
  dataFilter,
  upload,
  setUpload,
}) => {
  const items = [
    {
      label: <div onClick={() => handleDate(0)}>DD/MM/YYYY</div>,
      key: 0,
    },
    {
      label: <div onClick={() => handleDate(1)}>MM/DD/YYYY</div>,
      key: 1,
    },
    {
      label: <div onClick={() => handleDate(2)}>YYYY/MM/DD</div>,
      key: 2,
    },
  ];
  const TEMPLATE_INDEX = {
    TEMPLATE_1: 1, //Mẫu file template cũ từ trạm, encoding VNI
    TEMPLATE_2: 2, //Mẫu template do TTDK export ra
    TEMPLATE_3: 3, //Mẫu xuất ra từ phần mềm QLKD
  };

  const [selectingTemplateType, setSelectingTemplateType] = useState([]);
  const [date, setDate] = useState("DD/MM/YYYY");
  const [totalExcel, setTotalExcel] = useState(0);
  const { t: translation } = useTranslation();
  const { setUrlForModalDirectLink } = useModalDirectLinkContext();

  function _userSelectFileToUploadFollowTemplate1() {
    selectingFileTemplateChanged(TEMPLATE_INDEX.TEMPLATE_1);
  }
  function _userSelectFileToUploadFollowTemplate2() {
    selectingFileTemplateChanged(TEMPLATE_INDEX.TEMPLATE_2);
  }
  function _userSelectFileToUploadFollowTemplate3() {
    selectingFileTemplateChanged(TEMPLATE_INDEX.TEMPLATE_3);
  }

  useEffect(() => {}, []);

  const handleUploadChange = _.debounce(async (info) => {
    if (info.file.status === "error") {
      notification.error({
        message: "",
        description: translation("error"),
      });
    } else {
      const FIELDS_EXPORT_IMPORT_ZALO = [
        { api: "customerIndex", content: "Số TT" },
        { api: "customerRecordPlatenumber", content: "Biển kiểm soát" },
        { api: "customerRecordFullName", content: "Chủ phương tiện" },
        { api: "customerRecordAdress", content: "Địa chỉ" },
        { api: "customerRecordPhone", content: "Số điện thoại" },
        { api: "customerRecordCheckExpiredDate", content: "Ngày hết hạn" },
      ];
      const FIELDS_EXPORT_IMPORT_ZALO_3 = [
        { api: "customerIndex" },
        { api: "customerRecordCheckExpiredDate" },
        { api: "customerRecordPlatenumber" },
        { api: "" },
        { api: "" },
        { api: "" },
        { api: "" },
        { api: "" },
        { api: "" },
        { api: "" },
        { api: "" },
        { api: "" },
        { api: "customerRecordPhone" },
      ];
      const data = await handleParse(info.file.originFileObj, false);
      // mẫu 1
      if (data[0][0] === "Trung tâm đăng kiểm") {
        if (data[2]?.length === 0) {
          data.splice(0, 3);
        }
        const dateColumnIndex = data[0].indexOf("Ngày hết hạn");
        if (dateColumnIndex !== -1) {
          for (let i = 1; i < data.length; i++) {
            let dateValue = data[i][dateColumnIndex];
            if (dateValue) {
              let dateObj;
              if (typeof dateValue === "string" && dateValue.includes("/")) {
                // If the date is already in DD/MM/YYYY format, skip
                const parts = dateValue.split("/");
                if (parts[2].length === 4) continue;
              }
              if (typeof dateValue === "string") {
                dateObj = new Date(dateValue);
              } else if (typeof dateValue === "number") {
                dateObj = new Date((dateValue - (25567 + 1)) * 86400 * 1000);
              }
              const day = dateObj.getDate().toString().padStart(2, "0");
              const month = (dateObj.getMonth() + 1)
                .toString()
                .padStart(2, "0");
              const year = dateObj.getFullYear();
              data[i][dateColumnIndex] = `${day}/${month}/${year}`;
            }
          }
        }
        const convertData = convertFileToArray({
          data,
          FIELD_IMPORT_API: FIELDS_EXPORT_IMPORT_ZALO.map((item) => item.api),
          FIELD_IMPORT_FULL: FIELDS_EXPORT_IMPORT_ZALO.map(
            (item) => item.content
          ),
          removeLine: 0,
        });
        // check xem nếu năm thiếu 1 số thì năm = ""
        convertData.data.forEach((item) => {
          const dateParts = item.customerRecordCheckExpiredDate
            ? item.customerRecordCheckExpiredDate.split("/")
            : [];
          const year =
            dateParts.length === 3 ? parseInt(dateParts[2], 10) : NaN;
          if (isNaN(year) || year < 1900) {
            item.customerRecordCheckExpiredDate = "";
          }
        });
        setSelectingTemplateType(convertData.data);
        setUpload(true);
        onUploadFile(selectingTemplateType);
        setTotalExcel(convertData.data?.length);
        return;
      }

      // mẫu 2
      if (data[0][1] === "Biển kiểm soát") {
        const dateColumnIndex = data[0].indexOf("Ngày hết hạn");
        if (dateColumnIndex !== -1) {
          for (let i = 1; i < data.length; i++) {
            let dateValue = data[i][dateColumnIndex];
            if (dateValue) {
              let dateObj;
              if (typeof dateValue === "string" && dateValue.includes("/")) {
                // If the date is already in DD/MM/YYYY format, skip
                const parts = dateValue.split("/");
                if (parts[2].length === 4) continue;
              }
              if (typeof dateValue === "string") {
                dateObj = new Date(dateValue);
              } else if (typeof dateValue === "number") {
                dateObj = new Date((dateValue - (25567 + 1)) * 86400 * 1000);
              }
              const day = dateObj.getDate().toString().padStart(2, "0");
              const month = (dateObj.getMonth() + 1)
                .toString()
                .padStart(2, "0");
              const year = dateObj.getFullYear();
              data[i][dateColumnIndex] = `${day}/${month}/${year}`;
            }
          }
        }
        const convertData = convertFileToArray({
          data,
          FIELD_IMPORT_API: FIELDS_EXPORT_IMPORT_ZALO.map((item) => item.api),
          FIELD_IMPORT_FULL: FIELDS_EXPORT_IMPORT_ZALO.map(
            (item) => item.content
          ),
          removeLine: 0,
        });
        // check xem nếu năm thiếu 1 số thì năm = ""
        convertData.data.forEach((item) => {
          const dateParts = item.customerRecordCheckExpiredDate
            ? item.customerRecordCheckExpiredDate.split("/")
            : [];
          const year =
            dateParts.length === 3 ? parseInt(dateParts[2], 10) : NaN;
          if (isNaN(year) || year < 1900) {
            item.customerRecordCheckExpiredDate = "";
          }
        });
        setSelectingTemplateType(convertData.data);
        setUpload(true);
        onUploadFile(selectingTemplateType);
        setTotalExcel(convertData.data?.length);
        return;
      }

      // mẫu 3
      if (data[0][0] === "çn vÙ kiÌm ½Ùnh") {
        data.splice(0, 6);
        data.pop();
        for (let i = 0; i < data.length; i++) {
          let dateValue = data[i][1];
          if (dateValue) {
            let dateObj;
            if (typeof dateValue === "string" && dateValue.includes("/")) {
              const parts = dateValue.split("/");
              if (parts[2].length === 4) {
                continue;
              }
            }
            if (typeof dateValue === "string") {
              dateObj = new Date(dateValue);
            } else if (typeof dateValue === "number") {
              dateObj = new Date((dateValue - (25567 + 1)) * 86400 * 1000);
            }
            if (dateObj instanceof Date && !isNaN(dateObj)) {
              const day = dateObj.getDate().toString().padStart(2, "0");
              const month = (dateObj.getMonth() + 1)
                .toString()
                .padStart(2, "0");
              const year = dateObj.getFullYear();
              data[i][1] = `${day}/${month}/${year}`;
            }
          }
        }
        let mergedArray = data.map((itemB) => {
          let obj = {};
          FIELDS_EXPORT_IMPORT_ZALO_3.forEach((itemA, index) => {
            obj[itemA.api] = itemB[index] || ""; // Gán giá trị từ mảng B vào đối tượng obj với key là itemA.api
          });
          return obj;
        });
        const newData = mergedArray.filter((item) => item.customerIndex !== "");
        // check xem nếu năm thiếu 1 số thì năm = ""
        newData.forEach((item) => {
          const dateParts = item.customerRecordCheckExpiredDate
            ? item.customerRecordCheckExpiredDate.split("/")
            : [];
          const year =
            dateParts.length === 3 ? parseInt(dateParts[2], 10) : NaN;
          if (isNaN(year) || year < 1900) {
            item.customerRecordCheckExpiredDate = "";
          }
        });
        setSelectingTemplateType(newData);
        setUpload(true);
        onUploadFile(selectingTemplateType);
        selectingFileTemplateChanged(TEMPLATE_INDEX.TEMPLATE_3);
        setTotalExcel(newData?.length);
        return;
      }
      notification["error"]({
        message: "",
        description: translation("listCustomers.importTypeFailed"),
      });
      return;
    }
  }, 500);

  const handleDate = (value) => {
    if (value === 0) {
      // định dạng  DD/MM/YYYY
      const newArr = selectingTemplateType.map((item) => {
        return {
          ...item,
          customerRecordCheckExpiredDate: moment(
            item.customerRecordCheckExpiredDate,
            date
          ).format("DD/MM/YYYY"),
        };
      });
      setDate("DD/MM/YYYY");
      newArr.forEach((item) => {
        if (item.customerRecordCheckExpiredDate === "Invalid date") {
          item.customerRecordCheckExpiredDate = "";
        }
      });
      setSelectingTemplateType(newArr);
      return;
    }
    if (value === 1) {
      // định dạng  MM/DD/YYYY
      const newArr = selectingTemplateType.map((item) => {
        return {
          ...item,
          customerRecordCheckExpiredDate: moment(
            item.customerRecordCheckExpiredDate,
            date
          ).format("MM/DD/YYYY"),
        };
      });
      setDate("MM/DD/YYYY");
      newArr.forEach((item) => {
        if (item.customerRecordCheckExpiredDate === "Invalid date") {
          item.customerRecordCheckExpiredDate = "";
        }
      });
      setSelectingTemplateType(newArr);
      return;
    }
    if (value === 2) {
      // định dạng  YYYY/MM/DD
      const newArr = selectingTemplateType.map((item) => {
        return {
          ...item,
          customerRecordCheckExpiredDate: moment(
            item.customerRecordCheckExpiredDate,
            date
          ).format("YYYY/MM/DD"),
        };
      });
      setDate("YYYY/MM/DD");
      newArr.forEach((item) => {
        if (item.customerRecordCheckExpiredDate === "Invalid date") {
          item.customerRecordCheckExpiredDate = "";
        }
      });
      setSelectingTemplateType(newArr);
      return;
    }
  };

  const columns = [
    {
      title: translation("landing.index"),
      dataIndex: "customerIndex",
      key: "customerIndex",
      width: 30,
      render: (_, record) => {
        return <div>{record.customerIndex}</div>;
      },
    },
    {
      title: translation("listSchedules.fullName"),
      key: "customerRecordFullName",
      dataIndex: "customerRecordFullName",
      render: (_, record) => {
        return (
          <div>
            <div>{record.customerRecordFullName}</div>
          </div>
        );
      },
      width: 50,
    },
    {
      title: translation("accreditation.phoneNumber"),
      dataIndex: "customerRecordPhone",
      key: "customerRecordPhone",
      width: 70,
      render: (_, record) => {
        return (
          <div className="disflex">
            {record.customerRecordPhone && (
              <div>{record.customerRecordPhone}</div>
            )}
          </div>
        );
      },
    },
    // {
    //   title: translation("Email"),
    //   key: "customerRecordEmail",
    //   dataIndex: "customerRecordEmail",
    //   width: 100,
    //   render: (_, record) => {
    //     return <div className="blue-text">{record.customerRecordEmail}</div>;
    //   },
    // },
    {
      title: translation("accreditation.licensePlates"),
      dataIndex: "customerRecordPlatenumber",
      key: "customerRecordPlatenumber",
      width: 90,
      ellipsis: true,
      render: (_, item) => {
        const {
          hasCrime,
          customerRecordPlatenumber,
          customerRecordPlateColor,
        } = item;
        const splitText =
          customerRecordPlatenumber?.length >= 14
            ? `${customerRecordPlatenumber.slice(0, 14)}`
            : customerRecordPlatenumber;
        if (!hasCrime) {
          return (
            <TagVehicle
              color={getIndexTagVehicleFromColor(customerRecordPlateColor)}
            >
              {splitText}
            </TagVehicle>
          );
        }
        return <TagVehicleWarn>{splitText}</TagVehicleWarn>;
      },
    },
    {
      title: (
        <div>
          {/* {translation("listCustomers.dateEnd")} */}
          <Dropdown
            menu={{
              items,
            }}
          >
            <div
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <Space>
                <div>{translation("listCustomers.dateEnd")}</div>
                <div>{date}</div>
                <DownOutlined />
              </Space>
            </div>
          </Dropdown>
        </div>
      ),
      key: "customerRecordCheckExpiredDate",
      dataIndex: "customerRecordCheckExpiredDate",
      width: 100,
      render: (_, record) => {
        return <div>{record.customerRecordCheckExpiredDate}</div>;
      },
    },
  ];

  return (
    <Modal
      width={1000}
      height={500}
      visible={visible}
      title={translation("listCustomers.upload_customer_list")}
      onCancel={toggleUploadModal}
      footer={
        <div className="d-flex justify-content-center">
          {/* <Button onClick={() => setUrlForModalDirectLink(SAMPLE_FILE_LINK2)}>
            {translation("listCustomers.downloadSampleFile")}
          </Button> */}
          <Button
            disabled={!!!file}
            onClick={() => onImportFileToDb(selectingTemplateType)}
            type="primary"
          >
            {translation("listCustomers.importFile")}
          </Button>
        </div>
      }
    >
      <div className="">{isLoading && <LoadingOutlined />}</div>
      <div className="d-flex justify-content-center align-items-center" style={{flexWrap:'wrap',textAlign:'center',gap:'10%'}}>
        {upload === false ? (
          <>
            <div>
              <div className="upload-type">
                {translation("listCustomers.uploadType1")}
              </div>
              <div className="updoad mb-4 d-flex justify-content-center align-items-center">
                {/* <div className="lefta">
            <div className="textex">
              {translation("listCustomers.selectFileTitle")} excel(csv):
            </div>
            <input
              hidden
              type="file"
              id="selectFile"
              onChange={onUploadFile}
              accept={XLSX_TYPE}
            />
            <button className="labela" onClick={_userSelectFileToUploadFollowTemplate1}>
              <span>
                <VectorIcon />
              </span>
              <label htmlFor="selectFile">
                {translation("listCustomers.selectFile")}
              </label>
            </button>
          </div> */}
                <div className="righta">
                  <p>
                    {translation("listCustomers.downloadTemplateFileTitle")}
                  </p>
                  <button
                    className="untra"
                    onClick={() => setUrlForModalDirectLink(SAMPLE_FILE_LINK)}
                  >
                    <span>
                      <ColaIcon />
                    </span>
                    <label>
                      {translation("listCustomers.downloadSampleFile")}
                    </label>
                  </button>
                </div>
              </div>
            </div>
            <div>
              <div className="upload-type">
                {translation("listCustomers.uploadType2")}
              </div>
              <div className="updoad mb-4">
                <div className="righta">
                  <p>
                    {translation("listCustomers.downloadTemplateFileTitle")}
                  </p>
                  <button
                    className="untra"
                    onClick={() => setUrlForModalDirectLink(SAMPLE_FILE_LINK2)}
                  >
                    <span>
                      <ColaIcon />
                    </span>
                    <label>
                      {translation("listCustomers.downloadSampleFile")}
                    </label>
                  </button>
                </div>
              </div>
            </div>
            <div>
              <div className="upload-type">
                {translation("listCustomers.uploadType3")}
              </div>
              <div className="updoad mb-4">
                <div className="righta">
                  <p>
                    {translation("listCustomers.downloadTemplateFileTitle")}
                  </p>
                  <button
                    className="untra"
                    onClick={() => setUrlForModalDirectLink(SAMPLE_FILE_LINK3)}
                  >
                    <span>
                      <ColaIcon />
                    </span>
                    <label>
                      {translation("listCustomers.downloadSampleFile")}
                    </label>
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div>Tổng số dòng excel : {totalExcel}</div>
        )}
      </div>
      <div className="borderBottom">
        {upload === false ? (
          <Upload.Dragger
            maxCount={1}
            accept={XLSX_TYPE}
            showUploadList={true}
            multiple={false}
            onChange={handleUploadChange}
            customRequest={({ onSuccess }) => {
              setTimeout(() => {
                onSuccess("ok");
              }, 0);
            }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text text-danger">
              Số lượng dòng tối đa có thể import: 500 dòng
            </p>
            <p className="ant-upload-text">
              Click hoặc kéo thả để tải file lên
            </p>
          </Upload.Dragger>
        ) : (
          <>
            <Table
              dataSource={selectingTemplateType}
              columns={columns}
              scroll={{ x: 1000 }}
              pagination={true}
            />
          </>
        )}
        {/* <div className="upload-type">{translation("listCustomers.uploadType2")}</div>
        <div className="updoad mb-4">
          <div className="lefta">
            <div className="textex">
              {translation("listCustomers.selectFileTitle")} excel(csv):
            </div>
            <input
              hidden
              type="file"
              id="selectFile"
              onChange={onUploadFile}
              accept={XLSX_TYPE}
            />
            <button className="labela" onClick={_userSelectFileToUploadFollowTemplate2}>
              <span>
                <VectorIcon />
              </span>
              <label htmlFor="selectFile">
                {translation("listCustomers.selectFile")}
              </label>
            </button>
          </div>
          <div className="righta">
            <p>{translation("listCustomers.downloadTemplateFileTitle")}</p>
            <button
              className="untra"
              onClick={() => setUrlForModalDirectLink(SAMPLE_FILE_LINK2)}
            >
              <span>
                <ColaIcon />
              </span>
              <label>{translation("listCustomers.downloadSampleFile")}</label>
            </button>
          </div>
        </div> */}
      </div>
      {/* <div className="mt-4">
        <div className="upload-type mb-4">{translation("listCustomers.uploadType3")}</div>
        <div className="updoad">
          <div className="lefta">
            <div className="textex">
              {translation("listCustomers.selectFileTitle")} excel(xls):
            </div>
            <input
              hidden
              type="file"
              id="selectFile"
              onChange={onUploadFile}
              accept={XLSX_TYPE}
            />
            <button className="labela" onClick={_userSelectFileToUploadFollowTemplate3}>
              <span>
                <VectorIcon />
              </span>
              <label htmlFor="selectFile">
                {translation("listCustomers.selectFile")}
              </label>
            </button>
          </div>
          <div className="righta">
            <p>{translation("listCustomers.downloadTemplateFileTitle")}</p>
            <button
              className="untra"
              onClick={() => setUrlForModalDirectLink(SAMPLE_FILE_LINK3)}
            >
              <span>
                <ColaIcon />
              </span>
              <label>{translation("listCustomers.downloadSampleFile")}</label>
            </button>
          </div>
        </div>
      </div> */}
      {/* {file ? (
        <div className="mt-4" style={{ color: "var(--primary-color)" }}>
          <span className="iconf">
            <ZipIcon />
          </span>
          <span className="texta">{file.name}</span>
        </div>
      ) : (
        ""
      )} */}
      {/* <Button onClick={onImportFileToDb} className="">
        {translation("listCustomers.importFile")}
      </Button> */}
    </Modal>
  );
};

export default ModalUpload;
