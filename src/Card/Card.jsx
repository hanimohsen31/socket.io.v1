import React, { useEffect, useState } from "react";
import { Comment, Like, LikeFilled, Share } from "../store/Svgs";

export const Card = (props) => {
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    props.notificationData.type === 1 &&
      props.data.username === props.user &&
      setIsLiked(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.notificationData]);
  
  // send notification to server side
  const handleNotification = (type) => {
    type === 1 && setIsLiked(true);
    props.socket.emit("sendNotification", {
      senderName: props.user,
      reciverName: props.data.username,
      type,
    });
  };

  return (
    <div className="Card">
      <div className="card">
        <div className="card-top p-2">
          <img src={props.data.postImage} className="userImage" alt="..." />
          <div className="username">{props.data.fullname}</div>
        </div>
        <img src={props.data.postImage} className="card-img-top" alt="..." />
        <div className="card-body p-2">
          <p className="card-text mb-1">{props.data.desc}</p>
          <h5 className="card-title">
            {isLiked ? (<span><Like /></span>
            ) : (
              <span onClick={() => handleNotification(1)}><LikeFilled /></span>
            )}
            <span onClick={() => handleNotification(2)}><Comment /></span>
            <span onClick={() => handleNotification(3)}><Share /></span>
          </h5>
        </div>
      </div>
    </div>
  );
};
