export const STATION_DEVICES_STATUS = {
  NEW: "NEW",// Mới
  ACTIVE: "ACTIVE",// Đang hoạt động
  MAINTENANCE: "MAINTENANCE", // Bảo trì
  INACTIVE: "INACTIVE", // Ngừng hoạt động
  MAINTENANCE_SERVICE: 'MAINTENANCE_SERVICE', // Bảo dưỡng
  REPAIR: 'REPAIR' // Sửa chữa
}

export const getStationDevicesState = (translation) => ({
  [STATION_DEVICES_STATUS.NEW]: translation("device.status.new"),
  [STATION_DEVICES_STATUS.ACTIVE]: translation("device.status.active"),
  [STATION_DEVICES_STATUS.MAINTENANCE]: translation("device.status.maintenance"),
  [STATION_DEVICES_STATUS.INACTIVE]: translation("device.status.inactive"),
  [STATION_DEVICES_STATUS.MAINTENANCE_SERVICE]: translation("device.status.maintenance_service"),
  [STATION_DEVICES_STATUS.REPAIR]: translation("device.status.repair")
});

export const getStationDeviceStatusOptions = (translation) => {
  return [
    { label: translation("all"), value: "" },
    { label: translation("device.status.new"), value: STATION_DEVICES_STATUS.NEW },
    { label: translation("device.status.active"), value: STATION_DEVICES_STATUS.ACTIVE },
    { label: translation("device.status.maintenance"), value: STATION_DEVICES_STATUS.MAINTENANCE },
    { label: translation("device.status.inactive"), value: STATION_DEVICES_STATUS.INACTIVE },
    { label: translation("device.status.maintenance_service"), value: STATION_DEVICES_STATUS.MAINTENANCE_SERVICE },
    { label: translation("device.status.repair"), value: STATION_DEVICES_STATUS.REPAIR }
  ];
};

export const getStatusOptionsWithoutAll = (translation) => {
  return getStationDeviceStatusOptions(translation).filter(
    option => option.label !== translation("all")
  );
};