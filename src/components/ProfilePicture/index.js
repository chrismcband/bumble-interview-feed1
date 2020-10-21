import React from "react";
import "./styles.css";

export const ProfilePicture = ({ imageUrl, profileName }) => (
  <div className="profile-picture">
    <img src={imageUrl} alt={`${profileName}'s tweet`} />
  </div>
);
