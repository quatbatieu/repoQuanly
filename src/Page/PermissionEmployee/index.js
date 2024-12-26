import React, { useState, useEffect, Fragment } from "react";
import { Table, Input, notification, Form } from "antd";
import ManagementService from "../../services/manageService";
import { useTranslation } from "react-i18next";
import "./style.scss";
import UnLock from 'components/UnLock/UnLock';
import { useSelector } from 'react-redux';
import EditableRow from 'components/EditableRow';
import EditableCell from 'components/EditableCell';
import BasicTablePaging from "components/BasicTablePaging/BasicTablePaging";
import { NORMAL_COLUMN_WIDTH } from "constants/app";

const PermissionEmployee = () => {
  const { t: translation } = useTranslation();
  const [data, setData] = useState([]);
  const setting = useSelector((state) => state.setting);
  const [form] = Form.useForm();
  const DEFAULT_FILTER = {
    filter: {},
    skip: 0,
    limit: 20,
  }
  const [dataFilter, setDataFilter] = useState(DEFAULT_FILTER)
  const fetchData = (param) => {
    ManagementService.getLists(param).then((result) => {
      if (result) {
        setData(result.data);
      }
    });
  };

  const handleUpdatePer = (appUserId, permissionList) => {
    const newParam = {
      id : appUserId,
      data : {
        permissions : permissionList.join(",")
      }
    }
    ManagementService.UpdatePermission(newParam).then((result) => {
      if (result) {
        fetchData();
        notification.success({
          message: '',
          description: translation('accreditation.updateSuccess'),
        })

      } else {
        notification.success({
          message: '',
          description: translation('accreditation.updateError'),
      })
    }})
  };

  useEffect(() => {
    fetchData();
  }, []);
  const handleChangePage = (pageNum) => {
    const newFilter = {
      ...dataFilter,
      skip : (pageNum -1) * dataFilter.limit
    }
    setDataFilter(newFilter)
    fetchData(newFilter)
  }
  const components = {
    body: {
      row: (props) => <EditableRow {...props} form={form} />,
      cell: (props) => <EditableCell {...props} form={form} />,
    },
  };

  const columns = [
    {
      title: "",
      key: "appUserRoleName",
      dataIndex: "appUserRoleName",
      // width: 50,
      align: "center",
      render: (_, record) => {
        const { username } = record;
        return (
          <div className='checks'>
            {username}
          </div>
        );
      },
    },
    {
      title: (
        <div className="check-box">
          {translation("header.accreditation")}
        </div>
      ),
      key: "",
      dataIndex: "",
      width: 121,
      align: "center",
      render: (_, record) => {
        const { permissions, appUserId } = record;
        const permissionValue = 'MANAGE_RECORD'
        const isChecked = permissions.indexOf(permissionValue) > -1;
        return (
          <div className="check-box">
            <Input
              checked={isChecked}
              type="checkbox"
              style={{maxWidth:'16px'}}
              name={permissions}
              onChange={() => {
                let permissionList = permissions.split(",");
                // console.log("permissionList", permissionList);

                if (isChecked) {
                  permissionList = permissionList.filter(
                    (_item) => _item !== permissionValue);
                } else {
                  permissionList.push(permissionValue);
                }

                // console.log("new permissions", permissionList.join(","));
                handleUpdatePer(appUserId, permissionList)

                // call API update role
                // nếu thành công thì call API get
                // nếu thất bại thì thông báo lỗi
              }}
            />
          </div>
        );
      },
    },
    {
      title: (
        <div className="check-box">
          {translation("header.customers")}
        </div>
      ),
      key: "",
      dataIndex: "",
      width: 121,
      align: "center",
      render: (_, record) => {
        const { permissions, appUserId } = record;
        const permissionValue = 'MANAGE_CUSTOMER'
        const isChecked = permissions.indexOf(permissionValue) > -1;
        return (
          <div className="check-box">
            <Input
              checked={isChecked}
              style={{maxWidth:'16px'}}
              type="checkbox"
              onChange={() => {
                let permissionList = permissions.split(",");
                // console.log("permissionList", permissionList);

                if (isChecked) {
                  permissionList = permissionList.filter(
                    (_item) => _item !== permissionValue);
                } else {
                  permissionList.push(permissionValue);
                }

                // console.log("new permissions", permissionList.join(","));
                handleUpdatePer(appUserId, permissionList)
                // call API update role
                // nếu thành công thì call API get
                // nếu thất bại thì thông báo lỗi
              }}
            //   name={permissions}
            />
          </div>
        );
      },
    },
    {
      title: (
        <div className="check-box">
          {translation("header.documentary")}
        </div>
      ),
      key: "",
      dataIndex: "",
      width: 121,
      align: "center",
      render: (_, record) => {
        const { permissions, appUserId } = record;
        const permissionValue = 'MANAGE_DOCMENTARY'
        const isChecked = permissions.indexOf(permissionValue) > -1;
        return (
          <div className="check-box">
            <Input
              checked={isChecked}
              type="checkbox"
              style={{maxWidth:'16px'}}
              onChange={() => {
                let permissionList = permissions.split(",");
                // console.log("permissionList", permissionList);

                if (isChecked) {
                  permissionList = permissionList.filter(
                    (_item) => _item !== permissionValue);
                } else {
                  permissionList.push(permissionValue);
                }

                // console.log("new permissions", permissionList.join(","));
                handleUpdatePer(appUserId, permissionList)
                // call API update role
                // nếu thành công thì call API get
                // nếu thất bại thì thông báo lỗi
              }}
            //   name={permissions}
            />
          </div>
        );
      },
    },
    {
      title: (
        <div className="check-box">{translation("header.schedule")}</div>
      ),
      key: "",
      dataIndex: "",
      width: 121,
      align: "center",
      render: (_, record) => {
        const { permissions, appUserId } = record;
        const permissionValue = 'MANAGE_SCHEDULE'
        const isChecked = permissions.indexOf(permissionValue) > -1;
        return (
          <div className="check-box">
            <Input
              checked={isChecked}
              type="checkbox"
              style={{maxWidth:'16px'}}
              onChange={() => {
                let permissionList = permissions.split(",");
                // console.log("permissionList", permissionList);

                if (isChecked) {
                  permissionList = permissionList.filter(
                    (_item) => _item !== permissionValue);
                } else {
                  permissionList.push(permissionValue);
                }

                // console.log("new permissions", permissionList.join(","));
                handleUpdatePer(appUserId, permissionList)
                // call API update role
                // nếu thành công thì call API get
                // nếu thất bại thì thông báo lỗi
              }}
            //   name={permissions}
            />
          </div>
        );
      },
    },
    {
      title: (
        <div className="check-box">{translation("header.receipt")}</div>
      ),
      key: "",
      dataIndex: "",
      width: 121,
      align: "center",
      render: (_, record) => {
        const { permissions, appUserId } = record;
        const permissionValue = 'MANAGE_BILLING'
        const isChecked = permissions.indexOf(permissionValue) > -1;
        return (
          <div className="check-box">
            <Input
              checked={isChecked}
              type="checkbox"
              style={{maxWidth:'16px'}}
              onChange={() => {
                let permissionList = permissions.split(",");

                if (isChecked) {
                  permissionList = permissionList.filter(
                    (_item) => _item !== permissionValue);
                } else {
                  permissionList.push(permissionValue);
                }

                handleUpdatePer(appUserId, permissionList)
              }}
            />
          </div>
        );
      },
    },
    {
      title: (
        <div className="check-box">{translation("header.guide")}</div>
      ),
      key: "",
      dataIndex: "",
      width: 121,
      align: "center",
      render: (_, record) => {
        const { permissions, appUserId } = record;
        const permissionValue = 'MANAGE_GUIDE'
        const isChecked = permissions.indexOf(permissionValue) > -1;
        return (
          <div className="check-box">
            <Input
              checked={isChecked}
              type="checkbox"
              style={{maxWidth:'16px'}}
              onChange={() => {
                let permissionList = permissions.split(",");
                // console.log("permissionList", permissionList);

                if (isChecked) {
                  permissionList = permissionList.filter(
                    (_item) => _item !== permissionValue);
                } else {
                  permissionList.push(permissionValue);
                }

                // console.log("new permissions", permissionList.join(","));
                handleUpdatePer(appUserId, permissionList)

                // call API update role
                // nếu thành công thì call API get
                // nếu thất bại thì thông báo lỗi
              }}
            //   name={permissions}
            />
          </div>
        );
      },
    },
    {
      title: (
        <div className="check-box">
          {translation("header.establish")}
        </div>
      ),
      key: "",
      dataIndex: "",
      width: 121,
      align: "center",
      render: (_, record) => {
        const { permissions, appUserId } = record;
        const permissionValue = 'MANAGE_SETTINGS'
        const isChecked = permissions.indexOf(permissionValue) > -1;
        return (
          <div className="check-box">
            <Input
              checked={isChecked}
              type="checkbox"
              style={{maxWidth:'16px'}}
              onChange={() => {
                let permissionList = permissions.split(",");
                // console.log("permissionList", permissionList);

                if (isChecked) {
                  permissionList = permissionList.filter(
                    (_item) => _item !== permissionValue);
                } else {
                  permissionList.push(permissionValue);
                }

                // console.log("new permissions", permissionList.join(","));
                handleUpdatePer(appUserId, permissionList)
                // call API update role
                // nếu thành công thì call API get
                // nếu thất bại thì thông báo lỗi
              }}
            //   name={permissions}
            />
          </div>
        );
      },
    },
    {
      title: (
        <div className="check-box">
          {translation("header.management")}
        </div>
      ),
      key: "",
      dataIndex: "",
      width: 121,
      align: "center",
      render: (_, record) => {
        const { permissions, appUserId } = record;
        const permissionValue = 'MANAGE_APP_USER'
        const isChecked = permissions.indexOf(permissionValue) > -1;
        return (
          <div className="check-box">
            <Input
              checked={isChecked}
              type="checkbox"
              style={{maxWidth:'16px'}}
              onChange={() => {
                let permissionList = permissions.split(",");
                // console.log("permissionList", permissionList);

                if (isChecked) {
                  permissionList = permissionList.filter(
                    (_item) => _item !== permissionValue);
                } else {
                  permissionList.push(permissionValue);
                }

                // console.log("new permissions", permissionList.join(","));
                handleUpdatePer(appUserId, permissionList)
                // call API update role
                // nếu thành công thì call API get
                // nếu thất bại thì thông báo lỗi
              }}
            //   name={permissions}
            />
          </div>
        );
      },
    },
    {
      title: (
        <div className="check-box">{translation("header.file")}</div>
      ),
      key: "",
      dataIndex: "",
      width: 121,
      align: "center",
      render: (_, record) => {
        const { permissions, appUserId } = record;
        const permissionValue = 'MANAGE_FILE'
        const isChecked = permissions.indexOf(permissionValue) > -1;
        return (
          <div className="check-box">
            <Input
              checked={isChecked}
              type="checkbox"
              style={{maxWidth:'16px'}}
              onChange={() => {
                let permissionList = permissions.split(",");
                // console.log("permissionList", permissionList);

                if (isChecked) {
                  permissionList = permissionList.filter(
                    (_item) => _item !== permissionValue);
                } else {
                  permissionList.push(permissionValue);
                }

                // console.log("new permissions", permissionList.join(","));
                handleUpdatePer(appUserId, permissionList)
                // call API update role
                // nếu thành công thì call API get
                // nếu thất bại thì thông báo lỗi
              }}
            //   name={permissions}
            />
          </div>
        );
      },
    },
  ];
  return (
    <Fragment>
    {setting.enableManagerMenu === 0 ? <UnLock /> :
    <div className="container">
      <Table
        dataSource={data}
        columns={columns}
        scroll={{ x: 1250 }}
        pagination={false}
        bordered={true}
        components={components}
      />
        <BasicTablePaging handlePaginations={handleChangePage} skip={dataFilter.skip} count={data?.length < dataFilter.limit}></BasicTablePaging>
    </div>
    }
    </Fragment>
  );
};

export default PermissionEmployee;
