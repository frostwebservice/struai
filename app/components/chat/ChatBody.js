"use client";
import React, { useEffect, useRef, useState, useReducer } from "react";
import ChatItem from "./ChatItem";
import { useChatStore } from "@/app/store/store";
import ModelInterface from "./ModelInterface";
import DropZone from "../DropZone";
import Link from "next/link";
function ChatBody({
  open,
  showModel,
  setModel,
  isLoggedIn,
  setSubmittedPrompt,
  user,
  first = false,
  promptResponse,
  setFirst,
  setRight,
  setResponse,
}) {
  const contentRef = useRef(null);
  const currentChatInstance = useChatStore(
    (state) => state.currentChatInstance
  );
  const chatInstances = useChatStore((state) => state.chatInstances);

  const currentInstance = chatInstances.find(
    (instance) => instance.sessionID === currentChatInstance
  );
  const addmessageToChat = useChatStore((state) => state.addMessageToChat);
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

  // destructuring state and dispatch, initializing fileList to empty array
  const [data, dispatch] = useReducer(reducer, {
    inDropZone: false,
    fileList: [],
  });

  // console.log("cur instance");
  // console.log(currentChatInstance);
  // console.log("curinst");
  // console.log(currentInstance);
  // console.log("message");
  // console.log(currentInstance?.messages);

  useEffect(() => {
    if (promptResponse.includes("[DONE]")) {
      // the prompt messages is completed and so create a new message in the store using the instanceId
      // and the prompt response
      // addMessageToChat({ role: "assistant", content: promptResponse });
      console.log("track", promptResponse);
      addmessageToChat({
        role: "assistant",
        content: promptResponse.substring(0, promptResponse.length - 6),
      });
      // the bot response is done - so clear the prompt text
      setResponse("");
    }

    return () => {};
  }, [addmessageToChat, promptResponse, setResponse]);

  useEffect(() => {
    contentRef.current.scrollTop = contentRef.current.scrollHeight;
  });

  return (
    <div className="flex flex-row h-full !h-[91vh]">
      <article
        ref={contentRef}
        className={`grow ${
          currentInstance?.messages?.length ? "w-1/2" : "w-full"
        } flex flex-col gap-5 sm:gap-10 mb-5 overflow-y-auto custom-scrollbar pt-10`}
      >
        {currentInstance?.messages?.length ? (
          currentInstance.messages.map((data, index) => (
            <ChatItem
              onClick={setFirst(true)}
              open={open}
              {...data}
              key={`chatItem_${index}`}
            />
          ))
        ) : (
          // name of the app as huge text
          <div className="flex flex-col mt-[100px] sm:mt-[100px] md:mt-[50px] items-center justify-center w-full h-full text-xl text-center text-white">
            <div className="flex flex-row items-center justify-centertext-xl text-center text-white inline">
              <img src="/Frame19.png" className="w-12 inline" />

              {isLoggedIn && <span className="ml-3 text-3xl">Stru.AI</span>}
              {!isLoggedIn && (
                <span className="ml-3 text-3xl">
                  <Link className="text-blue-500 underline" href="/">
                    Please go to Login Page
                  </Link>
                </span>
              )}
            </div>
            <div className="w-full max-w-[1500px] mt-7">
              <div className="grid lg:grid-cols-3 sm:grid-col-12 gap-4 md:px-20 lg:px-10 sm:px-10 xl:px-20 2xl:px-40">
                <div className="rounded-2xl overflow-hidden shadow-lg bg-[#312f31] p-5 mx-5">
                  <div className="flex justify-center items-center">
                    <img className="w-10" src="/img1.png" />
                  </div>
                  <div className="px-2 py-2">
                    <div className="font-bold text-lg mb-2">Capabilities</div>
                    <p className="text-left my-3 text-base">
                      Ask questions that are directly understood and answered
                      contextually.
                    </p>
                    <p className="text-left text-base my-3 ">
                      Generate complete drawings based on your prompts.
                    </p>
                    <p className="text-left text-base my-3 ">
                      Generate preliminary structural calculations based on your
                      model.
                    </p>
                  </div>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg bg-[#312f31] p-5 mx-5">
                  <div className="flex justify-center items-center">
                    <img className="w-10" src="/img2.png" />
                  </div>
                  <div className="px-2 py-2">
                    <div className="font-bold text-lg mb-2">Limitations</div>
                    <p className="text-left my-3 text-base">
                      Models and logic are constantly being improved and results
                      may vary.
                    </p>
                    <p className="text-left text-base my-3 ">
                      Drawings are based on typical details and may not reflect
                      constructibility and site conditions.
                    </p>
                    <p className="text-left text-base my-3 ">
                      Models and logic are constantly being improved and results
                      may vary.
                    </p>
                  </div>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg bg-[#312f31] p-5 mx-5">
                  <div className="flex justify-center items-center">
                    <img className="w-10" src="/img3.png" />
                  </div>
                  <div className="px-2 py-2">
                    <div className="font-bold text-lg mb-2">Examples</div>
                    <p className="text-left my-3 text-base">
                      “Create a circular 1 in thick steel liner with anchors
                      around (radially)”
                    </p>
                    <p className="text-left text-base my-3 ">
                      “Can you share some sources to design a tunnel?”
                    </p>
                    <p className="text-left text-base my-3 ">
                      “Advise me on general building codes in the state of New
                      York”
                    </p>
                  </div>
                </div>
              </div>
              <div className="">
                <DropZone
                  data={data}
                  user={user}
                  dispatch={dispatch}
                  setFirst={setFirst}
                  setSubmittedPrompt={setSubmittedPrompt}
                  setRight={setRight}
                />
              </div>
            </div>
          </div>
        )}

        <p className="text-white">{promptResponse}</p>
        {/* {Boolean(promptResponse) && (
          <ChatItem role="assistant" content={promptResponse} open={open} />
        )} */}
        <span
          id="end-chat"
          ref={contentRef}
          className="hidden"
          aria-hidden="true"
        />
      </article>

      <ModelInterface
        open={open}
        user={user}
        setSubmittedPrompt={setSubmittedPrompt}
        first={first}
        setRight={setRight}
        handleClose={() => setRight(false)}
      />
    </div>
  );
}

export default ChatBody;
