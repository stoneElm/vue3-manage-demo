import axios from 'axios';

const api = axios.create({
	baseURL:"http://localhost:8888",
	responseType:'json',
	responseEncoding:'uft8'
});

export default api;