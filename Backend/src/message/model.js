/*
 * @description    
 * @since         Sunday, 8 20th 2023, 9:51:14 am
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */
const autopopulate = require("mongoose-autopopulate");
const mongoose = require("mongoose");
const dayjs = require("dayjs");

const conversationSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    type: {
        type: String,
        default: "personal",
    },
    description: {
        type: String,
        default: "",
    },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    created_at: {
        type: Number,
        default: dayjs(new Date()).unix(),
    },
    updated_at: {
        type: Number,
        default: dayjs(new Date()).unix()
    },
    last_message: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "comments",
        autopopulate: true,
    },
    attachments: {
        type: Array,
        default: [],
    },
});
conversationSchema.plugin(autopopulate);
const conversationsDB = mongoose.model("conversations", conversationSchema);
module.exports = { conversationsDB }