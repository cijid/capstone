import { BrowserRouter, Routes, Route } from "react-router-dom";

import SplashPage from "./pages/SplashPage";
import ArmyDashboard from "./pages/ArmyDashboard";
import SpaceForceDashboard from "./pages/SpaceForceDashboard";
import ArmyLogin from "./pages/ArmyLogin";
import SpaceForceLogin from "./pages/SpaceForceLogin";
import RegisterPage from "./pages/RegisterPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/army/login" element={<ArmyLogin />} />
        <Route path="/space-force/login" element={<SpaceForceLogin />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/army" element={<ArmyDashboard />} />
        <Route path="/space-force" element={<SpaceForceDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
