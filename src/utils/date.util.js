class DateUtil {
  getDateFromLocalDateTime(localDateTime) {
    return Date.UTC(localDateTime[0], localDateTime[1] - 1, localDateTime[2], localDateTime[3], localDateTime[4]);
  }

  compareDateStrings(aVal, bVal) {
    if (aVal === "-----" && bVal === "-----") {
      return 0;
    } else if (aVal === "-----") {
      return -1;
    } else if (bVal === "-----") {
      return 1;
    }
    let aList = aVal.split(".");
    let bList = bVal.split(".");
    let aDate, bDate;
    if (aList.length === 4 && !aList[3]) {
      aDate = Date.parse(aList[1], aList[0], aList[2]);
      bDate = Date.parse(bList[1], bList[0], bList[2]);
    } else if (aList.length === 4 && aList[3]) {
      aDate = Date.parse(aList[1], aList[0], aList[2], aList[3]);
      bDate = Date.parse(bList[1], bList[0], bList[2], aList[3]);
    }
    let diff = aDate - bDate;
    return diff === 0 ? 0 : (diff > 0 ? 1 : -1);
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