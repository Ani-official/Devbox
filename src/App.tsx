import { Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import Workspace from "./routes/Workspace";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import About from "./routes/About";
import PrivacyPolicy from "./routes/PrivacyPolicy";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/workspace/*" element={<Workspace />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
