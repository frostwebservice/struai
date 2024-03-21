"use client";
import sidebarIcon from "@/app/assets/icons/sidebarIcon.svg";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useAuthStore, useChatStore } from "../store/store";
import checkTimeRange from "../utils/checkTimeRange";
import { fetchData } from "../apiHandler/api";
import { useRouter } from "next/navigation";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import useTracer from "../utils/useTracer";
import avatar from "@/app/assets/icons/avatar.png";

const SidebarDate = ({ children, open }) => (
  <h3
    className={`${
      !open ? "translate-x-[200%] opacity-0" : ""
    }  w-[74px] leading-5 text-white text-opacity-75 text-xs my-[5px] mx-1`}
  >
    {children}
  </h3>
);

const SidebarCard = ({
  open,
  title,
  sessionID,
  disableSidebar,
  active = false,
  clearPromptAndResponse,
  setOpen,
}) => {
  const setCurrentChatInstance = useChatStore(
    (state) => state.setCurrentChatInstance
  );

  const user = useAuthStore((state) => state.user);
  const setCurrentChatMessages = useChatStore(
    (state) => state.setCurrentChatMessages
  );
  const handleChatInstanceClick = useCallback(async () => {
    if (!active) {
      clearPromptAndResponse();
      // check if there are messages in the store
      // if there are - then no need to fetch server data

      console.log("window.innerWidth = ", window.innerWidth);
      //closing the sidebar after clicking chat history if width < sm
      if (window.innerWidth < 640) setOpen(false);

      const messages = useChatStore
        .getState()
        .chatInstances.find(
          (instance) => instance.sessionID === sessionID
        )?.messages;
      if (messages?.length) {
        console.log("messages");
        console.log(messages);
        // set messages in store
        setCurrentChatInstance(sessionID);
      } else {
        const chatHistory = await fetchData({
          sessionID,
          userID: user?.email,
        });

        if (chatHistory) {
          console.log("chatHistory");
          console.log(chatHistory);
          // set messages in store
          setCurrentChatMessages(sessionID, chatHistory);
          setCurrentChatInstance(sessionID);
        }
      }
    }
  }, [
    active,
    clearPromptAndResponse,
    sessionID,
    setCurrentChatInstance,
    setCurrentChatMessages,
    user?.email,
  ]);

  const editChatInstanceTitle = useChatStore(
    (state) => state.editChatInstanceTitle
  );
  const editChatInstance = useCallback(
    async (e) => {
      e.stopPropagation();

      // get title from user - prompt
      const newTitle = prompt("Enter new title", title);

      if (newTitle) {
        const res = await fetchData({
          sessionID,
          userID: user?.email,
          getAnswer: "update-title",
          newTitle,
        });
        console.log(res);

        if (res.toLowerCase().includes("success")) {
          console.log("success updating store");
          console.log(newTitle);
          // update the title in store
          editChatInstanceTitle(sessionID, newTitle);
        }
      }
    },
    [editChatInstanceTitle, sessionID, title, user?.email]
  );

  const removeChatInstance = useChatStore((state) => state.deleteChatInstance);

  const deleteChatInstance = useCallback(
    async (e) => {
      e.stopPropagation();

      // get confirmation from user
      const confirmation = confirm(
        "Are you sure you want to delete this chat instance?"
      );
      if (!confirmation) return;

      const res = await fetchData({
        sessionID,
        userID: user?.email,
        getAnswer: "remove-session",
      });
      console.log(res);
      if (res.toLowerCase().includes("success")) {
        console.log("success updating store");
        setCurrentChatInstance(null);
        // remove the chat instance from store
        removeChatInstance(sessionID);
      }
    },
    [removeChatInstance, sessionID, setCurrentChatInstance, user?.email]
  );

  return (
    <div
      onClick={disableSidebar ? () => {} : handleChatInstanceClick}
      className={`${
        !open ? "translate-x-[200%]" : ""
      }  h-[43px] p-2 text-white mb-[5px] cursor-pointer relative rounded-lg  flex justify-start items-center gap-2 ${
        active ? "  border border-zinc-500  " : "  "
      }`}
      //  text-opacity-80 bg-neutral-800 p-4 break-all overflow-hidden whitespace-nowrap relative after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:from-80% after:to-neutral-800 after:to-95%
    >
      {" "}
      <span>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20.25 3.375H3.75C3.25272 3.375 2.77581 3.57254 2.42417 3.92417C2.07254 4.27581 1.875 4.75272 1.875 5.25V17.25C1.875 17.7473 2.07254 18.2242 2.42417 18.5758C2.77581 18.9275 3.25272 19.125 3.75 19.125H9.11531L10.3922 21.2147C10.5584 21.4917 10.7933 21.721 11.0743 21.8805C11.3552 22.0399 11.6725 22.1241 11.9955 22.1249C12.3186 22.1256 12.6363 22.0429 12.9179 21.8848C13.1996 21.7266 13.4356 21.4984 13.6031 21.2222L14.8847 19.125H20.25C20.7473 19.125 21.2242 18.9275 21.5758 18.5758C21.9275 18.2242 22.125 17.7473 22.125 17.25V5.25C22.125 4.75272 21.9275 4.27581 21.5758 3.92417C21.2242 3.57254 20.7473 3.375 20.25 3.375ZM19.875 16.875H14.6747C14.3524 16.875 14.0356 16.9581 13.7548 17.1163C13.474 17.2744 13.2387 17.5022 13.0716 17.7778L12 19.5309L10.9303 17.7806C10.7627 17.5049 10.5271 17.2768 10.2461 17.1182C9.96504 16.9596 9.648 16.8759 9.32531 16.875H4.125V5.625H19.875V16.875ZM8.25 11.25C8.25 10.9533 8.33797 10.6633 8.5028 10.4166C8.66762 10.17 8.90189 9.97771 9.17597 9.86418C9.45006 9.75065 9.75166 9.72094 10.0426 9.77882C10.3336 9.8367 10.6009 9.97956 10.8107 10.1893C11.0204 10.3991 11.1633 10.6664 11.2212 10.9574C11.2791 11.2483 11.2494 11.5499 11.1358 11.824C11.0223 12.0981 10.83 12.3324 10.5834 12.4972C10.3367 12.662 10.0467 12.75 9.75 12.75C9.35218 12.75 8.97064 12.592 8.68934 12.3107C8.40804 12.0294 8.25 11.6478 8.25 11.25ZM12.75 11.25C12.75 10.9533 12.838 10.6633 13.0028 10.4166C13.1676 10.17 13.4019 9.97771 13.676 9.86418C13.9501 9.75065 14.2517 9.72094 14.5426 9.77882C14.8336 9.8367 15.1009 9.97956 15.3107 10.1893C15.5204 10.3991 15.6633 10.6664 15.7212 10.9574C15.7791 11.2483 15.7494 11.5499 15.6358 11.824C15.5223 12.0981 15.33 12.3324 15.0834 12.4972C14.8367 12.662 14.5467 12.75 14.25 12.75C13.8522 12.75 13.4706 12.592 13.1893 12.3107C12.908 12.0294 12.75 11.6478 12.75 11.25Z"
            fill="#F0EDF4"
          />
        </svg>
      </span>
      <span className="hover:opacity-80 text-sm">{title.substring(0, 25)}</span>
      {active ? (
        // edit icon svg
        <div className="absolute flex items-center gap-3 p-3 right-[1px] bg-gradient-to-l from-neutral-800 from-40% pl-14">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 h-3 hover:opacity-80"
            fill="currentColor"
            onClick={editChatInstance}
            viewBox="0 0 48 48"
            id="Pen"
          >
            <path
              d="m46.242 10.245-4.467 4.467-8.616-8.352 4.599-4.599a5.999 5.999 0 1 1 8.484 8.484zm-7.083 7.08L11.694 44.79 0 48.048l3.207-11.739L30.57 8.946l8.589 8.379z"
              fill="#fbfbfb"
              // class="color000000 svgShape"
            ></path>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 h-3 hover:opacity-80"
            fill="currentColor"
            onClick={deleteChatInstance}
            viewBox="0 0 92 92"
            id="Trash"
          >
            <path
              d="m78.4 30.4-3.1 57.8c-.1 2.1-1.9 3.8-4 3.8H20.7c-2.1 0-3.9-1.7-4-3.8l-3.1-57.8c-.1-2.2 1.6-4.1 3.8-4.2 2.2-.1 4.1 1.6 4.2 3.8l2.9 54h43.1l2.9-54c.1-2.2 2-3.9 4.2-3.8 2.1.1 3.8 2 3.7 4.2zM89 17c0 2.2-1.8 4-4 4H7c-2.2 0-4-1.8-4-4s1.8-4 4-4h22V4c0-1.9 1.3-3 3.2-3h27.6C61.7 1 63 2.1 63 4v9h22c2.2 0 4 1.8 4 4zm-53-4h20V8H36v5zm1.7 65c2 0 3.5-1.9 3.5-3.8l-1-43.2c0-1.9-1.6-3.5-3.6-3.5-1.9 0-3.5 1.6-3.4 3.6l1 43.3c0 1.9 1.6 3.6 3.5 3.6zm16.5 0c1.9 0 3.5-1.6 3.5-3.5l1-43.2c0-1.9-1.5-3.6-3.4-3.6-2 0-3.5 1.5-3.6 3.4l-1 43.2c-.1 2 1.5 3.7 3.5 3.7-.1 0-.1 0 0 0z"
              fill="#fbfbfb"
              // class="color000000 svgShape"
            ></path>
          </svg>
        </div>
      ) : null}
      {/* {children} */}
    </div>
  );
};

function Sidebar(props) {
  const {
    hide = false,
    disableSidebar,
    clearPromptAndResponse = () => {},
    open,
    setOpen,
  } = props;
  // useTracer(props);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (hide) setOpen(false);
  }, [hide]);

  const data = useChatStore((state) => state.chatInstances);

  const currentChatInstance = useChatStore(
    (state) => state.currentChatInstance
  );

  const dateRef = React.useRef(null);
  dateRef.current = "";

  const [listingRef] = useAutoAnimate();

  const clearCurrentChatInstance = useChatStore(
    (state) => state.clearCurrentChatInstance
  );
  const handleNewChat = useCallback(() => {
    // clear current instance id
    clearCurrentChatInstance();
    // clear current messages
    // useChatStore.getState().clearCurrentChatMessages();
  }, [clearCurrentChatInstance]);
  const handleSignOut = () => {
    logOut();
    // chat instances needs to be cleared
    deleteAllChatInstances();
    clearCurrentChatInstance();
    if (localStorage)
      // Access localStorage
      localStorage.removeItem("ashva_google_acc");
    // redirect to home at / in nextjs
    router.push("/");
  };
  const logOut = useAuthStore((state) => state.logout);

  const router = useRouter();

  const deleteAllChatInstances = useChatStore(
    (state) => state.deleteAllChatInstances
  );

  return (
    <aside
      className={twMerge(
        `${
          open
            ? "!sm:m-0 md:w-[20%] min-w-[250px] md:mx-auto p-6 sm:pb-3"
            : "w-10 sm:w-10"
        } ease-in-out self-start pt-3 pb-1 gap-6 flex bg-black flex-col overflow-hidden  h-full md`
      )}
    >
      {/* open/close icon */}
      <figure
        ref={dateRef}
        className="flex items-center justify-end h-8 absolute right-3 p-10 contents"
      >
        <Image
          src={sidebarIcon}
          alt="image-5.png"
          className="w-4 sm:w-5 aspect-square cursor-pointer "
          onClick={() => setOpen((prev) => !prev)}
        />
      </figure>
      <div className="h-8 sm:hidden" aria-hidden="true"></div>

      {/* 'new chat' button in gpt like chat app */}
      {open && (
        <button
          className="w-6/8 h-[50px] mt-2  flex items-center justify-center gap-3 rounded-[10px] text-white text-base font-semibold border-gray-300  bg-indigo-400 	 border-gradient-to-r from-purple-800 to-blue-500 border-opacity-100 "
          onClick={handleNewChat}
        >
          {/* <svg
                        stroke="currentColor"
                        fill="none"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="icon-sm shrink-0"
                        height="1em"
                        width="1em"
                    >
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg> */}
          New Chat
        </button>
      )}

      {open && <div className="text-white">Open Chats</div>}
      {/* all chats */}
      <div
        className={`${
          open ? "px-2 sm:px-0" : "opacity-0"
        } h-[60%] overflow-y-auto overflow-x-hidden custom-scrollbar sm:pe-1`}
        ref={listingRef}
      >
        {data?.map((item, index) => {
          let day = checkTimeRange(item.timestamp);
          if (day === dateRef.current) {
            day = null;
          } else {
            dateRef.current = day;
          }

          return (
            <span key={`${item.sessionID}${index}`}>
              {day && <SidebarDate open={open}>{day}</SidebarDate>}

              <SidebarCard
                disableSidebar={disableSidebar}
                active={item.sessionID === currentChatInstance}
                title={item.title}
                sessionID={item.sessionID}
                open={open}
                clearPromptAndResponse={clearPromptAndResponse}
                setOpen={setOpen}
              />
            </span>
          );
        })}
      </div>
      {open && (
        <div className="absolute bottom-0">
          <div
            className={`${
              !open ? "translate-x-[200%]" : ""
            }  h-[43px] p-2 text-white mb-[5px] cursor-pointer relative rounded-lg  flex justify-start items-center gap-2 `}
          >
            {" "}
            <span>
              <svg
                width="20"
                height="22"
                viewBox="0 0 20 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.25 4.5H14.875V3.375C14.875 2.67881 14.5984 2.01113 14.1062 1.51884C13.6139 1.02656 12.9462 0.75 12.25 0.75H7.75C7.05381 0.75 6.38613 1.02656 5.89384 1.51884C5.40156 2.01113 5.125 2.67881 5.125 3.375V4.5H1.75C1.45163 4.5 1.16548 4.61853 0.954505 4.8295C0.743526 5.04048 0.625 5.32663 0.625 5.625C0.625 5.92337 0.743526 6.20952 0.954505 6.4205C1.16548 6.63147 1.45163 6.75 1.75 6.75H2.125V19.5C2.125 19.9973 2.32254 20.4742 2.67417 20.8258C3.02581 21.1775 3.50272 21.375 4 21.375H16C16.4973 21.375 16.9742 21.1775 17.3258 20.8258C17.6775 20.4742 17.875 19.9973 17.875 19.5V6.75H18.25C18.5484 6.75 18.8345 6.63147 19.0455 6.4205C19.2565 6.20952 19.375 5.92337 19.375 5.625C19.375 5.32663 19.2565 5.04048 19.0455 4.8295C18.8345 4.61853 18.5484 4.5 18.25 4.5ZM7.375 3.375C7.375 3.27554 7.41451 3.18016 7.48483 3.10984C7.55516 3.03951 7.65054 3 7.75 3H12.25C12.3495 3 12.4448 3.03951 12.5152 3.10984C12.5855 3.18016 12.625 3.27554 12.625 3.375V4.5H7.375V3.375ZM15.625 19.125H4.375V6.75H15.625V19.125ZM8.875 9.75V15.75C8.875 16.0484 8.75647 16.3345 8.5455 16.5455C8.33452 16.7565 8.04837 16.875 7.75 16.875C7.45163 16.875 7.16548 16.7565 6.9545 16.5455C6.74353 16.3345 6.625 16.0484 6.625 15.75V9.75C6.625 9.45163 6.74353 9.16548 6.9545 8.9545C7.16548 8.74353 7.45163 8.625 7.75 8.625C8.04837 8.625 8.33452 8.74353 8.5455 8.9545C8.75647 9.16548 8.875 9.45163 8.875 9.75ZM13.375 9.75V15.75C13.375 16.0484 13.2565 16.3345 13.0455 16.5455C12.8345 16.7565 12.5484 16.875 12.25 16.875C11.9516 16.875 11.6655 16.7565 11.4545 16.5455C11.2435 16.3345 11.125 16.0484 11.125 15.75V9.75C11.125 9.45163 11.2435 9.16548 11.4545 8.9545C11.6655 8.74353 11.9516 8.625 12.25 8.625C12.5484 8.625 12.8345 8.74353 13.0455 8.9545C13.2565 9.16548 13.375 9.45163 13.375 9.75Z"
                  fill="#F0EDF4"
                />
              </svg>
            </span>
            <span className="hover:opacity-80 text-sm">
              Clear Conversations
            </span>
          </div>
          <div
            className={`${
              !open ? "translate-x-[200%]" : ""
            }  h-[43px] p-2 text-white mb-[5px] cursor-pointer relative rounded-lg  flex justify-start items-center gap-2 `}
          >
            {" "}
            <span>
              <Image
                src={user?.picture ?? avatar}
                alt="avatar"
                width={30}
                height={30}
                className="rounded-full"
              />
            </span>
            <span className="hover:opacity-80 text-sm">My Account</span>
          </div>
          <div
            className={`${
              !open ? "translate-x-[200%]" : ""
            }  h-[43px] p-2 text-white mb-[5px] cursor-pointer relative rounded-lg  flex justify-start items-center gap-2 `}
          >
            {" "}
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                id="Exit"
                className="w-6 h-6 cursor-pointer hover:opacity-80"
                onClick={handleSignOut}
              >
                <path fill="none" d="M0 0h48v48H0z"></path>
                <path
                  d="M20.17 31.17 23 34l10-10-10-10-2.83 2.83L25.34 22H6v4h19.34l-5.17 5.17zM38 6H10c-2.21 0-4 1.79-4 4v8h4v-8h28v28H10v-8H6v8c0 2.21 1.79 4 4 4h28c2.21 0 4-1.79 4-4V10c0-2.21-1.79-4-4-4z"
                  fill="#fbfbfb"
                  className="color000000 svgShape"
                ></path>
              </svg>
            </span>
            <span className="hover:opacity-80 text-sm" onClick={handleSignOut}>
              Log out
            </span>
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;

/*
[
    {
        "sessionID": "45c0e916-f839-445b-8803-10d6ea7dcf7e",
        "title": "The Quick Brown Fox",
        "timestamp": "2023-11-07 22:55:25.397162-08:00"
    },
    {
        "sessionID": "f2d22ccc-9da8-497f-ab33-a86c0db1768b",
        "title": "Gone with the Wind",
        "timestamp": "2023-11-07 22:54:28.486313-08:00"
    },
    {
        "sessionID": "791b8b9a-c927-40f5-8aa4-99c0a8c2fa3d",
        "title": "The Silence of the Lambs",
        "timestamp": "2023-11-07 22:52:56.596465-08:00"
    },
    {
        "sessionID": "7153d5be-4555-4f38-9aa0-d3c1561e7269",
        "title": "Alice in Wonderland",
        "timestamp": "2023-11-07 22:50:24.882510-08:00"
    },
    {
        "sessionID": "bc233d58-ad86-4e86-b10e-32639e97b5f3",
        "title": "Summer Breeze",
        "timestamp": "2023-11-07 22:49:25.395313-08:00"
    },
    {
        "sessionID": "b3184d31-3803-4531-ad84-8e9a46899ad6",
        "title": "Alice in Wonderland",
        "timestamp": "2023-11-07 22:42:44.754147-08:00"
    },
    {
        "sessionID": "a5b09b62-062e-4c1f-aa72-b63cb54f49b7",
        "title": "A Tale of Two Cities",
        "timestamp": "2023-11-07 22:38:43.996717-08:00"
    }
]

*/
