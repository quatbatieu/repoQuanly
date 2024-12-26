import { LICENSE_PLATE_COLOR_STATE } from "constants/listSchedule"
import { getListVehicleTypes , getListLicensePlateColorState } from "constants/listSchedule";
import { getPaymentStatusList } from "constants/receipt";
import { getOptionScheduleStatusState } from "constants/scheduleStatus";
import { useEffect } from "react";

/**
 * Lấy thông tin thay đổi dữ liệu trong lịch sử.
 * @param {object} data - Dữ liệu thay đổi.
 * @param {string} data.dataFieldName - Tên trường dữ liệu.
 * @param {string} data.dataValueAfter - Giá trị sau khi thay đổi.
 * @param {string} data.dataValueBefore - Giá trị trước khi thay đổi.
 * @param {function} translation - Hàm dịch chuỗi.
 * @returns {object} - Thông tin thay đổi dữ liệu.
 */

// Nội dùng Hàm getDataChangeHistory : Dữ liệu database trả về có thể là một con số . 
// hàm này giúp dịch từ con số sang chữ hiển thị UI

export const getDataChangeHistory = ({ dataFieldName, dataValueAfter, dataValueBefore }, translation) => {
  // Danh sách các trường dữ liệu và giá trị dịch tương ứng
  const LIST_FIELD = {
    licensePlates: translation("listSchedules.licensePlates"),
    phone: translation("listSchedules.phoneNumber"),
    fullnameSchedule: translation("listSchedules.fullName"),
    email: "Email",
    dateSchedule: translation("listSchedules.dateSchedule"),
    approveDate : translation("listSchedules.paymentTime"),
    paymentStatus: {
      title: translation("listSchedules.payment.status"),
      externalData: {
        ...getPaymentStatusList(translation)
      },
    },
    time: translation("listSchedules.time"),
    vehicleType: {
      title: translation("listSchedules.vehicleType"),
      externalData: {
        ...getListVehicleTypes(translation)
      },
    },
    licensePlateColor: {
      title: translation("accreditation.licensePlateColor"),
      externalData: {
        ...getListLicensePlateColorState(translation)
      },
    },
    CustomerScheduleStatus: {
     title : translation("listSchedules.CustomerScheduleStatus"),
     externalData : {
      ...getOptionScheduleStatusState(translation)
     }
    },
    scheduleType: translation("listSchedules.scheduleType"),
    attachmentList: translation("listSchedules.attachmentList")
  }

  if (typeof LIST_FIELD[dataFieldName] === 'object') {
    return {
      dataFieldName: LIST_FIELD[dataFieldName].title,
      dataValueAfter: LIST_FIELD[dataFieldName].externalData[dataValueAfter] || translation("DetailSchedules.notConfirmed"),
      dataValueBefore: LIST_FIELD[dataFieldName].externalData[dataValueBefore] || translation("DetailSchedules.notConfirmed")
    };
  }
  return {
    dataFieldName: LIST_FIELD[dataFieldName],
    dataValueAfter,
    dataValueBefore
  }
}