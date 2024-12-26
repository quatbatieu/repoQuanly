import React, { useEffect } from "react"
import { Modal, Form, Input, Button, DatePicker, InputNumber , notification } from 'antd'
import { useTranslation } from "react-i18next"
import moment from "moment"
import listDocumentaryService from "../../services/listDocumentaryService";
import { useState } from "react";
import { Row, Col } from "antd";
import { ZipIcon } from "./../../assets/icons";
import Axios from "axios";
import { useModalDirectLinkContext } from "components/ModalDirectLink";

const ModalEditDocumentary = (props) => {
  const { setUrlForModalDirectLink } = useModalDirectLinkContext();
  const {isEditing , toggleEditModal , item} = props
  const { t: translation } = useTranslation()
  const { documentCode, documentTitle, documentPublishedDay, documentFiles , documentContent} = item

  const handleDownload = (fileUrl, fileName) => {
    Axios({
      url: fileUrl,
      method: 'GET',
      responseType: 'blob'
    }).then((response) => {
      // setUrlForModalDirectLink(fileUrl)
      const blob = new Blob([response.data], {type: 'application/octet-stream'});
      const blobUrl = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = blobUrl;
      a.download = fileName || fileUrl;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    }).catch((err) => {
      notification['error']({
        message: "",
        description: translation('linkUnavailableTitle')
      })
      return;
    });
  }
  
  return (
    <Modal
      visible={isEditing}
      title={translation('listDocumentary.see_details')}
      onCancel={toggleEditModal}
      width={700}
      footer={null}
    >
      <Row className="pb-2">
        <Col span={10} className='modal_document'>{translation('listDocumentary.DocumentaryCode')}</Col>
        <Col span={10} className='text_document'>{documentCode}</Col>
      </Row>
      <Row className="pb-2">
        <Col span={10} className='modal_document'>{translation('listDocumentary.title')}</Col>
        <Col span={10} className='text_document'>{documentTitle}</Col>
      </Row>
      <Row className="pb-2">
        <Col span={10} className='modal_document'>{translation('listDocumentary.documentPublishedDay')}</Col>
        <Col span={10} className='text_document'>{documentPublishedDay}</Col>
      </Row>
      <Row className="pb-2">
        <Col span={10} className='modal_document'>{translation('listDocumentary.attachments')}</Col>
        <Col span={10} className='text_document'>{documentFiles?.map((item, index) =>{
          return (
            <div key={index}>
              <p>
                <ZipIcon className="color_icon"/>
                <a
                  className="color_text"
                  onClick={() => handleDownload(item.documentFileUrl, item.documentFileName || null)}
                  >
                   {item.documentFileName ||  translation('listDocumentary.DocumentaryName') + " " + index}
                </a>
              </p>
            </div>
          )
        })}</Col>
      </Row>
      <Row>
        <Col span={10} className='modal_document'>{translation('listDocumentary.documentContent')}</Col>
        <Col span={24} className='text_document'>
          <div dangerouslySetInnerHTML={{ __html: documentContent }} />
        </Col>
      </Row>
    </Modal>
  )
}

export default ModalEditDocumentary