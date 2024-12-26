import React from 'react';
import {
  BlockOutlined,
  CarOutlined,
  CarryOutOutlined,
  CheckOutlined, CloseOutlined,
  ColumnWidthOutlined,
  ContainerOutlined,
  DatabaseOutlined,
  FireOutlined,
  PullRequestOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  ToolOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { getLabelVehicleFuelType } from 'constants/vehicleType';


const TechnicalSpecificationsDetailItem = ({ icon, text, value }) => {
  const { t: translation } = useTranslation()
  const Icon = icon;

  return (
    <div className="col-12">
      <div className="d-flex align-items-start">
        <div>
          <span className="booking-text me-2">{text}:</span>
          <span className="booking-value mb-0">
            {value}
          </span>
        </div>
      </div>
    </div>
  )
}

function TechnicalSpecificationsDetail({ vehicleRecord }) {
  const { t: translation } = useTranslation()

  return (
    <div className="row">
      <h3 className="management-title">{translation("vehicleRecords.title.wheels")}</h3>
      <TechnicalSpecificationsDetailItem
        icon={CarOutlined}
        text={translation("vehicleRecords.wheelFormula")}
        value={vehicleRecord.wheelFormula}
      />

      <TechnicalSpecificationsDetailItem
        icon={ToolOutlined}
        text={translation("vehicleRecords.wheelTrack")}
        value={vehicleRecord.wheelTreat}
      />

      <h3 className="management-title mt-2">{translation("vehicleRecords.title.dimensions")}</h3>
      <TechnicalSpecificationsDetailItem
        icon={DatabaseOutlined}
        text={translation("vehicleRecords.overallDimensions")}
        value={vehicleRecord.overallDimension}
      />

      <TechnicalSpecificationsDetailItem
        icon={ContainerOutlined}
        text={translation("vehicleRecords.cargoDimensions")}
        value={vehicleRecord.truckDimension}
      />

      <TechnicalSpecificationsDetailItem
        icon={ColumnWidthOutlined}
        text={translation("vehicleRecords.wheelbase")}
        value={vehicleRecord.wheelBase}
      />

      <h3 className="management-title mt-2">{translation("vehicleRecords.title.weight")}</h3>
      <TechnicalSpecificationsDetailItem
        icon={CarryOutOutlined}
        text={translation("vehicleRecords.unladenWeight")}
        value={vehicleRecord.vehicleWeight}
      />

      <TechnicalSpecificationsDetailItem
        icon={CarryOutOutlined}
        text={translation("vehicleRecords.authorizedPayload")}
        value={vehicleRecord.vehicleGoodsWeight}
      />

      <TechnicalSpecificationsDetailItem
        icon={SafetyCertificateOutlined}
        text={translation("vehicleRecords.authorizedTotalWeight")}
        value={vehicleRecord.vehicleTotalWeight}
      />

      <TechnicalSpecificationsDetailItem
        icon={PullRequestOutlined}
        text={translation("vehicleRecords.authorizedTowedMass")}
        value={vehicleRecord.vehicleTotalMass}
      />

      <h3 className="management-title mt-2">{translation("vehicleRecords.title.vehicleDescription")}</h3>
      <TechnicalSpecificationsDetailItem
        icon={TeamOutlined}
        text={translation("vehicleRecords.seatingCapacity")}
        value={vehicleRecord.vehicleSeatsLimit}
      />

      <TechnicalSpecificationsDetailItem
        icon={TeamOutlined}
        text={translation("vehicleRecords.vehicleFootholdLimit")}
        value={vehicleRecord.vehicleFootholdLimit}
      />

      <TechnicalSpecificationsDetailItem
        icon={TeamOutlined}
        text={translation("vehicleRecords.vehicleBerthLimit")}
        value={vehicleRecord.vehicleBerthLimit}
      />

      <TechnicalSpecificationsDetailItem
        icon={FireOutlined}
        text={translation("vehicleRecords.fuelType")}
        value={<span>{getLabelVehicleFuelType(translation)[vehicleRecord.vehicleFuelType]}</span>}
      />

      <h3 className="management-title mt-2">{translation("vehicleRecords.title.engine")}</h3>
      <TechnicalSpecificationsDetailItem
        icon={ToolOutlined}
        text={translation("vehicleRecords.engineDisplacement")}
        value={vehicleRecord?.engineDisplacement}
      />

      <TechnicalSpecificationsDetailItem
        icon={ThunderboltOutlined}
        text={translation("vehicleRecords.maxOutput")}
        value={vehicleRecord.revolutionsPerMinute}
      />

      <TechnicalSpecificationsDetailItem
        icon={BlockOutlined}
        text={translation("vehicleRecords.tireSize")}
        value={
          <p className="booking-value mb-0">
            <p className='booking-item-note'>
              <pre className='text-i notes-code'>{vehicleRecord?.vehicleTires}</pre>
            </p>
          </p>}
      />
    </div>
  );
}

export default TechnicalSpecificationsDetail;