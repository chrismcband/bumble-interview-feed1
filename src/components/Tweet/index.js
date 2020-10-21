import React from "react";
import "./styles.css";

import { ProfilePicture } from "../ProfilePicture";

export const Tweet = ({ index, style, data }) => {
  const currentItem = data[index];
  return (
    <div style={style} className="tweet">
      <div className="tweet__content">
        <ProfilePicture
          imageUrl={currentItem.image}
          profileName={currentItem.username}
        />
        <div className="tweet__user-text">
          <div className="tweet__username">{currentItem.username}</div>
          <div className="tweet__text">{currentItem.text}</div>
        </div>
      </div>
    </div>
  );
};
