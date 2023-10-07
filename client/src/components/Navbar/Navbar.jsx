import "./Navbar.css";
import { faUser, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();

  function logout() {
    localStorage.clear();
    navigate("/");
  }

  const NavLists = () => {
    if (currentUser) {
      return (
        <>
          <li >
            <Link className="nav-items" to="/top-5-sold-out">Top 5 / Sold Out</Link>
          </li>
          <li >
            <Link className="nav-items" to="/checkout">
              Checkout
              <FontAwesomeIcon icon={faShoppingCart} />
            </Link>
          </li>
          <li >
            <Link className="nav-items" to="/profile">
              User
              <FontAwesomeIcon icon={faUser} />
            </Link>
          </li>
          <li >
            <Link className="nav-items nav-btn" to="/" onClick={logout}>
              Logout
            </Link>
          </li>
        </>
      );
    } else {
      return (
        <>
        <li >
            <Link className="nav-items" to="/top-5-sold-out">Top 5 / Sold Out</Link>
          </li>
        <li >
          <Link className="nav-items" to="/login">Login</Link>
        </li>
        </>)
    }
  };

  return (
    <div>
      <nav className="nav flex-container">
        <Link className="nav-logo" to="/">
          OldPhoneDeals
        </Link>
        <ul className="flex-container nav-list">
          <NavLists />
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
