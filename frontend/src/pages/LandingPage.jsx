import React from "react";
import { Hero } from "../components/Home/Hero";
import Features from "../components/Home/Features";
import Testimonials from "../components/Home/Testimonials";
import PremiumDetails from "../components/Home/Premium";

function LandingPage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <Testimonials />
      <PremiumDetails />
    </div>
  );
}

export default LandingPage;
