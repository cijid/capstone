import { BrowserRouter, Routes, Route } from "react-router-dom";

import SplashPage from "./pages/SplashPage";
import ArmyDashboard from "./pages/ArmyDashboard";
import SpaceForceDashboard from "./pages/SpaceForceDashboard";
import SpaceCoverageDashboard from "./pages/SpaceCoverageDashboard";
import OrbitalAssetsDashboard from "./pages/OrbitalAssetsDashboard";
import CapabilityDependenciesDashboard from "./pages/CapabilityDependenciesDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/army" element={<ArmyDashboard />} />
        <Route path="/space-force" element={<SpaceForceDashboard />} />
        <Route path="/space-coverage" element={<SpaceCoverageDashboard />} />
        <Route
          path="/space-force/orbital-assets"
          element={<OrbitalAssetsDashboard />}
        />
        <Route
          path="/space-force/capability-dependencies"
          element={<CapabilityDependenciesDashboard />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
