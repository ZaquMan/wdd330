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
		document.querySelector("input").click();

		document.getElementById('addToCart')
			.addEventListener('click', this.addProductToCart.bind(this));

	}

	addProductToCart() {
		const currentCart = getLocalStorage("so-cart") || [];

		const selectedColorId = document.querySelector("input:checked").id;

		const productExist = currentCart.find(item => (item.Id === this.product.Id && item.selectedColor === selectedColorId));
		if (productExist) {
			productExist.quantity += 1;
		}
		else {
			currentCart.push({ ...this.product, quantity: 1, selectedColor: selectedColorId });
		}

		setLocalStorage("so-cart", currentCart);
	}

	productColorsTemplate(color) {
		const label = document.createElement("label");

		const radioBtn = document.createElement("input");
		radioBtn.addEventListener("click", () => this.updateProductImage(color.ColorCode));
		radioBtn.setAttribute("type", "radio");
		radioBtn.setAttribute("id", color.ColorCode);
		radioBtn.name = "color";
		label.appendChild(radioBtn);

		const fig = document.createElement("figure");
		const img = document.createElement("img");
		img.setAttribute("src", color.ColorChipImageSrc);
		fig.appendChild(img);
		const caption = document.createElement("figcaption");
		caption.textContent = color.ColorName;
		fig.appendChild(caption);
		label.appendChild(fig);

		return label;
	}

	renderProductColors(element) {
		this.product.Colors.forEach((color) => element.appendChild(this.productColorsTemplate(color)));
	}

	updateProductImage(id) {
		//TODO: When a label is clicked, change the product image
		console.log(`${id} was clicked`);

		const src = this.product.Colors.find(color => color.ColorCode === id).ColorPreviewImageSrc;
		const colorName = this.product.Colors.find(color => color.ColorCode === id).ColorName;
		const productName = this.product.Name;

		document.querySelector("#product_img").setAttribute("src", src);
		document.querySelector("#product_img").setAttribute("alt", `${productName} - ${colorName}`);
	}

	renderProductDetails() {
		const template = document.getElementById("product-details");
		const productPage = document.getElementById("productRender");

		const clone = template.content.cloneNode(true);
		const [brand, title, img, price, color, desc, button] = clone.querySelectorAll("h3, h2, img, p, div, p, button");

		brand.textContent = this.product.Brand.Name;
		title.textContent = this.product.NameWithoutBrand;
		img.src = this.product.Images.PrimaryExtraLarge;
		img.alt = this.product.Name;
		price.textContent = `$${this.product.SuggestedRetailPrice}`;
		// Added a visual indicator of the amount of the discount on the product detail page for each product.
		const finalPrice = Number(this.product.FinalPrice);
		const srp = this.product.SuggestedRetailPrice != null ? Number(this.product.SuggestedRetailPrice) : null;
		const listPrice = this.product.ListPrice != null ? Number(this.product.ListPrice) : null;

		// base price to compare to the final price
		const basePrice = (srp && srp > finalPrice) ? srp : ((listPrice && listPrice > finalPrice) ? listPrice : null);
		if (basePrice && finalPrice && basePrice > finalPrice) {
			const savings = basePrice - finalPrice;
			const percent = Math.round((savings / basePrice) * 100);

			// 33% off badge next to already existing price
			const coupon = document.createElement("span");
			coupon.textContent = ` -${percent}%`;
			coupon.style.display = "inline-block";
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

			//TODO: If there is a discount, use CSS to strike through SRP,
			//write the sale price / final price next to or under the SRP. 
		}

		//const colorChildEleList = this.renderProductColors();
		//color.innerHTML = this.renderProductColors();
		this.renderProductColors(color);
		// const firstColor = document.querySelector("input[type='radio']");
		// firstColor.click();
		desc.innerHTML = this.product.DescriptionHtmlSimple;
		button.dataset.id = this.productId;

		productPage.appendChild(clone);
	}
}

