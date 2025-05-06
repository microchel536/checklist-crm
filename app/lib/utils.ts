

export const addNewPair = () => {
    setInputPairs((prevPairs) => [
      ...prevPairs,
      { price: 0, quantity: 0 }
  ]);
};
export const formatDateToLocal = (
  dateStr: string,
  locale: string = "ru-RU"
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};



// chernovik
//interface ProductRow {
//  priceId: string;
//  quantityId: string;
//}
//
//const createProductRow = (index: number): ProductRow => {
//  const rowDiv = document.createElement("div");
//  rowDiv.classList.add("product-row");
//
//  const priceLabel = document.createElement("label");
//  priceLabel.textContent = `Цена (${index + 1}):`;
//
//  const priceInput = document.createElement("input");
//  priceInput.type = "number";
//  priceInput.placeholder = "Укажите цену";
//  priceInput.id = `price-${index}`;
//
//  const quantityLabel = document.createElement("label");
//  quantityLabel.textContent = `Количество (${index + 1}):`;
//
//  const quantityInput = document.createElement("input");
//  quantityInput.type = "number";
//  quantityInput.placeholder = "Укажите количество";
//  quantityInput.id = `quantity-${index}`;
//
//  rowDiv.append(priceLabel, priceInput, quantityLabel, quantityInput);
//
//  document.querySelector("#container")?.append(rowDiv);
//
//  return {
//    priceId: priceInput.id,
//    quantityId: quantityInput.id,
//  };
//};
//
//const calculateTotalPrice = () => {
//  const rows = Array.from(
//    document.querySelectorAll(".product-row")
//  ).map((rowEl) => ({
//    price: parseFloat(rowEl.querySelector(`#${rowEl.children[1].id}`)?.value || ""),
//    quantity: parseFloat(rowEl.querySelector(`#${rowEl.children[3].id}`)?.value || "")
//  }));
//
//  const totalSum = rows.reduce((acc, row) => acc + (row.price * row.quantity), 0);
//
//  document.querySelector("#result")?.innerText = `${totalSum.toFixed(2)} руб.`;
//};
//
//document.addEventListener("DOMContentLoaded", () => {
//  const addButton = document.createElement("button");
//  addButton.textContent = "+ Добавить услугу";
//  addButton.onclick = () => createProductRow(document.querySelectorAll(".product-row").length);
//
//  const calcButton = document.createElement("button");
//  calcButton.textContent = "Рассчитать стоимость";
//  calcButton.onclick = calculateTotalPrice;
//
//  const resultSpan = document.createElement("span");
//  resultSpan.id = "result";
//
//  const mainContainer = document.createElement("div");
//  mainContainer.id = "container";
//
//  // Инициализируем первые три товара
//  for (let i = 0; i < 3; i++) {
//    createProductRow(i);
//  }
//
//  mainContainer.append(addButton, calcButton, resultSpan);
//
//  document.body.append(mainContainer);
//});
