import React from "react";
import avatarImage from "../assets/avatar.png";

export function Avatar({ src = avatarImage }) {
  return (
    <img src={src} alt="profile picture" className="rounded-full w-10 h-10" />
  );
}
