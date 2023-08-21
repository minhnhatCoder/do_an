/*
 * @description    
 * @since         Monday, 8 21st 2023, 21:50:57 pm
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */

const mongoose = require("mongoose");
const dayjs = require("dayjs");

const friendRequestSchema = new mongoose.Schema({
    status: { type: String, required: true, default: "pending" },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    created_at: {
        type: Number,
        default: dayjs(new Date()).unix(),
    },

});

const friendRequestsDB = mongoose.model("friend_request", friendRequestSchema);
module.exports = { friendRequestsDB }