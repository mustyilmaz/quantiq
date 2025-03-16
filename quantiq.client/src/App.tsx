import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

//Contexts
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

//Layouts
import UserDashboardLayout from "./components/Layouts/UserDashboardLayout/UserDashboardLayout";

//Components
import Home from "./components/LandingPage/Home/Home";
import NotFound from "./components/NotFound/NotFound";

//Public Components
import CommissionCalculator from "./components/CommissionCalculator/CommissionCalculator";

//Auth Components
import Register from "./components/Auth/Register/Register";
import UserLogin from "./components/Auth/UserLogin/UserLogin";

//UserDashboard
import UserHome from "./components/UserDashboard/UserHome/UserHome";
import ChangePassword from "./components/UserDashboard/ChangePassword/ChangePassword";
import InfoAPI from "./components/UserDashboard/InfoAPI/InfoAPI";


//Routes 
import ProtectedUserRoute from "./routes/ProtectedUserRoute";
import MainLayout from "./components/Layouts/MainLayout/MainLayout";

// Types
import { NotificationType } from './types/notification';

import "./App.css";

const App = () => {
  const [notification, setNotification] = useState<NotificationType>(null);

  return (
    <ThemeProvider>
      <AuthProvider>
          <Router>
            <Routes>
              <Route element={<MainLayout notification={notification} onCloseNotification={() => setNotification(null)} />}>
                <Route path="/" element={<Home />} />
                <Route path="/user/login" element={<UserLogin setNotification={setNotification} />} />
                <Route path="/register" element={<Register setNotification={setNotification} />} />
                <Route path="/commission-calculator" element={<CommissionCalculator />} />
              </Route>

              <Route element={<ProtectedUserRoute />}>
                <Route element={<UserDashboardLayout notification={notification} onCloseNotification={() => setNotification(null)} />}>
                  <Route path="/user/dashboard" element={<UserHome />} />
                  <Route path="/user/change-password" element={<ChangePassword setNotification={setNotification} />} />
                  <Route path="/user/api-information" element={<InfoAPI />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
