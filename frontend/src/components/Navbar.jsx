import { Link } from "react-router-dom";


function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
  <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
    TrackExpress
  </Link>
</div>
      <ul className="nav-links">
        <li><Link to="/booking">Manage Booking</Link></li>
        <li><Link to="/pricing">Pricing</Link></li>
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/support">Support</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;