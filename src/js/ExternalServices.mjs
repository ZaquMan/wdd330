import { convertToJson } from "./utils.mjs";
const baseURL = import.meta.env.VITE_SERVER_URL;

export default class ExternalServices {
  constructor() {
    /*this.category = category;
    this.path = `../json/${this.category}.json`; */
  }
  getData(category) {
    return fetch(`${baseURL}products/search/${category}`)
      .then(convertToJson)
      .then((data) => {
        return data.Result;
      });
  }

  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    /*if (products.length === 0)
      throw new Error(`failed to fetch ${this.getData}`); */
    const data = await convertToJson(response);
    return data.Result;
  }

  async checkout(payload) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };
    return await fetch(`${baseURL}checkout`, options).then(convertToJson);
  }
}
