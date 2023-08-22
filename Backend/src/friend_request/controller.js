/*
 * @description    
 * @since         Monday, 8 21st 2023, 21:51:09 pm
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */

const { friendRequestsDB } = require("./model");
const usersDB = require("../auth/model");
const Features = require("../../libs/feature");
const dayjs = require("dayjs");

exports.getFriendRequests = async (req, res) => {
    try {
        const features = new Features(
            commentsDB.find().populate("sender", ["display_name", "image"]).populate("receiver", ["display_name", "image"]),
            req.query
        )
            .sorting()
            .paginating()
            .searching("status")
            .filtering();

        const counting = new Features(commentsDB.find(), req.query).sorting().searching("status").filtering().counting();
        const result = await Promise.allSettled([
            features.query,
            counting.query, //count number of user.
        ]);

        const data = result[0].status === "fulfilled" ? result[0].value : [];
        const count = result[1].status === "fulfilled" ? result[1].value : 0;

        return res.status(200).json({
            status: 200,
            data: data,
            count: count,
        });
    } catch (error) {
        return res.status(400).json({ status: 400, message: error.message });
    }
};
exports.getFriendRequest = async (req, res) => { };
exports.postFriendRequest = async (req, res) => {
    try {
        const friendRequest = new friendRequestsDB({
            sender: req.user_data._id,
            receiver: req.body.receiver,
            created_at: dayjs(new Date()).unix(),
        });
        await friendRequest.save();
        await usersDB.findOneAndUpdate(
            { _id: req.user_data._id },
            { $push: { friend_requests: friendRequest._id } }
        );
        await usersDB.findOneAndUpdate(
            { _id: req.body.receiver },
            { $push: { friend_requests: friendRequest._id } }
        );

        return res.status(200).json({
            status: 200,
            message: "Gửi lời mời kết bạn thành công",
        });
    } catch (error) {
        return res.status(400).json({ status: 400, message: error.message });
    }
};
exports.putFriendRequest = async (req, res) => {
    try {
        const friendRequest = await friendRequestsDB.findOneAndUpdate(
            { _id: req.params.id },
            {
                status: req.body.status,
            }, {
            new: true
        }
        );
        if (req.body.status == "approved") {
            await usersDB.findOneAndUpdate(
                { _id: friendRequest.receiver },
                {
                    $push: { friends: friendRequest.sender },
                    $pull: { friend_requests: friendRequest._id }
                }
            );
            await usersDB.findOneAndUpdate(
                { _id: friendRequest.sender },
                {
                    $push: { friends: friendRequest.receiver },
                    $pull: { friend_requests: friendRequest._id }
                }
            );
        } else if (req.body.status == "rejected") {
            await usersDB.findOneAndUpdate(
                { _id: friendRequest.receiver },
                { $pull: { friend_requests: friendRequest._id } }
            );
            await usersDB.findOneAndUpdate(
                { _id: friendRequest.sender },
                { $pull: { friend_requests: friendRequest._id } }
            );

        }

        return res.status(200).json({
            status: 200,
            message: "Cập nhật trạng thái thành công",
        });
    } catch (error) {
        return res.status(400).json({ status: 400, message: error.message });
    }
};
exports.deleteFriendRequest = async (req, res) => {
    try {
        await friendRequestsDB.findOneAndDelete({ _id: req.params.id });
        return res.status(200).json({
            status: 200,
            message: "Xóa lời mời kết bạn thành công",
        });
    } catch (error) {
        return res.status(400).json({ status: 400, message: error.message });
    }
};
