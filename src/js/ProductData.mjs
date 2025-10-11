import { convertToJson } from "./utils.mjs";

const baseURL = import.meta.env.VITE_SERVER_URL;

export default class ProductData {
  /*constructor(category) {
    //this.category = category;
    //this.path = `../json/${this.category}.json`; 
  }*/

  async getData(category) {
    const res = await fetch(`${baseURL}products/search/${encodeURIComponent(category)}`);
    const data = await convertToJson(res);
    return Array.isArray(data) ? data : (data.Results ?? []);
  }
    //getData() {
    //return fetch(this.path)
      //.then(convertToJson)
      //.then((data) => data);
  //}
  async findProductById(id) {
    const res = await fetch (`${baseURL}products/search/${encodeURIComponent(id)}`);
    const data = await convertToJson(res);
    return data;
    //const products = await this.getData();
    //if (products.length === 0) throw new Error(`failed to fetch ${this.getData}`)
    //return products.find((item) => item.Id === id);
  }
}
