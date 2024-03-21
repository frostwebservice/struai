export const LabelCard = ({
    title = "More time",
    desc = `Engineers spend a lot of time doing trivial things. AI Interns do
  the hard work starting from scratch, freeing engineers more time to
  review and revise faster - saving time and money.`
}) => (
    <div className="flex flex-col items-center gap-5 lg:gap-14 labels__card">
        <p className="lg:w-[512px] lg:h-[58px]   left-[190px] top-[1392px] text-xl lg:text-[40px] font-semibold text-center text-white">
            {title}
        </p>
        <p className="lg:w-[480px] lg:h-[278px]   left-[183px] top-[1450px] text-lg lg:text-[28px] text-center text-white">
            {desc}
        </p>
    </div>
);
