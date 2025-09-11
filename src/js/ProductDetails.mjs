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
		currentCart.push(product);
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
		button.Id = this.productId;

		productPage.appendChild(clone);
	}
}