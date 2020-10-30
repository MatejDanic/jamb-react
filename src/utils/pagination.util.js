function pagination() {
    let rowsPerPage = 10;
    let tbody = document.getElementById("tbody");
    let tbodyLength = tbody.rows.length;
    if (tbodyLength < rowsPerPage) return;
    let numOfPages = 0;
    if (tbodyLength % rowsPerPage === 0) {
        numOfPages = tbodyLength / rowsPerPage;
    }
    if (tbodyLength % rowsPerPage >= 1) {
        numOfPages = tbodyLength / rowsPerPage;
        numOfPages++;
        numOfPages = Math.floor(numOfPages++);
    }
    let pageList = [];
    let currentPage = parseInt(document.getElementById("current-page").label, 10);
    if (numOfPages > 1) {
        pageList.push(1);

        for (let i = -1; i <= 1; i++) {
            if (currentPage + i > 1 && currentPage + i < numOfPages)
                pageList.push(currentPage + i);
        }

        pageList.push(numOfPages)
    }
    document.getElementById("pagination").innerHTML = "";
    pageList.forEach((p) => {
        // -------------------- BUTTON PREVIOUS --------------------
        if (p === currentPage - 1 && currentPage > 3) {
            let node = createPaginationButton(tbody, "<<", currentPage - 2, rowsPerPage);
            document.getElementById('pagination').appendChild(node);
        }

        // -------------------- BUTTON WITH PAGE NUMBER --------------------
        let node = createPaginationButton(tbody, p, p, rowsPerPage);
        if (p === currentPage) {
            node.disabled = true;
        }
        document.getElementById('pagination').appendChild(node);

        // -------------------- BUTTON NEXT --------------------
        if (p === currentPage + 1 && currentPage < numOfPages - 2) {
            let node = createPaginationButton(tbody, ">>", currentPage + 2, rowsPerPage);
            document.getElementById('pagination').appendChild(node);
        }
    });
    for (let i = 0; i < tbodyLength; i++) {
        if (i < (currentPage - 1) * rowsPerPage || i >= currentPage * rowsPerPage) {
            if (document.getElementById(tbody.rows[i].id)) document.getElementById(tbody.rows[i].id).style.display = "none";
        }
    }
}

function createPaginationButton(tbody, text, page, rowsPerPage) {
    let tbodyLength = tbody.rows.length;
    let node = document.createElement("BUTTON");
    node.className = "button-pagination";
    node.innerText = text;
    node.onclick = function (e) {
        e.preventDefault();
        for (let i = 0; i < tbodyLength; i++) {
            if (document.getElementById(tbody.rows[i].id)) document.getElementById(tbody.rows[i].id).style.display = "none";
        }
        let temp = page - 1;
        let start = temp * rowsPerPage;
        document.getElementById("current-page").label = page;
        for (let j = 0; j < rowsPerPage; j++) {
            let k = start + j;
            if (k < tbodyLength && document.getElementById(tbody.rows[k].id)) document.getElementById(tbody.rows[k].id).style.display = "";
        }
        window.scrollTo(0, document.body.scrollHeight);
        pagination();
    }
    return node;
}
export { pagination };
export { createPaginationButton };