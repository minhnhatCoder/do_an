import { Input, Avatar } from "antd";
import { BiNews } from "react-icons/bi";
import { FaPhotoVideo } from "react-icons/fa";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import React, { useEffect, useState } from "react";
import Post from "../../components/post";
import UploadPost from "../../components/uploadPost";
import PostServices from "../../services/postServices";
import { useRootState } from "../../store";

const Home = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const userInfo = useRootState((state) => state.userInfo);

  const getPost = async () => {
    const params = {
      "related_user[in]": userInfo?._id,
      limit: 5,
      page: 1,
      sort: "-created_at",
    };
    setLoading(false);
    const res = await PostServices.getPosts(params);
    setData(res?.data);
    setLoading(false);
  };
  useEffect(() => {
    getPost();
  }, []);

  return (
    <div className="main-content flex items-start justify-between">
      <div className="w-1/4"></div>
      <div className="w-1/2 flex flex-col gap-4">
        <InputPost getPost={getPost} />
        {/* post */}
        {data?.map((item) => {
          return <Post key={item._id} post={item} setPost={setData} posts={data} />;
        })}
      </div>
      <div className="w-1/4"></div>
    </div>
  );
};

export default Home;
export const InputPost = ({ getPost }) => {
  const [isShowCreatePost, setIsShowCreatePost] = useState(false);
  return (
    <div className="py-3 px-5 rounded-lg bg-white box_shadow-light">
      <div className="flex items-center justify-center gap-3 pb-3 border-b-2 border-gray-200">
        <Avatar
          className="border border-black"
          size={40}
          src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1"
        />
        <Input
          placeholder="Nhật ơi, bạn đang nghĩ gì?"
          className="flex-1 rounded-full bg-gray-50"
          onClick={() => {
            setIsShowCreatePost(true);
          }}
        />
        <BiNews className="w-8 h-8" color="#1b74e4" />
      </div>
      <div className="flex items-center justify-around mt-3">
        <div className="flex items-center justify-center gap-2 cursor-pointer">
          <FaPhotoVideo className="w-8 h-8" color="#45bd62" />
          <p className="font-semibold">Ảnh</p>
        </div>
        <div className="flex items-center justify-center gap-2 cursor-pointer">
          <MdOutlineEmojiEmotions className="w-8 h-8" color="#f7b928" />
          <p className="font-semibold">Cảm xúc</p>
        </div>
      </div>
      <UploadPost
        show={isShowCreatePost}
        setShow={setIsShowCreatePost}
        cbSuccess={() => {
          getPost();
        }}
      />
    </div>
  );
};
