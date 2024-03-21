"use client";
import { CHAT_URL } from "@/app/apiHandler/constants";
import { useAuthStore, useChatStore } from "@/app/store/store";
import { useEffect, useState } from "react";

const useChat = (userSubmittedPrompt, promptResponse, setPromptResponse) => {
    const currentChatInstance = useChatStore(
        (state) => state.currentChatInstance
    );
    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        const fetchData = async () => {
            if (!userSubmittedPrompt || !currentChatInstance || !user?.email) {
                setPromptResponse("");
                return;
            }

            console.log("useChat fetching...");
            const response = await fetch(CHAT_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userID: user?.email,
                    sessionID: currentChatInstance,
                    message: userSubmittedPrompt
                })
            });

            if (!response.body) return;
            const decoder = new TextDecoderStream();
            const reader = response.body.pipeThrough(decoder).getReader();

            let tmpPromptResponse = "";
            while (true) {
                const { value, done } = await reader.read();

                //  if user is logged out or the response is done - stop the loop
                if (done || !user) {
                    console.log(tmpPromptResponse);
                    // reader.cancel();
                    break;
                } else {
                    tmpPromptResponse += `${value}`;
                    setPromptResponse(tmpPromptResponse);
                }
            }
        };

        fetchData();
    }, [currentChatInstance, userSubmittedPrompt]);

    return null;
};

export default useChat;
