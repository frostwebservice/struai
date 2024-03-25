import Image from "next/image";
import React, { useEffect, useRef, useState, useReducer } from "react";
import close from "@/app/assets/icons/close.svg";
import expand from "@/app/assets/icons/expand.svg";
import rotate from "@/app/assets/icons/rotate.svg";
import DropZone from "../DropZone";
import retainingWall from "@/app/assets/images/retainingWall.png";
import { twMerge } from "tailwind-merge";

function ModelInterface({
  open = true,
  user,
  first,
  setRight,
  setSubmittedPrompt,
  handleClose = () => {},
  modelImage = retainingWall,
}) {
  const reducer = (state, action) => {
    switch (action.type) {
      case "SET_IN_DROP_ZONE":
        return { ...state, inDropZone: action.inDropZone };
      case "ADD_FILE_TO_LIST":
        return { ...state, fileList: state.fileList.concat(action.files) };
      default:
        return state;
    }
  };
  const [data, dispatch] = useReducer(reducer, {
    inDropZone: false,
    fileList: [],
  });
  return (
    <div
      className={`${
        first
          ? "flex flex-col p-3 py-5 w-1/2 bg-black h-full"
          : "hidden w-0 bg-black"
      }`}
    >
      {open && (
        <article className="nestedSmoothUI  rounded-3xl bg-white p-5 relative flex items-center h-full w-full relative">
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
      )}
      {!open && (
        <div className="bg-black m-auto">
          <DropZone
            data={data}
            dispatch={dispatch}
            setSubmittedPrompt={setSubmittedPrompt}
            user={user}
            setRight={setRight}
          />
          {/* <div>
            <button>Share</button>
            <button>Generate PDF Report</button>
          </div> */}
        </div>
      )}
    </div>
  );
}

export default ModelInterface;
