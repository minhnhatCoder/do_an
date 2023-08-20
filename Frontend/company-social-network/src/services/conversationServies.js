/*
 * @description    
 * @since         Sunday, 8 20th 2023, 11:04:27 am
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */
import axiosClient from "../helper/Http";

const ConversationsServices = {
    getConversations: (params) => {
        const url = "/conversations";
        return axiosClient.get(url, { params });
    },
    getConversation: (id) => {
        const url = "/conversations/" + id;
        return axiosClient.get(url);
    },
    postConversation: (body) => {
        const url = "/conversations";
        return axiosClient.post(url, body);
    }
}

export default ConversationsServices;