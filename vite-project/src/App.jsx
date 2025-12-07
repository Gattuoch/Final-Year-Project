import { useState } from 'react'
import { Routes, Route } from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './Component/Home/Home';
import Navbar from './Component/Home/Navar';
import Footer from './Component/Home/Footer';

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <> <Home />
       </>
          
      } />
        {/* <Route path="/AboutMe" element={<AboutMe />} />
        <Route path="/Resume" element={<Resume />} />
        <Route path="/contactMe" element={<ContactMe />} />
        <Route path="/Testimonial" element={<Testimonia />} /> */}
      </Routes>
      <Footer />
    </>
  );
}

export default App
