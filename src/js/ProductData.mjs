import { convertToJson } from "./utils.mjs";

const baseURL = import.meta.env.VITE_SERVER_URL;

export default class ProductData {
  constructor() {
  //constructor(category) {
    //this.category = category;
    //this.path = `../json/${this.category}.json`; 
  }

  async getData(category) {
    const res = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(res);
    return data.Results;
  }
    //getData() {
    //return fetch(this.path)
      //.then(convertToJson)
      //.then((data) => data);
  //}
  async findProductById(id) {
    const res = await fetch (`${baseURL}products/search/${category}`);
    const data = await converToJson(res);
    return data.Result;
    //const products = await this.getData();
    //if (products.length === 0) throw new Error(`failed to fetch ${this.getData}`)
    //return products.find((item) => item.Id === id);
  }
}
