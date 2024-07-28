import requert from "@/utils/request.js";
import api from "@/api/api.js";

var baseURL = api.defaults.baseURL;

export const selectTableList = (data) =>
    requert({
        method: "POST",
        url: baseURL + '/devSupport/codeSupport/selectTableList',
        data
    })

export const produceCURDCode = (data) =>
    requert({
        method: "POST",
        url: baseURL + '/devSupport/codeSupport/produceCURDCode',
        data
    })