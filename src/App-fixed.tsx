import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import SignInPage from "./pages/SignInPage";

const App = () => (
  <BrowserRouter>
    <Navigation />
    <Routes>
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/" element={<Home />} />
    </Routes>
  </BrowserRouter>
);

export default App;
