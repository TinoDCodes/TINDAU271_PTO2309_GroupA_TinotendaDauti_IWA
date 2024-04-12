import { authors, genres } from "./data.js";

/**
 *  An object literal that contains references to all the HTML elements
 * referenced through the operation of the app either upon initialisation or
 * while its running (via event listeners). This arrangement allows for a structured
 * view and access to all user interface elements.
 */
export const documentHtml = {
  list: {
    items: document.querySelector("[data-list-items]"),
    message: document.querySelector("[data-list-message]"),
    button: document.querySelector("[data-list-button]"),
    overlay: document.querySelector("[data-list-active]"),
    "overlay-close": document.querySelector("[data-list-close]"),
    "overlay-image": document.querySelector("[data-list-image]"),
    "overlay-blur": document.querySelector("[data-list-blur]"),
    "overlay-title": document.querySelector("[data-list-title]"),
    "overlay-subtitle": document.querySelector("[data-list-subtitle]"),
    "overlay-description": document.querySelector("[data-list-description]"),
  },
  search: {
    button: document.querySelector("[data-header-search]"),
    overlay: document.querySelector("[data-search-overlay]"),
    title: document.querySelector("[data-search-title]"),
    genres: document.querySelector("[data-search-genres]"),
    authors: document.querySelector("[data-search-authors]"),
    cancel: document.querySelector("[data-search-cancel]"),
    form: document.querySelector("[data-search-form]"),
  },
  settings: {
    button: document.querySelector("[data-header-settings]"),
    overlay: document.querySelector("[data-settings-overlay]"),
    form: document.querySelector("[data-settings-form]"),
    "overlay-cancel": document.querySelector("[data-settings-cancel]"),
    "theme-select": document.querySelector("[data-settings-theme]"),
  },
};

//--------------------- HELPER FUNCTIONS ------------------------//

/**
 * Creates a book preview element with given details.
 *
 * @param {Object} params - The parameters for creating a preview.
 * @param {string} params.author - The author's name.
 * @param {string} params.id - The id of the book.
 * @param {string} params.image - The image URL of the book.
 * @param {string} params.title - The title of the book.
 * @returns {HTMLElement} The created preview element.
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
 * Loads the given list of books, as preview items, onto the DOM. An HTML node element is created
 * for each book in the list and that element is then appended to the children list of the 'list-items"
 * node.
 *
 * @param {Object[]} booksToShow - The array of books to show.
 * @param {string} booksToShow[].author - The ID of the author of the book.
 * @param {string} booksToShow[].id - The ID of the book.
 * @param {string} booksToShow[].image - The URL of the book's cover image.
 * @param {string} booksToShow[].title - The title of the book.
 *
 * @example
 * loadListItems([
 *   { author: '1', id: '101', image: 'http://example.com/book.jpg', title: 'Example Book' }
 * ]);
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
 * Updates the text shown in the "Show More" button in the book list, as well as the disabled state
 * of the button. If the number of books left to show is equal to 0, then the button will be disabled.
 *
 * @param {number} booksLeft - The number of books left to be shown.
 */
export const updateShowMoreBtn = (booksLeft) => {
  const { button } = documentHtml.list;

  button.innerHTML = /* html */ `
      <span>Show more <span class="list__remaining">(${booksLeft})</span></span>
  `;
  button.disabled = booksLeft === 0;
};

/**
 * Updates the "data-list-active" overlay element's HTML, using the data of the given book, so that the overlay
 * correctly displays the details of the selected book.
 *
 * @param {Object} book - The book object.
 * @param {string} book.image - The URL of the book's cover image.
 * @param {string} book.title - The title of the book.
 * @param {string} book.author - The ID of the author of the book.
 * @param {string} book.published - The published date of the book in ISO string format.
 * @param {string} book.description - The description of the book.
 */
export const loadBookOverlayData = (book) => {
  const { list } = documentHtml;
  const publishedDate = new Date(book.published);

  list["overlay-image"].setAttribute("src", book.image);
  list["overlay-blur"].setAttribute("src", book.image);
  list["overlay-title"].innerText = `${book.title}`;
  list["overlay-subtitle"].innerText = `${
    authors[book.author]
  } (${publishedDate.getFullYear()})`;
  list["overlay-description"].innerText = `${book.description}`;
};

//--------------------- LOAD SEARCH SELECT OPTIONS ------------------------//

const { search } = documentHtml;

// Create a new option element for the genres dropdown, set its value and inner text.
const allGenresOption = document.createElement("option");
allGenresOption.value = "any";
allGenresOption.innerText = "All Genres";
// Add the "All Genres" option to the genres dropdown
search.genres.appendChild(allGenresOption);

/**
 * Loop through the predefined list of genres in the "data.js" file.
 * For each genre, create a new option element whose value is the ID of the genre and whose
 * inner text is the name of the genre. Then add the created genre option to the genres dropdown.
 */
for (const [id, name] of Object.entries(genres)) {
  const genreOption = document.createElement("option");
  genreOption.value = id;
  genreOption.innerText = name;
  search.genres.appendChild(genreOption);
}

// Create a new option element for the authors dropdown, set its value and inner text.
const allAuthorsOption = document.createElement("option");
allAuthorsOption.value = "any";
allAuthorsOption.innerText = "All Authors";
// Add the "All Authors" option to the authors dropdown
search.authors.appendChild(allAuthorsOption);

/**
 * Loop through the predefined list of authors in the "data.js" file.
 * For each author, create a new option element whose value is the ID of the author and whose
 * inner text is the name of the auhtor. Then add the created author option to the authors dropdown.
 */
for (const [id, name] of Object.entries(authors)) {
  const authorOption = document.createElement("option");
  authorOption.value = id;
  authorOption.innerText = name;
  search.authors.appendChild(authorOption);
}
