import requert from "@/utils/request.js";
import api from "@/api/api.js";

var baseURL = api.defaults.baseURL;

export const selectChatMessageListByConversationID = (data) =>
    requert({
        method: "POST",
        url: baseURL + '/chat/chatMessage/selectChatMessageListByConversationID',
        data
    })

export const createChatMessageList = (data) =>
    requert({
        method: "POST",
        url: baseURL + '/chat/chatMessage/createChatMessageList',
        data
    })