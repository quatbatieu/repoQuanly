import React, { useState, useEffect } from "react";
import { Table } from "antd";
import ManagementService from "../../services/manageService";
import { useTranslation } from "react-i18next";
import "./style.scss";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

const Explaintation = () => {
  const { t: translation } = useTranslation();
  const [dataFilter, setDataFilter] = useState({});
  const [data, setData] = useState([]);

  const fetchData = (param) => {
    ManagementService.getListRole(param).then((result) => {
      if (result) {
        setData(result.data);
      }
    });
  };

  useEffect(() => {
    fetchData(dataFilter);
  }, []);

  const columns = [
    {
      title: "",
      key: "appUserRoleName",
      dataIndex: "appUserRoleName",
      width: 50,
      align: "center",
      render: (_, record) => {
        const { appUserRoleName } = record;
        return <div style={{ color: "#5F00FA", fontWeight : '700' }}>{appUserRoleName}</div>;
      },
    },
    {
      title: (
        <div style={{ color: "#086FD7", padding:'10px 10px' }}>
          {translation("header.accreditation")}
        </div>
      ),
      key: "",
      dataIndex: "",
      width: 50,
      align: "center",
      render: (_, record) => {
        const { permissions } = record;
        const index = permissions.search("MANAGE_RECORD");
        return (
          <>
            {index === -1 ? (
              <div className="close"><CloseOutlined style={{ fontSize: '22px', color: 'red', marginTop:'8px' }}/></div>
              ) : (
              <div className="check"><CheckOutlined style={{ fontSize: '22px', color: 'green', marginTop:'8px' }}/></div>
            )}
          </>
        );
      },
    },
    {
      title: (
        <div style={{ color: "#086FD7" }}>
          {translation("header.customers")}
        </div>
      ),
      key: "",
      dataIndex: "",
      width: 50,
      align: "center",
      render: (_, record) => {
        const { permissions } = record;
        const index = permissions.search("MANAGE_CUSTOMER");
        return (
          <>
            {index === -1 ? (
              <div className="close"><CloseOutlined style={{ fontSize: '22px', color: 'red', marginTop:'8px' }}/></div>
              ) : (
              <div className="check"><CheckOutlined style={{ fontSize: '22px', color: 'green', marginTop:'8px' }}/></div>
            )}
          </>
        );
      },
    },
    {
      title: (
        <div style={{ color: "#086FD7" }}>
          {translation("header.documentary")}
        </div>
      ),
      key: "",
      dataIndex: "",
      width: 50,
      align: "center",
      render: (_, record) => {
        const { permissions } = record;
        const index = permissions.search("MANAGE_DOCMENTARY");
        return (
          <>
            {index === -1 ? (
              <div className="close"><CloseOutlined style={{ fontSize: '22px', color: 'red', marginTop:'8px' }}/></div>
              ) : (
              <div className="check"><CheckOutlined style={{ fontSize: '22px', color: 'green', marginTop:'8px' }}/></div>
            )}
          </>
        );
      },
    },
    {
      title: (
        <div style={{ color: "#086FD7" }}>
          {translation("header.schedule")}
        </div>
      ),
      key: "",
      dataIndex: "",
      width: 50,
      align: "center",
      render: (_, record) => {
        const { permissions } = record;
        const index = permissions.search("MANAGE_SCHEDULE");
        return (
          <>
            {index === -1 ? (
              <div className="close"><CloseOutlined style={{ fontSize: '22px', color: 'red', marginTop:'8px' }}/></div>
              ) : (
              <div className="check"><CheckOutlined style={{ fontSize: '22px', color: 'green', marginTop:'8px' }}/></div>
            )}
          </>
        );
      },
    },
    {
      title: (
        <div style={{ color: "#086FD7" }}>
          {translation("header.receipt")}
        </div>
      ),
      key: "",
      dataIndex: "",
      width: 50,
      align: "center",
      render: (_, record) => {
        const { permissions } = record;
        const index = permissions.search("MANAGE_BILLING");
        return (
          <>
            {index === -1 ? (
              <div className="close"><CloseOutlined style={{ fontSize: '22px', color: 'red', marginTop:'8px' }}/></div>
              ) : (
              <div className="check"><CheckOutlined style={{ fontSize: '22px', color: 'green', marginTop:'8px' }}/></div>
            )}
          </>
        );
      },
    },
    {
      title: (
        <div style={{ color: "#086FD7" }}>
          {translation("header.guide")}
        </div>
      ),
      key: "",
      dataIndex: "",
      width: 50,
      align: "center",
      render: (_, record) => {
        const { permissions } = record;
        const index = permissions.search("MANAGE_GUIDE");
        return (
          <>
            {index === -1 ? (
              <div className="close"><CloseOutlined style={{ fontSize: '22px', color: 'red', marginTop:'8px' }}/></div>
              ) : (
              <div className="check"><CheckOutlined style={{ fontSize: '22px', color: 'green', marginTop:'8px' }}/></div>
            )}
          </>
        );
      },
    },
    {
      title: (
        <div style={{ color: "#086FD7" }}>
          {translation("header.establish")}
        </div>
      ),
      key: "",
      dataIndex: "",
      width: 50,
      align: "center",
      render: (_, record) => {
        const { permissions } = record;
        const index = permissions.search("MANAGE_SETTINGS");
        return (
          <>
            {index === -1 ? (
              <div className="close"><CloseOutlined style={{ fontSize: '22px', color: 'red', marginTop:'8px' }}/></div>
              ) : (
              <div className="check"><CheckOutlined style={{ fontSize: '22px', color: 'green', marginTop:'8px' }}/></div>
            )}
          </>
        );
      },
    },
    {
      title: (
        <div style={{ color: "#086FD7" }}>
          {translation("header.management")}
        </div>
      ),
      key: "",
      dataIndex: "",
      width: 50,
      align: "center",
      render: (_, record) => {
        const { permissions } = record;
        const index = permissions.search("MANAGE_APP_USER");
        return (
          <>
            {index === -1 ? (
              <div className="close"><CloseOutlined style={{ fontSize: '22px', color: 'red', marginTop:'8px' }}/></div>
              ) : (
              <div className="check"><CheckOutlined style={{ fontSize: '22px', color: 'green', marginTop:'8px' }}/></div>
            )}
          </>
        );
      },
    },
    {
      title: (
        <div style={{ color: "#086FD7" }}>
          {translation("header.file")}
        </div>
      ),
      key: "",
      dataIndex: "",
      width: 50,
      align: "center",
      render: (_, record) => {
        const { permissions } = record;
        const index = permissions.search("MANAGE_FILE");
        return (
          <>
            {index === -1 ? (
              <div className="close"><CloseOutlined style={{ fontSize: '22px', color: 'red', marginTop:'8px' }}/></div>
              ) : (
              <div className="check"><CheckOutlined style={{ fontSize: '22px', color: 'green', marginTop:'8px' }}/></div>
            )}
          </>
        );
      },
    },
  ];
  return (
    <div className="container">
      <Table
        dataSource={data}
        columns={columns}
        scroll={{ x: 1230 }}
        pagination={false}
        bordered={true}
      />
    </div>
  );
};

export default Explaintation;
