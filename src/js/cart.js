import { getLocalStorage, loadHeaderFooter, setLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const htmlItems =
    cartItems && cartItems.length > 0
      ? cartItems.map((item) => cartItemTemplate(item))
      : [];
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  // Show totals only if cart is not empty
  if (cartItems && cartItems.length > 0) {
    renderCartTotal(cartItems);
  }
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Images ? item.Images.PrimaryMedium : item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity"><button id="subQty">-</button><span>${item.quantity}</span><button id="addQty">+</button></p>
  <p class="cart-card__price">$${(item.FinalPrice * item.quantity).toFixed(2)}</p>
</li>`;

  return newItem;
}

function renderCartTotal(cartItems) {
  const total = cartItems.reduce(
    (sum, item) => sum + item.FinalPrice * item.quantity,
    0,
  );

  const cartFooter = document.querySelector(".cart-footer");
  cartFooter.classList.remove("hide");
  cartFooter.querySelector(".cart-total").textContent =
    `Total: $${total.toFixed(2)}`;
}

function addItem(productId) {

}

function subtractItem(productId) {
  
}

renderCartContents();

loadHeaderFooter();
