import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="not-found-page">
      <h1 className="not-found-heading">404</h1>
      <p className="not-found-text">Page not found</p>
      <Link to="/" className="not-found-link">
        Back to dashboard
      </Link>
    </div>
  );
};

export default NotFound;