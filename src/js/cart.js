import {
  getLocalStorage,
  loadHeaderFooter,
  setLocalStorage,
} from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const htmlItems =
    cartItems && cartItems.length > 0
      ? cartItems.map((item) => cartItemTemplate(item))
      : [];
  htmlItems.forEach((element) => {
    document.querySelector(".product-list").appendChild(element);
  });

  // Show totals only if cart is not empty
  if (cartItems && cartItems.length > 0) {
    renderCartTotal(cartItems);
  }
}

function cartItemTemplate(item) {
  const newItem = document.createElement("li");
  newItem.className = "cart-card divider";
  newItem.id = `product_${item.Id}_${item.selectedColor}`;

  const prodLink = document.createElement("a");
  prodLink.setAttribute("href", `/product_pages/index.html?product=${item.Id}`);
  prodLink.classList.add("cart-card__image");

  const prodImg = document.createElement("img");
  prodImg.setAttribute(
    "src",
    item.Images ? item.Images.PrimaryMedium : item.Image,
  );
  prodImg.setAttribute("alt", item.Name);
  prodLink.appendChild(prodImg);
  newItem.appendChild(prodLink);

  const prodLink2 = document.createElement("a");
  prodLink2.setAttribute(
    "href",
    `/product_pages/index.html?product=${item.Id}`,
  );

  const prodName = document.createElement("h2");
  prodName.classList.add("card__name");
  prodName.textContent = item.Name;
  prodLink2.append(prodName);
  newItem.appendChild(prodLink2);

  const prodColor = document.createElement("p");
  prodColor.textContent = item.Colors.find(
    (color) => color.ColorCode === item.selectedColor,
  ).ColorName;
  prodColor.className = "cart-card__color";
  newItem.appendChild(prodColor);

  const prodQty = document.createElement("p");
  prodQty.className = "cart-card__quantity";

  const subBtn = document.createElement("button");
  subBtn.textContent = "-";
  subBtn.addEventListener("click", () => {
    subtractItem(item.Id, item.selectedColor);
  });
  prodQty.appendChild(subBtn);

  const qty = document.createElement("span");
  qty.textContent = item.quantity;
  prodQty.appendChild(qty);

  const addBtn = document.createElement("button");
  addBtn.textContent = "+";
  addBtn.addEventListener("click", () => {
    addItem(item.Id, item.selectedColor);
  });
  prodQty.appendChild(addBtn);

  newItem.appendChild(prodQty);

  const prodPrice = document.createElement("p");
  prodPrice.className = "cart-card__price";
  prodPrice.textContent = (item.FinalPrice * item.quantity).toFixed(2);
  newItem.appendChild(prodPrice);

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

function addItem(productId, colorId) {
  const prodList = getLocalStorage("so-cart");

  prodList.forEach((product) => {
    if (product.IdWithColor === `${productId}_${colorId}`) {
      //Add 1 to the product quantity and update the cart page and the local storage.
      ++product.quantity;
      setLocalStorage("so-cart", prodList);
      document.querySelector(
        `#product_${productId}_${colorId} p.cart-card__quantity span`,
      ).textContent = product.quantity;
      document.querySelector(
        `#product_${productId}_${colorId} p.cart-card__price`,
      ).textContent = (product.FinalPrice * product.quantity).toFixed(2);
      renderCartTotal(prodList);
    }
  });
}

function subtractItem(productId, colorId) {
  let prodList = getLocalStorage("so-cart");

  prodList.forEach((product) => {
    //Remove 1 from the product quantity.
    if (product.IdWithColor === `${productId}_${colorId}`) {
      --product.quantity;
      document.querySelector(
        `#product_${productId}_${colorId} p.cart-card__price`,
      ).textContent = (product.FinalPrice * product.quantity).toFixed(2);
      if (product.quantity === 0) {
        //If the product quantity is 0, remove it from the local storage list and the cart page.
        prodList = prodList.filter(
          (prod) => prod.IdWithColor != `${productId}_${colorId}`,
        );
        setLocalStorage("so-cart", prodList);
        document.querySelector(`#product_${productId}_${colorId}`).remove();
        if (prodList.length > 0) {
          renderCartTotal(prodList);
        } else {
          //If there are no more items in the cart/local storage, remove the total.
          document.querySelector(".cart-total").remove();
        }
      } else {
        //If there is 1 or more of the item left, update the cart and local storage
        setLocalStorage("so-cart", prodList);
        document.querySelector(
          `#product_${productId}_${colorId} p.cart-card__quantity span`,
        ).textContent = product.quantity;
        renderCartTotal(prodList);
      }
    }
  });
}

renderCartContents();

loadHeaderFooter();
