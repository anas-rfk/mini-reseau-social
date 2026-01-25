import axios from "axios";

const API_URL = "http://localhost:3001";

export const fetchUsers = async () => {
  const res = await axios.get(`${API_URL}/users`);
  return res.data;
};
