import {
  DEFAULT_BOOKS_PER_PAGE,
  authors,
  books,
  genres,
  state,
  themeColors,
} from "./data.js";
import { documentHtml, loadListItems, updateShowMoreBtn } from "./view.js";

const { list, settings, search } = documentHtml;

state.matches = books;
// page = 1;

if (!books && !Array.isArray(books)) throw new Error("Source required");
// if (!range && range.length < 2) throw new Error('Range must be an array with two numbers')

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
  const { title, genres, authors } = search;

  if (isCancel) {
    search.form.reset();
    search.overlay.open = false;
  } else {
    search.overlay.open = true;
  }
};

//     window.scrollTo({ top: 0, behavior: 'smooth' });
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

// data-list-close.click() { data-list-active.open === false }

// data-list-button.click() {
//     document.querySelector([data-list-items]).appendChild(createPreviewsFragment(matches, page x BOOKS_PER_PAGE, {page + 1} x BOOKS_PER_PAGE]))
//     actions.list.updateRemaining()
//     page = page + 1
// }

// data-header-search.click() {
//     data-search-overlay.open === true ;
//     data-search-title.focus();
// }

// data-list-items.click() {
//     pathArray = Array.from(event.path || event.composedPath())
//     active;

//     for (node; pathArray; i++) {
//         if active break;
//         const previewId = node?.dataset?.preview

//         for (const singleBook of books) {
//             if (singleBook.id === id) active = singleBook
//         }
//     }

//     if !active return
//     data-list-active.open === true
//     data-list-blur + data-list-image === active.image
//     data-list-title === active.title

//     data-list-subtitle === '${authors[active.author]} (${Date(active.published).year})'
//     data-list-description === active.description
// }

search.button.addEventListener("click", handleToggleSearch);
search.cancel.addEventListener("click", handleToggleSearch);
search.form.addEventListener("submit", handleSearch);

settings.button.addEventListener("click", handleToggleSettings);
settings["overlay-cancel"].addEventListener("click", handleToggleSettings);
settings.form.addEventListener("submit", handleSaveSettings);

list.button.addEventListener("click", handleShowMore);
