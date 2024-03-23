import axios from 'axios';

const api = axios.create({
	baseURL:"http://47.97.47.109:8888",
	responseType:'json',
	responseEncoding:'uft8'
});

export default api;