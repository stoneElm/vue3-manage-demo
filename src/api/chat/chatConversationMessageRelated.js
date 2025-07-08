import requert from "@/utils/request.js";
import api from "@/api/api.js";

var baseURL = api.defaults.baseURL;

export const markReadMessageForCurrentLogin = (data) =>
    requert({
        method: "POST",
        url: baseURL + '/chat/chatConversationMessageRelated/markReadMessageForCurrentLogin',
        data
    })
