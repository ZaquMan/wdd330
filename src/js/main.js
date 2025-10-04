import { loadHeaderFooter } from "./utils.mjs";
import Alert from "./Alert.mjs";

const alerts = new Alert(document.querySelector("main"));
alerts.renderAlerts();

loadHeaderFooter();
