import axios from 'axios';

const api = axios.create({
	// baseURL:"http://47.97.47.109:8888",
	// baseURL:"http://localhost:8888",
	baseURL:"http://192.168.1.3:8888",
	responseType:'json',
	responseEncoding:'uft8'
});

export default api;