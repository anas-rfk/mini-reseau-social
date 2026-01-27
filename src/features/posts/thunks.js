import axios from "axios";

const API_URL = "http://localhost:3001";

export const fetchPosts = async () => {
  const res = await axios.get(`${API_URL}/posts`);
  return res.data;
};

export const patchPost = async (postId, data) => {
  const res = await axios.patch(`${API_URL}/posts/${postId}`, data);
  return res.data;
};