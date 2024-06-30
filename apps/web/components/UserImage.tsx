import React from "react";

export default function UserImage({ image, height, width }: any) {
  return (
    <div>
      <img
        className="rounded-full cursor-pointer"
        src={image || ""}
        width={width}
        height={height}
        alt="user_profile_image"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
