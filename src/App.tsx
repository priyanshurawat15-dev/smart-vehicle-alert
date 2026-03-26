
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Scan from './pages/Scan';
import ParkingAlert from './pages/ParkingAlert';
import Emergency from './pages/Emergency';
import Incident from './pages/Incident';

import Scanner from "./pages/Scanner";

import BottomNav from "./components/BottomNav";

import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>

      {/* BACKGROUND */}
      <div className="bg-gray-200 min-h-screen flex items-center justify-center">

        {/* MOBILE APP CONTAINER */}
        <div className="w-full max-w-sm bg-white min-h-screen shadow-xl rounded-3xl overflow-hidden">

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/scan/:qrCode" element={<Scan />} />
            <Route path="/alert/:vehicleId" element={<ParkingAlert />} />
            <Route path="/emergency/:vehicleId" element={<Emergency />} />
            <Route path="/incident/:vehicleId" element={<Incident />} />
            
            <Route path="/scanner" element={<Scanner />} />

            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
        <BottomNav />
      </div>

    </BrowserRouter>
  );
}

export default App;