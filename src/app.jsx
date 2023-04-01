import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FullCoverPreview from "@components/fullCoverPreview";
import Footer from "./layouts/footer";
import Header from "./layouts/header";
import Timeline from "./pages/timeline/timeline";
import Home from "./pages/home/home";

export default function App() {
  const [fullCover, setFullCover] = React.useState({ name: "", show: false });
  return (
    <React.StrictMode>
      <Router>
        <Header />
        <FullCoverPreview fullCover={fullCover} setFullCover={setFullCover} />
        <Routes>
          <Route path="/timeline" element={<Timeline setFullCover={setFullCover} />}></Route>
          <Route path="/" element={<Home setFullCover={setFullCover} />}></Route>
          <Route path="*" element={<h1 style={{textAlign:"center",marginTop:"40px"}}>404 Not Found</h1>}></Route>
        </Routes>
        <Footer />
      </Router>
    </React.StrictMode>
  );
}
