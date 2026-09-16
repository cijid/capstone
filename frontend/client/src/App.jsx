import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import SplashPage from "./pages/SplashPage";
import ArmyDashboard from "./pages/ArmyDashboard";
import SpaceForceDashboard from "./pages/SpaceForceDashboard";
import SpaceCoverageDashboard from "./pages/SpaceCoverageDashboard";
import OrbitalAssetsDashboard from "./pages/OrbitalAssetsDashboard";
import CapabilityDependenciesDashboard from "./pages/CapabilityDependenciesDashboard";
import AuthContext from "./contexts/AuthContext";
import { authenticateUser, loginUser } from "./services/api";
import ArmyLogin from "./pages/ArmyLogin";
import SpaceForceLogin from "./pages/SpaceForceLogin";
import RegisterPage from "./pages/RegisterPage";
import LoadingOverlay from "./components/LoadingOverlay";


function App() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = async () => {
      setLoading(true);
      try {
        const authenticatedUser = await authenticateUser();

        console.log(authenticatedUser);

        if (authenticatedUser?.id) setUser(authenticatedUser);
        else setUser(null);
      } catch (err) {console.log(err)};
      setLoading(false);
    };

    auth();
  }, []);

  function ProtectedRoute({ children, type }) {
    if (!user?.id) return <Navigate to="/login" replace />;
    if (type && user?.branch != type && !user.admin) return <Navigate to="/" replace />;

    return children;
  }

  if (loading) return <LoadingOverlay />;

  return (
    <AuthContext.Provider value={{user, setUser}}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProtectedRoute><SplashPage /></ProtectedRoute>} />
          <Route path="/army" element={<ProtectedRoute type="army"><ArmyDashboard /></ProtectedRoute>} />
          <Route path="/army/login" element={<ProtectedRoute><ArmyLogin /></ProtectedRoute>} />
          <Route path="/login" element={<SpaceForceLogin />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/space-force" element={<ProtectedRoute type="ussf"><SpaceForceDashboard /></ProtectedRoute>} />
          <Route path="/space-coverage" element={<ProtectedRoute><SpaceCoverageDashboard /></ProtectedRoute>} />
          <Route
            path="/space-force/orbital-assets"
            element={<ProtectedRoute><OrbitalAssetsDashboard /></ProtectedRoute>}
          />
          <Route
            path="/space-force/capability-dependencies"
            element={<ProtectedRoute><CapabilityDependenciesDashboard /></ProtectedRoute>}
          />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
