import axios from "axios";

export const api = axios.create({
  baseURL: "https://voice-note-manager.onrender.com/api",
});
