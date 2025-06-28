import requert from "@/utils/request.js";
import api from "@/api/api.js";

var baseURL = api.defaults.baseURL;

export const selectChatConversationAppList = (data) =>
    requert({
        method: "POST",
        url: baseURL + '/chat/chatConversationApp/selectChatConversationAppList',
        data
    })

export const selectLoginUserInvitedInfo = (data) =>
    requert({
        method: "POST",
        url: baseURL + '/chat/chatConversationApp/selectLoginUserInvitedInfo',
        data
    })

export const createChatConversationAppList = (data) =>
    requert({
        method: "POST",
        url: baseURL + '/chat/chatConversationApp/createChatConversationAppList',
        data
    })

export const updateChatConversationAppList = (data) =>
    requert({
        method: "POST",
        url: baseURL + '/chat/chatConversationApp/updateChatConversationAppList',
        data
    })