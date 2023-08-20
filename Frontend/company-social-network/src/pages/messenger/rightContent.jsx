/*
 * @description
 * @since         Sunday, 8 20th 2023, 13:19:15 pm
 * @author        Bình Lê <binhlv@getflycrm.com>
 * @copyright     Copyright (c) 2023, Getfly VN TECH.,JSC, Inc.
 * -----
 * Change Log: <press Ctrl + alt + c write changelog>
 */
import React, { useEffect, useState } from "react";
import Message from "./message";
import Info from "./info";
import { useParams } from "react-router-dom";
import ConversationsServices from "../../services/conversationServies";

const RightContent = () => {
  const { id } = useParams();
  const [conversation, setConversation] = useState({});
  const [loading, setLoading] = useState(false);
  const [attachments, setAttachments] = useState([]);

  const getConversation = async () => {
    try {
      setLoading(true);
      const res = await ConversationsServices.getConversation(id);
      setConversation(res.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  console.log(conversation);
  useEffect(() => {
    getConversation();
  }, [id]);
  return (
    <div className="flex w-3/4">
      <Message conversation={conversation} />
      <Info conversation={conversation} />
    </div>
  );
};

export default RightContent;
