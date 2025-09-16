import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
	constructor(productId, dataSource) {
		this.productId = productId;
		this.product = {};
		this.dataSource = dataSource;
	}

	async init() {
		// use the datasource to get the details for the current product. findProductById will return a promise! use await or .then() to process it
		// the product details are needed before rendering the HTML
		// once the HTML is rendered, add a listener to the Add to Cart button
		// Notice the .bind(this). This callback will not work if the bind(this) is missing. Review the readings from this week on 'this' to understand why.
		this.product = await this.dataSource.findProductById(this.productId);
		
		this.renderProductDetails();

		document.getElementById('addToCart')
			.addEventListener('click', this.addProductToCart.bind(this));
		
	}

	addProductToCart() {
		const currentCart = getLocalStorage("so-cart") || [];
		//Pulled the condensed version of "if currentCart is null, make it an array" from the example solution
		currentCart.push(this.product);
		setLocalStorage("so-cart", currentCart);
	}

	renderProductDetails() {
		const template = document.getElementById("product-details");
		const productPage = document.getElementById("productRender");

		const clone = template.content.cloneNode(true);
		const [brand, title, img, price, color, desc, button] = clone.querySelectorAll("h3, h2, img, p, p, p, button");

		brand.textContent = this.product.Brand.Name;
		title.textContent = this.product.Name;
		img.src = this.product.Image;
		img.alt = this.product.Name;
		price.textContent = `$${this.product.SuggestedRetailPrice}`;
		color.textContent = this.product.Colors.ColorName;
		desc.innerHTML= this.product.DescriptionHtmlSimple;
		button.dataset.id = this.productId;

		productPage.appendChild(clone);
	}
}

const finalPrice = Number(this.product.FinalPrice);
const srp = this.product.SuggestedReatilPrice != null ? Number(this.product.SuggestedRetailPrice) : null;
const listPrice = this.product.ListPrice !=  null ? Number (this.product.ListPrice) : null;

// Added a visual indicator of the amount of the discount on the product detail page for each product.
// base price to compare to the final price
const basePrice = (srp && srp > finalPrice) ? srp : ((listPrice && listPrice > finalPrice) ? listPrice : null);
if (basePrice && finalPrice && basePrice > finalPrice) {
	const savings = basePrice - finalPrice;
	const percent = Math.round((savings / basePrice) * 100);

	// 33% off badge next to already existing price
	const coupon = document.createElement("span");
	coupon.textContent = ` -${percent}%`;
	coupon.style.display = "inline block";
	coupon.style.marginLeft = "0.5rem";
	coupon.style.padding = "0.15rem 0.4rem";
	coupon.style.borderRadius = "9999px";
	coupon.style.background = "#16a34a";
	coupon.style.color = "#fff";
	coupon.style.fontWeight = "700";
	coupon.style.fontSize = "0.85rem";
	price.appendChild(coupon);

	// Show how much $ is saved underneath the price
	const savingsLine = document.createElement("p");
	savingsLine.textContent = `Save $${savings.toFixed(2)}`;
	savingsLine.style.color = "#16a34a";
	savingsLine.style.fontWeight = "600";
	savingsLine.style.margin = "0.25rem 0 0";
	price.insertAdjacentElement("afterend", savingsLine);
}
