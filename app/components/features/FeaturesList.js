import React from "react";
import FeatureCard from "../FeatureCard";

import card1 from "@/app/assets/images/card1.png";
import card2 from "@/app/assets/icons/card2.svg";
import card3 from "@/app/assets/icons/card3.svg";
import card4 from "@/app/assets/icons/card4.svg";
import card5 from "@/app/assets/icons/card5.svg";
import card6 from "@/app/assets/icons/card6.svg";
import card7 from "@/app/assets/icons/card7.svg";
import card8 from "@/app/assets/icons/card8.svg";

const list = [
    {
        title: "Generative AI Calcs",
        image: card1,
        description:
            "Ground up, fully redesigned API that seamlessly prints out Excel calculations. All-new Mathcad integration makes exporting easy. Or PDF it, whatever you prefer. Yes - models figures are included, and is matched to your format."
    },
    {
        title: "Modern models",
        image: card2,
        description:
            "Clean, lightning fast, easy to use design models. Utilize sliders to adjust parameters, or ask AI to make the structure work. Fully cloud based, no installs necessary."
    },
    {
        title: "Smart. Contextually smart.",
        image: card3,
        description:
            "Imagine GPT-4 pretrained for Civil Engineers. AI trained on ACI 318-19, ASCE 7-22, USACE EM, AASHTO and more. Ask questions that is directly understood and answered contextually."
    },
    {
        title: "Tunnel Engineering",
        image: card4,
        description:
            "Use our Excel Engine to have AI calculate Closed-Form solutions for ground loads. JSCE, ACI 544-R,  ITA based. Use our AutoCAD engine to draw segmental tunnel liner drawings."
    },
    {
        title: "AutoCAD Integration",
        image: card5,
        description:
            "Leverage AutoCAD API Integrations - draw retaining wall markups for drafters, developed tunnel intrados views and more"
    },
    {
        title: "OCR + NLP Old Docs",
        image: card6,
        description:
            "Transform an old engineering document, specs, basis of design that was typewritten with the power of AI OCR. Words are not just recognized, but NLP is added to make text content-aware."
    },
    {
        title: "Compare Specs / Document",
        image: card7,
        description:
            "Cross reference Specs with General Notes to compare documents, checking for errors. Summarize a large directory with what each file does, and who worked on it last."
    },
    {
        title: "SAP 2000 Integration",
        image: card8,
        description:
            "Ground up, in depth SAP 2000 API for everyone. Ask SAP what the load factors are, or what’s the difference between file_v1.sdb and file_v2.sdb. Change cover from 3” to 2.5” in section designer and draw PM curves."
    }
];

function FeaturesList() {
    return (
        <section className="flex flex-wrap items-center justify-center w-full gap-10 features ">
            {list.map((item, index) => (
                <FeatureCard key={`feature_${item.title}${index}`} {...item} />
            ))}
        </section>
    );
}

export default FeaturesList;
