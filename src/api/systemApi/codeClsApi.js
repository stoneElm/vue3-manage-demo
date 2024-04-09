import requert from "@/utils/request.js";
import api from "@/api/api.js";

var baseURL = api.defaults.baseURL;

export const queryCodeClsList = (data) =>
    requert({
        method: "POST",
        url: baseURL + '/system/codeCls/queryCodeClsList',
        data
    })

export const createCodeClsList = (data) =>
    requert({
        method: "POST",
        url: baseURL + '/system/codeCls/createCodeClsList',
        data
    })

export const updateCodeClsList = (data) =>
    requert({
        method: "POST",
        url: baseURL + '/system/codeCls/updateCodeClsList',
        data
    })

export const deleteCodeClsList = (data) =>
    requert({
        method: "POST",
        url: baseURL + '/system/codeCls/deleteCodeClsList',
        data
    })

export const queryCodeClsValList = (data) =>
    requert({
        method: "POST",
        url: baseURL + '/system/codeCls/queryCodeClsValList',
        data
    })

export const createCodeClsValList = (data) =>
    requert({
        method: "POST",
        url: baseURL + '/system/codeCls/createCodeClsValList',
        data
    })

export const updateCodeClsValList = (data) =>
    requert({
        method: "POST",
        url: baseURL + '/system/codeCls/updateCodeClsValList',
        data
    })

export const deleteCodeClsValList = (data) =>
    requert({
        method: "POST",
        url: baseURL + '/system/codeCls/deleteCodeClsValList',
        data
    })