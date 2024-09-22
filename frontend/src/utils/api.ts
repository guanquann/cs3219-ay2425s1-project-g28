import axios from "axios";

const questionsUrl = "http://localhost:3000/api/questions";

export const questionClient = axios.create({
  baseURL: questionsUrl,
  withCredentials: true,
});
