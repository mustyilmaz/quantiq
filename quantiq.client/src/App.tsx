import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/NavBar/Navbar';
import NotFound from './components/NotFound/NotFound';
import Home from './components/Home/Home';
import CommissionCalculator from './components/CommissionCalculator/CommissionCalculator';


//InitialPage
import WeatherForecast from './components/WeatherForecast/WeatherForecast';


const App = () => {
    return(
        <Router>
            <Navbar/>
            <Routes>
                <Route path="*" element={<NotFound />} />
                <Route path="/" element={<Home />} />
                <Route path="/weather-forecast" element={<WeatherForecast />} />
                <Route path="/commission-calculator" element={<CommissionCalculator />} />
            </Routes>
        </Router>
    );
}

export default App;