import { authors } from "./data.js";

/**
 * TODO: complete JSDoc comment for this object
 */
export const documentHtml = {
  list: {
    items: document.querySelector("[data-list-items]"),
    message: document.querySelector("[data-list-message]"),
    button: document.querySelector("[data-list-button]"),
    overlay: document.querySelector("[data-list-active]"),
  },
  search: {
    button: document.querySelector("[data-header-search]"),
    overlay: document.querySelector("[data-search-overlay]"),
    title: document.querySelector("[data-search-title]"),
    genres: document.querySelector("[data-search-genres]"),
    authors: document.querySelector("[data-search-authors]"),
    cancel: document.querySelector("[data-search-cancel]"),
  },
  settings: {
    button: document.querySelector("[data-header-settings]"),
    overlay: document.querySelector("[data-settings-overlay]"),
    form: document.querySelector("[data-settings-form]"),
    "overlay-cancel": document.querySelector("[data-settings-cancel]"),
    "theme-select": document.querySelector("[data-settings-theme]"),
  },
};

/**
 * TODO: complete the JSDoc comment for this method
 * @param {*} param0
 * @returns
 */
const createPreview = ({ author, id, image, title }) => {
  const element = document.createElement("div");
  element.className = "preview";
  element.dataset.id = id;

  element.innerHTML = /* html */ `
          <img src="${image}" class="preview__image" />

          <div class="preview__info">
            <h3 class="preview__title">${title}</h3>

            <p class="preview__author">${author}</p>
          </div>
      `;

  return element;
};

/**
 * TODO: write JSdoc comment
 * @param {Array} booksToShow
 */
export const loadListItems = (booksToShow) => {
  const { items } = documentHtml.list;
  for (const bookItem of booksToShow) {
    const { author, id, image, title } = bookItem;
    const authorName = authors[author];
    const preview = createPreview({
      author: authorName,
      id,
      image,
      title,
    });

    items.appendChild(preview);
  }
};

/**
 * TODO: write JSDoc comment
 * @param {number} booksLeft
 * @param {boolean} isDisabled
 */
export const updateShowMoreBtn = (booksLeft, isDisabled) => {
  const { button } = documentHtml.list;

  button.innerHTML = /* html */ `
      <p>Show more <span class="list__remaining">(${booksLeft})</span></p>
  `;
  button.disabled = isDisabled;
};
