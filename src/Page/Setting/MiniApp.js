import React, { Fragment, useState, useEffect } from "react";
import { notification, Button, Col, Row, Input, Switch, Select as SelectAntd, message, Select } from "antd";
import { useTranslation } from "react-i18next";
import {
  VEHICLE_SUB_CATEGORY,
  VIHCLE_CATEGORY_SPECIALIZED,
  VIHCLE_CATEGORY_PICKUP,
  VIHCLE_CATEGORY_MOOC,
  VIHCLE_CATEGORY_GROUP,
  VEHICLE_SUB_TYPE,
  PLATE_COLOR,
  VIHCLE_CATEGORY_OTO,
  VIHCLE_CATEGORY_BUS,
  VIHCLE_CATEGORY_TRUCK,
} from "constants/scheduleStatus";
import useCommonData from "hooks/CommonData";
import { CopyOutlined } from "@ant-design/icons";
import InspectionProcessService from "./../../services/inspectionProcessService";
import { useLocation } from "react-router-dom";
import "./setting.scss";
import { filter } from "lodash";

const MiniApp = () => {
  const { t: translation } = useTranslation();
  const location = useLocation();
  const searchparam = location.search;
  const params = new URLSearchParams(searchparam);
  const [vehicleSubCategoryOptions, setVehicleSubCategoryOptions] =
    useState(VIHCLE_CATEGORY_OTO);
  const { metaData } = useCommonData();

  const newType = Object.values(metaData?.SCHEDULE_TYPE).map((el) => {
    return {
      ...el,
      label: el.scheduleTypeName,
      value: el.scheduleType,
    };
  });
  const [settingData, setSettingData] = useState({});
  const [area, setArea] = useState([]);
  const [station, setStation] = useState([])
  // const [hiddens, setHiddens] = useState(true)
  const [data, setData] = useState({
    partner: null,
    stationArea: null,
    stationsCode: null,
    visible_StationArea: true,
    visible_StationsCode: true,
    scheduleType: 1,
    firstName: null,
    phoneNumber: null,
    vehicleIdentity: null,
    vehiclePlateColor: 1,
    vehicleSubCategory: 1001,
    vehicleSubType: 1,
    certificateSeries: '',
    visible_firstName: false,
    visible_phoneNumber: false,
    visible_vehicleIdentity: false,
    visible_vehicleType: null,
    visible_vehiclePlateColor: true,
    visible_vehicleSubCategory: false,
    visible_vehicleSubType: false,
    visible_certificateSeries: true,
    require_firstName: true,
    require_phoneNumber: true,
    require_vehicleIdentity: true,
    require_vehicleType: null,
    require_vehiclePlateColor: true,
    require_vehicleSubCategory: false,
    require_vehicleSubType: true,
    require_certificateSeries: false,
    stationsId: null
  });

  const handleOnchange = (name, value) => {
    if(name === 'vntId'){
      const obj = area?.filter(el => el.value === value)
      fetchDataStation(obj[0]?.label)
    }
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleCategory = (evt) => {
    if(evt === undefined){
      return
    }
    const categoryOptionsMap = {
      [VEHICLE_SUB_CATEGORY.CAR]: VIHCLE_CATEGORY_OTO,
      [VEHICLE_SUB_CATEGORY.PASSENGER]: VIHCLE_CATEGORY_BUS,
      [VEHICLE_SUB_CATEGORY.TRUCKER]: VIHCLE_CATEGORY_TRUCK,
      [VEHICLE_SUB_CATEGORY.GROUP]: VIHCLE_CATEGORY_GROUP,
      [VEHICLE_SUB_CATEGORY.ROMOOCL]: VIHCLE_CATEGORY_MOOC,
      [VEHICLE_SUB_CATEGORY.CAR_SPECIALIZED]: VIHCLE_CATEGORY_PICKUP,
      [VEHICLE_SUB_CATEGORY.ORTHER]: VIHCLE_CATEGORY_SPECIALIZED,
    };

    const options = categoryOptionsMap[evt];
    setVehicleSubCategoryOptions(options);
    data.vehicleSubCategory = options[0].value;
  };

  function handleCopyItem(value) {
    navigator.clipboard.writeText(value);
    message.success(translation("setting.copied"));
  }

  const fetchData = async () => {
    const result = await InspectionProcessService.getApikey({});
    if (result) {
      setSettingData(result.data.data);
    }
  };

  const fetchDataArea = async () => {
    const result = await InspectionProcessService.getAllStationArea({});
    if (result) {
      const newArr = result.data.map((el) => {
        return {
          label: el.value,
          value: el.value,
        };
      });
      setArea(newArr);
      const getMiniAppDefault = JSON.parse(localStorage.getItem("MiniAppDefault")) || data
      setData(getMiniAppDefault)
      fetchDataStation(getMiniAppDefault.vntId)
      handleCategory(getMiniAppDefault.vehicleSubType)
    }
  };

  const fetchDataStation = async (label) => {
    const param = {
      filter :{
        stationArea : label
      }
    }
    const result = await InspectionProcessService.getAllExternal(param);
    if (result) {
      const newArr = result?.data?.data?.map((el) => {
        return {
          label: el.stationCode,
          value: el.stationsId,
        };
      });
      setStation(newArr);
    }
    // setHiddens(false)
  };

  useEffect(() => {
    fetchData();
    fetchDataArea();
  }, []);

  let param = `https://partner.ttdk.com.vn/?apikey=${settingData[0]?.apiKey}`;
  Object.entries(data).forEach(([key, value]) => (param += `&${key}=${value}`));
  let paramIfram = `<iframe src=${param} width={500} height={600} style={{ border: "1px solid" }} />`;

  const handleSave = () =>{
    localStorage.setItem("MiniAppDefault" , JSON.stringify(data))
    notification['success']({
      message: "",
      description: translation("customerSettings.updateSettingsSuccess")
    })
  }

  return (
    <Fragment>
      <Row>
        <Col lg={6} md={12} sm={12} xs={24}>
          <h6>{translation("setting.display_value")}</h6>
          <Row gutter={[16, 16]} className="mt-3">
            <Col span={10}>
              <div>{translation("setting.logo_partner")}</div>
            </Col>
            <Col span={10}>
              <Input
                onChange={(e) => handleOnchange("partner", e.target.value)}
                placeholder="Logo url"
                value={data.partner}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]} className="mt-3">
            <Col span={10}>
              <div>{translation("setting.area")}</div>
            </Col>
            <Col span={10}>
              <SelectAntd
                onChange={(e) => {
                  handleOnchange("vntId", e);
                }}
                options={area}
                defaultValue={data.stationArea}
                className="w-100"
                placeholder="Khu vực"
                value={area.find(el => el.label === data.vntId)}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]} className="mt-3">
            <Col span={10}>
              <div>{translation("landing.stationCode")}</div>
            </Col>
            <Col span={10}>
               <Select
                onChange={(e) => {
                  handleOnchange("stationsId", e);
                }}
                options={station}
                // defaultValue={data.stationsCode}
                // disabled={hiddens}
                className="w-100"
                placeholder="Mã trạm"
                value={station.find(el => el.value === data.stationsId)}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]} className="mt-3">
            <Col span={10}>
              <div>{translation("management.fullName")}</div>
            </Col>
            <Col span={10}>
              <Input onChange={(e) => handleOnchange("name", e.target.value)} value={data.name}/>
            </Col>
          </Row>
          <Row gutter={[16, 16]} className="mt-3">
            <Col span={10}>
              <div>{translation("listSchedules.phoneNumber")}</div>
            </Col>
            <Col span={10}>
              <Input
                onChange={(e) => handleOnchange("phone", e.target.value)}
                value={data.phone}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]} className="mt-3">
            <Col span={10}>
              <div>{translation("landing.appointment_purpose")}</div>
            </Col>
            <Col span={10}>
              <SelectAntd
                onChange={(e) => {
                  handleOnchange("scheduleType", e);
                }}
                options={newType}
                defaultValue={data.scheduleType}
                className="w-100"
                value={newType.find(el => el.scheduleType === data.scheduleType)}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]} className="mt-3">
            <Col span={10}>
              <div>{translation("landing.license-plates")}</div>
            </Col>
            <Col span={10}>
              <Input
                onChange={(e) =>
                  handleOnchange("licensePlates", e.target.value)
                }
                value={data.licensePlates}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]} className="mt-3">
            <Col span={10}>
              <div>{translation("landing.transportation")}</div>
            </Col>
            <Col span={10}>
              <SelectAntd
                onChange={(e, vehicleType) => {
                  handleCategory(e);
                  setData({
                    ...data,
                    vehicleType: vehicleType.vehicleType,
                  });
                  handleOnchange("vehicleSubType", e);
                }}
                options={VEHICLE_SUB_TYPE}
                defaultValue={VEHICLE_SUB_TYPE[0]}
                className="w-100"
                value={VEHICLE_SUB_TYPE.find(el => el.value === data.vehicleSubType)}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]} className="mt-3">
            <Col span={10}>
              <div>{translation("landing.classify")}</div>
            </Col>
            <Col span={10}>
              <SelectAntd
                onChange={(e) => {
                  handleOnchange("vehicleSubCategory", e);
                }}
                value={data.vehicleSubCategory}
                options={vehicleSubCategoryOptions}
                className="w-100"
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]} className="mt-3">
            <Col span={10}>
              <div>{translation("accreditation.licensePlateColorLabel")}</div>
            </Col>
            <Col span={10}>
              <SelectAntd
                onChange={(e) => handleOnchange("licensePlateColor", e)}
                options={PLATE_COLOR}
                className="w-100"
                value={PLATE_COLOR.find(el => el.value === data.licensePlateColor)}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]} className="mt-3">
            <Col span={10}>
              <div>{translation("landing.code_gcn")}</div>
            </Col>
            <Col span={10}>
              <Input
                onChange={(e) =>
                  handleOnchange("certificateSeries", e.target.value)
                }
                value={data.certificateSeries}
              />
            </Col>
          </Row>
        </Col>
        <Col lg={5} md={12} sm={12} xs={24}>
          <h6>{translation("sms.show")}</h6>
          <Row gutter={[16, 16]} className="mt-3 smsrow">
            <Col span={15}>
              <div>{translation("setting.show_area")}</div>
            </Col>
            <Col span={7}>
              <Switch
                checked={data.visible_StationArea === true ? true : false}
                onChange={(checked) => {
                  handleOnchange("visible_StationArea", checked);
                }}
                value={data.visible_StationArea}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]} className="mt-3 smsrow">
            <Col span={15}>
              <div>{translation("setting.show_code")}</div>
            </Col>
            <Col span={7}>
              <Switch
                checked={data.visible_StationsCode === true ? true : false}
                onChange={(checked) =>
                  handleOnchange("visible_StationsCode", checked)
                }
                value={data.visible_StationsCode}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]} className="mt-3 smsrow">
            <Col span={15}>
              <div>{translation("setting.show_fullname")}</div>
            </Col>
            <Col span={7}>
              <Switch
                checked={data.visible_firstName === true ? true : false}
                onChange={(checked) =>
                  handleOnchange("visible_firstName", checked)
                }
                value={data.visible_firstName}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]} className="mt-3 smsrow">
            <Col span={15}>
              <div>{translation("setting.show_phone")}</div>
            </Col>
            <Col span={7}>
              <Switch
                checked={data.visible_phoneNumber === true ? true : false}
                onChange={(checked) =>
                  handleOnchange("visible_phoneNumber", checked)
                }
                value={data.visible_phoneNumber}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]} className="mt-3 smsrow">
            <Col span={15}>
              <div>{translation("setting.show_bsx")}</div>
            </Col>
            <Col span={7}>
              <Switch
                checked={data.visible_vehicleIdentity === true ? true : false}
                onChange={(checked) =>
                  handleOnchange("visible_vehicleIdentity", checked)
                }
                value={data.visible_vehicleIdentity}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]} className="mt-3 smsrow">
            <Col span={15}>
              <div>{translation("setting.show_colorPlate")}</div>
            </Col>
            <Col span={7}>
              <Switch
                checked={data.visible_vehiclePlateColor === true ? true : false}
                onChange={(checked) =>
                  handleOnchange("visible_vehiclePlateColor", checked)
                }
                value={data.visible_vehiclePlateColor}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]} className="mt-3 smsrow">
            <Col span={15}>
              <div>{translation("setting.show_transportation")}</div>
            </Col>
            <Col span={7}>
              <Switch
                checked={data.visible_vehicleSubType === true ? true : false}
                onChange={(checked) =>
                  handleOnchange("visible_vehicleSubType", checked)
                }
                value={data.visible_vehicleSubType}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]} className="mt-3 smsrow">
            <Col span={15}>
              <div>{translation("setting.show_classify")}</div>
            </Col>
            <Col span={7}>
              <Switch
                checked={
                  data.visible_vehicleSubCategory === true ? true : false
                }
                onChange={(checked) =>
                  handleOnchange("visible_vehicleSubCategory", checked)
                }
                value={data.visible_vehicleSubCategory}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]} className="mt-3 smsrow">
            <Col span={15}>
              <div>{translation("setting.show_gcn")}</div>
            </Col>
            <Col span={7}>
              <Switch
                checked={data.visible_certificateSeries === true ? true : false}
                onChange={(checked) =>
                  handleOnchange("visible_certificateSeries", checked)
                }
                value={data.visible_certificateSeries}
              />
            </Col>
          </Row>
        </Col>
        <Col lg={5} md={12} sm={12} xs={24}>
          <h6>{translation("setting.required_field")}</h6>
          <Row gutter={[16, 16]} className="mt-3 smsrow">
            <Col span={15}>
              <div>{translation("setting.require_fullname")}</div>
            </Col>
            <Col span={7}>
              <Switch
                checked={data.require_firstName === true ? true : false}
                onChange={(checked) =>
                  handleOnchange("require_firstName", checked)
                }
                value={data.require_firstName}
              />
            </Col>
          </Row>
          {/* <Row gutter={[16, 16]} className="mt-3 smsrow">
            <Col span={10}>
              <div>{translation("setting.require_phone")}</div>
            </Col>
            <Col span={10}>
              <Switch
                checked={data.require_phoneNumber === true ? true : false}
                onChange={(checked) =>
                  handleOnchange("require_phoneNumber", checked)
                }
                value={data.require_phoneNumber}
              />
            </Col>
          </Row> */}
          {/* <Row gutter={[16, 16]} className="mt-3 smsrow">
            <Col span={10}>
              <div>{translation("setting.require_bsx")}</div>
            </Col>
            <Col span={10}>
              <Switch
                checked={data.require_vehicleIdentity === true ? true : false}
                onChange={(checked) =>
                  handleOnchange("require_vehicleIdentity", checked)
                }
                value={data.require_vehicleIdentity}
              />
            </Col>
          </Row> */}
          <Row gutter={[16, 16]} className="mt-3 smsrow">
            <Col span={15}>
              <div>{translation("setting.require_colorPlate")}</div>
            </Col>
            <Col span={7}>
              <Switch
                checked={data.require_vehiclePlateColor === true ? true : false}
                onChange={(checked) =>
                  handleOnchange("require_vehiclePlateColor", checked)
                }
                value={data.require_vehiclePlateColor}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]} className="mt-3 smsrow">
            <Col span={15}>
              <div>{translation("setting.require_transportation")}</div>
            </Col>
            <Col span={7}>
              <Switch
                checked={data.require_vehicleSubType === true ? true : false}
                onChange={(checked) =>
                  handleOnchange("require_vehicleSubType", checked)
                }
                value={data.require_vehicleSubType}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]} className="mt-3 smsrow">
            <Col span={15}>
              <div>{translation("setting.require_classify")}</div>
            </Col>
            <Col span={7}>
              <Switch
                checked={
                  data.require_vehicleSubCategory === true ? true : false
                }
                onChange={(checked) =>
                  handleOnchange("require_vehicleSubCategory", checked)
                }
                value={data.require_vehicleSubCategory}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]} className="mt-3 smsrow">
            <Col span={15}>
              <div>{translation("setting.require_gcn")}</div>
            </Col>
            <Col span={7}>
              <Switch
                checked={data.require_certificateSeries === true ? true : false}
                onChange={(checked) =>
                  handleOnchange("require_certificateSeries", checked)
                }
                value={data.require_certificateSeries}
              />
            </Col>
          </Row>
        </Col>
        <Col lg={6} md={12} sm={12} xs={24}>
          <h6>{translation("setting.preview")}</h6>
          <Row gutter={[16, 16]} className="mt-3">
            <Col span={8}>
              <div>{translation("setting.path_miniApp")}</div>
            </Col>
            <Col span={14}>
              <Input value={param} disabled />
            </Col>
            <Col span={2}>
              <CopyOutlined
                style={{ fontSize: 20, cursor: "pointer" }}
                onClick={() => handleCopyItem(param)}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]} className="mt-3">
            <Col span={8}>
              <div>{translation("setting.integrated_code")}</div>
            </Col>
            <Col span={14}>
              <Input value={paramIfram} disabled />
            </Col>
            <Col span={2}>
              <CopyOutlined
                style={{ fontSize: 20, cursor: "pointer" }}
                onClick={() => handleCopyItem(paramIfram)}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]} className="mt-3">
            <iframe
              src={param}
              width={500}
              height={600}
              style={{ border: "1px solid" }}
            />
          </Row>
          <Row>
            <Button type="primary" onClick={() => handleSave()} className="mt-3">
                {translation('setting.bankTransferModal.saveButton')}
            </Button>
          </Row>
        </Col>
      </Row>
    </Fragment>
  );
};

export default MiniApp;
