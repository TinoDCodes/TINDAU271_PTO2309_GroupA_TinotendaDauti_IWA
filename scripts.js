import { authors, books, genres, state, themeColors } from "./data.js";
import { documentHtml, loadListItems, updateShowMoreBtn } from "./view.js";

const { list, settings, search } = documentHtml;
// matches = books
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

state["extracted-books"] = books.slice(0, state["books-per-page"]);

loadListItems(state["extracted-books"]);

updateShowMoreBtn(
  books.length - state["books-per-page"],
  state["books-per-page"] === books.length
);

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
    title.value = "";
    genres.value = "any";
    authors.value = "any";
    search.overlay.open = false;
  } else {
    search.overlay.open = true;
  }
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

  state["books-per-page"] = newLength > books.length ? books.length : newLength;
  state["extracted-books"] =
    state["books-per-page"] === books.length
      ? books
      : books.slice(0, state["books-per-page"]);

  const itemsToLoad = state["extracted-books"].slice(
    prevLength,
    state["books-per-page"]
  );

  loadListItems(itemsToLoad);
  updateShowMoreBtn(
    books.length - state["books-per-page"],
    state["books-per-page"] === books.length
  );
};

// data-list-button = "Show more (books.length - BOOKS_PER_PAGE)"

// data-list-button.disabled = !(matches.length - [page * BOOKS_PER_PAGE] > 0)

// data-list-button.innerHTML = /* html */ [
//     '<span>Show more</span>',
//     '<span class="list__remaining"> (${matches.length - [page * BOOKS_PER_PAGE] > 0 ? matches.length - [page * BOOKS_PER_PAGE] : 0})</span>',
// ]

// data-search-cancel.click() { data-search-overlay.open === false }
// data-settings-cancel.click() { querySelect(data-settings-overlay).open === false }
// data-settings-form.submit() { actions.settings.submit }
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

// data-search-form.click(filters) {
//     preventDefault()
//     const formData = new FormData(event.target)
//     const filters = Object.fromEntries(formData)
//     result = []

//     for (book; booksList; i++) {
//         titleMatch = filters.title.trim() = '' && book.title.toLowerCase().includes[filters.title.toLowerCase()]
//         authorMatch = filters.author = 'any' || book.author === filters.author

//         {
//             genreMatch = filters.genre = 'any'
//             for (genre; book.genres; i++) { if singleGenre = filters.genre { genreMatch === true }}}
//         }

//         if titleMatch && authorMatch && genreMatch => result.push(book)
//     }

//     if display.length < 1
//     data-list-message.class.add('list__message_show')
//     else data-list-message.class.remove('list__message_show')

//     data-list-items.innerHTML = ''
//     const fragment = document.createDocumentFragment()
//     const extracted = source.slice(range[0], range[1])

//     for ({ author, image, title, id }; extracted; i++) {
//         const { author: authorId, id, image, title } = props

//         element = document.createElement('button')
//         element.classList = 'preview'
//         element.setAttribute('data-preview', id)

//         element.innerHTML = /* html */ `
//             <img
//                 class="preview__image"
//                 src="${image}"
//             />

//             <div class="preview__info">
//                 <h3 class="preview__title">${title}</h3>
//                 <div class="preview__author">${authors[authorId]}</div>
//             </div>
//         `

//         fragment.appendChild(element)
//     }

//     data-list-items.appendChild(fragments)
//     initial === matches.length - [page * BOOKS_PER_PAGE]
//     remaining === hasRemaining ? initial : 0
//     data-list-button.disabled = initial > 0

//     data-list-button.innerHTML = /* html */ `
//         <span>Show more</span>
//         <span class="list__remaining"> (${remaining})</span>
//     `

//     window.scrollTo({ top: 0, behavior: 'smooth' });
//     data-search-overlay.open = false
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

settings.button.addEventListener("click", handleToggleSettings);
settings["overlay-cancel"].addEventListener("click", handleToggleSettings);
settings.form.addEventListener("submit", handleSaveSettings);

list.button.addEventListener("click", handleShowMore);
