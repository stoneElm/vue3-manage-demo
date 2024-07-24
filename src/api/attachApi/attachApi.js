import requert from "@/utils/request.js";
import api from "@/api/api.js";

var baseURL = api.defaults.baseURL;

export const queryAttachDtlList = (data) =>
    requert({
        method: "POST",
        url: baseURL + '/attachment/files/selectAttachDtlList',
        data
    })

export const deleteAttachDtlByID = (data) =>
    requert({
        method: "POST",
        url: baseURL + '/attachment/files/deleteAttachDtlByID',
        data
    })

export const fileDownload = (data) =>
    requert({
        method: "POST",
        url: baseURL + '/attachment/files/download',
        data
    })