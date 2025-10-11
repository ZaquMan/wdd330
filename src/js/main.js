import { loadHeaderFooter } from "./utils.mjs";
import Alert from "./Alert.mjs";

const alerts = new Alert(document.querySelector("main"));
alerts.renderAlerts();

document.addEventListener("DOMContentLoaded", () => {
  const dialog = document.getElementById("cta-dialog");
  const closeBtn = document.getElementById("cta-close");
  const registerBtn = document.getElementById("cta-register");
  
  dialog.showModal();
  closeBtn.addEventListener("click", () => {
    dialog.close();
    dialog.style.display = "none";
  });

  registerBtn.addEventListener("click", () => {
    dialog.close();
  });
});

loadHeaderFooter();
