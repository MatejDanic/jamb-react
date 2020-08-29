class DateUtil {
  getDateFromLocalDateTime(localDateTime) {
    return Date.UTC(localDateTime[0], localDateTime[1]-1, localDateTime[2], localDateTime[3], localDateTime[4]);
  }
}

export default new DateUtil();