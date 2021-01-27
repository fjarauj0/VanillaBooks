const API = "https://www.googleapis.com/books/v1/volumes";
const maxResults = 20;
let startIndex = 0;
let actualPage = 1;
let pages = 0,
  input, favorites;

const pageTxt = document.getElementById("txtPage");
const output = document.getElementById("results");
const total = document.getElementById("total");
const mainTitle = document.getElementById("mainTitle");

const favActive = "fav--active fas";
const favInactive = "fav--inactive far";

document.getElementById("btn").addEventListener("click", newSearch);
let main = document.getElementById("main");

//if favs exists in local storage, set favorites array with elemens in local storage, else set favorites array empty
if (localStorage.getItem("favs") === null) {
  favorites = [];
}
else {
  favorites = JSON.parse(localStorage.getItem("favs"));
}

function newSearch() {
  input = document.getElementById("txt")
    .value;
  pages = 0;
  startIndex = 0;
  actualPage = 1;
  output.style.display = "grid";
  document.getElementById("pagination").style.display = "initial";
  getData(input);
}

const getData = async (input) => {
  let filter = document.getElementById("type").value;
  if (filter == "ebooks") filter = "&filter=ebooks";
  else filter = "";

  startIndex = (actualPage - 1) * maxResults;
  output.innerHTML = "";
  const apiURL = input
    ? `${API}?q=${input}&maxResults=${maxResults}&startIndex=${startIndex}${filter}`
    : API;
  try {
    const response = await fetch(apiURL);
    const data = await response.json();
    if (pages == 0) {
      pages = Math.ceil(data.totalItems / maxResults);
      total.innerHTML = `Pages: ${pages}`;
    }
    setPage();
    setCards(data);
  } catch (error) {
    console.log("Fetch error", error);
  }
};

const setCards = (data) => {
  mainTitle.innerHTML = "Results";
  main.style.display = "block";
  data.items.forEach((element) => {
    if (favorites.includes(element.id)) favStatus = favActive;
    else favStatus = favInactive;
    if (typeof element.volumeInfo.imageLinks == "undefined")
      cover = "src/images/no_cover_thumb.gif";
    else cover = element.volumeInfo.imageLinks.thumbnail;
    output.innerHTML += `
  <div class="card">
  <div class="fav"onClick="addFav(this.id)"  id="${element.id}"><i class="${favStatus} fa-heart "></i></div>
  <a href="${element.volumeInfo.canonicalVolumeLink}" target="_blank"><img src="${cover}"></a>
  <h4>${element.volumeInfo.title}</h4>
  <p>${element.volumeInfo.authors}</p> 
  </div>
  `;
  });
};

const setPage = () => {
  pageTxt.value = actualPage;
};

const prev = () => {
  if (actualPage > 1 && actualPage <= pages) {
    actualPage -= 1;
    getData(input);
  }
};

const next = () => {
  if (actualPage < pages) {
    actualPage += 1;
    getData(input);
  }
};

const clearFav = () => {
  localStorage.clear("favs");
  favorites = [];
  Favorites();

};

const addFav = (id) => {
  if (!favorites.includes(id)) {
    document.getElementById(id).innerHTML = `<i class="${favActive} fa-heart "></i>`
    favorites.push(id);
  }
  else {
    document.getElementById(id).innerHTML = `<i class="${favInactive} fa-heart "></i>`
    for (var i = 0; i < favorites.length; i++) {
      if (favorites[i] === id) {
        favorites.splice(i, 1);
      }
    }
  }
  localStorage.setItem("favs", JSON.stringify(favorites));
};

const Favorites = () => {
  output.innerHTML = "";
  output.style.display = "block";
  main.style.display = "block";
  mainTitle.innerHTML = "Favorites";
  document.getElementById("pagination").style.display = "none";
  favorites.forEach((id) => {
    setFavorites(id);
  });
  output.innerHTML += `<button class=btn onclick="clearFav()">Clear</button>`;
};

const setFavorites = async (id) => {
  const apiURL = `${API}/${id}`;
  try {
    const response = await fetch(apiURL);
    const data = await response.json();
    output.innerHTML += `
    <div class="card__fav">
    <h3>${data.volumeInfo.title}</h3>
    <p>${data.volumeInfo.authors}</p>
    <p></p>
    </div>`;
  } catch (error) {
    console.log("Fetch error", error);
  }
};
