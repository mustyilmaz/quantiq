import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/NavBar/Navbar";
import Footer from "./components/Footer/Footer";
import NotFound from "./components/NotFound/NotFound";
import Home from "./components/Home/Home";
import CommissionCalculator from "./components/CommissionCalculator/CommissionCalculator";

//InitialPage
import WeatherForecast from "./components/WeatherForecast/WeatherForecast";
import Register from "./components/Auth/Register/Register";
import UserLogin from "./components/Auth/UserLogin/UserLogin";

//UserDashboard
import UserDashboardLayout from "./components/Layouts/UserDashboardLayout";
//Routes
import ProtectedRoute from "./routes/ProtectedUserRoute";
import { AuthProvider } from "./components/Auth/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./App.css";
import UserHome from "./components/UserDashboard/UserHome/UserHome";
import InfoAPI from "./components/UserDashboard/InfoAPI/InfoAPI";

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<Home />} />
            <Route path="register" element={<Register />} />
            <Route path="user/login" element={<UserLogin />} />
            <Route path="/weather-forecast" element={<WeatherForecast />} />
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
            </Route>
          </Routes>
          <Footer />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
