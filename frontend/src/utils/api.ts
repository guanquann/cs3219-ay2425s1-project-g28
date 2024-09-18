import axios from "axios";

const questionsUrl = "http://localhost:3001";

export const questionClient = axios.create({
  baseURL: questionsUrl,
  withCredentials: true,
});
