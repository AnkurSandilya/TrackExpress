import { Routes, Route } from "react-router-dom";
import Payment from "./pages/Payment";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Support from "./pages/Support";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/home" element={<Home />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/about" element={<About />} />
      <Route path="/support" element={<Support />} />
    </Routes>
  );
}

export default App;