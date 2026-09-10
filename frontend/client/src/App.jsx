import { BrowserRouter, Routes, Route } from "react-router-dom";

import SplashPage from "./pages/SplashPage";
import ArmyDashboard from "./pages/ArmyDashboard";
import SpaceForceDashboard from "./pages/SpaceForceDashboard";
import SpaceCoverageDashboard from "./pages/SpaceCoverageDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/army" element={<ArmyDashboard />} />
        <Route path="/space-force" element={<SpaceForceDashboard />} />
        <Route path="/space-coverage" element={<SpaceCoverageDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
