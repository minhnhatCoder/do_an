import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostServices from "../../services/postServices";
import { Empty, Spin } from "antd";

const Image = ({ images }) => {
 
  const navigate = useNavigate();
  
  return (
    <Spin spinning={false}>
      <div className="w-2/3 rounded-lg bg-white mx-auto mt-3 p-3 ">
        <p className="font-bold text-2xl">Ảnh</p>
        <div className="flex items-start justify-start gap-3 flex-wrap mt-7 min-h-[500px]">
          {images?.length > 0 ? (
            images?.map((i) => (
              <img
                key={i?._id}
                src={i?.url}
                className="w-[287px] h-[287px] rounded-lg cursor-pointer object-cover"
                // onClick={() => {
                //   navigate("/post/detail/" + i?.post_id);
                // }}
              />
            ))
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Empty />
            </div>
          )}
        </div>
      </div>
    </Spin>
  );
};

export default Image;
