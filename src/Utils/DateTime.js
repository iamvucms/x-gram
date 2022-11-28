import Moment from 'moment'

export const format_ddMMyyyy = 'DD/MM/yyyy'
export const format_dd_mm_yyyy = 'DD-MM-yyyy'
export const format_hhmmDDMM = 'HH:mm, DD/MM'
export const format_DDMMHHmmm = 'DD-MM HH:mm'
export const format_hhMMDDMMYYYY = 'HH:mm, DD/MM/yyyy'
export const format_ddmm = 'DD/MM'
export const format_ddMMyyyy_hhmm = 'DD/MM/yyyy  |  hh:mm'
export const format_yyyyMMddTHHmmssZ = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
export const format_yyyyMMdd_HHmmss = 'YYYY-MM-DD HH-mm-ss'
export const format_yyyyMMdd_HHmmssz = 'YYYY-MM-DD HH:mm:ss'
export const format_yyyyMMdd = 'yyyy-MM-DD'
export const format_HHmmss = 'HH:mm:ss'
export const format_DDMMHHmm = 'DD/MM - HH:mm'
export const format_HHmm = 'HH:mm'
export const format_MMDD = 'MM-DD'
export const format_DDMM = 'DD-MM'

export function formatDate({ dateTime, format = 'HH:mm DD/MM/yyyy' }) {
  return Moment(dateTime).format(format)
}

export function secondToTime(second) {
  const hours = Math.floor(second / 3600)
  const minutes = Math.floor((second - hours * 3600) / 60)
  const seconds = second - hours * 3600 - minutes * 60
  return {
    hours: hours < 10 ? `0${hours}` : hours,
    minutes: minutes < 10 ? `0${minutes}` : minutes,
    seconds: seconds < 10 ? `0${seconds}` : seconds,
  }
}
export function getWeekdays(t) {
  return [
    t('date.mon'),
    t('date.tue'),
    t('date.wed'),
    t('date.thu'),
    t('date.fri'),
    t('date.sat'),
    t('date.sun'),
  ]
}
export function getMonths(t) {
  return [
    t('date.jan'),
    t('date.feb'),
    t('date.mar'),
    t('date.apr'),
    t('date.may'),
    t('date.jun'),
    t('date.jul'),
    t('date.aug'),
    t('date.sep'),
    t('date.oct'),
    t('date.nov'),
    t('date.dec'),
  ]
}
