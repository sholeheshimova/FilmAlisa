export function createTablePaginator({
  tableBody,
  pagerEl,
  colSpan,
  pageSize = 8,
  emptyText = "No records yet.",
  renderRow,
}) {
  let items = [];
  let page = 1;

  const totalPages = () => Math.max(1, Math.ceil(items.length / pageSize));

  function renderPager() {
    pagerEl.replaceChildren();
    const pages = totalPages();

    if (items.length === 0 || pages <= 1) {
      pagerEl.classList.add("d-none");
      return;
    }

    pagerEl.classList.remove("d-none");

    const addButton = (label, targetPage, { active = false, nav = false } = {}) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `pager-btn${nav ? " pager-btn--nav" : ""}${active ? " pager-btn--active" : ""}`;
      button.textContent = label;
      button.disabled = targetPage === page;
      button.setAttribute("aria-label", nav ? label : `Page ${label}`);
      if (active) button.setAttribute("aria-current", "page");
      button.addEventListener("click", () => {
        page = targetPage;
        renderPage();
      });
      pagerEl.appendChild(button);
    };

    addButton("Previous", Math.max(1, page - 1), { nav: true });

    const pageNumbers = pages <= 7
      ? Array.from({ length: pages }, (_, index) => index + 1)
      : [
          1,
          ...(page > 3 ? ["…"] : []),
          ...Array.from(
            { length: Math.min(pages - 1, page + 1) - Math.max(2, page - 1) + 1 },
            (_, index) => Math.max(2, page - 1) + index,
          ),
          ...(page < pages - 2 ? ["…"] : []),
          pages,
        ];

    pageNumbers.forEach((number) => {
      if (number === "…") {
        const ellipsis = document.createElement("span");
        ellipsis.className = "pager-ellipsis";
        ellipsis.textContent = number;
        pagerEl.appendChild(ellipsis);
      } else {
        addButton(String(number), number, { active: number === page });
      }
    });

    addButton("Next", Math.min(pages, page + 1), { nav: true });
  }

  function renderPage() {
    page = Math.min(Math.max(page, 1), totalPages());
    tableBody.replaceChildren();

    if (items.length === 0) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.colSpan = colSpan;
      cell.className = "table-empty";
      cell.textContent = emptyText;
      row.appendChild(cell);
      tableBody.appendChild(row);
      renderPager();
      return;
    }

    const start = (page - 1) * pageSize;
    const visibleItems = items.slice(start, start + pageSize);
    visibleItems.forEach((item, index) => {
      const renderedRow = renderRow(item, start + index);
      if (renderedRow instanceof Node) {
        tableBody.appendChild(renderedRow);
      } else {
        tableBody.insertAdjacentHTML("beforeend", renderedRow);
      }
    });

    if (totalPages() > 1) {
      for (let index = visibleItems.length; index < pageSize; index += 1) {
        const row = document.createElement("tr");
        row.className = "row table-placeholder-row";
        row.setAttribute("aria-hidden", "true");

        const cell = document.createElement("td");
        cell.colSpan = colSpan;
        row.appendChild(cell);
        tableBody.appendChild(row);
      }
    }

    renderPager();
  }

  return {
    setItems(newItems) {
      items = Array.isArray(newItems) ? newItems : [];
      page = 1;
      renderPage();
    },
  };
}