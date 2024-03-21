import Image from "next/image";
import React from "react";

import close from "@/app/assets/icons/close.svg";
import expand from "@/app/assets/icons/expand.svg";
import rotate from "@/app/assets/icons/rotate.svg";

import retainingWall from "@/app/assets/images/retainingWall.png";
import { twMerge } from "tailwind-merge";

function ModelInterface({
  open = false,
  handleClose = () => {},
  modelImage = retainingWall,
}) {
  return (
    <div className={`${open ? "flex flex-col p-3 py-5 w-1/2" : "w-0"}`}>
      <article
        className={`
                  nestedSmoothUI  rounded-3xl bg-white p-5 relative flex items-center",
                ${
                  open
                    ? " h-full w-full relative"
                    : " translate-x-[30%] opacity-0 w-0  "
                }
            `}
      >
        <div className="absolute top-0 right-0 z-[5] flex items-center gap-5 p-10">
          <Image
            src={expand}
            alt="retainingWall"
            className="object-contain cursor-pointer hover:opacity-80"
          />{" "}
          <Image
            src={close}
            onClick={handleClose}
            alt="retainingWall"
            className="object-contain cursor-pointer hover:opacity-80"
          />
        </div>

        <Image
          src={modelImage}
          alt="retainingWall"
          className="object-contain w-full cursor-pointer hover:opacity-80 "
        />

        <div className="absolute bottom-0 right-0 p-10">
          <Image
            src={rotate}
            alt="retainingWall"
            className="object-contain cursor-pointer hover:opacity-80"
          />
        </div>
      </article>
    </div>
  );
}

export default ModelInterface;
