import React from "react";

import avatar from "@/app/assets/icons/avatar.png";
import botAvatar from "@/app/assets/icons/botAvatar.png";
import Image from "next/image";
import { useAuthStore } from "@/app/store/store";

function ChatItem({
  open,
  role = "user",
  content = "Design a retaining wall that is 20 ft high and has a base of...",
}) {
  const user = useAuthStore((state) => state.user);
  const custom = open ? "custom-p sm:w-[30%] md:w-[50%] xl:w-[70%] " : "";
  return (
    <div className={`flex items-start gap-x-6 sm:gap-x-10 px-2 w-full`}>
      <Image
        width={50}
        height={50}
        className="w-8 aspect-square sm:w-12 rounded-full shrink-0 grow-0"
        alt="ellipse-7.png"
        src={role === "user" ? user?.picture ?? avatar : botAvatar}
      />
      <p className="custom-p text-sm sm:text-base text-left text-white whitespace-pre-line">
        {content}
      </p>
    </div>
  );
}

export default ChatItem;
