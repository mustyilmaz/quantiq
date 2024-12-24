import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from 'react';

import Navbar from "./components/NavBar/Navbar";
import Notification from "./components/Notification/Notification";
import Footer from "./components/Footer/Footer";
import NotFound from "./components/NotFound/NotFound";
import Home from "./components/Home/Home";
import CommissionCalculator from "./components/CommissionCalculator/CommissionCalculator";

//Auth
import Register from "./components/Auth/Register/Register";
import UserLogin from "./components/Auth/UserLogin/UserLogin";

//UserDashboard
import UserHome from "./components/UserDashboard/UserHome/UserHome";
import UserDashboardLayout from "./components/Layouts/UserDashboardLayout";
import ChangePassword from "./components/UserDashboard/ChangePassword/ChangePassword";
import InfoAPI from "./components/UserDashboard/InfoAPI/InfoAPI";
//Routes
import ProtectedRoute from "./routes/ProtectedUserRoute";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./App.css";



const App = () => {
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleCloseNotification = () => {
    setNotification(null);
  };
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Navbar />
          {notification && (
            <Notification
              message={notification.message}
              type={notification.type}
              onClose={handleCloseNotification}
            />
          )}
          <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<Home />} />
            <Route path="register" element={<Register />} />
            <Route path="user/login" element={<UserLogin />} />
            <Route
              path="/commission-calculator"
              element={<CommissionCalculator />}
            />
            {/* Dashboard Routes */}
            <Route
              path="/user"
              element={
                <ProtectedRoute>
                  <UserDashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<UserHome />} />
              <Route path="api-information" element={<InfoAPI />} />
              <Route path="change-password" element={<ChangePassword setNotification={setNotification}/>} />
            </Route>
          </Routes>
          <Footer />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
