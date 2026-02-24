//! HTML elements
const productName = document.getElementById("productName");
const category = document.getElementById("category");
const price = document.getElementById("price");
const description = document.getElementById("description");
const fileUpload = document.getElementById("fileUpload");
const searchInput = document.getElementById("searchInput");
const productListContainer = document.getElementById("productListContainer");
const btnAddProduct = document.querySelector(".btn-primary");
const btnUpdateProduct = document.getElementById("update");

//! app variables
let updatedIndex;
const nameRegex = /^[A-Z][a-z]{3,}$/;
const categoryRegex = /^[A-Z][a-z]{3,}$/;
const priceRegex = /^[1-9][0-9]{0,4}$/;
const descriptionRegex = /^[a-z\s]{25,100}$/;
let productList = JSON.parse(localStorage.getItem("products")) || [];
displayAllProducts();

//functions
function addProduct() {
  if (
    nameRegex.test(productName.value) &&
    categoryRegex.test(category.value) &&
    priceRegex.test(price.value) &&
    descriptionRegex.test(description.value)
  ) {
    const product = {
      name: productName.value,
      category: category.value,
      price: price.value,
      description: description.value,
      imgPath: "./assets/images/" + fileUpload.files[0].name,
    };
    productList.push(product);
    localStorage.setItem("products", JSON.stringify(productList));
    displayProduct(productList.length - 1);
    clearForm();
  } else {
    alert("Please fill all fields correctly.");
  }
}
function displayProduct(product) {
  let ProductCard = `<div class="product-card">
            <div class="card-image-wrapper">
              <img src="${product.imgPath}" alt="Product Image" class="product-image">
            </div>
            
            <div class="card-body">
              <div class="card-header-row">
                <h3 class=>${product.name}</h3>
                <span class="product-price">${product.price}$</span>
              </div>
              
              <div class="category-row">
                <svg class="category-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
                <span class=>${product.category}</span>
              </div>
              
              <p class="product-description">
                ${product.description}
              </p>
              
              <div class="card-actions">
                <button class="btn-update" onclick="getProductInfo(${productList.indexOf(product)})">Update</button>
                <button class="btn-delete" onclick="deleteProduct(${productList.indexOf(product)})">Delete</button>
              </div>
            </div>
          </div>`;
  productListContainer.innerHTML += ProductCard;
}

function clearForm() {
  productName.value = "";
  category.value = "";
  price.value = "";
  description.value = "";
  fileUpload.value = "";
  productName.classList.remove("is-valid", "is-invalid");
  category.classList.remove("is-valid", "is-invalid");
  price.classList.remove("is-valid", "is-invalid");
  description.classList.remove("is-valid", "is-invalid");
}

function displayAllProducts() {
  for (let i = 0; i < productList.length; i++) {
    displayProduct(productList[i]);
  }
}

function deleteProduct(index) {
  productList.splice(index, 1);
  localStorage.setItem("products", JSON.stringify(productList));
  productListContainer.innerHTML = "";
  displayAllProducts();
}
function getProductInfo(index) {
  updatedIndex = index;
  productName.value = productList[index].name;
  category.value = productList[index].category;
  price.value = productList[index].price;
  description.value = productList[index].description;
  btnAddProduct.classList.add("d-none");
  btnUpdateProduct.classList.remove("d-none");
}

function updateProduct() {
  if (
    nameRegex.test(productName.value) &&
    categoryRegex.test(category.value) &&
    priceRegex.test(price.value) &&
    descriptionRegex.test(description.value)
  ) {
    productList[updatedIndex] = {
      name: productName.value,
      category: category.value,
      price: price.value,
      description: description.value,
      imgPath: fileUpload.files.length > 0 ? "./assets/images/" + fileUpload.files[0].name : productList[updatedIndex].imgPath,
    };
    localStorage.setItem("products", JSON.stringify(productList));
    btnAddProduct.classList.remove("d-none");
    btnUpdateProduct.classList.add("d-none");
    clearForm();
    productListContainer.innerHTML = ""; 
    displayAllProducts();
  } else {
    alert("Please fill all fields correctly.");
  }
}

function searchProducts() {
  const query = searchInput.value.toLowerCase();
  const filteredProducts = productList.filter((product) =>
    product.name.toLowerCase().includes(query),
  );
  productListContainer.innerHTML = "";
  filteredProducts.forEach((product) => {
    displayProduct(product);
  });
}
function validate(regex, element) {
  const errorMessage = element.nextElementSibling;
  if (regex.test(element.value)) {
    element.classList.add("is-valid");
    element.classList.remove("is-invalid");
    if (errorMessage && errorMessage.classList.contains("error-message")) {
      errorMessage.style.display = "none";
    }
    return true;
  }
  element.classList.add("is-invalid");
  element.classList.remove("is-valid");
  if (errorMessage && errorMessage.classList.contains("error-message")) {
    errorMessage.style.display = "block";
  }
  return false;
}
// ! events
btnAddProduct.addEventListener("click", addProduct);
searchInput.addEventListener("input", searchProducts);
productName.addEventListener(
  "input",
  validate.bind(null, nameRegex, productName),
);
category.addEventListener(
  "input",
  validate.bind(null, categoryRegex, category),
);
price.addEventListener("input", validate.bind(null, priceRegex, price));
description.addEventListener(
  "input",
  validate.bind(null, descriptionRegex, description),
);
btnUpdateProduct.addEventListener("click", updateProduct);
