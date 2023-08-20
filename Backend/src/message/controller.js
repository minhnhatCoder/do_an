/*
 * @description    
 * @since         Sunday, 8 20th 2023, 9:51:23 am
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */

const { conversationsDB } = require("./model");
const { commentsDB } = require("../comment/model");
const Features = require("../../libs/feature");
const dayjs = require("dayjs");

exports.getConversations = async (req, res) => {
    try {
        const features = new Features(
            conversationsDB.find().populate("participants", ["display_name", "image"]),
            req.query
        )
            .sorting()
            .paginating()
            .searching("title")
            .filtering();

        const counting = new Features(conversationsDB.find(), req.query).sorting().searching("title").filtering().counting();
        const result = await Promise.allSettled([
            features.query,
            counting.query, //count number of user.
        ]);

        const conversations = result[0].status === "fulfilled" ? result[0].value : [];
        const count = result[1].status === "fulfilled" ? result[1].value : 0;

        return res.status(200).json({
            status: 200,
            data: conversations,
            count: count,
        });
    } catch (error) {
        return res.status(400).json({ status: 400, message: error.message });
    }
};
exports.getConversation = async (req, res) => {
    try {
        const conversation = await conversationsDB.findOne({ _id: req.params.id }).populate("participants", ["display_name", "image"]);
        return res.status(200).json({
            status: 200,
            data: conversation,
        });
    } catch (error) {
        return res.status(400).json({ status: 400, message: error.message });
    }
};
exports.postConversation = async (req, res) => {
    const conversation = new conversationsDB({
        title: req.body.title,
        type: req.body.type,
        description: req.body.description,
        attachments: req.body.attachments,
        participants: req.body.participants,
        last_message: req.body.last_message,
        created_at: dayjs(new Date()).unix(),
        updated_at: dayjs(new Date()).unix(),
    });
    try {
        const saveConversation = await conversation.save();
        return res.status(200).json({
            status: 200,
            data: saveConversation,
            message: "Tạo cuộc hội thoại thành công",
        });
    } catch (error) {
        return res.status(400).json({ status: 400, message: error.message });
    }
};
exports.putConversation = async (req, res) => {
    try {
        const conversation = await conversationsDB.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true }
        );
        return res.status(200).json({
            status: 200,
            data: conversation,
            message: "Cập nhật cuộc hội thoại thành công",
        });
    } catch (error) {
        return res.status(400).json({ status: 400, message: error.message });
    }
};
exports.deleteConversation = async (req, res) => {
    try {
        await conversationsDB.findOneAndDelete({ _id: req.params.id });
        return res.status(200).json({
            status: 200,
            message: "Xóa cuộc hội thoại thành công"
        });
    } catch (error) {
        return res.status(400).json({ status: 400, message: error.message });
    }
};

///////////message//////////////
exports.sendMessage = async (req, res) => {
    try {
        const comment = new commentsDB({
            target: req.params.id,
            created_by: req.user_data._id,
            content: req.body.content,
            attachments: req.body.attachments,
            read_receipts: [req.user_data._id],
            created_at: dayjs(new Date()).unix(),
        });
        const savedComment = await comment.save();

        await conversationsDB.findOneAndUpdate(
            { _id: req.params.id },
            { $push: { attachments: { $each: req.body.attachments } }, last_message: savedComment?._id },
            { new: true }
        );
        return res.status(200).json({
            status: 200,
            data: savedComment,
            message: "Gửi tin nhắn thành công",
        });
    } catch (error) {
        return res.status(400).json({ status: 400, message: error.message });
    }
}