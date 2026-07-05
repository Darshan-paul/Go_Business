import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("jwt_token");
    navigate("/login");
  };

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">
        Go Business
      </Link>

      <nav className="navbar-nav" aria-label="Primary">
        <Link to="/" className="navbar-link">
          Home
        </Link>
      </nav>

      <button type="button" className="navbar-logout-btn" onClick={handleLogout}>
        Log out
      </button>
    </header>
  );
};

export default Navbar;