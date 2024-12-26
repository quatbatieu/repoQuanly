import React from "react";
import { Image } from "antd";

const UploadItem = ({ fileName, title, image }) => {
  return (
    <div className="d-flex align-items-center">
      <div className="me-4">
        <Image
          src={image}
          width={95}
          height={95}
          preview={false}
        />
      </div>
      <div className="">
        <p className="mb-0 drawerManagement-upload-title">{title}</p>
        {/* <p className="mt-1 mb-0 drawerManagement-upload-fileName">{fileName}</p> */}
      </div>
    </div>
  )
}

export default UploadItem;