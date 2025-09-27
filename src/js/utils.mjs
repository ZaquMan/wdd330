// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false,
) {
  if (!parentElement) return;
  if (clear) parentElement.innerHTML = "";
  const htmlStrings = list.map(templateFn).join("");
  parentElement.insertAdjacentHTML(position, htmlStrings);
}

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) callback(data);
}

export async function convertToJson(res) {
  const data = await res.json();
  if (res.ok) {
    return data;
  } else {
    throw { name: "servicesError", message: data };
  }
}

function convertToText(result) {
  if (result.ok) {
    return result.text();
  } else {
    throw new error("Bad Response");
  }
}

export async function loadTemplate(path) {
  return fetch(path)
    .then(convertToText)
    .then((data) => data);
}

export async function loadHeaderFooter() {
  const headerPath = "/partials/header.html";
  const footerPath = "/partials/footer.html";

  const headerTemplate = await loadTemplate(headerPath);
  const footerTemplate = await loadTemplate(footerPath);

  const headerEle = document.querySelector("#main-header");
  const footerEle = document.querySelector("#main-footer");

  renderWithTemplate(headerTemplate, headerEle);
  renderWithTemplate(footerTemplate, footerEle);

  document.querySelector(".cart-items").textContent =
    getLocalStorage("so-cart").length;
}

export function alertMessage(message, scroll = true, duration = 3000) {
  const alert = document.createElement("div");
  alert.classList.add("alert");
  alert.innerHTML = `<p>${message}</p><span>X</span>`;

  alert.addEventListener("click", function (e) {
    if (e.target.tagName == "SPAN") {
      main.removeChild(this);
    }
  });
  const main = document.querySelector("main");
  main.prepend(alert);

  if (scroll) window.scrollTo(0, 0);
}

export function removeAllAlerts() {
  const alerts = document.querySelectorAll(".alert");
  alerts.forEach((alert) => document.querySelector("main").removeChild(alert));
}
