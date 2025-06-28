import requert from "@/utils/request.js";
import api from "@/api/api.js";

var baseURL = api.defaults.baseURL;

export const selectPersonalDocList = (data) =>
    requert({
        method: "POST",
        url: baseURL + '/personalCenter/personalDoc/selectPersonalDocList',
        data
    })

export const createPersonalDocList = (data) =>
    requert({
        method: "POST",
        url: baseURL + '/personalCenter/personalDoc/createPersonalDocList',
        data
    })

export const updatePersonalDocList = (data) =>
    requert({
        method: "POST",
        url: baseURL + '/personalCenter/personalDoc/updatePersonalDocList',
        data
    })

export const deletePersonalDocList = (data) =>
    requert({
        method: "POST",
        url: baseURL + '/personalCenter/personalDoc/deletePersonalDocList',
        data
    })
export const selectPersonalDocPath = (data) =>
    requert({
        method: "POST",
        url: baseURL + '/personalCenter/personalDoc/selectPersonalDocPath',
        data
    })