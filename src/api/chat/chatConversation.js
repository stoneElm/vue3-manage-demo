import requert from "@/utils/request.js";
import api from "@/api/api.js";

var baseURL = api.defaults.baseURL;

export const selectChatConversationList = (data) =>
    requert({
        method: "POST",
        url: baseURL + '/chat/chatConversation/selectChatConversationList',
        data
    })

export const selectLoginUserConversationList = (data) =>
    requert({
        method: "POST",
        url: baseURL + '/chat/chatConversation/selectLoginUserConversationList',
        data
    })

export const createChatConversationList = (data) =>
    requert({
        method: "POST",
        url: baseURL + '/chat/chatConversation/createChatConversationList',
        data
    })

export const updateChatConversationList = (data) =>
    requert({
        method: "POST",
        url: baseURL + '/chat/chatConversation/updateChatConversationList',
        data
    })