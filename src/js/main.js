import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import Alert from "./Alert.mjs";
import { loadHeaderFooter } from "./utils.mjs";

const alerts = new Alert(document.querySelector("main"));
alerts.renderAlerts();

const dataSource = new ProductData("tents");

const element = document.querySelector(".product-list");

const productList = new ProductList("Tents", dataSource, element);

productList.init();

loadHeaderFooter();
