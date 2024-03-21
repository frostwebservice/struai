import React from "react";

import card1 from "@/app/assets/images/card1.png";
import Image from "next/image";

function FeatureCard({
    title = "Generative AI Calcs",
    description = "Ground up, fully redesigned API that seamlessly prints out Excel calculations. All-new Mathcad integration makes exporting easy. Or PDF it, whatever you prefer. Yes - models figures are included, and is matched to your format.",
    image = card1
}) {
    return (
        <article className="featureCard btn-hover color-4 lg:w-[580px] min-h-fit lg:h-[460px] p-10 flex items-center justify-center flex-col   left-[156px] top-[2024px] rounded-[18px] bg-[#161618] border-0 border-[#6b0485]">
            <div className="lg:w-[512px] lg:h-[359px] flex flex-col gap-10 items-center justify-center">
                <p className="lg:w-[512px] lg:h-[58px]   left-[190px] top-[2078px] text-[40px] font-semibold text-center text-white">
                    {title}
                </p>
                <Image
                    src={image}
                    alt="excel-2.png"
                    className="  lg:h-[100px]  object-contain"
                />
                <p className="lg:w-[400px] lg:h-[120px]   left-[248px] top-[2317px] text-xl text-center   text-white">
                    {description}
                </p>
            </div>
        </article>
    );
}

export default FeatureCard;
