import { convertToJson } from "./utils.mjs";

function alertTemplate(alert) {
	return `<p style="color:${alert.color}; background-color:${alert.background};">${alert.message}</p>`;
}

export default class Alert {
	constructor(targetElement) {
		this.path = "../json/alerts.json";
		this.targetElement = targetElement;
	}

	getData() {
    return fetch(this.path)
      .then(convertToJson)
      .then((data) => data);
	}
	
	async renderAlerts() {
		const alerts = await this.getData();
		if (alerts) {
			const htmlString = `<section class="alert-list">
				${alerts.map(alertTemplate).join("")}
			</section>`;

			this.targetElement.insertAdjacentHTML("beforebegin", htmlString);
		} //DEBUG
		else { console.log("Checked and there are no alerts"); }
	}
}
