import {
  DEFAULT_BOOKS_PER_PAGE,
  authors,
  books,
  genres,
  state,
  themeColors,
} from "./data.js";
import {
  documentHtml,
  loadBookOverlayData,
  loadListItems,
  updateShowMoreBtn,
} from "./view.js";

const { list, settings, search } = documentHtml;

if (!books && !Array.isArray(books)) throw new Error("Source required");

// TODO: write a comment for this process below
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

// TODO: add comment for the below process
const allGenresOption = document.createElement("option");
allGenresOption.value = "any";
allGenresOption.innerText = "All Genres";
search.genres.appendChild(allGenresOption);

for (const [id, name] of Object.entries(genres)) {
  const genreOption = document.createElement("option");
  genreOption.value = id;
  genreOption.innerText = name;
  search.genres.appendChild(genreOption);
}

// TODO: complete comment for the process below
const allAuthorsOption = document.createElement("option");
allAuthorsOption.value = "any";
allAuthorsOption.innerText = "All Authors";
search.authors.appendChild(allAuthorsOption);

for (const [id, name] of Object.entries(authors)) {
  const authorOption = document.createElement("option");
  authorOption.value = id;
  authorOption.innerText = name;
  search.authors.appendChild(authorOption);
}

/**
 * TODO: complete method and comment
 * @param {Event} event
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
 * TODO: write JSDoc comment for this event handler
 * @param {Event} event
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

  if (searchResults.length < 1) {
    state["books-per-page"] = DEFAULT_BOOKS_PER_PAGE;
    state["extracted-books"] = [];
    state.matches = [];

    list.message.classList.add("list__message_show");
    updateShowMoreBtn(0);
  } else {
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
  window.scrollTo({ top: 0, behavior: "smooth" });
};

/**
 * TODO: check method is complete and write JSDoc comment
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
 * TODO: write JSDoc comment for the below
 * @param {Event} event
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
 * TODO: complete JSDoc comment for this function
 * @param {Event} event
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

// TODO: add comment to destinguish event listeners
search.button.addEventListener("click", handleToggleSearch);
search.cancel.addEventListener("click", handleToggleSearch);
search.form.addEventListener("submit", handleSearch);

settings.button.addEventListener("click", handleToggleSettings);
settings["overlay-cancel"].addEventListener("click", handleToggleSettings);
settings.form.addEventListener("submit", handleSaveSettings);

list.button.addEventListener("click", handleShowMore);
list.items.addEventListener("click", handleToggleListItem);
list["overlay-close"].addEventListener("click", handleToggleListItem);
