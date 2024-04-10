import requert from "@/utils/request.js";
import api from "@/api/api.js";

var baseURL = api.defaults.baseURL;

export const userLogin = (data) =>
    requert({
        method: "POST",
        url: baseURL + '/user/userLogin/login',
        data
    })

export const logout = (data) =>
    requert({
        method: "POST",
        url: baseURL + '/user/userLogin/logout',
        data
    })