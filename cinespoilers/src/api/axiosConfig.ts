import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZjlmNzA1YjQ3ODRmNTQ3Mzc2ZjJjZDg4Mzg5MTY4NiIsIm5iZiI6MTY0OTQzMTA3MC41NTAwMDAyLCJzdWIiOiI2MjUwNTIxZWEwNTVlZjAwNjU1NzUxMzkiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.wVw0rRwvJOhkTsFj_I1BHB1C9khFhICg3_IaPkbf3og",
  },
});

export default axiosInstance;
