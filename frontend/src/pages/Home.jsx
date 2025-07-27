import { MessageCircle } from "lucide-react";
import CodeCard from "../components/Home/CodeCard";
import FAQFAQChatAi from "../components/Home/FAQChatAi";
import Features from "../components/Home/Features";
import { Hero } from "../components/Home/Hero";
import Leaderboard from "../components/Home/Leaderboard";
import PremiumDetails from "../components/Home/Premium";
import Testimonials from "../components/Home/Testimonials";
import { useState } from "react";

function Home() {
  const [showFAQ, setShowFAQ] = useState(false);

  return (
    <div className="min-h-screen">
      <Hero />
      <div  onClick={() => setShowFAQ((prev) => !prev)}  className="fixed bottom-5 flex gap-1 cursor-pointer select-none right-10 z-50 p-3 shadow shadow-black border border-black/15 dark:border-white/10 dark:bg-neutral/30 backdrop-blur-2xl  bg-white rounded-full">
        <span className="absolute top-7 right-6.5 text-xs font-bold">FAQ</span>{" "}
        <MessageCircle size={50} />
      </div>
      {showFAQ && (
        <div className="fixed bottom-25 right-10 z-50 rounded-2xl border border-black/15 dark:border-white/10 dark:bg-neutral/30 backdrop-blur-2xl w-[90%]  sm:w-[40%] bg-white shadow-md">
          <FAQFAQChatAi />
        </div>
      )}
      <Features />
      <Testimonials />
      <Leaderboard />
      <CodeCard />
      <PremiumDetails />
    </div>
  );
}

export default Home;
