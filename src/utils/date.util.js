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
    if (!aList[3] || !bList[3]) {
      aDate = new Date(aList[2], aList[1]-1, aList[0]);
      bDate = new Date(bList[2], bList[1]-1, bList[0]);
    } else {
      let aTime = aList[3].split(":");
      let bTime = bList[3].split(":");
      aDate = new Date(aList[2], aList[1]-1, aList[0], aTime[0], aTime[1]);
      bDate = new Date(bList[2], bList[1]-1, bList[0], bTime[0], bTime[1]); 
    }
    let diff = aDate.getTime() - bDate.getTime();
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