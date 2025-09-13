import ProductList from "./ProductList.mjs";
import ProductData from "./ProductData.mjs";

const listElement = document.querySelector(".product-list");
const category = "tents";
const dataSource = new ProductData(category);

const productList = new ProductList(category, dataSource, listElement);
productList.init();