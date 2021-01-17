const API = "https://www.googleapis.com/books/v1/volumes";
const maxResults = 20;
let startIndex = 0;
let actualPage = 1;
let pages;

const pageTxt = document.getElementById("txtPage");
const output = document.getElementById("results");
const total = document.getElementById("total");

document.getElementById("btn").addEventListener("click", getData);

async function getData() {
  output.innerHTML = "";
  const input = document.getElementById("txt").value;
  const apiURL = input
    ? `${API}?q=${input}&maxResults=${maxResults}&startIndex=${startIndex}`
    : API;
  try {
    const response = await fetch(apiURL);
    const data = await response.json();
    pages = Math.ceil(data.totalItems / 20);
    total.innerHTML = `Pages: ${pages}`;
    setPage();
    setCards(data);
  } catch (error) {
    console.log("Fetch error", error);
  }
}

const setCards = (data) => {
  document.getElementById("main").style.display = "block";
  data.items.forEach((element) => {
    output.innerHTML += `
  <div class="card">
  <a href="${element.volumeInfo.canonicalVolumeLink} target="_blank"><img src="${element.volumeInfo.imageLinks.thumbnail}"></a>
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
    setPage();
  }
};

const next = () => {
  if (actualPage < pages) {
    actualPage += 1;
    setPage();
  }
};
