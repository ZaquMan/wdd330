import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import Alert from "./Alert.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

const alerts = new Alert(document.querySelector("main"));
alerts.renderAlerts();

const category = getParam("category");

const dataSource = new ExternalServices();

const element = document.querySelector(".product-list");

const productList = new ProductList(category, dataSource, element);

loadHeaderFooter();

productList.init();
