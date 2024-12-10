import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';
import NotFound from './components/NotFound/NotFound';
import Home from './components/Home/Home';
import CommissionCalculator from './components/CommissionCalculator/CommissionCalculator';


//InitialPage
import WeatherForecast from './components/WeatherForecast/WeatherForecast';
import Register from './components/Auth/Register/Register';
import UserLogin from './components/Auth/UserLogin/UserLogin';

import "./App.css";


const App = () => {
    return(
        <Router>
            <Navbar/>
            <Routes>
                <Route path="*" element={<NotFound />} />
                <Route path="/" element={<Home />} />
                <Route path='register' element={<Register />}/>
                <Route path='user/login' element={<UserLogin />}/>
                <Route path="/weather-forecast" element={<WeatherForecast />} />
                <Route path="/commission-calculator" element={<CommissionCalculator />} />
            </Routes>
            <Footer/>
        </Router>
    );
}

export default App;