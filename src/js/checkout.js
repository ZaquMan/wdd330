import { loadHeaderFooter, getLocalStorage } from "./utils.mjs";

loadHeaderFooter();

function orderSummary() {
	const cartItems = getLocalStorage("so-cart");
	const subtotal = cartItems.reduce((sum, item) => sum + item.FinalPrice, 0);
	const tax = subtotal * 0.06;
	let shipping = 0;

	if (cartItems.length >= 1) shipping += 10;
	if (cartItems.length > 1) shipping += (cartItems.length - 1) * 2;

	const total = subtotal + tax + shipping;

	document.querySelector("#subtotal").textContent = `$${subtotal.toFixed(2)}`;
	document.querySelector("#tax").textContent = `$${tax.toFixed(2)}`;
	document.querySelector("#shipping").textContent = `$${shipping.toFixed(2)}`;
	document.querySelector("#total").textContent = `$${total.toFixed(2)}`;
}

orderSummary();