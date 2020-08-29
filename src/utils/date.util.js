class DateUtil {
  getDateFromLocalDateTime(localDateTime) {
    return Date.UTC(localDateTime[0], localDateTime[1]-1, localDateTime[2], localDateTime[3], localDateTime[4]);
  }
  
  getLastScoreDate(scores) {
    let date = Date.UTC(2020, 1, 1, 0, 0);
    for (let key in scores) {
      let scoreDate = this.getDateFromLocalDateTime(scores[key].date);
      if (scoreDate > date) date = scoreDate;
    }
    return date;
  }
}

export default new DateUtil();