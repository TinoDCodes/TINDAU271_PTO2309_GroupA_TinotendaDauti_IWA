import { DEFAULT_BOOKS_PER_PAGE, books, state, themeColors } from "./data.js";
import {
  documentHtml,
  loadBookOverlayData,
  loadListItems,
  updateShowMoreBtn,
} from "./view.js";

const { list, settings, search } = documentHtml;

if (!books && !Array.isArray(books)) throw new Error("Source required");

//--------------------- INITIALIZE APP STATE ------------------------//

/**
 * The below if-statement checks if the user's browser supports the 'prefers-color-scheme'
 * media feature and if the user has chosen the 'dark' color scheme in their system settings.
 *
 * If both conditions are met, it sets the theme of the application to 'night'.
 * It then updates the value of the 'theme-select' setting to reflect this change.
 * Finally, it updates the CSS custom properties '--color-dark' and '--color-light' with the
 * corresponding color values from the 'night' theme.
 */
if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
  state.theme = "night";
  settings["theme-select"].value = state.theme;

  document.documentElement.style.setProperty(
    "--color-dark",
    themeColors[state.theme].dark
  );
  document.documentElement.style.setProperty(
    "--color-light",
    themeColors[state.theme].light
  );
}

state.matches = books;
state["extracted-books"] = state.matches.slice(0, state["books-per-page"]);

loadListItems(state["extracted-books"]);

updateShowMoreBtn(state.matches.length - state["books-per-page"]);

//--------------------- EVENT HANDLER FUNCTIONS ------------------------//

/**
 * Event handler for toggling the search overlay.
 * If the event target is the cancel button, it resets the search form and closes the overlay.
 * Otherwise, it opens the search overlay.
 *
 * @param {Event} event - The event object.
 */
const handleToggleSearch = (event) => {
  const isCancel = event.target === search.cancel;

  if (isCancel) {
    search.form.reset();
    search.overlay.open = false;
  } else {
    search.overlay.open = true;
  }
};

/**
 * Event handler that performs the search functionality based on the values of the form when it is
 * submitted.
 * It loops through the array of books. For each book it will check whether the title value entered by the user
 * is a subString of the book's title, whether the book's author is the same as the author selected by the user and
 * whether the genre selected by the user is included in the book's lis of genres. If all of these conditions are met
 * the book is added to the search results array.
 *
 * Once all the matches are found, the apps state is updated and the UI is updated to reflected the results of the search.
 *
 * @param {Event} event - The event object from the form submission.
 */
const handleSearch = (event) => {
  event.preventDefault();
  const { title, genres, authors } = search;
  const searchResults = [];

  for (const book of books) {
    const titleMatch =
      title.value.trim() === "" ||
      book.title.toLowerCase().includes(title.value.toLowerCase());
    const authorMatch =
      authors.value === "any" || book.author === authors.value;
    const genreMatch =
      genres.value === "any" || book.genres.includes(genres.value);

    if (titleMatch && authorMatch && genreMatch) searchResults.push(book);
  }

  list.items.innerHTML = "";

  // check whether there are any books that match the user's search
  if (searchResults.length < 1) {
    state["books-per-page"] = DEFAULT_BOOKS_PER_PAGE;
    state["extracted-books"] = [];
    state.matches = [];

    // show the "No results" message
    list.message.classList.add("list__message_show");
    updateShowMoreBtn(0);
  } else {
    // hide the "No results" message
    list.message.classList.remove("list__message_show");
    state.matches = searchResults;

    state["books-per-page"] =
      searchResults.length >= DEFAULT_BOOKS_PER_PAGE
        ? DEFAULT_BOOKS_PER_PAGE
        : searchResults.length;

    state["extracted-books"] =
      state["books-per-page"] === searchResults.length
        ? state.matches
        : state.matches.slice(0, state["books-per-page"]);

    loadListItems(state["extracted-books"]);
    updateShowMoreBtn(state.matches.length - state["books-per-page"]);
  }

  search.form.reset();
  search.overlay.open = false;
  // scroll to the top of the screen
  window.scrollTo({ top: 0, behavior: "smooth" });
};

/**
 * Event handler for toggling settings overlay.
 * If the event target is the "overlay-cancel" element, it resets the theme selection and closes the overlay.
 * Otherwise, it opens the overlay.
 *
 * @param {Event} event - The event object.
 */
const handleToggleSettings = (event) => {
  const isCancel = event.target === settings["overlay-cancel"];

  if (isCancel) {
    settings["theme-select"].value = state.theme;
    settings.overlay.open = false;
  } else {
    settings.overlay.open = true;
  }
};

/**
 * TODO: complete JSDoc comment for this method
 * @param {Event} event
 */
const handleSaveSettings = (event) => {
  event.preventDefault();

  if (settings["theme-select"].value !== state.theme) {
    state.theme = settings["theme-select"].value;
    document.documentElement.style.setProperty(
      "--color-dark",
      themeColors[state.theme].dark
    );
    document.documentElement.style.setProperty(
      "--color-light",
      themeColors[state.theme].light
    );
  }

  settings.overlay.open = false;
};

/**
 * Handles the toggling of list items.
 * If the target of the event is the close button, it closes the overlay.
 * If the target is a preview item, the id of the selected book is extracted from the target
 * element's dataset and used to get the full book object from the "books" array. The book data
 * is then loaded onto the overlay and the overlay open state is set to true.
 *
 * @param {Event} event - The event object from the event listener.
 */
const handleToggleListItem = (event) => {
  const { id } = event.target.dataset;
  const isPreviewItem = id ? true : false;
  const isCloseBtn = event.target === list["overlay-close"];

  if (isCloseBtn) {
    list.overlay.open = false;
  } else if (isPreviewItem) {
    const book = state["extracted-books"].filter((item) => item.id === id)[0];

    loadBookOverlayData(book);

    list.overlay.open = true;
  }
};

/**
 * Event handler for showing more books in the list.
 * It doubles the number of books to show per page, up to the total number of matches.
 * It then extracts the new books to show (that are not already on the DOM) and loads them into the list.
 * Finally, it updates the "Show More" button based on the remaining number of books.
 *
 * @param {Event} event - The event object.
 */
const handleShowMore = (event) => {
  const newLength = state["books-per-page"] * 2;
  const prevLength = state["books-per-page"];

  state["books-per-page"] =
    newLength > state.matches.length ? state.matches.length : newLength;
  state["extracted-books"] =
    state["books-per-page"] === state.matches.length
      ? state.matches
      : state.matches.slice(0, state["books-per-page"]);

  const itemsToLoad = state["extracted-books"].slice(
    prevLength,
    state["books-per-page"]
  );

  loadListItems(itemsToLoad);
  updateShowMoreBtn(state.matches.length - state["books-per-page"]);
};

//--------------------- ADDING APP EVENT LISTENERS ------------------------//
search.button.addEventListener("click", handleToggleSearch);
search.cancel.addEventListener("click", handleToggleSearch);
search.form.addEventListener("submit", handleSearch);

settings.button.addEventListener("click", handleToggleSettings);
settings["overlay-cancel"].addEventListener("click", handleToggleSettings);
settings.form.addEventListener("submit", handleSaveSettings);

list.button.addEventListener("click", handleShowMore);
list.items.addEventListener("click", handleToggleListItem);
list["overlay-close"].addEventListener("click", handleToggleListItem);
