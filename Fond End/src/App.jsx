import { Routes, Route } from "react-router-dom";

// Home Components
import Navbar from "./Component/Home/Navar";
import Footer from "./Component/Home/Footer";
import Home from "./Component/Home/Home";
import Hero from "./Component/Home/Hero";
import FeaturedCamps from "./Component/Home/FeaturedCamps";
import WhyChoose from "./Component/Home/WhyChoose";
import HowItWorks from "./Component/Home/HowItWorks";
import Testimonials from "./Component/Home/Testimonials";
import CTASection from "./Component/Home/CTASection";

// Feature Page Components
import FeatureHome from "./Component/Home/FeatureHome";
import PlatformFeatures from "./Component/Home/PlatformFeatures";
import Experience from "./Component/Home/Experience";
import BrowseCamps from "./Component/Home/BrowseCamps";

// Camps Page Components
import CampHome from "./Component/Home/CampHome";
import CampBrowse from "./Component/Home/CampBrowse";
import BrowseALLCamps from "./Component/Home/BrowseAllCamp";

// About Page Components
import About from "./Component/Home/About";
import CoreValues from "./Component/Home/CoreValues";
import { GrowingCommunity } from "./Component/Home/GrowingCommunity";

// Contact Page Components
import GetInTouch from "./Component/Home/Contact/GetIntouch";
import FormContact from "./Component/Home/Contact/FormContact";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* HOME */}
        <Route
          path="/"
          element={
            <>
              <Home />
              <Hero />
              <WhyChoose />
              <FeaturedCamps />
              <HowItWorks />
              <Testimonials />
              <CTASection />
            </>
          }
        />

        {/* FEATURES */}
        <Route
          path="/features"
          element={
            <>
              <FeatureHome />
              <PlatformFeatures />
              <Experience />
              <BrowseCamps />
            </>
          }
        />

        {/* CAMPS */}
        <Route
          path="/camps"
          element={
            <>
              <CampHome />
              <BrowseALLCamps />
              <CampBrowse />
            </>
          }
        />

        {/* ABOUT */}
        <Route
          path="/about"
          element={
            <>
              <About />
              <CoreValues />
              <GrowingCommunity />
            </>
          }
        />

        {/* CONTACT */}
        <Route
          path="/contact"
          element={
            <>
              <GetInTouch />
              <FormContact />
            </>
          }
        />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
