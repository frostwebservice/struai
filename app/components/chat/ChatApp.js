"use client";

import { useAuthStore } from "@/app/store/store";
import { useState } from "react";
import ChatHeader from "../ChatHeader";
import Sidebar from "../Sidebar";
import ChatBody from "./ChatBody";
import ChatInput from "./ChatInput";
import ModelInterface from "./ModelInterface";
import useChat from "./useChat";

const ChatAppWrapper = ({ children }) => {
  return (
    <section className="flex justify-center h-screen" id="chatApp">
      {/* border-0 border-[#6b0485]  */}
      <div className=" w-full h-screen bg-[#161618]  ">
        <article className=" h-screen w-full flex nestedSmoothUI relative">
          {children}
        </article>
      </div>
    </section>
  );
};

function ChatApp() {
  const [showModel, setModel] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [response, setResponse] = useState("");
  const [submittedPrompt, setSubmittedPrompt] = useState("");
  const [right, setRight] = useState(false);
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = Boolean(user?.email);
  const [first, setFirst] = useState(false);
  useChat(submittedPrompt, response, setResponse);

  const clearPromptAndResponse = () => {
    setSubmittedPrompt("");
    setResponse("");
  };

  return (
    <ChatAppWrapper>
      <Sidebar
        // open={isSidebarOpen}
        // setOpen={setSidebarOpen}
        disableSidebar={Boolean(response?.length)}
        hide={showModel || !isLoggedIn}
        clearPromptAndResponse={clearPromptAndResponse}
        setFirst={setFirst}
        open={showSidebar}
        setOpen={setShowSidebar}
      />

      <div
        className={`${
          showSidebar ? "w-0 [&>*]:hidden sm:[&>*]:flex sm:w-full" : "w-full"
        } h-screen flex flex-col  pb-0`}
      >
        {/* <ChatHeader /> */}
        <div
          className={`${
            showSidebar
              ? "w-[full] flex grow overflow-y-auto custom-scrollbar justify-center overflow-x-hidden"
              : "w-full flex grow overflow-y-auto custom-scrollbar justify-center overflow-x-hidden"
          } `}
        >
          {/* ${showModel ? "w-0 [&>*]:hidden sm:[&>*]:flex sm:w-[51%]" : "w-full"} */}
          <article className={` h-screen flex  flex-col w-full h-full`}>
            <ChatBody
              isLoggedIn={isLoggedIn}
              promptResponse={response}
              open={right}
              setRight={setRight}
              first={first}
              user={user}
              setFirst={setFirst}
              showModel={showModel}
              setSubmittedPrompt={setSubmittedPrompt}
              setModel={setModel}
              setResponse={setResponse}
            />
            <ChatInput
              isLoggedIn={isLoggedIn}
              setModel={setModel}
              user={user}
              setFirst={setFirst}
              open={showSidebar}
              promptResponse={response}
              setSubmittedPrompt={setSubmittedPrompt}
            />
          </article>
          {/* <ModelInterface
            // open={showModel}
            first={first}
            open={false}
            handleClose={() => setModel(false)}
          /> */}
        </div>
      </div>
    </ChatAppWrapper>
  );
}

export default ChatApp;
