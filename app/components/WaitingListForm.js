"use client";

import React, { useCallback, useState } from "react";
import Input from "./ui/Input";
import toast from "react-hot-toast";
import axios from "axios";

const WAITLIST_URL = "https://ashva.pythonanywhere.com/waitlist";

const initial = {
    fname: "",
    email: "",
    suggestion: ""
};

function WaitingListForm({
    titleElm = (
        <div className="flex flex-col gap-3">
            <p className="w-full lg:w-[1000px] h-fit lg:h-20 text-5xl lg:text-6xl font-bold text-center text-white">
                <span className="gradient-text">Reimagine </span>
                Structural Design
            </p>
            <p className="w-full lg:w-[976px] h-fit lg:h-8 text-2xl text-center text-[#818181]">
                Join the waitlist to get access. Suggest what problem you need
                solved.
            </p>
        </div>
    )
}) {
    const [formData, setFormData] = useState(initial);
    const [loading, setLoading] = useState(0);

    const handleChange = useCallback(
        (e) => {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        },
        [formData]
    );

    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();
            if (formData.fname === "" || formData.email === "") {
                // alert error - email, name empty
                toast.error("Please check your email and name", {
                    style: {
                        borderRadius: "10px",
                        background: "#333",
                        color: "#fff"
                    }
                });

                return;
            }
            setLoading(1);
            axios
                .post(WAITLIST_URL, {
                    details: formData
                })
                .then((response) => {
                    if (response.data.includes("NOT JSON")) {
                        throw new Error("NOT JSON");
                    }

                    toast.success("Thank you for joining the waitlist!", {
                        style: {
                            borderRadius: "10px",
                            background: "#333",
                            color: "#fff"
                        }
                    });

                    setFormData(initial);
                })
                .catch((error) => {
                    toast.error(error.message, {
                        style: {
                            borderRadius: "10px",
                            background: "#333",
                            color: "#fff"
                        }
                    });
                    console.error(error);
                })
                .finally(() => {
                    setLoading(false);
                });

        },
        [formData]
    );

    return (
        <article className="relative flex flex-col items-center gap-10 py-20 waitingListForm ">
            {titleElm}
            <form
                onSubmit={handleSubmit}
                className="flex flex-col items-start justify-center w-full gap-2 lg:w-auto lg:gap-2 lg:flex-row"
            >
                <div className="flex flex-col items-start justify-start w-full gap-1 lg:w-auto lg:gap-1 ">
                    <div className="flex flex-col w-full gap-1 sm:flex-row lg:gap-2 lg:w-auto">
                        <Input
                            id="waitingList__name"
                            required
                            name="fname"
                            value={formData.fname}
                            onChange={handleChange}
                            type="text"
                            placeholder="First Name"
                            addClass="w-full lg:w-[223px]  h-[46px] "
                        />
                        <Input
                            required
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            type="email"
                            placeholder="name@email.com"
                            addClass="w-full lg:w-[357px]  h-[46px] "
                        />
                    </div>
                    <Input
                        name="suggestion"
                        value={formData.suggestion}
                        onChange={handleChange}
                        type="text"
                        placeholder="I want AI to be able to |"
                        addClass="w-full lg:w-[590px]  h-[46px] "
                    />
                </div>
                <button
                    type="submit"
                    className={`w-full  lg:w-[167px]   h-[50px] ${
                        loading ? "hover:cursor-wait" : ""
                    }   btn-hover color-3 text-xl text-center text-white  rounded-[14px] border-0 border-[#6b0485]`}
                    // style={{
                    //     background: loading
                    //         ? "linear-gradient(142.97deg, #6b0385 -18.76%, rgba(107,4,100,0) 120.76%)"
                    //         : "linear-gradient(142.97deg, #6b0485 -18.76%, rgba(107,4,133,0) 120.76%)"
                    // }}
                    disabled={loading}
                >
                    {loading ? "Submitting" : "Join waitlist"}
                </button>
            </form>
        </article>
    );
}

export default WaitingListForm;
