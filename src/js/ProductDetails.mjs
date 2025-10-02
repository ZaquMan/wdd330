import { getLocalStorage, setLocalStorage } from "./utils.mjs";

const COMMENTS_KEY = "productComments";

function loadCommentsStore() {
	const store = getLocalStorage(COMMENTS_KEY);
	return store ? store : {};
}

function saveCommentsStore() {
	setLocalStorage(COMMENTS_KEY, store);
}

function getComments() {
	const store = loadCommentsStore();
	const list = store[productId];
	return array.isArray(list) ? list : [];
}

function postComment(productId, payload) {
	const store = loadCommentsStore();
	const list = Array.isArray(store[productId]) ? store[productId] : [];

	var name = 	payload.name ? payload.name.trim() : "";
	var text = payload.text ? payload.text.trim() : "";
	if (!text) return list;

	list.push({
		id: string(Date.now()),
		name: name || "Anonymous",
		text: text,
		createdAt: new Date().toISOString()
	});

	store[productId] = list;
	saveCommentsStore(store);
	return list;

}

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

			this.setupComments();
		
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
		// Added a visual indicator of the amount of the discount on the product detail page for each product.
		const finalPrice = Number(this.product.FinalPrice);
		const srp = this.product.SuggestedRetailPrice != null ? Number(this.product.SuggestedRetailPrice) : null;
		const listPrice = this.product.ListPrice !=  null ? Number (this.product.ListPrice) : null;

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

			color.textContent = this.product.Colors.ColorName;
			desc.innerHTML= this.product.DescriptionHtmlSimple;
			button.dataset.id = this.productId;

			productPage.appendChild(clone);
	}

	setupComments() {
		this.renderComments();

		var form = document.getElementById("CommentForm");
		if (!form) return;

		form.addEventListener("submit", (e) => {
			e.preventDefault();

			var nameInput = document.getElementById("commentName");
			var textInput = document.getElementById("commentText");

			var name = nameInput ? nameInput.value : "";
			var text = textInput ? textInput.value : "";

			if (!text || text.trim() === "") return;

			postComment(this.productId,{ name: name, text: text});
			form.reset();
			this.renderComments();
		});
	}

	renderComments() {
		var listEl = document.getElementById("commentList");
		if (!listEl) return;

		listEl.innerHTML = "";

		var comments = getComments(this.productId);

		if (!comments.length) {
			var emptyItem = document.createElement("li");
			emptyItem.className="comment-item";
			var emptyText = document.createElement("div");
			emptyText.className="comment-text";
			emptyText.textContent = "Be the first to leave a comment.";
			emptyItem.appendChild(emptyText);
			listEl.appendChild(emptyItem);
			return;
		}

		comments.sort(function (a, b) {
			return new Date(b.createdAt) - new Date(a.createdAt);
		});

		for (var i = 0; i < comments.length; i++) {
			var c = comments[i];

			var li = document.createElement("li");
			li.className = "comment-item";

			var meta = document.createElement("div");
			meta.className = "comment-meta";
			var when = new Date(c.createdAt).toLocaleString();
			meta.textContent = (c.name || "Anonymous") + " * " + when;

			var body = document.createElement("div");
			body.className = "comment-text";
			body,textContent = c.text;

			li.appendChild(meta);
			li.appendChild(body);
			listEl.appendChild(li);
		}

	}
}

