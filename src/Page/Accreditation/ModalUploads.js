import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal , Button } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { HOST } from "../../constants/url";
import { VectorIcon } from "../../assets/icons";
import { ColaIcon } from "../../assets/icons";
import { ZipIcon } from "../../assets/icons";
import { useModalDirectLinkContext } from "components/ModalDirectLink";
import { XLSX_TYPE } from "constants/excelFileType";

const SAMPLE_FILE_LINK = `${HOST}/uploads/exportExcel/file_mau_bao_cao.xlsx`;
const SAMPLE_FILE_LINK2 = `${process.env.PUBLIC_URL}/import/file_mau_import_khach_hang_2.xlsx`;
const ModalUpload = ({
  visible,
  toggleUploadModal,
  onUploadFile,
  file,
  onImportFileToDb,
  loading,
}) => {
  const { t: translation } = useTranslation();
  const { setUrlForModalDirectLink } = useModalDirectLinkContext();

  return (
    <Modal
      width={433}
      visible={visible}
      title={translation("listCustomers.toreport")}
      onCancel={toggleUploadModal}
      footer={
        <div className="d-flex justify-content-center">
          <Button onClick={toggleUploadModal} type="text">
            {translation("listCustomers.cancel")}
          </Button>
          <Button disabled={!!!file} onClick={onImportFileToDb} type="primary">
            {translation("listCustomers.importFile")}
          </Button>
        </div>
      }
    >
      <div className="">{loading && <LoadingOutlined />}</div>
      <div>
        {/* <div className="upload-type">{translation("listCustomers.uploadType1")}</div> */}
        <div className="updoad mb-4">
          <div className="lefta">
            <div className="textex">
              {translation("listCustomers.selectFileTitle")} excel (csv):
            </div>
            <input
              hidden
              type="file"
              id="selectFile"
              onChange={onUploadFile}
              accept={XLSX_TYPE}
            />
            <button className="labela">
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
              onClick={() => setUrlForModalDirectLink(SAMPLE_FILE_LINK)}
            >
              <span>
                <ColaIcon />
              </span>
              <label>{translation("listCustomers.downloadSampleFile")}</label>
            </button>
          </div>
        </div>
      </div>
      {file ? (
        <div className="mt-4" style={{color:'var(--primary-color)'}}>
          <span className="iconf">
            <ZipIcon />
          </span>
          <span className="texta">{file.name}</span>
        </div>
      ) : (
        ""
      )}
      {/* <Button onClick={onImportFileToDb} className="">
        {translation("listCustomers.importFile")}
      </Button> */}
    </Modal>
  );
};

export default ModalUpload;
