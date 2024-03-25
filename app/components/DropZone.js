import React from "react";
import Image from "next/image";
import FilePreview from "./FilePreview";

import Input from "@/app/components/ui/Input";
import { useCallback, useEffect, useRef, useState } from "react";

import model3d from "@/app/assets/icons/3d-model 1.svg";
import sendIcon from "@/app/assets/icons/chatSend.svg";
import excel from "@/app/assets/icons/excel 1.svg";

import { fetchData } from "@/app/apiHandler/api";
import { useChatStore } from "@/app/store/store";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";
import getFormattedDateTime from "@/app/utils/getFormattedDate";
import { Modal } from "next-modal";
import axios from "axios";
import { Mulish } from "next/font/google";

const DropZone = ({
  data,
  setFirst = null,
  user,
  setSubmittedPrompt,
  dispatch,
  setRight,
}) => {
  const currentChatInstance = useChatStore(
    (state) => state.currentChatInstance
  );
  const setChatInstances = useChatStore((state) => state.setChatInstances);
  const addChatInstance = useChatStore((state) => state.addChatInstance);
  const addmessageToChat = useChatStore((state) => state.addMessageToChat);

  const setCurrentChatInstance = useChatStore(
    (state) => state.setCurrentChatInstance
  );
  // onDragEnter sets inDropZone to true
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: true });
  };

  // onDragLeave sets inDropZone to false
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: false });
  };

  // onDragOver sets inDropZone to true
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // set dropEffect to copy i.e copy of the source item
    e.dataTransfer.dropEffect = "copy";
    dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: true });
  };

  // onDrop sets inDropZone to false and adds files to fileList
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // get files from event on the dataTransfer object as an array
    let files = [...e.dataTransfer.files];

    // ensure a file or files are dropped
    if (files && files.length > 0) {
      // loop over existing files
      const existingFiles = data.fileList.map((f) => f.name);
      // check if file already exists, if so, don't add to fileList
      // this is to prevent duplicates
      files = files.filter((f) => !existingFiles.includes(f.name));

      // dispatch action to add droped file or files to fileList
      dispatch({ type: "ADD_FILE_TO_LIST", files });
      // reset inDropZone to false
      dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: false });
    }
  };
  const editChatInstanceTitle = useChatStore(
    (state) => state.editChatInstanceTitle
  );
  const setTitleOfNewInstace = useCallback(
    async (sessionID) => {
      const title = await fetchData({
        userID: user?.email,
        sessionID,
        getAnswer: "get-title",
      });
      editChatInstanceTitle(sessionID, title);
    },
    [editChatInstanceTitle, user?.email]
  );
  // to handle file uploads
  const uploadFiles = async () => {
    // get the files from the fileList as an array
    let files = data.fileList;
    // initialize formData object
    const formData = new FormData();
    // loop over files and add to formData
    // files.forEach((file) => formData.append("files", file));
    formData.append("file", files[0]);

    axios
      .post(
        "https://ashva.pythonanywhere.com/upload?userID=bhoshaga@gmail.com",
        formData
      )
      .then((response) => {
        const resp = response.data;
        console.log(resp.message[0].message); // Full response by server, dictionary with keys: status, message, status_code, server_response, filename

        let newChat = !currentChatInstance;

        const sessionID = currentChatInstance || uuidv4();
        console.log("sessionID", sessionID);
        // process the data - set input disabled - form disabled
        // setProcessing(true);
        if (!currentChatInstance) {
          // new chat - new session id
          console.log("this is new");
          setCurrentChatInstance(sessionID);

          addChatInstance({
            sessionID,
            title: "",
            date: getFormattedDateTime(),
            messages: [
              {
                role: "user",
                content: "A new file uploaded to server",
              },
            ],
          });

          // addmessageToChat({
          //   role: "assistant",
          //   content: resp.message[0].message,
          // });
        } else {
          // existing chat - add message to the current instance

          addmessageToChat({
            role: "user",
            content: "A new file uploaded to server",
          });
          // addmessageToChat({
          //   role: "assistant",
          //   content: resp.message[0].message,
          // });
        }
        setSubmittedPrompt("A new file uploaded to server");
        if (newChat) {
          // get title from server
          setTimeout(() => {
            setTitleOfNewInstace(sessionID);
          }, 3000);
          // setModel(true);
        }
        if (setFirst != null) setFirst(true);
        setRight(true);
      });
  };
  return (
    <>
      <div
        className="dropzone max-w-[400px] mt-5 mx-auto"
        onDragEnter={(e) => handleDragEnter(e)}
        onDragOver={(e) => handleDragOver(e)}
        onDragLeave={(e) => handleDragLeave(e)}
        onDrop={(e) => handleDrop(e)}
      >
        {/* <input id="fileSelect" type="file" multiple className="files" /> */}
        {/* <label htmlFor="fileSelect">You can select multiple Files</label> */}
        <h3 className="uploadMessage text-2xl text-gray-500">
          Start typing, or drop your documents here
        </h3>
        <Image src="/img4.png" alt="upload" height={50} width={50} />
      </div>
      {/* <FilePreview fileData={data} /> */}
      {data.fileList.length > 0 && (
        <button
          className="uploadBtn !mx-0 !w-full !max-w-[400px]"
          onClick={uploadFiles}
        >
          Upload
        </button>
      )}
    </>
  );
};

export default DropZone;
