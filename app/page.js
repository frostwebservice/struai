import ChatWindow from "./components/ChatWindow";
import { LabelCard } from "./components/LabelCard";
import MadeWithSticker from "./components/MadeWithSticker";
import WaitingListForm from "./components/WaitingListForm";
import ChatApp from "./components/chat/ChatApp";
import FeaturesList from "./components/features/FeaturesList";
import Header from "./components/Header";
export default function Home() {
  return (
    <>
      <Header />
      <main className="home px-[7%]">
        <section className="hero" id="hero">
          <WaitingListForm />
          <ChatWindow />
        </section>

        <section className="flex flex-col items-center gap-10 p-10 lg:flex-row labelCards labels justify-evenly">
          <LabelCard />
          <LabelCard
            title="Faster results"
            desc={`Industry software help do complex design - we transform those results
                        in practical terms - meaning faster spreadsheets, drawings, reports.
                        All in your desired format.`}
          />
        </section>

        <WaitingListForm
          titleElm={
            <p className="lg:w-[666px] lg:h-[46px] text-4xl text-center text-[#818181]">
              Join the waitlist to get access
            </p>
          }
        />
        <FeaturesList />
        <WaitingListForm />
        <MadeWithSticker />
      </main>
    </>
  );
}
