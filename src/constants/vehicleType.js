export const optionVehicleType = (translation) => {
  return (
    [
      {
        value: 1,
        label: translation("accreditation.car"),
      },
      {
        value: 20,
        label: translation("accreditation.Trailers"),
      },
      {
        value: 10,
        label: translation("accreditation.otherVehicles"),
      },
    ]
  )
}

export const optionVehicleCalendar = (translation) => {
  return [
    {
      name: translation("accreditation.car"),
      enable: 1,
    },
    {
      name: translation("accreditation.Trailers"),
      enable: 1,
    },
    {
      name: translation("accreditation.otherVehicles"),
      enable: 1,
    },
  ]
}

export const VEHICLE_FILE_TYPE =  {
  IMAGE: 1, // hình ảnh   
  DOCUMENT: 2, // tài liệu 
}

export const LIST_CONVERT_COLOR_VEHICLE = {
  T: "WHITE",
  B: "BLUE",
  V: "YELLOW",
  R: "RED"
}

export const VEHICLE_FUEL_TYPE = {
  GASOLINE: 1, // Xăng
  OIL: 2, // Dầu
}

export const getLabelVehicleFuelType = (translation) => {
  return {
    [VEHICLE_FUEL_TYPE.GASOLINE]: translation("vehicleRecords.vehicleFuelType.gasoline"),
    [VEHICLE_FUEL_TYPE.OIL]: translation("vehicleRecords.vehicleFuelType.oil")
  }
}

export const optionVehicleFuelType = (translation) => {
  return (
    [
      {
        value: VEHICLE_FUEL_TYPE.GASOLINE,
        label: translation("vehicleRecords.vehicleFuelType.gasoline"),
      },
      {
        value: VEHICLE_FUEL_TYPE.OIL,
        label: translation("vehicleRecords.vehicleFuelType.oil"),
      }
    ]
  )
}