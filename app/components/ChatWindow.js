"use client";

import { useCallback, useState } from "react";
import Input from "./ui/Input";

import model3d from "@/app/assets/icons/3d-model 1.svg";
import cad from "@/app/assets/icons/cad 1.svg";
import excel from "@/app/assets/icons/excel 1.svg";
import mcdx from "@/app/assets/icons/mcdx.svg";
import windowBtns from "@/app/assets/icons/windowBtns.svg";

import Image from "next/image";
import { TypeAnimation } from "react-type-animation";

const PromptButton = ({ text, icon, onClick = () => {} }) => {
  return (
    <button
      className=" px-2 lg:px-5 w-full lg:w-auto lg:min-w-[226px] btn-hover color-2 h-[50px] flex-grow shrink-0 hover:opacity-80  text-left  gap-4 flex items-center justify-evenly   rounded-[18px] text-white text-base lg:text-xl font-semibold   border-2 border-violet-700	 border-gradient-to-r from-purple-800 to-blue-500 border-opacity-100 "
      onClick={onClick}
    >
      {text} {icon}
    </button>
  );
};

function ChatWindow() {
  const [formData, setFormData] = useState({});
  const textCycle = [
    "Structural",
    2000,
    "Transportation",
    2000,
    "Tunnel",
    2000,
    "Civil",
    2000,
  ];

  const handleChange = useCallback(
    (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    },
    [formData]
  );

  // const handleSubmit = useCallback(
  //     (e) => {
  //         e.preventDefault();
  //     },
  //     [formData]
  // );

  const handleScroll = useCallback(() => {
    document.querySelector("body").scrollIntoView({
      behavior: "smooth",
    });
    setTimeout(() => {
      document.querySelector("#waitingList__name").focus();
    }, 500);
  }, []);

  const prompts = [
    {
      text: "Retaining Wall Designer",
      icon: (
        <Image
          src={model3d}
          alt="3d-model"
          className="lg:w-[30px] lg:h-[30px] left-[514.5px] top-[1066.5px] object-cover"
        />
      ),
    },
    {
      text: "Generate Excel",
      icon: (
        <Image
          src={excel}
          alt="excel"
          className="lg:w-[30px] lg:h-[30px] object-cover"
        />
      ),
    },
    {
      text: "Generate Mathcad",
      icon: <Image src={mcdx} alt="mcdx" className="object-cover h-5 w-fit" />,
    },
    {
      text: "AutoCAD DWG",
      icon: (
        <Image
          src={cad}
          alt="cad"
          className="lg:w-[30px] lg:h-[30px] object-cover"
        />
      ),
    },
  ];
  return (
    <div className="flex flex-col items-center w-full">
      <div className=" w-full lg:w-[1200px]  lg:h-[850px] relative  flex   items-center justify-center rounded-[18px] bg-[#161618] px-7 py-[120px] lg:p-2 border-0 border-[#6b0485]">
        <Image
          src={windowBtns}
          alt="windowBtns"
          className="absolute   block top-0 left-0 object-contain   w-20 lg:w-[100px] p-5"
        />
        <div className="flex flex-col gap-10 content">
          <div className="flex flex-col items-center gap-3 content__header">
            <p className=" max-w-[90vw] lg:max-w-none lg:w-[1112px] lg:h-[182px] text-2xl lg:text-6xl font-bold text-center">
              <span className="text-white ">Your Personal</span>
              <br />
              <span className="text-white ">AI </span>
              <span className=" gradient-text">
                {/* animate here  */}
                <TypeAnimation
                  sequence={textCycle}
                  wrapper="span"
                  omitDeletionAnimation
                  cursor={false}
                  speed={200}
                  //   style={{ fontSize: '2em', display: 'inline-block' }}
                  repeat={Infinity}
                />{" "}
                Engineer
              </span>
              <span className="text-white "> Intern</span>
            </p>
            <p className=" lg:w-[666px] h-8 text-base lg:text-2xl text-center text-[#818181]">
              When Generative AI comes to the Engineering World
            </p>
          </div>

          <div className="flex flex-col items-center gap-5">
            <Input
              onFocus={handleScroll}
              addClass=" lg:w-[944px]  h-[50px]  h-8 text-lg lg:text-2xl"
              value={formData.prompt}
              name="prompt"
              onChange={handleChange}
              placeholder="Design a retaining wall that is 20 ft high and has a base of..."
            />
            <div className="flex flex-col items-center justify-between gap-2 lg:flex-row ">
              {prompts.map((button) => (
                <PromptButton
                  onClick={handleScroll}
                  key={`prompt_${button.text}`}
                  text={button.text}
                  icon={button.icon}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;
