import { BrowserRouter, Routes, Route } from "react-router-dom";
import SplashPage from "./pages/SplashPage";
import ArmyDashboard from "./pages/ArmyDashboard";
import SpaceForceDashboard from "./pages/SpaceForceDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splashpage />} />
        <Route path="/army" element={<ArmyDashboard />} />
        <Route path="/space-force" element={<SpaceForceDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;