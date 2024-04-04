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
  },
  settings: {
    button: document.querySelector("[data-header-settings]"),
    overlay: document.querySelector("[data-settings-overlay]"),
  },
};

/**
 * TODO: complete the JSDoc comment for this method
 * @param {*} param0
 * @returns
 */
export const createPreview = ({ author, id, image, title }) => {
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
