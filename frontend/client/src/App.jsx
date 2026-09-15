import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import SplashPage from "./pages/SplashPage";
import ArmyDashboard from "./pages/ArmyDashboard";
import SpaceForceDashboard from "./pages/SpaceForceDashboard";
import SpaceCoverageDashboard from "./pages/SpaceCoverageDashboard";
import OrbitalAssetsDashboard from "./pages/OrbitalAssetsDashboard";
import CapabilityDependenciesDashboard from "./pages/CapabilityDependenciesDashboard";
import AuthContext from "./contexts/AuthContext";
import { authenticateUser, loginUser } from "./services/api";

function App() {
  const [user, setUser] = useState({});

  useEffect(() => {
    const auth = async () => {
      await loginUser("riley.bennet@army.mil", "Cooliosters");
      const authenticatedUser = await authenticateUser();

      console.log(authenticatedUser);

      if (authenticatedUser) setUser(authenticatedUser);
    };

    auth();
  }, [])

  return (
    <AuthContext.Provider value={user}>
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
    </AuthContext.Provider>
  );
}

export default App;
