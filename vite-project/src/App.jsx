import { useState } from 'react'
import { Routes, Route } from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './Component/Home/Home';
import Navbar from './Component/Home/Navar';
import Footer from './Component/Home/Footer';
import Hero from './Component/Home/Hero';
import FeaturedCamps from './Component/Home/FeaturedCamps';
import WhyChoose from './Component/Home/WhyChoose';
import HowItWorks from './Component/Home/HowItWorks';
import Testimonials from './Component/Home/Testimonials';
import CTASection from './Component/Home/CTASection';
import FeatureHome from './Component/Home/FeatureHome';
import PlatformFeatures from './Component/Home/PlatformFeatures';
import Experience from './Component/Home/Experience';
import BrowseCamps from './Component/Home/BrowseCamps';
import CampHome from './Component/Home/CampHome';
import CampBrowse from './Component/Home/CampBrowse';
import BrowseALLCamps from './Component/Home/BrowseAllCamp';
import About from './Component/Home/About';
import CoreValues from './Component/Home/CoreValues';
import { GrowingCommunity } from './Component/Home/GrowingCommunity';
import GetInTouch from './Component/Home/Contact/GetIntouch';
import FormContact from './Component/Home/Contact/FormContact';

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <> <Home /> <Hero/> <WhyChoose/> <FeaturedCamps/>
          <HowItWorks/> <Testimonials/> <CTASection/>
       </>
          
      } />
      <Route path="/features" element={
          <> <FeatureHome/> <PlatformFeatures/> <Experience/> <BrowseCamps/>
       </>
          
      } />
      <Route path="/camps" element={
          <> <CampHome/> <BrowseALLCamps/> <CampBrowse/>
       </>
          
      } />
      <Route path="/about" element={
          <>  <About/> <CoreValues/> <GrowingCommunity/>
       </>
          
      } />
      <Route path="/contact" element={
          <>  <GetInTouch/> <FormContact/>
       </>
          
      } />
      </Routes>
      <Footer />
    </>
  );
}

export default App
