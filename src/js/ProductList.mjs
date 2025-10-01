import { renderListWithTemplate } from "./utils.mjs";

function productCartTemplate(product) {
  const img = product.Image;;
  const href = `product_pages/index.html?id=${encodeURIComponent(product.Id)}`;
  const brand = product?.Brand?.Name ?? "";
  return `
    <li class="product-card">
      <a class="product-link" href="${href}" aria-label="${product.Name}">
        <img src="${img}" alt="${product.Name}" Loading="Lazy">
        <h3 class="card__brand">${brand}</h3>
        <h2 class="card__name">${product.Name}</h2>
        <p class="product-card__price">$${Number(product.FinalPrice).toFixed(2)}</p>
      </a>
    </li>
    `;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const list = await this.dataSource.getData(this.category);
    this.renderList(list);
  }

  renderList(list) {
    renderListWithTemplate(productCartTemplate, this.listElement, list);
  }
}
