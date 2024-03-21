import React from "react";

import heart from "@/app/assets/icons/heart.svg";
import Image from "next/image";

function MadeWithSticker() {
    return (
        <article className="flex justify-center w-full pb-10 lg:justify-end pt-60 ">
            <div className="w-[220px] h-16 flex flex-col items-center lg:items-start  justify-center lg:justify-start">
                <p className="w-[220px] h-8 flex items-center gap-2    justify-center lg:justify-start   left-[1246px] top-[4620px] text-xl text-center  lg:text-left text-white">
                    Made with
                    <Image
                        src={heart}
                        alt="image-5.png"
                        className="w-[30px] h-[30px]   left-[1340.5px] top-[4620.5px] object-cover"
                    />
                </p>
                <p className="w-[220px] h-8 text-center   justify-center lg:justify-start  left-[1246px] top-[4652px] text-xl font-semibold lg:text-left text-white">
                    San Francisco, CA
                </p>
            </div>
        </article>
    );
}

export default MadeWithSticker;
