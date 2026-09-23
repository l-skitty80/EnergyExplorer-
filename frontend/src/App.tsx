import { Routes, Route } from "react-router-dom";
import AppShell from "@/components/AppShell";
import Home from "@/pages/Home";
import SolarTracker from "@/pages/SolarTracker";
import ElectricityJourney from "@/pages/ElectricityJourney";
import Calculator from "@/pages/Calculator";
import LpuCaseStudy from "@/pages/LpuCaseStudy";
import CityGame from "@/pages/CityGame";
import InformationHub from "@/pages/InformationHub";
import Survey from "@/pages/Survey";
import About from "@/pages/About";

// One <Route> per page in src/pages; BrowserRouter already wraps this in main.tsx.
export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Home />} />
        <Route path="/solar" element={<SolarTracker />} />
        <Route path="/journey" element={<ElectricityJourney />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/lpu" element={<LpuCaseStudy />} />
        <Route path="/game" element={<CityGame />} />
        <Route path="/learn" element={<InformationHub />} />
        <Route path="/survey" element={<Survey />} />
        <Route path="/about" element={<About />} />
      </Route>
    </Routes>
  );
}
