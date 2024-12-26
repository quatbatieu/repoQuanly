export const geScheduleError = (translation) => {
  return {
    INVALID_STATION: translation("addBookingSuccess.ScheduleError.INVALID_STATION"),
    INVALID_BOOKING_CONFIG: translation("addBookingSuccess.ScheduleError.INVALID_BOOKING_CONFIG"),
    BOOKING_MAX_LIMITED_BY_CONFIG: translation("addBookingSuccess.ScheduleError.BOOKING_MAX_LIMITED_BY_CONFIG"),
    BOOKING_MAX_LIMITED: translation("addBookingSuccess.ScheduleError.BOOKING_MAX_LIMITED"),
    UNCONFIRMED_BOOKING_EXISTED: translation("addBookingSuccess.ScheduleError.UNCONFIRMED_BOOKING_EXISTED"),
    INVALID_DATE: translation("addBookingSuccess.ScheduleError.INVALID_DATE"),
    BLOCK_USER_BOOKING_SCHEDULE: translation("addBookingSuccess.ScheduleError.BLOCK_USER_BOOKING_SCHEDULE"),
    BOOKING_ON_DAY_OFF: translation("addBookingSuccess.ScheduleError.BOOKING_ON_DAY_OFF"),
    BOOKING_ON_SUNDAY: translation("addBookingSuccess.ScheduleError.BOOKING_ON_SUNDAY"),
    INVALID_REQUEST: translation("addBookingSuccess.ScheduleError.INVALID_REQUEST"),
    MAX_LIMIT_SCHEDULE_BY_USER: translation("addBookingSuccess.ScheduleError.MAX_LIMIT_SCHEDULE_BY_USER"),
    MAX_LIMIT_SCHEDULE_BY_PHONE: translation("addBookingSuccess.ScheduleError.MAX_LIMIT_SCHEDULE_BY_PHONE"),
    MAX_LIMIT_SCHEDULE_BY_PLATE_NUMBER: translation("addBookingSuccess.ScheduleError.MAX_LIMIT_SCHEDULE_BY_PLATE_NUMBER"),
    ALREADY_CANCEL: translation("addBookingSuccess.ScheduleError.ALREADY_CANCEL"),
    CONFIRMED_BY_STATION_STAFF: translation("addBookingSuccess.ScheduleError.CONFIRMED_BY_STATION_STAFF"),
    EARLY_BOOKING: translation("addBookingSuccess.ScheduleError.EARLY_BOOKING"),
    BLOCK_BOOKING_BY_PHONE: translation("addBookingSuccess.ScheduleError.BLOCK_BOOKING_BY_PHONE"),
    INVALID_BOOKING_DATE: translation("addBookingSuccess.ScheduleError.INVALID_BOOKING_DATE"),
    BOOKING_ON_TODAY: translation("addBookingSuccess.ScheduleError.BOOKING_ON_TODAY"),
    MAX_LIMIT_SCHEDULE_BY_VEHICLE_COUNT: translation("addBookingSuccess.ScheduleError.MAX_LIMIT_SCHEDULE_BY_VEHICLE_COUNT"),
    INVALID_CERTIFICATE_SERIES: translation("addBookingSuccess.ScheduleError.INVALID_CERTIFICATE_SERIES"),
    STATION_NOT_ACCEPT_VEHICLE: translation("addBookingSuccess.ScheduleError.STATION_NOT_ACCEPT_VEHICLE"),
    DUPLICATE_VEHICLE: translation("addBookingSuccess.ScheduleError.DUPLICATE_VEHICLE"),
    VEHICLE_NOT_FOUND: translation("addBookingSuccess.ScheduleError.VEHICLE_NOT_FOUND"),
    INVALID_PLATE_NUMBER: translation("addBookingSuccess.ScheduleError.INVALID_PLATE_NUMBER"),
    MAX_OWNER_VEHICLE: translation("addBookingSuccess.ScheduleError.MAX_OWNER_VEHICLE"),
    MAX_LIMIT_ACCESS: translation("addBookingSuccess.ScheduleError.MAX_LIMIT_ACCESS"),
    INVALID_INPUT: translation("addBookingSuccess.ScheduleError.INVALID_INPUT"),
    NO_DATA: translation("addBookingSuccess.ScheduleError.NO_DATA"),
    INVALID_VEHICLE_CERTIFICATE: translation("addBookingSuccess.ScheduleError.INVALID_VEHICLE_CERTIFICATE"),
    WRONG_VEHICLE_TYPE: translation("addBookingSuccess.ScheduleError.WRONG_VEHICLE_TYPE")
  };

}

export const getVehicleProfile = (translation) => {
  return {
    DUPLICATE_VEHICLE: translation("vehicleRecords.VehicleProfileError.DUPLICATE_VEHICLE"),
    VEHICLE_NOT_FOUND: translation("vehicleRecords.VehicleProfileError.VEHICLE_NOT_FOUND"),
    INVALID_PLATE_NUMBER: translation("vehicleRecords.VehicleProfileError.INVALID_PLATE_NUMBER"),
    EXISTED_PLATE_NUMBER: translation("vehicleRecords.VehicleProfileError.EXISTED_PLATE_NUMBER"),
    EXISTED_ENGINE_NUMBER: translation("vehicleRecords.VehicleProfileError.EXISTED_ENGINE_NUMBER"),
    EXISTED_REGISTRATION_CODE: translation("vehicleRecords.VehicleProfileError.EXISTED_REGISTRATION_CODE"),
    EXISTED_CHASSIS_NUMBER: translation("vehicleRecords.VehicleProfileError.EXISTED_CHASSIS_NUMBER"),
    INVALID_VEHICLE_CERTIFICATE: translation("vehicleRecords.VehicleProfileError.INVALID_VEHICLE_CERTIFICATE"),
    WRONG_VEHICLE_TYPE: translation("vehicleRecords.VehicleProfileError.WRONG_VEHICLE_TYPE"),
    INVALID_VEHICLE_EXPIRATION_DATE: translation("vehicleRecords.VehicleProfileError.INVALID_VEHICLE_EXPIRATION_DATE"),
  };
}

export const getMessageCustomerMarketingError = (translation) => {
  return {
    LACK_OF_KEY_FOR_TEMPLATE: translation("listCustomers.customerMarketingError.LACK_OF_KEY_FOR_TEMPLATE"), //Dữ liệu gửi tin nhắn bị thiếu so với tin mẫu
    DATA_OF_MESSAGE_MISMATCH_WITH_TEMPLATE: translation("listCustomers.customerMarketingError.DATA_OF_MESSAGE_MISMATCH_WITH_TEMPLATE"), //Dữ liệu gửi tin nhắn không phù hợp với tin mẫu
    STATIONS_UNENABLED_SMS: translation("listCustomers.customerMarketingError.STATIONS_UNENABLED_SMS"), //Trung tâm chưa đăng ký tính năng gửi SMS
    STATIONS_UNENABLED_ZNS: translation("listCustomers.customerMarketingError.STATIONS_UNENABLED_ZNS"), //Trung tâm chưa đăng ký tính năng gửi ZNS
    STATIONS_UNENABLED_APNS: translation("listCustomers.customerMarketingError.STATIONS_UNENABLED_APNS"), //Trung tâm chưa đăng ký tính năng gửi APNS
    WRONG_CONFIG: translation("listCustomers.customerMarketingError.WRONG_CONFIG"),
    SEND_APNS_FAILED: translation("listCustomers.customerMarketingError.SEND_APNS_FAILED"),
    SEND_ZNS_FAILED: translation("listCustomers.customerMarketingError.SEND_ZNS_FAILED"),
    PRICE_NEGATIVE: translation("listCustomers.customerMarketingError.PRICE_NEGATIVE"), // giá tiền âm
    INVALID_TEMPLATE: translation("listCustomers.customerMarketingError.INVALID_TEMPLATE"), // Sai mẫu tin nhắn
    INVALID_MESSAGE: translation("listCustomers.customerMarketingError.INVALID_MESSAGE"), // tin nhắn không tồn tại
    INVALID_TEMPLATE_ID: translation("listCustomers.customerMarketingError.INVALID_TEMPLATE_ID"), // Sai templateID ,
    UPDATE_FAILED: translation("listCustomers.customerMarketingError.UPDATE_FAILED"), // Lỗi cập nhật không thành công
    EXCEED_QUANTITY_MESSAGE: translation("listCustomers.customerMarketingError.EXCEED_QUANTITY_MESSAGE"), // Vượt quá số lượng tin nhắn cho phép
    STATION_NOT_FOUND: translation("listCustomers.customerMarketingError.STATION_NOT_FOUND") // Trung tâm không được tìm thấy
  };
}

export const getStationDevicesError = (translation) => {
  return {
    DUPLICATE_SERI: translation("device.StationDevicesError.DUPLICATE_SERI")
  };
}