import { pagination } from "./pagination.util";
import DateUtil from "./date.util";

let index;      // cell index
let toggleBool; // sorting asc, desc 
function sortTable(idx, order) {
  index = idx;
  if (order != null) toggleBool = order;
  if (toggleBool) {
    toggleBool = false;
  } else {
    toggleBool = true;
  }
  let tbody = document.getElementById("tbody");
  let datas = [];
  let tbodyLength = tbody.rows.length;
  for (let i = 0; i < tbodyLength; i++) {
    document.getElementById(tbody.rows[i].id).style.display = "";
  }
  for (let i = 0; i < tbodyLength; i++) {
    datas[i] = tbody.rows[i];
  }
  // sort by cell[index] 
  datas.sort(compareCells);
  for (let i = 0; i < tbody.rows.length; i++) {
    // rearrange table rows by sorted rows
    tbody.appendChild(datas[i]);
  }
  pagination();
}

function compareCells(a, b) {
  let aVal = a.cells[index].innerText;
  let bVal = b.cells[index].innerText;

  aVal = aVal.replace(/,/g, '');
  bVal = bVal.replace(/,/g, '');

  if (toggleBool) {
    let temp = aVal;
    aVal = bVal;
    bVal = temp;
  }
  
  if (aVal.includes(".") || aVal.includes(":") || bVal.includes(".") || bVal.includes(":")) {
    return DateUtil.compareDateStrings(aVal, bVal);
  }

  if (aVal.match(/^[0-9]+$/) && bVal.match(/^[0-9]+$/)) {
    return parseFloat(aVal) - parseFloat(bVal);
  }
  else {
    aVal = aVal.toLowerCase();
    bVal = bVal.toLowerCase();
    if (aVal < bVal) {
      return -1;
    } else if (aVal > bVal) {
      return 1;
    } else {
      return 0;
    }
  }
}

export {sortTable}