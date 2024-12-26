import moment from "moment"
import { DATE_DISPLAY_FORMAT } from "constants/dateFormats"

export const convertStingToDate = (date) => {
  if(!date) {
    return ""
  }

  return moment(date, DATE_DISPLAY_FORMAT)
}

export const convertDateToDisplayFormat = (date) => {
  if(!date) {
    return ""
  }
  return moment(date).format(DATE_DISPLAY_FORMAT)
}