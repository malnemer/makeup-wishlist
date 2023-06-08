const searchBtn = document.getElementById('search-btn');
const productList = document.getElementById('products');
const wishlistIcon = document.querySelector('.wishlist-icon');
const wishlistCount = document.querySelector('.wishlist-count');
const wishlistDropdown = document.querySelector('.wishlist-dropdown');
const clearWishlistBtn = document.getElementById('clear-wishlist-btn');
const viewAllBtn = document.getElementById('view-all-btn');
const wishlistItems = document.getElementById('wishlist-items');

let itemCount = 0;
let wishlistItemsData = [];

searchBtn.addEventListener('click', getProductList);
wishlistIcon.addEventListener('click', toggleWishlist);
clearWishlistBtn.addEventListener('click', clearWishlist);
viewAllBtn.addEventListener('click', navigateToWishlist);

function getProductList() {
  let searchInputTxt = document.getElementById('search-input').value.trim();
  if (searchInputTxt !== '') {
    fetch(`http://makeup-api.herokuapp.com/api/v1/products.json?product_type=${searchInputTxt}`)
      .then(response => response.json())
      .then(data => {
        let html = "";
        if (data.length > 0) {
          const promises = data.map(product => {
            const imageSrc = product.image_link ? product.image_link : product.image;
            return isImageExists(imageSrc).then(exists => {
              if (exists) {
                html += `
                  <div class="product-item" data-id="${product.id}">
                    <div class="product-img">
                      <img src="${imageSrc}" alt="makeup">
                    </div>
                    <div class="product-name">
                      <h3>${product.name}</h3>
                      <a href="#" class="product-btn" data-id="${product.id}" data-name="${product.name}" data-img="${imageSrc}">
                        <i class="fas fa-heart"></i>
                        Add
                      </a>
                    </div>
                  </div>`;
              }
            });
          });
          Promise.all(promises).then(() => {
            productList.innerHTML = html;
            const productButtons = document.querySelectorAll('.product-btn');
            productButtons.forEach(button => {
              button.addEventListener('click', addToWishlist);
            });
          });
        } else {
          html = `<p>No products found.</p>`;
          productList.innerHTML = html;
        }
      })
      .catch(error => {
        console.log('An error occurred:', error);
      });
  }
}

function isImageExists(imageSrc) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = imageSrc;
  });
}

function toggleWishlist() {
  wishlistDropdown.classList.toggle('show');
}

function addToWishlist(event) {
  const productId = event.target.getAttribute('data-id');
  const productName = event.target.getAttribute('data-name');
  const productImage = event.target.getAttribute('data-img');

  // Check if the product already exists in the wishlist
  const existingWishlistItem = wishlistItemsData.find(item => item.productId === productId);
  if (existingWishlistItem) {
    return; // Exit the function if the product already exists
  }

  const wishlistItem = {
    productId,
    productName,
    productImage
  };

  wishlistItemsData.push(wishlistItem);
  renderWishlistCount();
  renderWishlistItem(wishlistItem);
}

function clearWishlist() {
  wishlistItemsData = [];
  renderWishlistCount();
  wishlistItems.innerHTML = '';
  wishlistDropdown.classList.remove('show');
}

function navigateToWishlist() {
  const queryParams = new URLSearchParams();
  queryParams.append('wishlistItems', JSON.stringify(wishlistItemsData));

  window.location.href = `wishlist.html?${queryParams.toString()}`;
}

function renderWishlistCount() {
  itemCount = wishlistItemsData.length;
  wishlistCount.textContent = itemCount;
}

function renderWishlistItem(item) {
  const wishlistItemElement = document.createElement('li');
  wishlistItemElement.setAttribute('data-id', item.productId);
  wishlistItemElement.innerHTML = `
    <div class="wishlist-item">
      <div class="cart-item-img">
        <img src="${item.productImage}" alt="makeup">
      </div>
      <div class="wishlist-item-name">${item.productName}</div>
    </div>
  `;
  wishlistItems.appendChild(wishlistItemElement);
  wishlistDropdown.classList.add('show');
}

// Add event listener to dynamically added product buttons
productList.addEventListener('click', function (event) {
  if (event.target.classList.contains('product-btn')) {
    addToWishlist(event);
  }
});

