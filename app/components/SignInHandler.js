"use client";

import React, { useCallback, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";
import avatar from "@/app/assets/icons/avatar.png";
import GoogleSignIn from "../auth/GoogleSignIn";
import axios from "axios";
import { useAuthStore, useChatStore } from "../store/store";
import { useRouter } from "next/navigation";

// const CLIENT_ID = `438033925920-3nkveo9ok78io1utr9ta5878uk5coj8d.apps.googleusercontent.com`;
const BASE_URL = "https://ashva.pythonanywhere.com/creds";
const query = JSON.stringify("client_id"); // or client_secrets

export const SignInHandler = () => {
    const user = useAuthStore((state) => state.user);
    const signIn = useAuthStore((state) => state.login);
    const logOut = useAuthStore((state) => state.logout);
    const [userKey, setKey] = useState(null);

    const router = useRouter();

    const handleSignIn = useCallback(
        (res) => {
            console.log("res.credential");
            const userData = jwtDecode(res.credential);
            console.log(userData);
            signIn(userData);
            if (localStorage)
                // Access localStorage
                localStorage.setItem(
                    "ashva_google_acc",
                    JSON.stringify(userData)
                );
        },
        [signIn]
    );

    const deleteAllChatInstances = useChatStore(
        (state) => state.deleteAllChatInstances
    );
    const clearCurrentChatInstance = useChatStore(
        (state) => state.clearCurrentChatInstance
    );

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

    const getKeys = useCallback(async () => {
        try {
            if (userKey) {
                return userKey;
            }
            const response = await axios.get(BASE_URL, {
                params: {
                    query
                }
            });
            console.log(response.data);
            setKey(response.data);
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }, [userKey]);

    const initiateAuthElm = useCallback(async () => {
        /* global google */
        google.accounts.id.initialize({
            client_id: await getKeys(),
            callback: handleSignIn
        });
        google.accounts.id.renderButton(
            document.getElementById("signin-button"),
            {
                theme: "outline",
                size: "large"
            }
        );
        setTimeout(() => {
            if (!useAuthStore.getState().user) {
                /* global google */
                google.accounts.id.prompt();
            }
        }, 5000);
    }, [getKeys, handleSignIn]);

    const SCRIPT_ID = "google-signin-script";

    const initateScript = useCallback(() => {
        // check if script already exists - remove if exists
        const scriptExists = document.getElementById(SCRIPT_ID);
        if (scriptExists) {
            scriptExists.remove();
        }

        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.id = SCRIPT_ID;
        script.onload = initiateAuthElm;
        document.body.appendChild(script);
    }, [initiateAuthElm]);

    useEffect(() => {
        initateScript();
    }, [initateScript, signIn, user?.email]);

    useEffect(() => {
        // check if user exists in localstorage and sync with store
        const userData = JSON.parse(localStorage.getItem("ashva_google_acc"));
        if (userData) {
            signIn(userData);
        }
        return () => {};
    }, [signIn]);

    // get only first word from string sentence
    const getFirstWord = (str) => {
        if (str.indexOf(" ") === -1) return str;
        else return str.substr(0, str.indexOf(" "));
    };

    return user ? (
        <div className="flex items-center gap-5 text-xl text-white ">
            <p className="">{getFirstWord(user?.name)}</p>
            <Image
                src={user?.picture ?? avatar}
                alt="avatar"
                width={30}
                height={30}
                className="rounded-full"
            />
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
        </div>
    ) : (
        <>
            <GoogleSignIn />
            <button id="signin-button" />
            {/* <button
                onClick={handleSignIn}
                className="header__right lg:w-[130px] h-8 hover:text-gray-300  text-lg lg:text-xl font-semibold text-center text-white"
            >
                Sign in
            </button> */}
        </>
    );
};
