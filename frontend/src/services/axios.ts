import axios, { type AxiosInstance } from "axios";

export const instance: AxiosInstance = axios.create({
  baseURL: "http://localhost:3000/",
});
