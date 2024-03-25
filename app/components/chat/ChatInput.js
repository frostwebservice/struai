"use client";

import Input from "@/app/components/ui/Input";
import { useCallback, useEffect, useRef, useState } from "react";

import model3d from "@/app/assets/icons/3d-model 1.svg";
import sendIcon from "@/app/assets/icons/chatSend.svg";
import excel from "@/app/assets/icons/excel 1.svg";

import { fetchData } from "@/app/apiHandler/api";
import { useChatStore } from "@/app/store/store";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";
import getFormattedDateTime from "@/app/utils/getFormattedDate";
import { Modal } from "next-modal";
import axios from "axios";

const PromptButton = ({ addClass = "", text, icon, onClick = () => {} }) => {
  return (
    <button
      className={twMerge(
        "px-[10px] text-white text-sm h-10 w-full  @2xl:text-lg @2xl:h-16 @2xl:w-[310px] btn-hover color-2 hover:opacity-80 gap-3 flex items-center justify-evenly rounded-[18px] font-semibold border-2 hover:border-violet-700   ",
        addClass
      )}
      onClick={onClick}
    >
      {text} {icon}
    </button>
  );
};

function ChatInput({
  isLoggedIn,
  user,
  setModel,
  setSubmittedPrompt,
  promptResponse,
  setFirst,
}) {
  // local state
  const [showPrompt, setPrompt] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({ prompt: "" });
  const [dropOpen, setDropOpen] = useState(false);
  const [toggleModal, setToggleModal] = useState(false);
  const [documents, setDocuments] = useState([]);
  useEffect(() => {
    axios
      .get("https://ashva.pythonanywhere.com/files?userID=bhoshaga@gmail.com")
      .then(function (response) {
        setDocuments(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }, []);
  const prompts = [
    {
      content: "Retaining Wall Designer",
      icon: (
        <Image
          src={model3d}
          alt="3d-model"
          className="lg:w-[30px] lg:h-[30px] left-[514.5px] top-[1066.5px] object-cover"
        />
      ),

      onClick: () => {
        // setSidebarOpen(false);
        setModel(true);
      },
    },
    {
      content: "OCR + NLP Old Docs",
      icon: (
        <Image
          src={excel}
          alt="excel"
          className="lg:w-[30px] lg:h-[30px] object-cover"
        />
      ),
      onClick: () => {
        setModel(true);
      },
    },
  ];

  // store

  const currentChatInstance = useChatStore(
    (state) => state.currentChatInstance
  );
  const setChatInstances = useChatStore((state) => state.setChatInstances);
  const addChatInstance = useChatStore((state) => state.addChatInstance);
  const setCurrentChatInstance = useChatStore(
    (state) => state.setCurrentChatInstance
  );
  // ref

  const inputRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    setPrompt(!currentChatInstance);
  }, [currentChatInstance]);

  const handleChange = useCallback(
    (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    },
    [formData]
  );

  const addmessageToChat = useChatStore((state) => state.addMessageToChat);

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

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // if response is being processed, do not allow user to submit another prompt
      if (promptResponse) return;
      let newChat = !currentChatInstance;
      const sessionID = currentChatInstance || uuidv4();

      // process the data - set input disabled - form disabled
      // setProcessing(true);
      if (!currentChatInstance) {
        // new chat - new session id
        setCurrentChatInstance(sessionID);

        addChatInstance({
          sessionID,
          title: "",
          date: getFormattedDateTime(),
          messages: [
            {
              role: "user",
              content: formData.prompt,
            },
          ],
        });

        // console.log("currentChatInstance");
        // console.log(currentChatInstance);
      } else {
        // existing chat - add message to the current instance

        addmessageToChat({
          role: "user",
          content: formData.prompt,
        });
      }
      setFirst(true);
      setSubmittedPrompt(formData.prompt);
      if (newChat) {
        // get title from server
        setTimeout(() => {
          setTitleOfNewInstace(sessionID);
        }, 3000);
        // setModel(true);
      }
      // setProcessing(false);
      setFormData({ prompt: "" });
    },
    [
      promptResponse,
      currentChatInstance,
      setSubmittedPrompt,
      formData.prompt,
      setCurrentChatInstance,
      addChatInstance,
      addmessageToChat,
      setTitleOfNewInstace,
    ]
  );

  const getChatInstancesFromServer = useCallback(async () => {
    // When Chat App opens
    // Check for chat instances in server
    const instances = await fetchData({
      userID: user?.email,
    });
    if (instances.includes("new user")) {
      setChatInstances([]);
    } else {
      // existing user with instances
      setChatInstances(instances.reverse());
    }

    // If chat instances are present, fetch the latest instance with id from server
    // const latestChatMessages = await fetchData({
    //     userID: user?.email,
    //     instanceID: instances[0].id
    // });

    // If chat instances are not present, create a new instance
  }, [setChatInstances, user?.email]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.shiftKey) return;
      if (event.key === "Enter") {
        event.preventDefault();
        btnRef.current.click();
      }
    };
    const iRef = inputRef.current;
    iRef.addEventListener("keypress", handleKeyPress);

    if (isLoggedIn) getChatInstancesFromServer();

    return () => {
      iRef.removeEventListener("keypress", handleKeyPress);
    };
  }, [getChatInstancesFromServer, isLoggedIn]);

  return (
    <>
      <Modal
        toggle={toggleModal}
        setToggle={setToggleModal}
        className="z-50 !bg-[#201F1F] !shadow-none"
      >
        <Modal.Header className="sans font-900 text-white text-30px fade-in-left animation-duration-500ms animation-forwards">
          <h3>My Documents</h3>
        </Modal.Header>
        <Modal.Body className="sans font-400 text-15px  text-white fade-in animation-duration-800ms animation-forwards">
          {documents.map((document) => (
            <div className="flex flex-row justify-between my-5 border-[1px] border-slate-600 p-2 rounded-md">
              <span className="mr-2 flex flex-row">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.2959 7.46396L15.0459 2.21396C14.9415 2.10935 14.8174 2.02636 14.6808 1.96974C14.5442 1.91311 14.3978 1.88396 14.25 1.88396H5.25C4.75272 1.88396 4.27581 2.0815 3.92417 2.43313C3.57254 2.78476 3.375 3.26168 3.375 3.75896V20.259C3.375 20.7562 3.57254 21.2332 3.92417 21.5848C4.27581 21.9364 4.75272 22.134 5.25 22.134H18.75C19.2473 22.134 19.7242 21.9364 20.0758 21.5848C20.4275 21.2332 20.625 20.7562 20.625 20.259V8.25896C20.625 7.96082 20.5066 7.67489 20.2959 7.46396ZM15 5.35271L17.1562 7.50896H15V5.35271ZM5.625 19.884V4.13396H12.75V8.63396C12.75 8.93233 12.8685 9.21847 13.0795 9.42945C13.2905 9.64043 13.5766 9.75896 13.875 9.75896H18.375V19.884H5.625Z"
                    fill="#F0EDF4"
                  />
                </svg>
                {document}
              </span>

              <span className="flex ">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M27 6.00896H22.5V4.50896C22.5 3.5807 22.1313 2.69046 21.4749 2.03408C20.8185 1.37771 19.9283 1.00896 19 1.00896H13C12.0717 1.00896 11.1815 1.37771 10.5251 2.03408C9.86875 2.69046 9.5 3.5807 9.5 4.50896V6.00896H5C4.60218 6.00896 4.22064 6.16699 3.93934 6.4483C3.65804 6.7296 3.5 7.11113 3.5 7.50896C3.5 7.90678 3.65804 8.28831 3.93934 8.56962C4.22064 8.85092 4.60218 9.00896 5 9.00896H5.5V26.009C5.5 26.672 5.76339 27.3079 6.23223 27.7767C6.70107 28.2456 7.33696 28.509 8 28.509H24C24.663 28.509 25.2989 28.2456 25.7678 27.7767C26.2366 27.3079 26.5 26.672 26.5 26.009V9.00896H27C27.3978 9.00896 27.7794 8.85092 28.0607 8.56962C28.342 8.28831 28.5 7.90678 28.5 7.50896C28.5 7.11113 28.342 6.7296 28.0607 6.4483C27.7794 6.16699 27.3978 6.00896 27 6.00896ZM12.5 4.50896C12.5 4.37635 12.5527 4.24917 12.6464 4.1554C12.7402 4.06164 12.8674 4.00896 13 4.00896H19C19.1326 4.00896 19.2598 4.06164 19.3536 4.1554C19.4473 4.24917 19.5 4.37635 19.5 4.50896V6.00896H12.5V4.50896ZM23.5 25.509H8.5V9.00896H23.5V25.509ZM14.5 13.009V21.009C14.5 21.4068 14.342 21.7883 14.0607 22.0696C13.7794 22.3509 13.3978 22.509 13 22.509C12.6022 22.509 12.2206 22.3509 11.9393 22.0696C11.658 21.7883 11.5 21.4068 11.5 21.009V13.009C11.5 12.6111 11.658 12.2296 11.9393 11.9483C12.2206 11.667 12.6022 11.509 13 11.509C13.3978 11.509 13.7794 11.667 14.0607 11.9483C14.342 12.2296 14.5 12.6111 14.5 13.009ZM20.5 13.009V21.009C20.5 21.4068 20.342 21.7883 20.0607 22.0696C19.7794 22.3509 19.3978 22.509 19 22.509C18.6022 22.509 18.2206 22.3509 17.9393 22.0696C17.658 21.7883 17.5 21.4068 17.5 21.009V13.009C17.5 12.6111 17.658 12.2296 17.9393 11.9483C18.2206 11.667 18.6022 11.509 19 11.509C19.3978 11.509 19.7794 11.667 20.0607 11.9483C20.342 12.2296 20.5 12.6111 20.5 13.009Z"
                    fill="#C05851"
                  />
                </svg>
              </span>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer className="sans font-400 text-10px">
          <button
            className="w-full h-[50px] mt-2  flex items-center justify-center gap-3 rounded-[10px] text-white text-base font-semibold border-gray-300  bg-indigo-400 	 border-gradient-to-r from-purple-800 to-blue-500 border-opacity-100 "
            // onClick={handleNewChat}
          >
            Upload +
          </button>
        </Modal.Footer>
      </Modal>
      <article className="flex flex-col !h-[9vh] items-center gap-2 sm:gap-5 @container sm:px-0 py-5 bg-[#3a3448]">
        {/* {showPrompt ? (
          <div className="flex  lg:px-5 flex-col items-center justify-center gap-1 sm:gap-3 lg:flex-row @[500px]:flex-nowrap ">
            {prompts.map((button, index) => (
              <PromptButton
                // onClick={handlePrompt}
                key={`prompt_${button.content}${index}`}
                addClass={`rounded-lg border border-[#818181]`}
                text={button.content}
                icon={button.icon}
                onClick={button.onClick}
              />
            ))}
          </div>
        ) : null} */}

        {/* <div class="modal fixed w-full h-full top-0 left-0 flex items-center justify-center">
          <div class="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
        </div> */}
        <form
          onSubmit={handleSubmit}
          className="relative w-full max-w-[1200px] flex"
        >
          <div class="relative inline text-left my-auto mx-5">
            <div>
              <button
                type="button"
                class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                id="menu-button"
                aria-expanded="false"
                aria-haspopup="false"
                onClick={(e) => {
                  setDropOpen(!dropOpen);
                }}
              >
                Documents
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 25 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.796 15.7959C20.6914 15.9008 20.5673 15.984 20.4305 16.0408C20.2938 16.0976 20.1471 16.1268 19.9991 16.1268C19.851 16.1268 19.7044 16.0976 19.5677 16.0408C19.4309 15.984 19.3067 15.9008 19.2022 15.7959L12.5 9.09373L5.79596 15.7959C5.58461 16.0073 5.29797 16.126 4.99908 16.126C4.7002 16.126 4.41355 16.0073 4.20221 15.7959C3.99086 15.5846 3.87213 15.2979 3.87213 14.999C3.87213 14.7002 3.99086 14.4135 4.20221 14.2022L11.7022 6.70216C11.8067 6.59728 11.9309 6.51407 12.0677 6.45729C12.2044 6.40051 12.351 6.37128 12.4991 6.37128C12.6471 6.37128 12.7938 6.40051 12.9305 6.45729C13.0673 6.51407 13.1914 6.59728 13.296 6.70216L20.796 14.2022C20.9008 14.3067 20.9841 14.4309 21.0408 14.5676C21.0976 14.7044 21.1268 14.851 21.1268 14.999C21.1268 15.1471 21.0976 15.2937 21.0408 15.4305C20.9841 15.5672 20.9008 15.6914 20.796 15.7959Z"
                    fill="#121212"
                  />
                </svg>
              </button>
            </div>
            {dropOpen && (
              <div
                class="absolute left-0 bottom-[40px] z-10 mt-2 w-56  rounded-md text-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none bg-black"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                tabindex="-1"
              >
                {documents.map((document) => (
                  <div class="py-1 flex p-1" role="none">
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

                    <a
                      href="#"
                      class="text-white block flex px-4 text-md"
                      role="menuitem"
                      tabindex="-1"
                      id="menu-item-0"
                    >
                      {document}
                    </a>
                  </div>
                ))}

                <div
                  class="py-1 border-t-[0.1px] border-slate-800 "
                  role="none"
                >
                  <a
                    href="#"
                    class="text-blue-600 block px-4 py-2 text-sm text-right"
                    role="menuitem"
                    tabindex="-1"
                    id="menu-item-0"
                    onClick={() => {
                      setToggleModal((prev) => !prev);
                      setDropOpen(false);
                    }}
                  >
                    Manage Documents
                  </a>
                </div>
              </div>
            )}
          </div>
          <Input
            textarea
            passRef={inputRef}
            addClass=" w-full h-[50px] max-h-[200px] pt-3 pr-10 lg:pt-2 text-sm lg:text-lg bg-black border-none"
            value={formData.prompt}
            name="prompt"
            onChange={handleChange}
            // promptResponse ||
            disabled={Boolean(!isLoggedIn)}
            placeholder="Start typing..."
          />

          <span className="absolute right-3 top-2.5 shrink-0 p-1  bg-transparent">
            <Image
              src={sendIcon}
              onClick={handleSubmit}
              alt="sendIcon"
              className="w-5 cursor-pointer shrink-0 hover:opacity-95"
            />
          </span>

          <button type="submit" className="hidden" ref={btnRef} />
        </form>
        {/* <p className="w-full h-5 text-xs sm:text-sm md:text-base text-center text-[#818181]">
                AI can make mistakes, verify all information.
            </p> */}
      </article>
    </>
  );
}

export default ChatInput;
