"use client";

import { twMerge } from "tailwind-merge";

const noop = () => {};

function Input({
    onChange = noop,
    onClick = noop,
    onFocus = noop,
    value = "",
    label = "", // title for checkbox
    desc = "",
    icon = null,
    placeholder = "",
    name = "",
    required = false,
    checked = false,
    className = null,
    inputClassName = null,
    borderAt = [],
    type = "text",
    selectList = [],
    addClass = "",
    info = null,
    id = null,
    labelClass = null,
    disabled = false,
    passRef = null,
    textarea = false
}) {
    const inputProps = {
        ref: passRef,
        disabled: disabled,
        autoComplete: type === "password" ? "new-password" : "",
        value: value,
        onChange: onChange,
        onClick: onClick,
        onFocus: onFocus,
        id: id,
        type: type,
        name: name,
        placeholder: placeholder,
        className: inputClassName
            ? inputClassName
            : twMerge(
                  `formInput px-5 outline-none  rounded-[14px] bg-transparent border-[3px] border-[#6b0485] text-white `,
                  addClass
              )
    };

    return textarea ? <textarea {...inputProps} /> : <input {...inputProps} />;
}

export default Input;
