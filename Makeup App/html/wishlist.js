const wishlistItems = document.getElementById('wishlist-items');

function getWishlistItems() {
  const urlParams = new URLSearchParams(window.location.search);
  const wishlistItemsParam = urlParams.get('wishlistItems');
  if (wishlistItemsParam) {
    const wishlistItemsData = JSON.parse(wishlistItemsParam);
    wishlistItemsData.forEach(item => {
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
    });
    renderWishlistCount(); // Update the wishlist count
  }
}

function renderWishlistCount() {
  const wishlistCount = document.querySelector('.wishlist-count');
  const itemCount = wishlistItems.children.length; // Calculate the count based on the number of wishlist items
  wishlistCount.textContent = itemCount;
}

getWishlistItems();










  

