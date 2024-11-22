const wrapper = document.querySelector(".wrapper");
const loading = document.querySelector(".loading");
const btn = document.querySelector(".btn");
const categoryContainer = document.querySelector(".categories");

const API_URL = "https://dummyjson.com";
let offset = 1;
let perPageCount = 4;
let total = 0;
let currentCategory = "all";

async function fetchData(api, callback) {
  loading.style.display = "flex";
  try {
    const response = await fetch(api);
    const data = await response.json();
    callback(data);
  } catch (err) {
    console.error("Error fetching data:", err);
  } finally {
    loading.style.display = "none";
  }
}

fetchData(`${API_URL}/products?limit=${perPageCount}`, (data) => {
  total = data.total;
  createCard(data);
});
fetchData(`${API_URL}/products/categories`, createCategories);

function createCard(data) {
  while (wrapper.firstChild) {
    wrapper.firstChild.remove();
  }

  data.products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${product.images[0]}" alt="${product.title}" />
      <h3>${product.title}</h3>
      <strong>${product.price} USD</strong>
      <br />
      <button>Buy now</button>
    `;
    wrapper.appendChild(card);
  });

  window.scrollTo(0, wrapper.scrollHeight);
}

function createCategories(categories) {
  while (categoryContainer.firstChild) {
    categoryContainer.firstChild.remove();
  }
  const allButton = document.createElement("button");
  allButton.textContent = "All";
  allButton.addEventListener("click", () => getByCategory("all"));
  categoryContainer.appendChild(allButton);

  if (Array.isArray(categories)) {
    categories.forEach((category) => {
      const categoryBtn = document.createElement("button");
      categoryBtn.textContent = category.slug; 
      categoryBtn.addEventListener("click", () => getByCategory(category.slug));
      categoryContainer.appendChild(categoryBtn);
    });

    
  } else {
    console.error("Categories data is not an array:", categories);
  }
}

function getByCategory(category) {
  currentCategory = category;
  offset = 1;
  const apiUrl =
    category === "all"
      ? `${API_URL}/products?limit=${perPageCount}`
      : `${API_URL}/products/category/${category}?limit=${perPageCount}`;
  fetchData(apiUrl, (data) => {
    total = category === "all" ? data.total : data.products.length;
    createCard(data);
  });
}

function seeMore() {
  offset++;
  const apiUrl =
    currentCategory === "all"
      ? `${API_URL}/products?limit=${perPageCount * offset}`
      : `${API_URL}/products/category/${currentCategory}?limit=${
          perPageCount * offset
        }`;

  fetchData(apiUrl, (data) => {
    createCard(data);
    if (offset * perPageCount >= total) {
      btn.style.display = "none";
    }
  });
}
